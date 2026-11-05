import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { INDICATORS, linkResult, viewLinks } from '../src/lib/links';
import { lagFromHash } from '../src/lib/select';
import { linksOverview } from '../src/lib/pages';
import { KPIS } from '../src/lib/kpis';
import { loadManifest } from '../src/lib/manifest';
import { getSeries } from '../src/lib/series';
import { MIN, noiseBand } from '../src/link/link';

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
  it('office vacancy in the 7 major cities has a Link against the consumer price index, like every other pair (ticket 15)', () => {
    const ind = (geo: string) => viewLinks(view('kpi-office-vacancy', 'office', geo), preview).map((l) => l.indicator);
    expect(ind('7-cities')).toContain('cpi');
    expect(ind('127-towns')).toContain('cpi');
  });
  it('the KPI side is the view’s first series, Land included', () => {
    expect(viewLinks(view('construction', 'office', 'de-by'), preview)[0]).toMatchObject({ kpi: 'construction-permits-office', land: '09' });
  });
  it('default build drops pairs with a series that is not public', () => {
    const indicators = (m: ReturnType<typeof loadManifest>) => viewLinks(view('construction', 'office'), m).map((l) => l.indicator);
    const withheld = loadManifest(false).filter((m) => m.key !== 'cpi');
    expect(indicators(withheld)).not.toContain('cpi');
    expect(indicators(withheld)).toContain('euribor-3m');
  });
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

// Ticket 10: the matrix lag selector reuses the +1 / +2 lags of the Link panel; nothing is computed anew.
describe('matrix lag selector (ticket 10)', () => {
  beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
  afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });
  const cells = () => linksOverview().rows.flatMap((r) => [...r.cells.values()].map((c) => ({ page: r.kpi.page, ...c })));
  it('every cell at N-1 / N-2 equals the +1 / +2 lag of its Link panel; same year equals the headline', () => {
    for (const c of cells()) {
      const r = linkResult(getSeries(c.pair.kpi, c.pair.land), getSeries(c.pair.indicator));
      for (const years of [0, 1, 2] as const) {
        const want = r.shown ? r.lags.find((l) => l.lag === years)! : { rho: null, n: r.n0 };
        expect(c.lags[years], `${c.pair.id} N-${years}`).toMatchObject({ rho: want.rho, n: want.n });
      }
    }
  });
  it('initial yield (7 cities) x 10-year Bund: 0.40 at N-1, 0.43 at N-2', () => {
    const c = cells().find((x) => x.page === 'kpi-initial-yield' && x.pair.name === 'bund-yield-10y')!;
    expect(c.lags[0].rho).toBeCloseTo(0.107, 3);
    expect(c.lags[1].rho).toBeCloseTo(0.397, 3);
    expect(c.lags[2].rho).toBeCloseTo(0.431, 3);
  });
  it('the pre-set marker is on initial yield and price index against Bund, Euribor and loan rate, and nowhere else', () => {
    const marked = cells().filter((c) => c.pair.preset).map((c) => `${c.page}|${c.pair.name}`).sort();
    const rates = ['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc'];
    expect(marked).toEqual(['kpi-initial-yield', 'kpi-price-index'].flatMap((p) => rates.map((n) => `${p}|${n}`)).sort());
  });
  it('the same scope holds for the Link panels of every view', () => {
    const scope = (page: string) => KPIS.find((k) => k.page === page)!.views.flatMap((v) => viewLinks(v, preview));
    for (const l of scope('kpi-initial-yield')) expect(l.preset).toBe(['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc'].includes(l.name));
    for (const l of scope('kpi-price-index')) expect(l.preset).toBe(['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc'].includes(l.name));
    for (const l of scope('kpi-rent-index')) expect(l.preset).toBe(false);
  });
  // Ticket 11: the noise band is 2/sqrt(n-1) from each cell's own n at the selected lag.
  it('no cell of the matrix is empty: every row has a value or a "Not shown" for every column', () => {
    const o = linksOverview();
    for (const r of o.rows) expect(o.columns.filter((n) => !r.cells.has(n)), r.kpi.page).toEqual([]);
    expect(cells()).toHaveLength(o.rows.length * o.columns.length);
  });
  it('same year: the cells outside the noise band are these ten', () => {
    const outside = cells().filter((c) => !c.lags[0].noise && c.lags[0].rho !== null).map((c) => `${c.page}|${c.pair.name}`).sort();
    expect(outside).toEqual([
      'kpi-price-index|cpi', 'kpi-rent-index|construction-price', 'kpi-initial-yield|cpi', 'kpi-initial-yield|gdp-real',
      'kpi-initial-yield|oecd-confidence', 'kpi-office-vacancy|unemployment-rate', 'kpi-office-vacancy|gdp-real',
      'kpi-transaction-volume|gdp-real', 'kpi-transaction-volume|oecd-confidence', 'construction|oecd-confidence'].sort());
    expect(cells().filter((c) => c.lags[0].rho !== null)).toHaveLength(48); // 47 plus office vacancy x CPI (ticket 15)
  });
  it('the band follows the n of the selected lag', () => {
    const c = cells().find((x) => x.page === 'kpi-initial-yield' && x.pair.name === 'euribor-3m')!;
    expect([c.lags[0].n, c.lags[2].n]).toEqual([30, 29]);
    expect(c.lags[0].band).toBeCloseTo(2 / Math.sqrt(29), 10);
    expect(c.lags[2].band).toBeCloseTo(2 / Math.sqrt(28), 10);
  });
  it('a quarterly Link counts n / 4 effective observations (rounded down) in its band', () => {
    expect(noiseBand(44, 'Q')).toBeCloseTo(2 / Math.sqrt(11 - 1), 10);
    expect(noiseBand(47, 'Q')).toBeCloseTo(2 / Math.sqrt(11 - 1), 10);
    expect(noiseBand(30, 'A')).toBeCloseTo(2 / Math.sqrt(29), 10);
  });
  it('a hash selects the lag; anything else is same year', () => {
    expect(lagFromHash('#lag-1')).toBe(1);
    expect(lagFromHash('#lag-2')).toBe(2);
    for (const h of ['', '#', '#lag-0', '#lag-3', '#lag-', '#foo', '#lag-1x', '#link-x']) expect(lagFromHash(h), h).toBe(0);
  });
});

it('wording: co-movement only, never impact, driver, effect (spec section 6)', () => {
  const prose = ['en', 'de'].flatMap((l) => readdirSync(`content/${l}`).map((f) => `content/${l}/${f}`));
  const texts = ['src/i18n/en.yaml', 'src/i18n/de.yaml', ...prose].map((f) => readFileSync(f, 'utf8'));
  for (const s of texts) expect(s).not.toMatch(/\b(impact|driver|drives|effect|Einfluss|Treiber)/i);
});
