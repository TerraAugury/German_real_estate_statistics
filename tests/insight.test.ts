import { describe, expect, it } from 'vitest';
import { compareLines, computeInsight, tone, verdict, type InsightSeries } from '../src/insight/insight';

const annual = (from: number, values: number[]): InsightSeries => ({
  freq: 'A', obs: values.map((value, i) => ({ period: String(from + i), value })),
});
const monthly = (year: number, months: number, value: number) => Array.from({ length: months }, (_, m) => ({ period: `${year}-${String(m + 1).padStart(2, '0')}`, value }));
const zeros = (n: number) => Array<number>(n).fill(0);

describe('Insight module: shared period and spread', () => {
  it('spread is KPI minus reference over the overlap of both series', () => {
    const r = computeInsight(annual(2000, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]), annual(2002, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), { growth: false });
    expect(r).toMatchObject({ shown: true, from: '2002', to: '2011', n: 10 });
    if (r.shown) expect(r.points.map((p) => p.value)).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });
  it('a monthly series is averaged per year and a year with missing months is dropped, not partly averaged', () => {
    const obs = [...Array.from({ length: 12 }, (_, i) => monthly(2000 + i, 12, 4)).flat(), ...monthly(2012, 7, 100)];
    const r = computeInsight({ freq: 'M', obs }, annual(2000, zeros(13)), { growth: false });
    expect(r).toMatchObject({ shown: true, from: '2000', to: '2011', n: 12 });
    if (r.shown) expect(r.points.every((p) => p.value === 4)).toBe(true);
  });
});

describe('Insight module: growth headlines', () => {
  const grow = (rate: number, n: number) => Array.from({ length: n }, (_, i) => 100 * (1 + rate) ** i);
  it('growth compares year-on-year percent changes and loses the first year', () => {
    const r = computeInsight(annual(2000, grow(0.1, 12)), annual(2000, grow(0.02, 12)), { growth: true });
    expect(r).toMatchObject({ shown: true, from: '2001', to: '2011', n: 11 });
    if (r.shown) for (const p of r.points) expect(p.value).toBeCloseTo(8, 9);
  });
});

describe('Insight module: how much history', () => {
  const run = (n: number) => computeInsight(annual(2000, zeros(n)), annual(2000, zeros(n)), { growth: false });
  it('under 10 observations the Insight is not shown, and says how many it had', () => {
    expect(run(9)).toEqual({ shown: false, n: 9, reason: 'too_few' });
    expect(run(10).shown).toBe(true);
  });
  it('under 20 observations the average is flagged as weak', () => {
    expect(run(19)).toMatchObject({ short: true });
    expect(run(20)).toMatchObject({ short: false });
  });
});

describe('Insight module: the verdict', () => {
  const spread = (values: number[]) => computeInsight(annual(2000, values), annual(2000, zeros(values.length)), { growth: false });
  it('mean and population standard deviation cover the whole shared period, the latest value included', () => {
    const r = spread([...zeros(9), 10]); // mean 1, population SD 3
    expect(r).toMatchObject({ shown: true, mean: 1, sd: 3, latest: { period: '2009', value: 10 } });
  });
  it('higher or lower when the latest value is more than half a standard deviation from the mean', () => {
    expect(spread([...zeros(9), 10])).toMatchObject({ verdict: 'higher' });
    expect(spread([...zeros(9), -10])).toMatchObject({ verdict: 'lower' });
  });
  it('in line within half a standard deviation, boundary included', () => {
    expect(spread([3, -3, 3, -3, 3, -3, 3, -3, 0, 0])).toMatchObject({ verdict: 'in_line' });
    expect(verdict(1.5, 1, 1)).toBe('in_line');
    expect(verdict(1.5 + 1e-9, 1, 1)).toBe('higher');
    expect(verdict(0.5, 1, 1)).toBe('in_line');
    expect(verdict(0.5 - 1e-9, 1, 1)).toBe('lower');
  });
  it('a constant series has no spread, so it reads in line', () => {
    expect(spread(zeros(12))).toMatchObject({ sd: 0, verdict: 'in_line' });
  });
});

describe('Insight module: lines behind the headline, rebased', () => {
  const ramp = (from: number, n: number, start = 10) => annual(from, Array.from({ length: n }, (_, i) => start + i));
  it('both series are rebased to 2015 = 100 over the headline period', () => {
    const r = computeInsight(ramp(2005, 20, 20), ramp(2005, 20, 100), { growth: false, base: 2015 });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.base).toBe('2015');
    expect(r.lines.kpi.find((p) => p.period === '2015')!.value).toBe(100);
    expect(r.lines.reference.find((p) => p.period === '2015')!.value).toBe(100);
    expect(r.lines.kpi.map((p) => p.period)).toEqual(r.points.map((p) => p.period));
    expect(r.lines.kpi.at(-1)!.value).toBeCloseTo((39 / 30) * 100, 9); // 2024: 39 against 30 in 2015
  });
  it('without a 2015 value in the shared period both fall back to the first shared year', () => {
    const r = computeInsight(ramp(2016, 12, 40), ramp(2016, 12, 50), { growth: false, base: 2015 });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.base).toBe('2016');
    expect(r.lines.kpi[0]).toEqual({ period: '2016', value: 100 });
    expect(r.lines.reference[0]).toEqual({ period: '2016', value: 100 });
  });
  it('with no base the lines are the levels as they are', () => {
    const r = computeInsight(ramp(2000, 12, 3), ramp(2000, 12, 1), { growth: false });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.base).toBeUndefined();
    expect(r.lines.kpi.slice(0, 2)).toEqual([{ period: '2000', value: 3 }, { period: '2001', value: 4 }]);
  });
  it('a growth headline draws year-on-year changes, not rebased levels, starting a year after the levels', () => {
    const r = computeInsight(ramp(2000, 12, 10), ramp(2000, 12, 100), { growth: true, base: 2005 });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.growth).toBe(true);
    expect(r.lines.base).toBeUndefined();
    expect(r.lines.kpi[0].period).toBe('2001');
    expect(r.lines.kpi[0].value).toBeCloseTo(10, 9); // the first year-on-year change of the 10-per-year ramp
    expect(r.lines.kpi.at(-1)!.value - r.lines.reference.at(-1)!.value).toBeCloseTo(r.latest.value, 9);
  });
});

describe('Insight module: ratio and the shifted reference', () => {
  const ramp = (from: number, n: number, k: number) => annual(from, Array.from({ length: n }, (_, i) => k * (1 + i)));
  it('the ratio is KPI over reference', () => {
    const r = computeInsight(ramp(2000, 12, 6), ramp(2000, 12, 3), { headline: 'ratio' });
    expect(r).toMatchObject({ shown: true, n: 12, mean: 2, sd: 0, verdict: 'in_line' });
  });
  it('a year with a zero reference has no ratio and is left out', () => {
    const ref = ramp(2000, 12, 3);
    ref.obs[4].value = 0;
    const r = computeInsight(ramp(2000, 12, 6), ref, { headline: 'ratio' });
    expect(r).toMatchObject({ shown: true, n: 11 });
    if (r.shown) expect(r.points.map((p) => p.period)).not.toContain('2004');
  });
  it('shift pairs the KPI of year t with the reference of year t minus the shift', () => {
    // completions from 2010, permits from 2008: 2010 completions against 2008 permits
    const r = computeInsight(ramp(2010, 16, 2), ramp(2008, 16, 1), { headline: 'ratio', shift: 2 });
    expect(r).toMatchObject({ shown: true, from: '2010', to: '2025', n: 16, mean: 2 });
  });
  it('the lines follow the shift, so the shifted line sits under the year it is compared with', () => {
    const r = computeInsight(ramp(2010, 16, 2), ramp(2008, 16, 1), { headline: 'ratio', shift: 2 });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.reference[0]).toEqual({ period: '2010', value: 1 }); // the 2008 value, shown at 2010
  });
});

describe('Insight module: lines of a further compared series', () => {
  const ramp = (from: number, n: number, start: number) => annual(from, Array.from({ length: n }, (_, i) => start + i));
  it('the same lines the headline uses, over the years asked for and the series has', () => {
    const years = ['2002', '2003', '2004', '2005'];
    const l = compareLines(ramp(2003, 10, 10), ramp(2000, 12, 1), years, {});
    expect(l.kpi).toEqual([{ period: '2003', value: 10 }, { period: '2004', value: 11 }, { period: '2005', value: 12 }]);
    expect(l.reference.map((p) => p.period)).toEqual(['2003', '2004', '2005']);
    expect(l.base).toBeUndefined();
  });
  it('rebased and shifted like the headline', () => {
    const l = compareLines(ramp(2010, 16, 2), ramp(2008, 16, 1), ['2010', '2011'], { base: 2015, shift: 2 });
    expect(l.base).toBe('2010'); // 2015 is not among the years asked for
    expect(l.kpi[0]).toEqual({ period: '2010', value: 100 });
    expect(l.reference[0]).toEqual({ period: '2010', value: 100 });
  });
});

describe('Insight module: indexed ratio and real growth', () => {
  const geometric = (from: number, n: number, start: number, rate: number) => annual(from, Array.from({ length: n }, (_, i) => start * (1 + rate) ** i));
  it('indexed: the ratio of the two series after both are rebased, so it is 1 in the base year', () => {
    const r = computeInsight(geometric(2010, 16, 50 / 1.1 ** 5, 0.1), geometric(2010, 16, 200 / 1.05 ** 5, 0.05), { headline: 'ratio', base: 2015, indexed: true });
    if (!r.shown) throw new Error('not shown');
    expect(r.points.find((p) => p.period === '2015')!.value).toBeCloseTo(1, 12);
    expect(r.latest.value).toBeCloseTo((1.1 / 1.05) ** 10, 9); // 2025
    expect(r.lines.base).toBe('2015');
  });
  it('real growth: growth of the KPI divided by the deflator, in percent', () => {
    const r = computeInsight(geometric(2000, 12, 100, 0.1), geometric(2000, 12, 100, 0.04), { headline: 'growth', deflate: 'flow' });
    if (!r.shown) throw new Error('not shown');
    expect(r).toMatchObject({ from: '2001', n: 11 });
    for (const p of r.points) expect(p.value).toBeCloseTo((1.1 / 1.04 - 1) * 100, 9);
  });
  it('a base year adds the real index compounded from it (= 100), with its total change and yearly rate; without a base there is none', () => {
    const [kpi, cpi] = [geometric(2000, 12, 100, 0.1), geometric(2000, 12, 100, 0.04)];
    const r = computeInsight(kpi, cpi, { headline: 'growth', deflate: 'flow', base: 2003 });
    if (!r.shown || !r.index) throw new Error('no index');
    const real = 1.1 / 1.04; // each year's real growth factor, compounded from 2003
    expect(r.index).toMatchObject({ from: '2003', to: '2011' });
    expect(r.index.points.map((p) => p.period)).toEqual(['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011']);
    r.index.points.forEach((p, i) => expect(p.value).toBeCloseTo(100 * real ** i, 9));
    expect(r.index.total).toBeCloseTo((real ** 8 - 1) * 100, 9);
    expect(r.index.annual).toBeCloseTo((real - 1) * 100, 9);
    // the headline, mean and verdict do not depend on the index
    const without = computeInsight(kpi, cpi, { headline: 'growth', deflate: 'flow' });
    if (!without.shown) throw new Error('not shown');
    expect(without.index).toBeUndefined();
    expect({ ...r, index: undefined, lines: undefined }).toEqual({ ...without, index: undefined, lines: undefined });
  });
  it('flow deflates by the annual-average price level, stock by the December one', () => {
    // CPI is 50 in January to November and 100 + 10 i in December of year i; the KPI stays at 100
    const kpi = annual(2000, Array(12).fill(100));
    const cpi: InsightSeries = { freq: 'M', obs: Array.from({ length: 12 }, (_, i) => Array.from({ length: 12 }, (_, m) => ({ period: `${2000 + i}-${String(m + 1).padStart(2, '0')}`, value: m === 11 ? 100 + 10 * i : 50 }))).flat() };
    const stock = computeInsight(kpi, cpi, { headline: 'growth', deflate: 'stock' });
    const flow = computeInsight(kpi, cpi, { headline: 'growth', deflate: 'flow' });
    if (!stock.shown || !flow.shown) throw new Error('not shown');
    expect(stock.latest.value).toBeCloseTo((200 / 210 - 1) * 100, 9); // December 2010 against December 2011
    const mean = (dec: number) => (11 * 50 + dec) / 12;
    expect(flow.latest.value).toBeCloseTo((mean(200) / mean(210) - 1) * 100, 9);
    expect(stock.latest.value).not.toBeCloseTo(flow.latest.value, 3);
  });
});

describe('Insight module: change of one series with another as context', () => {
  const geometric = (from: number, n: number, start: number, rate: number) => annual(from, Array.from({ length: n }, (_, i) => start * (1 + rate) ** i));
  const rise = (from: number, n: number) => annual(from, Array.from({ length: n }, (_, i) => 5 + 2 * i));
  it('the headline is the year-on-year change of the KPI in points, and the reference growth comes along as context', () => {
    const r = computeInsight(rise(2000, 13), geometric(2000, 13, 100, 0.02), { headline: 'change' });
    if (!r.shown) throw new Error('not shown');
    expect(r).toMatchObject({ from: '2001', to: '2012', n: 12, mean: 2, sd: 0, verdict: 'in_line' });
    expect(r.context!.map((p) => p.period)).toEqual(r.points.map((p) => p.period));
    for (const p of r.context!) expect(p.value).toBeCloseTo(2, 9);
  });
  it('only years with both a vacancy change and a reference growth count, so a reference ending a year early ends the Insight', () => {
    const r = computeInsight(rise(2000, 14), geometric(2000, 13, 100, 0.02), { headline: 'change' });
    expect(r).toMatchObject({ shown: true, to: '2012', n: 12 });
  });
  it('the other headlines carry no context', () => {
    const r = computeInsight(rise(2000, 12), rise(2000, 12), {});
    expect(r).toMatchObject({ shown: true });
    if (r.shown) expect(r.context).toBeUndefined();
  });
});

describe('Insight module: every compared series counts toward the shared period', () => {
  const ramp = (from: number, n: number) => annual(from, Array.from({ length: n }, (_, i) => 5 + i));
  it('a further KPI series that starts later shortens the shared period and the headline', () => {
    const r = computeInsight(ramp(2000, 14), ramp(2000, 14), { also: [ramp(2004, 10)] });
    expect(r).toMatchObject({ shown: true, from: '2004', to: '2013', n: 10 });
  });
  it('and under 10 shared observations it is not shown', () => {
    expect(computeInsight(ramp(2000, 14), ramp(2000, 14), { also: [ramp(2006, 8)] })).toEqual({ shown: false, n: 8, reason: 'too_few' });
  });
});

// Insight tone: the Verdict read through the direction the Insight declares as better. The sign of the number never decides.
describe('Insight module: the tone of a verdict', () => {
  it('reads by direction: higher is better where higher is better, worse where lower is better, and the reverse for lower', () => {
    expect([tone('higher', 'higher'), tone('lower', 'higher')]).toEqual(['better', 'worse']);
    expect([tone('higher', 'lower'), tone('lower', 'lower')]).toEqual(['worse', 'better']);
  });
  it('in line is neutral whichever way is better, and an Insight with no better side is always neutral', () => {
    expect([tone('in_line', 'higher'), tone('in_line', 'lower'), tone('in_line', 'none')]).toEqual(['neutral', 'neutral', 'neutral']);
    expect([tone('higher', 'none'), tone('lower', 'none')]).toEqual(['neutral', 'neutral']);
  });
  it('a negative latest value is better when it is lower than an average and lower is better (vacancy falling)', () => {
    const r = computeInsight(annual(2000, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]), annual(2000, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3]), { headline: 'spread' });
    if (!r.shown) throw new Error('not shown');
    expect(r.latest.value).toBeLessThan(0);
    expect(tone(r.verdict, 'lower')).toBe('better');
  });
  it('a negative latest value above a more negative average is "higher than" and reads by direction, not by sign', () => {
    const r = computeInsight(annual(2000, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), annual(2000, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0.3]), { headline: 'spread' });
    if (!r.shown) throw new Error('not shown');
    expect(r.latest.value).toBeLessThan(0);
    expect(r.verdict).toBe('higher');
    expect(tone(r.verdict, 'higher')).toBe('better');
    expect(tone(r.verdict, 'lower')).toBe('worse');
  });
});
