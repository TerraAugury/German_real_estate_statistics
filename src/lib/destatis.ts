// GENESIS-Online cube parser. A cube is a flat CSV: header blocks (K;), then one data row (D;) per combination of
// classifying values and time, holding a (value;quality) pair for every measure in the order the DQI block lists them.

import { createHash } from 'node:crypto';
import type { ManifestEntry } from './manifest';
import { BadResponse, Unavailable, checkUnit, sameData, type Part, type Snapshot } from './snapshot';
import { partIds, revised, type Deps } from './pipeline';

export const GENESIS = 'https://genesis.destatis.de/genesisWS/rest/2020';

export interface CubeMeasure { name: string; unit: string }
export interface CubeRow { dims: Record<string, string>; time: string; values: Record<string, { value: number | null; quality: string }> }
export interface Cube { measures: CubeMeasure[]; rows: CubeRow[] }

/** Quality flags: `e` real value, `-` nothing to report (true zero), `x` secret or not applicable, `.` not known, `/` no data. Those last three carry no usable number; every other flag (provisional, estimated, corrected, ...) is a real value. */
const NO_VALUE = new Set(['x', '.', '/', '']);
const hasValue = (q: string) => !NO_VALUE.has(q);

export function parseCube(text: string, onBad: (line: string) => never): Cube {
  const names: string[] = [], measures: CubeMeasure[] = [];
  let block = '', timeName = '';
  const rows: CubeRow[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim() || line.startsWith('*')) continue;
    const f = line.replace(/\r$/, '').split(';');
    if (f[0] === 'K') { block = f[1]; continue; }
    if (f[0] !== 'D') continue;
    if (block === 'DQA') names.push(f[1]);
    else if (block === 'DQZ') timeName = f[1];
    else if (block === 'DQI') measures.push({ name: f[1], unit: f[2] });
    else if (block === 'QEI') {
      const n = names.length;
      if (!timeName || f.length < 1 + n + 1 + 2 * measures.length) onBad(line);
      const values: CubeRow['values'] = {};
      measures.forEach((m, i) => {
        const raw = f[n + 2 + 2 * i], quality = f[n + 3 + 2 * i];
        const v = Number(raw);
        values[m.name] = { value: hasValue(quality) && raw !== '' && Number.isFinite(v) ? v : null, quality };
      });
      rows.push({ dims: Object.fromEntries(names.map((k, i) => [k, f[1 + i]])), time: f[1 + n], values });
    }
  }
  if (!measures.length || !rows.length) onBad('no measures or rows');
  return { measures, rows };
}

/** Month number of a MONATnn classifying value ("MONAT02" -> 2). */
const monthOf = (code: string) => { const m = /^MONAT(\d\d)$/.exec(code); return m ? +m[1] : null; };

/**
 * One series out of a cube. `id` is the series id in the DBnomics layout the manifest keeps: classifying values in the
 * cube's axis order, then the measure. A month axis after them (CPI: MONAT, construction prices: QUARM1, the reporting
 * month of a quarter) is not part of the id: it makes the period (monthly "2026-09", quarterly "2026-Q3" for months 2, 5, 8, 11).
 */
export function extractSeries(cube: Cube, id: string, frequency: string): { period: string[]; value: (number | null)[]; unit: string } {
  const parts = id.split('.'), measure = parts.pop()!;
  const axes = Object.keys(cube.rows[0].dims);
  const unit = cube.measures.find((m) => m.name === measure)?.unit;
  if (unit === undefined) throw new Error(`cube has no measure ${measure}`);
  if (axes.length - parts.length !== (frequency === 'annual' ? 0 : 1)) throw new Error(`id has ${parts.length} values but the cube has ${axes.length} axes`);
  const rows = cube.rows.filter((r) => parts.every((v, i) => r.dims[axes[i]] === v));
  const out = new Map<string, number | null>();
  for (const r of rows) {
    const month = axes.length > parts.length ? monthOf(r.dims[axes[parts.length]]) : null;
    const p = frequency === 'annual' ? r.time
      : month === null ? (() => { throw new Error(`${id}: ${frequency} series without a month axis`); })()
      : frequency === 'monthly' ? `${r.time}-${String(month).padStart(2, '0')}` : `${r.time}-Q${Math.ceil(month / 3)}`;
    out.set(p, r.values[measure].value);
  }
  const period = [...out.keys()].sort();
  return { period, value: period.map((p) => out.get(p)!), unit };
}

/** Raised before any request when the login is not configured. Not a BadResponse: the old snapshot stays and a Note says so. */
export class MissingCredentials extends Error {}

interface Creds { user: string; password: string }
type Body = { Status?: { Code?: number; Content?: string }; Object?: Record<string, any> };

/** "14.09.2026 18:22:09h" (Berlin time as GENESIS prints it) -> "2026-09-14T18:22:09". */
const isoLocal = (s: string | undefined) => { const m = s?.match(/^(\d\d)\.(\d\d)\.(\d{4}) (\d\d:\d\d:\d\d)/); return m ? `${m[3]}-${m[2]}-${m[1]}T${m[4]}` : null; };

/** One request to GENESIS; the body's own status decides: 0 ok, 104 no such object, anything else an error. */
async function call(deps: Deps, { user, password }: Creds, path: string, form: Record<string, string>): Promise<Body['Object']> {
  const url = `${GENESIS}/${path}`;
  const body: Body = await deps.post!(url, form, { username: user, password });
  const code = body?.Status?.Code;
  if (code === 104) throw new Unavailable(`${url} ${form.name}: ${body.Status!.Content}`);
  if (code !== 0 || !body.Object) throw new Error(`${url} ${form.name}: GENESIS status ${code} ${body?.Status?.Content ?? ''}`.trim());
  return body.Object;
}

type Cached<T> = WeakMap<object, Map<string, Promise<T>>>;
/** Run `make` once per dataset and run (`deps` is the run), so the series of one dataset share the request. */
function once<T>(store: Cached<T>, deps: Deps, name: string, make: () => Promise<T>): Promise<T> {
  const mine = store.get(deps) ?? store.set(deps, new Map()).get(deps)!;
  if (!mine.has(name)) mine.set(name, make());
  return mine.get(name)!;
}
const infos: Cached<{ title: string; updated: string | null }> = new WeakMap();
const cubes: Cached<{ cube: Cube; sha256: string }> = new WeakMap();

/** The cube's title and last-update time: one small call that tells whether the data download can be skipped. */
const fetchInfo = (deps: Deps, name: string, creds: Creds) => once(infos, deps, name, async () => {
  const meta = await call(deps, creds, 'metadata/cube', { name });
  return { title: String(meta!.Content ?? ''), updated: isoLocal(meta!.Updated) };
});

const fetchData = (deps: Deps, name: string, creds: Creds) => once(cubes, deps, name, async () => {
  const data = await call(deps, creds, 'data/cube', { name, area: 'all', values: 'true', metadata: 'false', additionals: 'false', format: 'csv' });
  const content = String(data!.Content);
  const cube = parseCube(content, (l) => { throw new BadResponse(`${name}: malformed cube line: ${l.slice(0, 80)}`); });
  return { cube, sha256: createHash('sha256').update(content.replace(/^\*.*\n/, '')).digest('hex') }; // the first line names the user who exported
});

/**
 * Refresh one Destatis series from its GENESIS cube (dataset = cube name, ids[0] = series id with {land}). The login comes
 * from DESTATIS_USER and DESTATIS_PASSWORD. Returns null when the cube's update time or the values are unchanged and the snapshot already has source metadata.
 */
export async function refreshDestatis(m: ManifestEntry, old: Snapshot | undefined, deps: Deps): Promise<Snapshot | null> {
  const env = deps.env ?? process.env, user = env.DESTATIS_USER, password = env.DESTATIS_PASSWORD;
  if (!user || !password) throw new MissingCredentials(`${m.key}: DESTATIS_USER and DESTATIS_PASSWORD are not set`);
  const creds = { user, password };
  if (!deps.post) throw new Error('no post function for a source that needs a login');
  const { title, updated } = await fetchInfo(deps, m.dataset, creds);
  // Same update time as the snapshot already holds: nothing to download.
  if (updated && old && !old.fetch_failed && partIds(m).every((id) => old.parts[id]?.meta?.valid_from === updated)) return null;
  const { cube, sha256 } = await fetchData(deps, m.dataset, creds);
  const url = `${GENESIS}/data/cube?name=${m.dataset}`, iso = deps.now.toISOString();
  const parts: Record<string, Part> = {};
  let changed = !old || !!old.fetch_failed, wasRevised = false;
  for (const id of partIds(m)) {
    let s;
    try { s = extractSeries(cube, id, m.frequency); } catch (e) { throw new BadResponse(`${id}: ${(e as Error).message}`); }
    if (!s.period.length) throw new BadResponse(`${id}: no observations in cube ${m.dataset}`);
    const prev = old?.parts[id];
    parts[id] = { name: title, frequency: m.frequency, period: s.period, value: s.value,
      meta: { source: 'Statistisches Bundesamt (Destatis)', url, title, unit: s.unit, unit_mult: 0, decimals: null, comment: null, general_comment: null,
        third_party: false, valid_from: updated, retrieved_at: iso, sha256 } };
    checkUnit(id, prev, parts[id]);
    if (!prev?.meta || !sameData(prev, parts[id])) changed = true;
    if (prev && revised(prev, parts[id])) wasRevised = true;
  }
  if (!changed) return null;
  return { retrieved_at: iso, fetch_failed: null, revised_at: wasRevised ? iso : old?.revised_at ?? null, parts };
}
