// Insight module (spec section 4): series in, a headline measure and its verdict out. Pure; pages format and draw it.
import { changes, levels, type LinkSeries } from '../link/link';

/** Fewest annual observations an Insight needs to be shown. */
export const MIN_OBS = 10;
/** Under this many, the average rests on too little history and the page says so. */
export const SHORT_OBS = 20;

export type Headline = 'spread' | 'ratio' | 'growth' | 'change' | 'deviation' | 'gap';
export type Verdict = 'higher' | 'lower' | 'in_line';
export type Better = 'higher' | 'lower' | 'none';
export type Tone = 'better' | 'worse' | 'neutral';
export type InsightSeries = Pick<LinkSeries, 'freq' | 'obs'> & { unit?: { en: string } };
/** A rate or percentage (unit "%", "% p.a.", "% balance"): never rebased to an index, always shown in its own unit. */
export const isRate = (s: InsightSeries) => s.unit?.en.startsWith('%') ?? false;
export type Points = { period: string; value: number }[];
export type InsightResult =
  | { shown: false; n: number; reason: 'too_few' }
  | { shown: true; points: Points; from: string; to: string; n: number; short: boolean;
      mean: number; sd: number; latest: Points[number]; verdict: Verdict;
      /** change: the reference's year-on-year percent growth over the same years, shown beside the headline and never given a verdict. */
      context?: Points;
      /** deviation: what the top chart draws instead of the headline points (the KPI's yearly change, with the reference's growth as context), with its own average and spread. */
      chart?: { points: Points; context: Points; from: string; to: string; mean: number; sd: number };
      /** The two series over the headline period, rebased when a base year was asked for (`base` is the year actually used). */
      lines: { kpi: Points; reference: Points; base?: string; /** year-on-year percent changes, not levels: the lines of an Insight whose headline is a growth rate or a gap between two. */ growth?: boolean; /** gap: the reference line is a year-on-year growth rate drawn on its own right-hand axis. */ secondAxis?: boolean; /** Which line is an index: a rate stays in its own unit, so a chart with one of each needs two axes. */ rebased?: { kpi: boolean; reference: boolean } } };

/** In line when the latest value is within half a standard deviation of the mean (boundary included); a zero deviation reads in line. */
export function verdict(latest: number, mean: number, sd: number): Verdict {
  const d = latest - mean;
  return Math.abs(d) <= sd / 2 ? 'in_line' : d > 0 ? 'higher' : 'lower';
}

/**
 * The verdict read through the direction an Insight declares as better for an office investor. In line, and an Insight with no
 * better side, are neutral. The sign of the number never decides: only where the latest value sits against the average.
 */
export const tone = (v: Verdict, better: Better): Tone => (v === 'in_line' || better === 'none' ? 'neutral' : v === better ? 'better' : 'worse');

/**
 * Both series over `years`, each divided by its value in the base year and scaled to 100. The base year is `base` when
 * both series have a value then, else the first of `years`, so the two lines always meet at 100 in one year. A rate (`rate`) is
 * never rebased and stays in its own unit; two rates are not rebased at all.
 */
function lines(a: Map<number, number>, b: Map<number, number>, years: number[], base?: number, rate = { kpi: false, reference: false }): Extract<InsightResult, { shown: true }>['lines'] {
  if (base === undefined || (rate.kpi && rate.reference)) return { kpi: years.map((y) => ({ period: String(y), value: a.get(y)! })), reference: years.map((y) => ({ period: String(y), value: b.get(y)! })) };
  const year = years.includes(base) ? base : years[0];
  const scale = (m: Map<number, number>, isRated: boolean) => years.map((y) => ({ period: String(y), value: isRated ? m.get(y)! : (m.get(y)! / m.get(year)!) * 100 }));
  return { kpi: scale(a, rate.kpi), reference: scale(b, rate.reference), base: String(year), rebased: { kpi: !rate.kpi, reference: !rate.reference } };
}

/** `levels` divided by the deflator's level of the same year (x 100), over the years both have: a real series, e.g. rents over the annual-average CPI. */
const real = (levels: Map<number, number>, deflator: Map<number, number>) =>
  new Map([...levels].filter(([y]) => deflator.has(y)).map(([y, v]) => [y, (v / deflator.get(y)!) * 100]));

const shifted = (m: Map<number, number>, by = 0) => new Map([...m].map(([y, v]) => [y + by, v]));

/** The lines of one more compared series, over the given years where both series have a value; rebased and shifted like the headline. */
export function compareLines(kpi: InsightSeries, reference: InsightSeries, years: string[], opts: { base?: number; shift?: number }) {
  const [a, b] = [levels(kpi, 'A'), shifted(levels(reference, 'A'), opts.shift)];
  return lines(a, b, years.map(Number).filter((y) => a.has(y) && b.has(y)), opts.base, { kpi: isRate(kpi), reference: isRate(reference) });
}

/** The value of the December observation of each year (a stock, as at year end); a year without one has no value. */
function decemberLevels(s: InsightSeries): Map<number, number> {
  return new Map(s.obs.filter((o) => o.period.endsWith('-12') && o.value !== null).map((o) => [+o.period.slice(0, 4), o.value as number]));
}

export type InsightOptions = {
  /** spread (default): KPI minus reference in points; ratio: KPI over reference; growth: year-on-year percent change of the KPI alone;
   * change: year-on-year change of the KPI in points, with the reference's growth as context over the years both have.
   * deviation: the reference's latest level as a percent above or below its own average over the shared years.
   * gap: the KPI's level minus its own average over the years the reference's real growth exists (the deflator deflates the reference). */
  headline?: Headline;
  /** Compare year-on-year percent changes of both series instead of levels (spread). */
  growth?: boolean;
  /** Rebase the lines behind the headline to this year = 100. */
  base?: number;
  /** Pair the reference of year t - shift with the KPI of year t. */
  shift?: number;
  /** ratio: take the ratio of the two series after rebasing to `base`, for index series with different bases. */
  indexed?: boolean;
  /** Further KPI series of the Insight: their years must be covered too, so the shared period is the overlap of all series. */
  also?: InsightSeries[];
  /** growth: deflate the KPI by the reference (a price level) first; flow uses its annual average, stock its December value. */
  deflate?: 'flow' | 'stock';
  /** spread with growth: the price level the KPI is deflated by first (as for the growth headline), so a real KPI growth is compared with the reference. */
  deflator?: InsightSeries;
};

/**
 * The headline measure over the years the series cover, as set by `opts`; a year with a zero reference has no ratio and is left out.
 * ponytail: annual only. Every catalogued Insight runs at the coarsest frequency of its series, which is annual; add a quarterly target when one is declared.
 */
export function computeInsight(kpi: InsightSeries, reference: InsightSeries, opts: InsightOptions = {}): InsightResult {
  const [nominal, lb] = [levels(kpi, 'A'), shifted(levels(reference, 'A'), opts.shift)];
  const head = opts.headline ?? 'spread';
  const la = opts.deflator && head !== 'gap' ? real(nominal, opts.deflate === 'stock' ? decemberLevels(opts.deflator) : levels(opts.deflator, 'A')) : nominal;
  const values = new Map<number, number>();
  // Year-on-year changes of both series (the real KPI for a deflated spread): the lines drawn for a growth headline, and the terms of a growth spread.
  const growthLines = opts.growth || head === 'growth' ? [la, lb].map((l) => changes(l, 'A', 'pct')) : undefined;
  let growth: Map<number, number> | undefined;
  const avg = (xs: number[]) => xs.reduce((sum, x) => sum + x, 0) / xs.length;
  const shared = [...la.keys()].filter((y) => lb.has(y));
  const realGrowth = head === 'gap' && opts.deflator ? changes(real(lb, levels(opts.deflator, 'A')), 'A', 'pct') : undefined;
  if (head === 'deviation') {
    const m = avg(shared.map((y) => lb.get(y)!));
    for (const y of shared) values.set(y, (lb.get(y)! / m - 1) * 100);
  } else if (realGrowth) {
    const ys = shared.filter((y) => realGrowth.has(y));
    const m = avg(ys.map((y) => la.get(y)!));
    for (const y of ys) values.set(y, la.get(y)! - m);
  } else if (head === 'growth') {
    const deflator = opts.deflate === 'stock' ? decemberLevels(reference) : lb;
    for (const [y, v] of changes(opts.deflate ? real(la, deflator) : la, 'A', 'pct')) values.set(y, v);
  } else if (head === 'change') {
    growth = changes(lb, 'A', 'pct');
    for (const [y, v] of changes(la, 'A', 'diff')) if (growth.has(y)) values.set(y, v);
  } else {
    const [a, b] = growthLines ?? [la, lb];
    for (const [y, v] of a) if (b.has(y) && !(head === 'ratio' && b.get(y) === 0)) values.set(y, head === 'ratio' ? v / b.get(y)! : v - b.get(y)!);
  }
  const more = (opts.also ?? []).map((x) => (opts.growth || head === 'growth' ? changes(levels(x, 'A'), 'A', 'pct') : levels(x, 'A')));
  const years = [...values.keys()].filter((y) => more.every((m) => m.has(y))).sort((x, y) => x - y);
  if (years.length < MIN_OBS) return { shown: false, n: years.length, reason: 'too_few' };
  const ln = realGrowth
    ? { kpi: years.map((y) => ({ period: String(y), value: la.get(y)! })), reference: years.map((y) => ({ period: String(y), value: realGrowth.get(y)! })), secondAxis: true }
    : growthLines
    ? { kpi: years.map((y) => ({ period: String(y), value: growthLines[0].get(y)! })), reference: years.map((y) => ({ period: String(y), value: growthLines[1].get(y)! })), growth: true }
    : lines(la, lb, years, opts.base, { kpi: isRate(kpi), reference: isRate(reference) });
  const points = years.map((y, i) => ({ period: String(y), value: opts.indexed ? ln.kpi[i].value / ln.reference[i].value : values.get(y)! }));
  const latest = points.at(-1)!;
  const stats = (ps: Points) => {
    const m = avg(ps.map((p) => p.value));
    // Deviations from the own average have mean 0 up to rounding; show it as 0.
    return { mean: Math.abs(m) < 1e-9 ? 0 : m, sd: Math.sqrt(avg(ps.map((p) => (p.value - m) ** 2))) }; // population SD, whole period
  };
  const { mean, sd } = stats(points);
  // deviation: the top chart shows the KPI's yearly change against the reference's yearly growth, over the years both changes exist.
  let chart: Extract<InsightResult, { shown: true }>['chart'];
  if (head === 'deviation') {
    const [dv, cg] = [changes(la, 'A', 'diff'), changes(lb, 'A', 'pct')];
    const cy = years.filter((y) => dv.has(y) && cg.has(y));
    const pts = cy.map((y) => ({ period: String(y), value: dv.get(y)! }));
    if (pts.length >= MIN_OBS) chart = { points: pts, context: cy.map((y) => ({ period: String(y), value: cg.get(y)! })), from: pts[0].period, to: pts.at(-1)!.period, ...stats(pts) };
  }
  return { shown: true, points, from: points[0].period, to: latest.period, n: points.length, short: points.length < SHORT_OBS, mean, sd, latest, verdict: verdict(latest.value, mean, sd), lines: ln,
    ...(growth && { context: years.map((y) => ({ period: String(y), value: growth!.get(y)! })) }), ...(chart && { chart }) };
}

/** A rising vacancy rate over the latest two years while the real growth line is still positive in both: the one case that earns the tenant-shift note. `l` is a `gap` Insight's lines. */
export const vacancyRisingRealGrowth = (l: { kpi: Points; reference: Points }) =>
  l.kpi.length >= 3 && [1, 2].every((i) => { const [v, w] = [l.kpi.at(-i)!.value, l.kpi.at(-i - 1)!.value]; return v > w && l.reference.at(-i)!.value > 0; });
