import { readFileSync } from 'node:fs';
import { loadManifest, type Localized } from './manifest';
import { validateSnapshot, isStale } from './pipeline';

export interface Series {
  key: string; title: Localized; unit: Localized;
  publisher: string; licence: { name: string; url: string }; dbnomicsId: string; dbnomicsUrl: string;
  points: { year: number; value: number }[]; lastPeriod: string; derived: boolean; provisional: boolean;
  stale: boolean; fetchFailed: string | null; retrievedAt: string; revisedAt: string | null;
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
  const sums = new Map<number, number>();
  for (const p of parts) p.period.forEach((per: string, i: number) => {
    if (p.value[i] != null && p.value[i] !== 'NA') sums.set(+per, (sums.get(+per) ?? 0) + p.value[i] * m.scale);
  });
  // ponytail: no "Partial total" Note yet; a Land with missing years silently lowers the sum (later ticket)
  const points = [...sums].sort((a, b) => a[0] - b[0]).map(([year, value]) => ({ year, value }));
  return { key, title: m.title, unit: m.unit, publisher: m.publisher, licence: m.licence,
    dbnomicsId: m.lands.length > 1 ? `${m.provider}/${m.dataset}/{${m.lands[0]}–${m.lands.at(-1)}}.${m.ids[0].split('.').slice(1).join('.')}` : `${m.provider}/${m.dataset}/${m.ids[0]}`,
    dbnomicsUrl: `https://db.nomics.world/${m.provider}/${m.dataset}`, points, lastPeriod: String(points.at(-1)!.year),
    derived: m.lands.length > 1, provisional: m.provisional,
    stale: isStale(String(points.at(-1)!.year), m.frequency, now), fetchFailed: snap.fetch_failed ?? null,
    retrievedAt: snap.retrieved_at, revisedAt: snap.revised_at ?? null };
}
