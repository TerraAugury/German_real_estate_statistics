// Pure pipeline logic (fetch, diff, staleness, validation). Network and clock are injected so tests can mock them.
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import type { ManifestEntry } from './manifest';
import { originalDataSource, refreshBundesbank } from './bundesbank';
import { refreshDestatis } from './destatis';

export const API = 'https://api.db.nomics.world/v22/series';
export const UA = 'german-cre-statistics (build; contact oelamine@terraaugury.com)';

export type { Part, Snapshot, SourceMeta } from './snapshot';
export { BadResponse } from './snapshot';
import { BadResponse, Unavailable, type Part, type Snapshot } from './snapshot';
export type Post = (url: string, form: Record<string, string>, headers: Record<string, string>) => Promise<any>;
/** `post` and `env` are needed only by sources that log in (Destatis); `env` defaults to the process environment. */
export interface Deps { get: (url: string) => Promise<any>; post?: Post; env?: Record<string, string | undefined>; now: Date; warn?: (msg: string) => void }

/** Non-2xx answer; the message is the status code and URL. */
export class HttpError extends Error { constructor(public status: number, url = '') { super(`${status} ${url}`.trim()); } }

const NO_RETRY = new Set([401, 403, 404, 410]); // a second try will not change the answer

/** Fetch JSON with retry and exponential backoff. */
async function fetchJson(fetchFn: typeof fetch, sleep: (ms: number) => Promise<unknown>, tries: number, url: string, init: RequestInit) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetchFn(url, init);
      if (r.ok) return (await r.json()) as any;
      throw new HttpError(r.status, url);
    } catch (e) {
      if (i >= tries - 1 || (e instanceof HttpError && NO_RETRY.has(e.status))) throw e;
      await sleep(1000 * 2 ** i);
    }
  }
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET JSON with retry and exponential backoff. */
export const makeGet = (fetchFn: typeof fetch = fetch, sleep = wait, tries = 3) => (url: string) =>
  fetchJson(fetchFn, sleep, tries, url, { headers: { 'User-Agent': UA } });

/** POST a form and read JSON, with the same retry. `headers` carries the credentials. */
export const makePost = (fetchFn: typeof fetch = fetch, sleep = wait, tries = 3): Post => (url, form, headers) =>
  fetchJson(fetchFn, sleep, tries, url, { method: 'POST', body: new URLSearchParams(form), headers: { 'User-Agent': UA, ...headers } });

function firstDoc(res: any, id: string): any {
  const d = res?.series?.docs?.[0];
  if (!d) throw new BadResponse(`${id}: response has no series doc`);
  return d;
}

export const partIds = (m: ManifestEntry) => m.laender.map((land) => m.ids[0].replace('{land}', land));
const url = (m: ManifestEntry, id: string, obs: boolean) => `${API}/${m.dbnomics_provider}/${m.dataset}/${id}${obs ? '?observations=1' : ''}`;

/** True if a value for a period before the latest one changed. */
export function revised(old: Part, next: Part): boolean {
  const latest = next.period.at(-1)!;
  const was = new Map(old.period.map((p, i) => [p, old.value[i]]));
  return next.period.some((p, i) => p < latest && was.has(p) && was.get(p) !== next.value[i]);
}

/**
 * Refresh one series. indexed_at is checked first; observations are downloaded only for parts where it moved.
 * Returns the new snapshot, or null when nothing changed. Throws on any fetch error, and BadResponse on a malformed response or a changed frequency or unit.
 */
export async function refreshDbnomics(m: ManifestEntry, old: Snapshot | undefined, { get, now, warn = console.warn }: Deps): Promise<Snapshot | null> {
  const parts: Record<string, Part> = {};
  let downloaded = false, backfilled = false, wasRevised = false;
  for (const id of partIds(m)) {
    const prev = old?.parts[id];
    const meta = firstDoc(await get(url(m, id, false)), id);
    const dims: Record<string, string> = meta.dimensions ?? {};
    if (prev?.dimensions && JSON.stringify(prev.dimensions) !== JSON.stringify(dims))
      throw new BadResponse(`${id}: dimensions (unit) changed from ${JSON.stringify(prev.dimensions)} to ${JSON.stringify(dims)}`);
    if (prev?.frequency && prev.indexed_at === meta.indexed_at) {
      // Snapshots from before the unit check have no dimensions: record them now so the next change is caught.
      if (!prev.dimensions) backfilled = true;
      parts[id] = { ...prev, dimensions: dims };
      continue;
    }
    const doc = firstDoc(await get(url(m, id, true)), id);
    if (!Array.isArray(doc.period) || !Array.isArray(doc.value) || doc.period.length !== doc.value.length || !doc.period.length)
      throw new BadResponse(`${id}: malformed period/value arrays`);
    if (doc['@frequency'] !== m.frequency) throw new BadResponse(`${id}: frequency changed to ${doc['@frequency']}, manifest says ${m.frequency}`);
    parts[id] = { name: doc.series_name, indexed_at: doc.indexed_at, frequency: doc['@frequency'], dimensions: dims, period: doc.period, value: doc.value };
    downloaded = true;
    if (prev && prev.name !== doc.series_name) warn(`${id}: DBnomics name changed from "${prev.name}" to "${doc.series_name}"; re-check manifest titles`);
    if (prev && revised(prev, parts[id])) wasRevised = true;
  }
  if (!downloaded && !backfilled && old && !old.fetch_failed) return null;
  const iso = now.toISOString();
  return { retrieved_at: downloaded || !old ? iso : old.retrieved_at, fetch_failed: null,
    revised_at: wasRevised ? iso : old?.revised_at ?? null, parts };
}

/** Refresh one series from the source its manifest entry names. */
export async function refresh(m: ManifestEntry, old: Snapshot | undefined, deps: Deps): Promise<Snapshot | null> {
  if (m.source === 'dbnomics') return refreshDbnomics(m, old, deps);
  if (m.source === 'bundesbank') return refreshBundesbank(m, old, deps);
  if (m.source === 'destatis') return refreshDestatis(m, old, deps);
  throw new BadResponse(`${m.key}: no fetcher for source ${m.source}`);
}

/** Last snapshot with fetch_failed recorded. A series without a snapshot fails the build. */
export function markFailed(key: string, old: Snapshot | undefined, now: Date, err: unknown): Snapshot {
  if (!old) throw new Error(`${key}: fetch failed and no snapshot: ${err}`);
  const iso = now.toISOString();
  return { ...old, fetch_failed: iso, unavailable: err instanceof Unavailable ? iso : null };
}

/** Manifest validation: every id present, frequency and start date as in the manifest. */
export function validateSnapshot(m: ManifestEntry, snap: Snapshot): void {
  const errs: string[] = [];
  for (const id of partIds(m)) {
    const p = snap.parts[id];
    if (!p) { errs.push(`id missing: ${id}`); continue; }
    if (p.frequency !== m.frequency) errs.push(`${id}: frequency ${p.frequency}, manifest says ${m.frequency}`);
    if (p.meta?.third_party && !m.provisional) errs.push(`${id}: original source "${p.meta.comment ?? originalDataSource(p.meta.general_comment)}" is third-party data; set provisional: true until its licence is confirmed`);
    if (+p.period[0].slice(0, 4) !== m.expected_start) errs.push(`${id}: starts ${p.period[0]}, manifest says ${m.expected_start}`);
  }
  if (errs.length) throw new Error(`manifest validation, ${m.key}: ${errs.join('; ')}`);
}

let cached: Record<string, number> | undefined;
const thresholds = () => (cached ??= parse(readFileSync('manifest/stale.yaml', 'utf8')) as Record<string, number>);

/** Stale when the last period ended more than the frequency's threshold ago. */
export function isStale(lastPeriod: string, frequency: string, now: Date, days = thresholds()): boolean {
  const limit = days[frequency];
  if (limit === undefined) throw new Error(`no stale threshold for frequency ${frequency}`);
  const [y, rest] = lastPeriod.split('-');
  let end: number; // first millisecond after the period
  if (!rest) end = Date.UTC(+y + 1, 0, 1);
  else if (rest[0] === 'Q') end = Date.UTC(+y, +rest[1] * 3, 1);
  else end = Date.UTC(+y, +rest, 1);
  return (now.getTime() - end) / 864e5 > limit;
}
