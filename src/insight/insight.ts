// Insight module (spec section 4): series in, a headline measure and its verdict out. Pure; pages format and draw it.
import { changes, levels, type LinkSeries } from '../link/link';

/** Fewest annual observations an Insight needs to be shown. */
export const MIN_OBS = 10;
/** Under this many, the average rests on too little history and the page says so. */
export const SHORT_OBS = 20;

export type Verdict = 'higher' | 'lower' | 'in_line';
export type InsightSeries = Pick<LinkSeries, 'freq' | 'obs'>;
type Points = { period: string; value: number }[];
export type InsightResult =
  | { shown: false; n: number; reason: 'too_few' }
  | { shown: true; points: { period: string; value: number }[]; from: string; to: string; n: number; short: boolean;
      mean: number; sd: number; latest: { period: string; value: number }; verdict: Verdict;
      /** The two series over the headline period, rebased when a base year was asked for (`base` is the year actually used). */
      lines: { kpi: Points; reference: Points; base?: string } };

/** In line when the latest value is within half a standard deviation of the mean (boundary included); a zero deviation reads in line. */
export function verdict(latest: number, mean: number, sd: number): Verdict {
  const d = latest - mean;
  return Math.abs(d) <= sd / 2 ? 'in_line' : d > 0 ? 'higher' : 'lower';
}

/**
 * Both series over `years`, each divided by its value in the base year and scaled to 100. The base year is `base` when
 * both series have a value then, else the first of `years`, so the two lines always meet at 100 in one year.
 */
function lines(a: Map<number, number>, b: Map<number, number>, years: number[], base?: number) {
  if (base === undefined) return { kpi: years.map((y) => ({ period: String(y), value: a.get(y)! })), reference: years.map((y) => ({ period: String(y), value: b.get(y)! })) };
  const year = years.includes(base) ? base : years[0];
  const scale = (m: Map<number, number>) => years.map((y) => ({ period: String(y), value: (m.get(y)! / m.get(year)!) * 100 }));
  return { kpi: scale(a), reference: scale(b), base: String(year) };
}

/**
 * KPI minus reference, in points, over the years both series cover; with `growth`, of their year-on-year percent changes.
 * ponytail: annual only. Every catalogued Insight runs at the coarsest frequency of its series, which is annual; add a quarterly target when one is declared.
 */
export function computeInsight(kpi: InsightSeries, reference: InsightSeries, opts: { growth: boolean; base?: number }): InsightResult {
  const [la, lb] = [kpi, reference].map((s) => levels(s, 'A'));
  const [a, b] = opts.growth ? [la, lb].map((l) => changes(l, 'A', 'pct')) : [la, lb];
  const years = [...a.keys()].filter((y) => b.has(y)).sort((x, y) => x - y);
  if (years.length < MIN_OBS) return { shown: false, n: years.length, reason: 'too_few' };
  const points = years.map((y) => ({ period: String(y), value: a.get(y)! - b.get(y)! }));
  const latest = points.at(-1)!;
  const mean = points.reduce((sum, p) => sum + p.value, 0) / points.length;
  const sd = Math.sqrt(points.reduce((sum, p) => sum + (p.value - mean) ** 2, 0) / points.length); // population SD, whole period
  return { shown: true, points, from: points[0].period, to: latest.period, n: points.length, short: points.length < SHORT_OBS, mean, sd, latest, verdict: verdict(latest.value, mean, sd), lines: lines(la, lb, years, opts.base) };
}
