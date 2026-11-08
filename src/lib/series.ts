import { readFileSync } from 'node:fs';
import { loadManifest, partId, seriesId, seriesUrl, isDerived, SOURCE_INFO, type Localized, type ManifestEntry } from './manifest';
import { validateSnapshot, isStale } from './pipeline';
import { landName } from './kpis';
import { langs } from './routes';

/** Years in which some Länder had no value, so the Germany sum covers only the others. */
export type PartialTotal = { period: string; laender: string[] }[];

export interface Series {
  key: string; title: Localized; unit: Localized;
  publisher: string; licence: { name: string; url: string }; seriesId: string; seriesUrl: string;
  /** Where the data was fetched from: "DBnomics" or the publisher; the web service for a direct source; the source's own title and unit when the snapshot kept them. */
  fetchedFrom: string; service?: string; original?: { title?: string; unit: string; source?: string };
  obs: { period: string; value: number }[]; change: 'pct' | 'diff'; freq: 'M' | 'Q' | 'A';
  lastPeriod: string; derived: boolean; provisional: boolean;
  /** Decimals the source published; only for an original (not derived) series, so its values can be shown as published. */
  decimals?: number;
  /** Original source credited by name in the citation (manifest `credit`). */
  credit?: string;
  /** Terms the source's statistics are reused under (the Bundesbank's ESCB terms), when its snapshot records them. */
  terms?: { name: string; url: string };
  stale: boolean; fetchFailed: string | null; unavailable: string | null; retrievedAt: string; revisedAt: string | null;
  /** KPI-page Note inputs: manifest scope keys, short-history sentence key (true = no extra sentence), Partial total years. */
  scope: ManifestEntry['scope']; shortWindow: string | boolean; partial: PartialTotal;
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
  const sum = sumLaender(laender.map((l) => ({ land: l, ...snap.parts[partId(m, l)] })), m.scale);
  const { obs, partial } = sum;
  const lastPeriod = obs.at(-1)!.period;
  const meta = snap.parts[partId(m, laender[0])]?.meta;
  const title = land ? landTitle(m.title, land) : m.title;
  const derived = (isDerived(m) && !land) || m.scale !== 1 || m.resampling === 'mean';
  const src = SOURCE_INFO[m.source];
  const s: Series = { key, title, unit: m.unit, publisher: m.publisher, licence: m.licence,
    seriesId: seriesId(m, land), seriesUrl: seriesUrl(m, land), obs, change: m.change, freq: FREQ[m.frequency as keyof typeof FREQ],
    fetchedFrom: src.fetchedFrom(m), service: src.service,
    original: meta ? { title: src.originalTitle ? meta.title : undefined, unit: meta.unit_mult ? `${meta.unit} (×10^${meta.unit_mult})` : meta.unit, source: m.credit ? meta.comment ?? undefined : undefined } : undefined,
    lastPeriod, derived, provisional: m.provisional, decimals: !derived && meta?.decimals != null ? meta.decimals : undefined, terms: meta?.terms, credit: m.credit,
    stale: isStale(lastPeriod, m.frequency, now), fetchFailed: snap.fetch_failed ?? null, unavailable: snap.unavailable ?? null,
    retrievedAt: snap.retrieved_at, revisedAt: snap.revised_at ?? null,
    scope: m.scope, shortWindow: m.short_window && (m.short_window_sentence ?? true), partial };
  if (!s.freq) throw new Error(`${key}: unknown frequency ${m.frequency}`);
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
