import { readFileSync } from 'node:fs';
import { loadManifest, dbnomicsId, dbnomicsUrl, isDerived, type Localized } from './manifest';
import { validateSnapshot, isStale } from './pipeline';
import { noteTexts } from './notes';
import { langs, type Lang } from './routes';

export interface Series {
  key: string; title: Localized; unit: Localized;
  publisher: string; licence: { name: string; url: string }; dbnomicsId: string; dbnomicsUrl: string;
  obs: { period: string; value: number }[]; change: 'pct' | 'diff'; freq: 'M' | 'A';
  lastPeriod: string; derived: boolean; provisional: boolean;
  stale: boolean; fetchFailed: string | null; retrievedAt: string; revisedAt: string | null;
  /** Unprefixed Note texts per language (stale, fetch failed, revised); Link panels inherit them. */
  notes: Record<Lang, string[]>;
}

/** Load a manifest series from its committed snapshot. Germany = sum of Länder (own calculation). */
export function loadSeries(key: string, now = new Date()): Series {
  const m = loadManifest().find((s) => s.key === key);
  if (!m) throw new Error(`manifest: no series ${key}`);
  let snap;
  try { snap = JSON.parse(readFileSync(`data/snapshots/${key}.json`, 'utf8')); }
  catch { throw new Error(`${key}: no snapshot`); }
  validateSnapshot(m, snap);
  const parts = Object.values<any>(snap.parts);
  const sums = new Map<string, number>();
  for (const p of parts) p.period.forEach((per: string, i: number) => {
    if (p.value[i] != null && p.value[i] !== 'NA') sums.set(per, (sums.get(per) ?? 0) + p.value[i] * m.scale);
  });
  // ponytail: no "Partial total" Note yet; a Land with missing years silently lowers the sum (later ticket)
  const obs = [...sums].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([period, value]) => ({ period, value }));
  const annual = m.frequency === 'annual';
  const lastPeriod = obs.at(-1)!.period;
  const stale = isStale(lastPeriod, m.frequency, now);
  const s: Series = { key, title: m.title, unit: m.unit, publisher: m.publisher, licence: m.licence,
    dbnomicsId: dbnomicsId(m),
    dbnomicsUrl: dbnomicsUrl(m), obs, change: m.change, freq: annual ? 'A' : 'M',
    lastPeriod, derived: isDerived(m), provisional: m.provisional, stale, fetchFailed: snap.fetch_failed ?? null,
    retrievedAt: snap.retrieved_at, revisedAt: snap.revised_at ?? null, notes: { en: [], de: [] } };
  for (const l of langs) s.notes[l] = noteTexts(s, l, now);
  return s;
}

/** Annual observations as year/value pairs. Explicit error for other frequencies, never a silent empty list. */
export function annualPoints(s: Series): { year: number; value: number }[] {
  if (s.freq !== 'A') throw new Error(`${s.key}: annualPoints needs an annual series, got ${s.freq}`);
  return s.obs.map((o) => ({ year: +o.period, value: o.value }));
}
