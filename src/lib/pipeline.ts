// Pure pipeline logic (fetch, diff, staleness, validation). Network and clock are injected so tests can mock them.
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import type { ManifestEntry } from './manifest';

export const API = 'https://api.db.nomics.world/v22/series';
export const UA = 'german-cre-statistics (build; contact oelamine@terraaugury.com)';

export interface Part { name: string; indexed_at: string; frequency: string; period: string[]; value: (number | string | null)[] }
export interface Snapshot { retrieved_at: string; fetch_failed: string | null; revised_at?: string | null; parts: Record<string, Part> }
export interface Deps { get: (url: string) => Promise<any>; now: Date }

/** GET JSON with retry and exponential backoff. */
export function makeGet(fetchFn: typeof fetch = fetch, sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)), tries = 3) {
  return async (url: string) => {
    for (let i = 0; ; i++) {
      try {
        const r = await fetchFn(url, { headers: { 'User-Agent': UA } });
        if (r.ok) return (await r.json()) as any;
        throw new Error(String(r.status));
      } catch (e) {
        if (i >= tries - 1) throw e;
        await sleep(1000 * 2 ** i);
      }
    }
  };
}

/** The API answered but not as expected (or the frequency changed). Fails the build; never a reason to reuse the snapshot. */
export class BadResponse extends Error {}

function firstDoc(res: any, id: string): any {
  const d = res?.series?.docs?.[0];
  if (!d) throw new BadResponse(`${id}: response has no series doc`);
  return d;
}

export const partIds = (m: ManifestEntry) => m.lands.map((land) => m.ids[0].replace('{land}', land));
const url = (m: ManifestEntry, id: string, obs: boolean) => `${API}/${m.provider}/${m.dataset}/${id}${obs ? '?observations=1' : ''}`;

/** True if a value for a period before the latest one changed. */
export function revised(old: Part, next: Part): boolean {
  const latest = next.period.at(-1)!;
  const was = new Map(old.period.map((p, i) => [p, old.value[i]]));
  return next.period.some((p, i) => p < latest && was.has(p) && was.get(p) !== next.value[i]);
}

/**
 * Refresh one series. indexed_at is checked first; observations are downloaded only for parts where it moved.
 * Returns the new snapshot, or null when nothing changed. Throws on any fetch error, and BadResponse on a malformed response or changed frequency.
 */
export async function refresh(m: ManifestEntry, old: Snapshot | undefined, { get, now }: Deps): Promise<Snapshot | null> {
  const parts: Record<string, Part> = {};
  let downloaded = false, wasRevised = false;
  for (const id of partIds(m)) {
    const prev = old?.parts[id];
    const meta = firstDoc(await get(url(m, id, false)), id);
    if (prev?.frequency && prev.indexed_at === meta.indexed_at) { parts[id] = prev; continue; }
    const doc = firstDoc(await get(url(m, id, true)), id);
    if (!Array.isArray(doc.period) || !Array.isArray(doc.value) || doc.period.length !== doc.value.length || !doc.period.length)
      throw new BadResponse(`${id}: malformed period/value arrays`);
    if (doc['@frequency'] !== m.frequency) throw new BadResponse(`${id}: frequency changed to ${doc['@frequency']}, manifest says ${m.frequency}`);
    parts[id] = { name: doc.series_name, indexed_at: doc.indexed_at, frequency: doc['@frequency'], period: doc.period, value: doc.value };
    downloaded = true;
    if (prev && revised(prev, parts[id])) wasRevised = true;
  }
  if (!downloaded && old && !old.fetch_failed) return null;
  const iso = now.toISOString();
  return { retrieved_at: downloaded || !old ? iso : old.retrieved_at, fetch_failed: null,
    revised_at: wasRevised ? iso : old?.revised_at ?? null, parts };
}

/** Last snapshot with fetch_failed recorded. A series without a snapshot fails the build. */
export function markFailed(key: string, old: Snapshot | undefined, now: Date, err: unknown): Snapshot {
  if (!old) throw new Error(`${key}: fetch failed and no snapshot: ${err}`);
  return { ...old, fetch_failed: now.toISOString() };
}

/** Manifest validation: every id present, frequency and start date as in the manifest. */
export function validateSnapshot(m: ManifestEntry, snap: Snapshot): void {
  const errs: string[] = [];
  for (const id of partIds(m)) {
    const p = snap.parts[id];
    if (!p) { errs.push(`id missing: ${id}`); continue; }
    if (p.frequency !== m.frequency) errs.push(`${id}: frequency ${p.frequency}, manifest says ${m.frequency}`);
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
