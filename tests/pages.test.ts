import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { INDICATORS } from '../src/lib/links';
import { KPIS, GEO_GROUPS } from '../src/lib/kpis';
import { availability, kpiPage, linksOverview } from '../src/lib/pages';

// Preview build: Bundesbank KPIs and most indicators are provisional.
beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });
const kpi = (page: string) => KPIS.find((k) => k.page === page)!;

describe('KPI page model (spec section 8, ticket 12)', () => {
  it.each(KPIS.map((k) => k.page))('%s: panels once each, in indicator order; only the first view and its panels live', (page) => {
    const p = kpiPage(kpi(page));
    const ids = p.panels.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    const order = p.panels.map((x) => INDICATORS.indexOf(x.pair.name));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const v of p.views) for (const id of v.links) expect(ids).toContain(id);
    expect(p.views.filter((v) => v.live)).toEqual(p.views.slice(0, 1));
    expect(p.panels.filter((x) => x.live).map((x) => x.id).sort()).toEqual([...(p.views[0]?.links ?? [])].sort());
  });
  it('Construction: Germany then the Länder in the geography selector; Land panels name their Land', () => {
    const p = kpiPage(kpi('construction'));
    expect(p.selectors.geo.map((g) => g.group)).toEqual(['germany', 'laender']);
    expect(p.selectors.geo[1].geos).toHaveLength(16);
    expect(p.panels.find((x) => x.pair.land === '09')).toMatchObject({ geo: 'de-by', live: false });
  });
  it('Price index: "excluding supra-regional" sits with Germany, supra-regional with the City classes', () => {
    expect(kpiPage(kpi('kpi-price-index')).selectors.geo).toEqual([
      { group: 'germany', geos: ['germany', 'excl-supra-regional'] },
      { group: 'city_classes', geos: ['supra-regional'] },
    ]);
  });
});

describe('Links overview model', () => {
  it('columns are the indicators some row has, in order; every cell anchors a panel on its KPI page', () => {
    const o = linksOverview();
    expect(o.columns).toEqual(INDICATORS.filter((n) => o.rows.some((r) => r.cells.has(n))));
    expect(o.columns.length).toBeGreaterThan(0);
    for (const r of o.rows) {
      const ids = kpiPage(r.kpi).panels.map((x) => x.id);
      for (const c of r.cells.values()) expect(ids).toContain(c.pair.id);
    }
  });
});

describe('Availability model', () => {
  it('a cell with a view lists the geography groups it covers; Not available cells list none', () => {
    for (const row of availability()) for (const c of row.cells) {
      if ('view' in c.cell) expect(c.geos.length).toBeGreaterThan(0);
      else expect(c.geos).toEqual([]);
      for (const g of c.geos) expect(GEO_GROUPS).toContain(g);
    }
    const office = availability().find((r) => r.kpi.page === 'construction')!.cells.find((c) => c.segment === 'office')!;
    expect(office.geos).toEqual(['germany', 'laender']);
  });
});
