import { describe, expect, it } from 'vitest';
import { sumLaender, type Series } from '../src/lib/series';
import { kpiNotes } from '../src/lib/notes';
import { KPIS, liveViews } from '../src/lib/kpis';
import { pickView } from '../src/lib/select';
import { loadAllManifest, loadManifest } from '../src/lib/manifest';

const kpi = (page: string) => KPIS.find((k) => k.page === page)!;
const keys = (page: string, segment: string, geo: string, freq = 'annual') =>
  kpi(page).views.find((x) => x.segment === segment && x.geo === geo && x.freq === freq)?.series.map((s) => s.key + (s.land ? `@${s.land}` : ''));

const part = (land: string, period: string[], value: (number | string | null)[]) => ({ land, period, value });

describe('Germany construction figure (sum of the Länder)', () => {
  it('sums every Land with data and scales thousand m² to million m²', () => {
    const r = sumLaender([part('01', ['2020', '2021'], [1000, 2000]), part('02', ['2020', '2021'], [500, 500])], 0.001);
    expect(r.obs).toEqual([{ period: '2020', value: 1.5 }, { period: '2021', value: 2.5 }]);
    expect(r.partial).toEqual([]);
  });
  it('a Land with no value in a year is left out of that year and named in the partial list', () => {
    const r = sumLaender([
      part('01', ['2020', '2021'], [1000, 2000]), part('02', ['2020', '2021'], [500, 'NA']), part('03', ['2021'], [300])], 0.001);
    expect(r.obs).toEqual([{ period: '2020', value: 1.5 }, { period: '2021', value: expect.closeTo(2.3) }]);
    expect(r.partial).toEqual([{ period: '2020', laender: ['03'] }, { period: '2021', laender: ['02'] }]);
  });
});

describe('KPI catalogue (spec section 4)', () => {
  it('six KPI pages in catalogue order, every series in the manifest', () => {
    expect(KPIS.map((k) => k.page)).toEqual(['kpi-price-index', 'kpi-rent-index', 'kpi-initial-yield', 'kpi-office-vacancy', 'kpi-transaction-volume', 'construction']);
    const all = new Set(loadAllManifest().map((m) => m.key));
    for (const k of KPIS) for (const x of k.views) for (const s of x.series) expect(all.has(s.key), s.key).toBe(true);
  });
  it('maps Segment, geography and frequency to the spec series', () => {
    expect(keys('kpi-price-index', 'commercial-overall', 'supra-regional', 'quarterly')).toEqual(['price-index-cities-total-q']);
    expect(keys('kpi-rent-index', 'retail', 'germany', 'quarterly')).toEqual(['rent-index-de-retail-q']);
    expect(keys('kpi-rent-index', 'office', '7-cities')).toBeUndefined(); // combined only, under commercial overall
    expect(keys('kpi-rent-index', 'commercial-overall', '7-cities')).toEqual(['rent-index-combined-7']);
    expect(keys('kpi-office-vacancy', 'office', '120-towns')).toEqual(['office-vacancy-120']);
    expect(keys('kpi-transaction-volume', 'commercial-overall', '127-districts')).toEqual(['transaction-volume-127']);
    expect(keys('kpi-transaction-volume', 'commercial-overall', '127-towns')).toBeUndefined();
  });
  it('Länder only for Construction; no Logistics view outside Construction', () => {
    for (const k of KPIS.filter((k) => k.page !== 'construction')) for (const x of k.views) {
      expect(x.geo.startsWith('de-'), `${k.page} ${x.geo}`).toBe(false);
      expect(x.segment).not.toBe('logistics');
    }
    expect(kpi('construction').views.filter((x) => x.segment === 'office')).toHaveLength(17);
  });
  it('Construction: Destatis beside Bundesbank at Germany, Destatis only per Land; commercial overall keeps two building types', () => {
    expect(keys('construction', 'office', 'germany')).toEqual([
      'construction-permits-office', 'construction-bbk-permits-office', 'construction-completions-office', 'construction-bbk-completions-office']);
    expect(keys('construction', 'logistics', 'de-by')).toEqual(['construction-permits-warehouse@09', 'construction-completions-warehouse@09']);
    expect(keys('construction', 'commercial-overall', 'germany')).toEqual([
      'construction-permits-office', 'construction-permits-commercial', 'construction-bbk-permits-office', 'construction-bbk-permits-wholesale-warehouse',
      'construction-completions-office', 'construction-completions-commercial', 'construction-bbk-completions-office', 'construction-bbk-completions-wholesale-warehouse']);
  });
  it('provisional gate: Bundesbank-only KPIs have no live view; Construction keeps Destatis', () => {
    const live = loadManifest(false);
    expect(liveViews(kpi('kpi-price-index'), live)).toEqual([]);
    expect(liveViews(kpi('construction'), live).find((x) => x.segment === 'office' && x.geo === 'germany')!.series.map((s) => s.key))
      .toEqual(['construction-permits-office', 'construction-completions-office']);
  });
});

describe('selector resolution', () => {
  const vs = [
    { segment: 'office', geo: 'germany', freq: 'annual' }, { segment: 'office', geo: 'germany', freq: 'quarterly' },
    { segment: 'commercial-overall', geo: '7-cities', freq: 'annual' }, { segment: 'commercial-overall', geo: 'germany', freq: 'annual' }];
  it('no parameters: the first view', () => expect(pickView(vs, {})).toBe(vs[0]));
  it('exact match', () => expect(pickView(vs, { segment: 'office', geo: 'germany', freq: 'quarterly' })).toBe(vs[1]));
  it('unknown combination: Segment wins over geography and frequency', () =>
    expect(pickView(vs, { segment: 'commercial-overall', geo: 'germany', freq: 'quarterly' })).toBe(vs[3]));
  it('the selector just changed always takes effect', () =>
    expect(pickView(vs, { segment: 'commercial-overall', geo: '7-cities', freq: 'quarterly' }, 'freq')).toBe(vs[1]));
});

describe('KPI page Notes (spec section 9)', () => {
  const base = { stale: false, fetchFailed: null, revisedAt: null, lastPeriod: '2026-Q1', retrievedAt: '2026-10-01T00:00:00Z',
    obs: [{ period: '2013-Q1', value: 100 }, { period: '2026-Q1', value: 120 }], scope: [], shortWindow: false, partial: [] } as unknown as Series;
  const at = new Date('2026-11-01');
  it('scope, short history with the cycle sentence, then stale, in the fixed order and prefixed', () => {
    const s = { ...base, scope: ['index', 'city_class'], shortWindow: 'note.short_cycle', stale: true } as Series;
    expect(kpiNotes(s, 'en', 'Cities of supra-regional importance', at)).toEqual([
      'Note: Index (2013 = 100): shows change over time, not a price level in euros.',
      'Note: Aggregate for cities of supra-regional importance, not an individual city.',
      'Note: Short history (2013-Q1 to 2026-Q1). This window contains essentially one interest-rate cycle, so the pattern may not hold in other periods.',
      'Note: Latest observation: 2026-Q1. The source has not published newer data within the expected interval, so this series may be out of date.',
    ]);
  });
  it('combined scope and short history without the cycle sentence, in German', () => {
    const s = { ...base, scope: ['combined'], shortWindow: true } as Series;
    // Unreviewed German carries [DRAFT] (ticket 09), so match the text, not the whole line.
    expect(kpiNotes(s, 'de', '', at)).toEqual([
      expect.stringContaining('Büro und Einzelhandel zusammen; keine getrennten Werte.'),
      expect.stringContaining('Kurze Zeitreihe (2013-Q1 bis 2026-Q1).'),
    ]);
  });
  it('Partial total names the missing Länder per year', () => {
    const s = { ...base, partial: [{ period: '2019', laender: ['04', '11'] }] } as Series;
    expect(kpiNotes(s, 'en', '', at)).toEqual(['Note: Germany total is the sum of the Länder with data; no value for Bremen, Berlin in 2019.']);
  });
});

it('Construction lists the Länder in Destatis order after Germany', () => {
  const geos = KPIS.find((k) => k.page === 'construction')!.views.filter((x) => x.segment === 'office').map((x) => x.geo);
  expect(geos.slice(0, 3)).toEqual(['germany', 'de-sh', 'de-hh']);
  expect(geos.at(-1)).toBe('de-th');
});
