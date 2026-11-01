import { describe, expect, it } from 'vitest';
import { computeLink, MIN, type Series } from '../../src/link/link';
import fixtures from './fixtures.json';

describe('scipy-checked fixtures', () => {
  for (const f of fixtures) {
    it(f.name, () => {
      const r = computeLink(f.kpi as Series, f.indicator as Series);
      const e = f.expected as any;
      expect(r.shown).toBe(e.shown);
      if (!r.shown) return expect(r.n0).toBe(e.n0);
      expect(r.lags.map((l) => [l.lag, l.n])).toEqual(e.lags.map((l: any) => [l.lag, l.n]));
      r.lags.forEach((l, i) => {
        if (e.lags[i].rho === null) expect(l.rho).toBeNull();
        else expect(l.rho).toBeCloseTo(e.lags[i].rho, 9);
      });
      expect(r.headline.n).toBe(e.headline.n);
      expect(r.headline.rho).toBeCloseTo(e.headline.rho, 9);
      expect(r.strongest.lag).toBe(e.strongest.lag);
    });
  }
});

describe('sign convention', () => {
  it('positive lag = indicator moved earlier than the KPI', () => {
    const K = [3, 1, 4, 1.5, 9, 2.5, 6, 5.5, 3.5, 8, 7, 0.5, 10, 2, 11, 12.5]; // kpi change in year t = 2001+i
    const mk = (xs: number[]): Series => ({
      freq: 'A', change: 'diff',
      obs: xs.reduce<number[]>((a, x) => [...a, a[a.length - 1] + x], [0]).map((value, i) => ({ period: String(2000 + i), value })),
    });
    // indicator change in year t equals kpi change in year t+1: the indicator moved a year earlier
    const r = computeLink(mk(K), mk(K.slice(1)));
    if (!r.shown) throw new Error('expected shown');
    expect(r.lags.find((l) => l.lag === 1)!.rho).toBeCloseTo(1, 12);
    expect(r.strongest.lag).toBe(1);
    expect(MIN.A).toBe(10);
  });
});

describe('guards', () => {
  it('drops incomplete periods and never upsamples', () => {
    const kpi: Series = { freq: 'Q', change: 'diff', obs: [] };
    const ind: Series = { freq: 'A', change: 'diff', obs: [{ period: '2020', value: 1 }] };
    expect(() => computeLink(kpi, ind)).toThrow();
  });
});
