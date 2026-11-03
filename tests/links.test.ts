import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { INDICATORS, linkResult, viewLinks } from '../src/lib/links';
import { KPIS } from '../src/lib/kpis';
import { loadManifest } from '../src/lib/manifest';
import { getSeries } from '../src/lib/series';
import { MIN } from '../src/link/link';

const view = (page: string, segment: string, geo = 'germany', freq = 'annual') =>
  KPIS.find((k) => k.page === page)!.views.find((v) => v.segment === segment && v.geo === geo && v.freq === freq)!;
const preview = loadManifest(true);

describe('Link pairs per view (spec sections 5, 6)', () => {
  it('eight indicators; construction prices and OECD confidence follow the Segment', () => {
    expect(INDICATORS).toHaveLength(8);
    const ind = (seg: string) => viewLinks(view('kpi-price-index', seg), preview).map((l) => l.indicator);
    expect(ind('office')).toEqual(['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc', 'cpi', 'gdp-real', 'unemployment-rate',
      'construction-price-office', 'oecd-confidence-construction']);
    expect(ind('retail').slice(6)).toEqual(['construction-price-commercial', 'oecd-confidence-retail']);
  });
  it('Construction: construction prices follow the KPI series’ building type, not the Segment', () => {
    const prices = (seg: string) => viewLinks(view('construction', seg), preview)[6].indicator;
    expect(prices('commercial-overall')).toBe('construction-price-office'); // its first series is office permits
    expect(prices('logistics')).toBe('construction-price-commercial');
  });
  it('office vacancy in the 7 major cities has no Link against the consumer price index', () => {
    const ind = (geo: string) => viewLinks(view('kpi-office-vacancy', 'office', geo), preview).map((l) => l.indicator);
    expect(ind('7-cities')).not.toContain('cpi');
    expect(ind('127-towns')).toContain('cpi');
  });
  it('the KPI side is the view’s first series, Land included', () => {
    expect(viewLinks(view('construction', 'office', 'de-by'), preview)[0]).toMatchObject({ kpi: 'construction-permits-office', land: '09' });
  });
  it('default build drops pairs with a provisional series', () =>
    expect(viewLinks(view('construction', 'office'), loadManifest(false)).map((l) => l.indicator))
      .toEqual(['euribor-3m', 'cpi', 'construction-price-office']));
});

describe('annual minimum of 10 pairs on real data (spec section 6)', () => {
  // Bundesbank KPIs are provisional: only a preview build loads them.
  beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
  afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });
  const euribor = () => getSeries('euribor-3m');
  it('transaction volume index gets a Link at all lags ±3', () => {
    const r = linkResult(getSeries('transaction-volume-de'), euribor());
    expect(r.shown && r.lags.every((l) => l.rho !== null)).toBe(true);
  });
  it('annual price index (12 changes): shown; lag -3 has 9 pairs and is blank', () => {
    // Euribor reaches back before 2013, so +3 keeps 12 pairs; only -3 runs past its last complete year.
    const r = linkResult(getSeries('price-index-de-total-a'), euribor());
    expect(r.shown).toBe(true);
    if (r.shown) {
      expect(r.lags.filter((l) => l.rho === null)).toEqual([{ lag: -3, n: 9, rho: null }]);
      expect(r.headline.n).toBeGreaterThanOrEqual(MIN.A);
    }
  });
});

it('wording: co-movement only, never impact, driver, effect (spec section 6)', () => {
  const prose = ['en', 'de'].flatMap((l) => readdirSync(`content/${l}`).map((f) => `content/${l}/${f}`));
  const texts = ['src/i18n/en.yaml', 'src/i18n/de.yaml', ...prose].map((f) => readFileSync(f, 'utf8'));
  for (const s of texts) expect(s).not.toMatch(/\b(impact|driver|drives|effect|Einfluss|Treiber)/i);
});
