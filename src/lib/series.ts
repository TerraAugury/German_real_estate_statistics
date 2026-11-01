import { parse } from 'yaml';
import { readFileSync } from 'node:fs';

export interface Series {
  key: string; title: { en: string; de: string }; unit: { en: string; de: string };
  publisher: string; licence: { name: string; url: string }; dbnomicsId: string;
  points: { year: number; value: number }[]; lastPeriod: string; derived: boolean; provisional: boolean;
}

/** Load a manifest series from its committed snapshot. Germany = sum of Länder (own calculation). */
export function loadSeries(key: string): Series {
  const m = (parse(readFileSync('manifest/series.yaml', 'utf8')) as any[]).find((s) => s.key === key);
  if (!m) throw new Error(`manifest: no series ${key}`);
  for (const l of ['en', 'de']) if (!m.title?.[l] || !m.unit?.[l]) throw new Error(`manifest: ${key} needs en and de title/unit`);
  let snap;
  try { snap = JSON.parse(readFileSync(`data/snapshots/${key}.json`, 'utf8')); }
  catch { throw new Error(`${key}: no snapshot`); }
  const parts = Object.values<any>(snap.parts);
  const sums = new Map<number, number>();
  for (const p of parts) p.period.forEach((per: string, i: number) => {
    if (p.value[i] != null && p.value[i] !== 'NA') sums.set(+per, (sums.get(+per) ?? 0) + p.value[i] * m.scale);
  });
  // ponytail: no "Partial total" Note yet; a Land with missing years silently lowers the sum (later ticket)
  const points = [...sums].sort((a, b) => a[0] - b[0]).map(([year, value]) => ({ year, value }));
  return { key, title: m.title, unit: m.unit, publisher: m.publisher, licence: m.licence,
    dbnomicsId: `${m.provider}/${m.dataset}`, points, lastPeriod: String(points.at(-1)!.year),
    derived: m.lands.length > 1, provisional: m.provisional };
}
