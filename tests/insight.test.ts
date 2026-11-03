import { describe, expect, it } from 'vitest';
import { computeInsight, verdict, type InsightSeries } from '../src/insight/insight';

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
  it('a growth headline starts a year after its levels; the lines follow the headline period', () => {
    const r = computeInsight(ramp(2000, 12, 10), ramp(2000, 12, 100), { growth: true, base: 2005 });
    if (!r.shown) throw new Error('not shown');
    expect(r.lines.kpi[0].period).toBe('2001');
    expect(r.lines.base).toBe('2005');
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
