import { readFileSync } from 'node:fs';
import { loadManifest, dbnomicsId, dbnomicsUrl, isDerived, type Localized, type ManifestEntry } from './manifest';
import { validateSnapshot, isStale } from './pipeline';
import { noteTexts } from './notes';
import { landName } from './kpis';
import { langs, type Lang } from './routes';

/** Years in which some Länder had no value, so the Germany sum covers only the others. */
export type PartialTotal = { period: string; laender: string[] }[];

export interface Series {
  key: string; title: Localized; unit: Localized;
  publisher: string; licence: { name: string; url: string }; dbnomicsId: string; dbnomicsUrl: string;
  obs: { period: string; value: number }[]; change: 'pct' | 'diff'; freq: 'M' | 'Q' | 'A';
  lastPeriod: string; derived: boolean; provisional: boolean;
  stale: boolean; fetchFailed: string | null; retrievedAt: string; revisedAt: string | null;
  /** KPI-page Note inputs: manifest scope keys, short-history sentence key (true = no extra sentence), Partial total years. */
  scope: ManifestEntry['scope']; shortWindow: string | boolean; partial: PartialTotal;
  /** Unprefixed Note texts per language (stale, fetch failed, revised); Link panels inherit them. */
  notes: Record<Lang, string[]>;
}

const FREQ = { annual: 'A', quarterly: 'Q', monthly: 'M' } as const;
const missing = (v: unknown) => v == null || v === 'NA';

/** Germany = sum of the Länder with data, scaled once; years where a Land has no value are listed (Partial total Note). */
export function sumLaender(parts: { land: string; period: string[]; value: (number | string | null)[] }[], scale: number) {
  const sums = new Map<string, number>();
  const have = new Map<string, Set<string>>();
  for (const p of parts) p.period.forEach((per, i) => {
    if (!have.has(per)) have.set(per, new Set());
    if (missing(p.value[i])) return;
    sums.set(per, (sums.get(per) ?? 0) + (p.value[i] as number));
    have.get(per)!.add(p.land);
  });
  const periods = [...sums.keys()].sort();
  return {
    obs: periods.map((period) => ({ period, value: sums.get(period)! * scale })),
    partial: periods.flatMap((period) => {
      const laender = parts.map((p) => p.land).filter((l) => !have.get(period)!.has(l));
      return laender.length ? [{ period, laender }] : [];
    }),
  };
}

/** Load a manifest series from its committed snapshot: one Land if `land` is given, else Germany (the sum of the Länder). */
export function loadSeries(key: string, now = new Date(), land?: string): Series {
  const m = loadManifest().find((s) => s.key === key);
  if (!m) throw new Error(`manifest: no series ${key}`);
  if (land && !m.laender.includes(land)) throw new Error(`${key}: no Land ${land}`);
  let snap;
  try { snap = JSON.parse(readFileSync(`data/snapshots/${key}.json`, 'utf8')); }
  catch { throw new Error(`${key}: no snapshot`); }
  validateSnapshot(m, snap);
  const laender = land ? [land] : m.laender;
  const { obs, partial } = sumLaender(laender.map((l) => ({ land: l, ...snap.parts[m.ids[0].replace('{land}', l)] })), m.scale);
  const lastPeriod = obs.at(-1)!.period;
  const title = land ? landTitle(m.title, land) : m.title;
  const s: Series = { key, title, unit: m.unit, publisher: m.publisher, licence: m.licence,
    dbnomicsId: dbnomicsId(m, land), dbnomicsUrl: dbnomicsUrl(m, land), obs, change: m.change, freq: FREQ[m.frequency as keyof typeof FREQ],
    lastPeriod, derived: (isDerived(m) && !land) || m.scale !== 1, provisional: m.provisional,
    stale: isStale(lastPeriod, m.frequency, now), fetchFailed: snap.fetch_failed ?? null,
    retrievedAt: snap.retrieved_at, revisedAt: snap.revised_at ?? null,
    scope: m.scope, shortWindow: m.short_window && (m.short_window_sentence ?? true), partial, notes: { en: [], de: [] } };
  if (!s.freq) throw new Error(`${key}: unknown frequency ${m.frequency}`);
  for (const l of langs) s.notes[l] = noteTexts(s, l, now);
  return s;
}

const cache = new Map<string, Series>();
/** `loadSeries` at build time, once per series and Land. */
export function getSeries(key: string, land?: string): Series {
  const id = `${key}@${land ?? ''}`;
  if (!cache.has(id)) cache.set(id, loadSeries(key, undefined, land));
  return cache.get(id)!;
}

/** Destatis titles end in ", Germany"; a Land series names the Land instead. */
function landTitle(title: Localized, land: string): Localized {
  const out = { ...title };
  for (const l of langs) {
    out[l] = title[l].replace(/, (Germany|Deutschland)$/, `, ${landName(l, land)}`);
    if (out[l] === title[l]) throw new Error(`series title has no Germany suffix to replace: ${title[l]}`);
  }
  return out;
}

/** Annual observations as year/value pairs. Explicit error for other frequencies, never a silent empty list. */
export function annualPoints(s: Series): { year: number; value: number }[] {
  if (s.freq !== 'A') throw new Error(`${s.key}: annualPoints needs an annual series, got ${s.freq}`);
  return s.obs.map((o) => ({ year: +o.period, value: o.value }));
}
