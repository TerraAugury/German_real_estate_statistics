// Insight module (spec section 4): series in, a headline measure and its verdict out. Pure; pages format and draw it.
import { changes, levels, type LinkSeries } from '../link/link';

/** Fewest annual observations an Insight needs to be shown. */
export const MIN_OBS = 10;
/** Under this many, the average rests on too little history and the page says so. */
export const SHORT_OBS = 20;

export type Headline = 'spread' | 'ratio' | 'growth';
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

const shifted = (m: Map<number, number>, by = 0) => new Map([...m].map(([y, v]) => [y + by, v]));

/** The lines of one more compared series, over the given years where both series have a value; rebased and shifted like the headline. */
export function compareLines(kpi: InsightSeries, reference: InsightSeries, years: string[], opts: { base?: number; shift?: number }) {
  const [a, b] = [levels(kpi, 'A'), shifted(levels(reference, 'A'), opts.shift)];
  return lines(a, b, years.map(Number).filter((y) => a.has(y) && b.has(y)), opts.base);
}

/** The value of the December observation of each year (a stock, as at year end); a year without one has no value. */
function decemberLevels(s: InsightSeries): Map<number, number> {
  return new Map(s.obs.filter((o) => o.period.endsWith('-12') && o.value !== null).map((o) => [+o.period.slice(0, 4), o.value as number]));
}

export type InsightOptions = {
  /** spread (default): KPI minus reference in points; ratio: KPI over reference; growth: year-on-year percent change of the KPI alone. */
  headline?: Headline;
  /** Compare year-on-year percent changes of both series instead of levels (spread). */
  growth?: boolean;
  /** Rebase the lines behind the headline to this year = 100. */
  base?: number;
  /** Pair the reference of year t - shift with the KPI of year t. */
  shift?: number;
  /** ratio: take the ratio of the two series after rebasing to `base`, for index series with different bases. */
  indexed?: boolean;
  /** growth: deflate the KPI by the reference (a price level) first; flow uses its annual average, stock its December value. */
  deflate?: 'flow' | 'stock';
};

/**
 * The headline measure over the years the series cover, as set by `opts`; a year with a zero reference has no ratio and is left out.
 * ponytail: annual only. Every catalogued Insight runs at the coarsest frequency of its series, which is annual; add a quarterly target when one is declared.
 */
export function computeInsight(kpi: InsightSeries, reference: InsightSeries, opts: InsightOptions = {}): InsightResult {
  const [la, lb] = [levels(kpi, 'A'), shifted(levels(reference, 'A'), opts.shift)];
  const head = opts.headline ?? 'spread';
  const values = new Map<number, number>();
  if (head === 'growth') {
    const deflator = opts.deflate === 'stock' ? decemberLevels(reference) : lb;
    const real = opts.deflate ? new Map([...la].filter(([y]) => deflator.has(y)).map(([y, v]) => [y, (v / deflator.get(y)!) * 100])) : la;
    for (const [y, v] of changes(real, 'A', 'pct')) values.set(y, v);
  } else {
    const [a, b] = opts.growth ? [la, lb].map((l) => changes(l, 'A', 'pct')) : [la, lb];
    for (const [y, v] of a) if (b.has(y) && !(head === 'ratio' && b.get(y) === 0)) values.set(y, head === 'ratio' ? v / b.get(y)! : v - b.get(y)!);
  }
  const years = [...values.keys()].sort((x, y) => x - y);
  if (years.length < MIN_OBS) return { shown: false, n: years.length, reason: 'too_few' };
  const ln = lines(la, lb, years, opts.base);
  const points = years.map((y, i) => ({ period: String(y), value: opts.indexed ? ln.kpi[i].value / ln.reference[i].value : values.get(y)! }));
  const latest = points.at(-1)!;
  const mean = points.reduce((sum, p) => sum + p.value, 0) / points.length;
  const sd = Math.sqrt(points.reduce((sum, p) => sum + (p.value - mean) ** 2, 0) / points.length); // population SD, whole period
  return { shown: true, points, from: points[0].period, to: latest.period, n: points.length, short: points.length < SHORT_OBS, mean, sd, latest, verdict: verdict(latest.value, mean, sd), lines: ln };
}
