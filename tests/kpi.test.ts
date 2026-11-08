import { describe, expect, it } from 'vitest';
import { sumLaender } from '../src/lib/series';
import { period, t } from '../src/lib/i18n';
import { KPIS, SEGMENTS, cell, headline, isLand, liveViews } from '../src/lib/kpis';
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
      expect(isLand(x.geo), `${k.page} ${x.geo}`).toBe(false);
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
  it('withheld Bundesbank series: Bundesbank-only KPIs have no live view; Construction keeps Destatis', () => {
    const live = loadManifest(false).filter((m) => m.dbnomics_provider !== 'BUBA'); // as if the Bundesbank licence were withdrawn
    expect(liveViews(kpi('kpi-price-index'), live)).toEqual([]);
    expect(liveViews(kpi('construction'), live).find((x) => x.segment === 'office' && x.geo === 'germany')!.series.map((s) => s.key))
      .toEqual(['construction-permits-office', 'construction-completions-office']);
  });
});

describe('Availability grid (spec section 4)', () => {
  const grid = (live: ReturnType<typeof loadManifest>) => KPIS.map((k) => SEGMENTS.map((seg) => {
    const c = cell(k, seg, live);
    return 'view' in c ? 'Y' : c.na === 'licence' ? 'L' : 'N';
  }).join(' '));
  it('preview build: the spec grid, columns office, retail, logistics, commercial overall', () =>
    expect(grid(loadManifest(true))).toEqual(['Y Y N Y', 'Y Y N Y', 'N N N Y', 'Y N N N', 'N N N Y', 'Y N Y Y']));
  it('default build: the same grid as preview, every series is cleared', () =>
    expect(grid(loadManifest(false))).toEqual(grid(loadManifest(true))));
  it('withheld Bundesbank series: Bundesbank-only cells are licence gaps, Construction stays', () =>
    expect(grid(loadManifest(false).filter((m) => m.dbnomics_provider !== 'BUBA'))).toEqual(['L L N L', 'L L N L', 'N N N L', 'L N N N', 'N N N L', 'Y N Y Y']));
  it('every source gap has a reason in both languages', () => {
    for (const k of KPIS) for (const seg of SEGMENTS) {
      const c = cell(k, seg, loadManifest(true));
      if ('reason' in c) for (const l of ['en', 'de'] as const) expect(t(l, c.reason)).toBeTruthy();
    }
  });
  it('a cell shows the first view of its Segment, national where the KPI has it', () => {
    const c = cell(kpi('kpi-price-index'), 'retail', loadManifest(true));
    expect('view' in c && c.view.series.map((s) => s.key)).toEqual(['price-index-de-retail-a']);
  });
  it('Home headline: commercial overall at Germany where it exists, else the first view', () => {
    const live = loadManifest(true);
    expect(headline(kpi('kpi-price-index'), live)?.series[0].key).toBe('price-index-de-total-a');
    expect(headline(kpi('kpi-office-vacancy'), live)?.series[0].key).toBe('office-vacancy-7');
    expect(headline(kpi('kpi-price-index'), loadManifest(false).filter((m) => m.dbnomics_provider !== 'BUBA'))).toBeUndefined();
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

it('Construction lists the Länder in Destatis order after Germany', () => {
  const geos = KPIS.find((k) => k.page === 'construction')!.views.filter((x) => x.segment === 'office').map((x) => x.geo);
  expect(geos.slice(0, 3)).toEqual(['germany', 'de-sh', 'de-hh']);
  expect(geos.at(-1)).toBe('de-th');
});

it('periods: "Q1 2026" in both languages, annual as the year, months through Intl (spec section 10)', () => {
  expect(period('en', '2026-Q1')).toBe('Q1 2026');
  expect(period('de', '2026-Q1')).toBe('Q1 2026');
  expect(period('en', '2026')).toBe('2026');
  expect(period('en', '2026-03')).toBe('March 2026');
  expect(period('de', '2026-03')).toBe('März 2026');
});

describe('index-valued cards show their base year (ticket 9)', () => {
  it('every KPI view series with an index unit names its base, in both languages', () => {
    const units = new Map(loadAllManifest().map((m) => [m.key, m.unit]));
    const index = KPIS.flatMap((k) => k.views.flatMap((v) => v.series.map((s) => s.key))).filter((key) => /^index/i.test(units.get(key)!.en));
    expect(index.length).toBeGreaterThan(0);
    for (const key of index) { expect(units.get(key)!.en).toMatch(/^index, \d{4}=100$/); expect(units.get(key)!.de.replace('[DRAFT] ', '')).toMatch(/^Index, \d{4}=100$/); }
  });
});

describe('every index-unit series carries its base year (ticket 9)', () => {
  it('names a base in both languages, equal to the base the source publishes', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    const covered: string[] = [];
    for (const m of loadAllManifest()) {
      if (!/^index/i.test(m.unit.en)) continue;
      expect(m.unit.en, m.key).toMatch(/^index, \d{4}=100$/);
      expect(m.unit.de.replace('[DRAFT] ', ''), m.key).toMatch(/^Index, \d{4}=100$/);
      const file = `data/snapshots/${m.key}.json`;
      if (existsSync(file)) for (const part of Object.values(JSON.parse(readFileSync(file, 'utf8')).parts) as { meta?: { unit?: string } }[]) expect(part.meta?.unit, m.key).toBe(m.unit.en.replace('index, ', ''));
      covered.push(`${m.key} (${m.unit.en})`);
    }
    console.log(`index-unit series covered (${covered.length}):\n${covered.join('\n')}`);
    expect(covered.length).toBeGreaterThan(0);
  });
});
