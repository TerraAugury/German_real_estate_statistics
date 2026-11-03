// Insight module (spec section 4): series in, a headline measure and its verdict out. Pure; pages format and draw it.
import { changes, levels, type LinkSeries } from '../link/link';

/** Fewest annual observations an Insight needs to be shown. */
export const MIN_OBS = 10;
/** Under this many, the average rests on too little history and the page says so. */
export const SHORT_OBS = 20;

export type Verdict = 'higher' | 'lower' | 'in_line';
export type InsightSeries = Pick<LinkSeries, 'freq' | 'obs'>;
export type InsightResult =
  | { shown: false; n: number; reason: 'too_few' }
  | { shown: true; points: { period: string; value: number }[]; from: string; to: string; n: number; short: boolean;
      mean: number; sd: number; latest: { period: string; value: number }; verdict: Verdict };

/** In line when the latest value is within half a standard deviation of the mean (boundary included); a zero deviation reads in line. */
export function verdict(latest: number, mean: number, sd: number): Verdict {
  const d = latest - mean;
  return Math.abs(d) <= sd / 2 ? 'in_line' : d > 0 ? 'higher' : 'lower';
}

/**
 * KPI minus reference, in points, over the years both series cover; with `growth`, of their year-on-year percent changes.
 * ponytail: annual only. Every catalogued Insight runs at the coarsest frequency of its series, which is annual; add a quarterly target when one is declared.
 */
export function computeInsight(kpi: InsightSeries, reference: InsightSeries, opts: { growth: boolean }): InsightResult {
  const [a, b] = [kpi, reference].map((s) => (opts.growth ? changes(levels(s, 'A'), 'A', 'pct') : levels(s, 'A')));
  const years = [...a.keys()].filter((y) => b.has(y)).sort((x, y) => x - y);
  if (years.length < MIN_OBS) return { shown: false, n: years.length, reason: 'too_few' };
  const points = years.map((y) => ({ period: String(y), value: a.get(y)! - b.get(y)! }));
  const latest = points.at(-1)!;
  const mean = points.reduce((sum, p) => sum + p.value, 0) / points.length;
  const sd = Math.sqrt(points.reduce((sum, p) => sum + (p.value - mean) ** 2, 0) / points.length); // population SD, whole period
  return { shown: true, points, from: points[0].period, to: latest.period, n: points.length, short: points.length < SHORT_OBS, mean, sd, latest, verdict: verdict(latest.value, mean, sd) };
}
