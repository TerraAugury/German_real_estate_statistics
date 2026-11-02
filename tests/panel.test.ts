import { describe, expect, it } from 'vitest';
import { loadSeries } from '../src/lib/series';
import { computeLink, type LinkResult } from '../src/link/link';
import { annualPoints } from '../src/lib/series';
import { renderPanel } from '../src/lib/panel';

const kpi = loadSeries('construction-permits-office');
const ind = loadSeries('euribor-3m');
const lag = (l: number, rho: number | null) => ({ lag: l, n: rho === null ? 5 : 14, rho });
const shown = (n0: number): LinkResult => ({
  shown: true, span: ['2009', '2025'],
  overlay: [{ period: '2008', kpi: 1, indicator: 2 }, { period: '2009', kpi: 2, indicator: 1 }],
  lags: [lag(-1, 0.1), lag(0, 0.5), lag(1, -0.7), lag(2, null)],
  headline: { lag: 0, n: n0, rho: 0.5 }, strongest: lag(1, -0.7),
});

describe('Link panel', () => {
  it('EN: exact co-movement sentence with period and n, both series named, note + strongest-of-N', () => {
    const h = renderPanel(kpi, ind, shown(14), 'en');
    expect(h).toContain('This shows how two series moved together over 2009 to 2025 (n = 14). It does not show that one causes the other, and it is not a forecast.');
    expect(h).toContain(kpi.title.en);
    expect(h).toContain(ind.title.en);
    expect(h).toContain('Strongest of 3 lags tested; chosen after looking at the data, so likely overstated.');
    expect(h).toContain('<svg');
  });
  it('DE: exact sentence', () => {
    const h = renderPanel(kpi, ind, shown(14), 'de');
    expect(h).toContain('Dargestellt ist, wie sich zwei Reihen im Zeitraum 2009 bis 2025 (n = 14) gemeinsam entwickelt haben. Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose.');
  });
  it('small sample Note only for annual n < 20 at lag 0', () => {
    expect(renderPanel(kpi, ind, shown(14), 'en')).toContain('Based on only 14 annual observations.');
    expect(renderPanel(kpi, ind, shown(20), 'en')).not.toContain('Based on only');
  });
  it('Notes in the fixed order: the KPI’s short history, then small sample (spec section 9)', () => {
    const h = renderPanel({ ...kpi, shortWindow: true }, ind, shown(14), 'en');
    expect(h.indexOf('Short history')).toBeGreaterThan(-1);
    expect(h.indexOf('Short history')).toBeLessThan(h.indexOf('Based on only'));
  });
  it('not-shown state is visible, with n, in both languages, and no charts', () => {
    const r: LinkResult = { shown: false, n0: 7, reason: 'too_few' };
    expect(renderPanel(kpi, ind, r, 'en')).toContain('Link not shown: too few observations (n = 7)');
    expect(renderPanel(kpi, ind, r, 'de')).toContain('nicht angezeigt: zu wenige Beobachtungen (n = 7)');
    expect(renderPanel(kpi, ind, r, 'en')).not.toContain('<svg');
  });
  it('inherits series Notes prefixed with the series title', () => {
    // no hand-injected flags: a 2035 'now' makes the committed snapshot stale when loadSeries reads it
    const stale = loadSeries('construction-permits-office', new Date('2035-01-01'));
    expect(stale.stale).toBe(true);
    expect(renderPanel(stale, ind, shown(14), 'en')).toContain(`Note: ${kpi.title.en}: Latest observation: `);
    expect(renderPanel(kpi, ind, shown(14), 'en')).not.toContain('Latest observation');
  });
  it('real data: office permits vs Euribor and CPI give a shown Link', () => {
    const r = computeLink(
      { freq: 'A', change: kpi.change, obs: kpi.obs },
      { freq: 'M', change: ind.change, obs: ind.obs });
    expect(r.shown).toBe(true);
    const c = loadSeries('cpi');
    expect(computeLink({ freq: 'A', change: kpi.change, obs: kpi.obs }, { freq: 'M', change: c.change, obs: c.obs }).shown).toBe(true);
  });
  it('annualPoints refuses monthly series', () => {
    expect(() => annualPoints(ind)).toThrow(/annual/);
    expect(annualPoints(kpi).length).toBe(kpi.obs.length);
  });
});
