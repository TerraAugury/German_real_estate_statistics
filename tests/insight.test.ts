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
