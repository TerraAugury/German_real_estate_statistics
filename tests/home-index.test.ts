import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { homeIndex } from '../src/lib/pages';
import { sparkline } from '../src/lib/chart';
import { documentTitle } from '../src/lib/i18n';
import { KPIS, headline } from '../src/lib/kpis';
import { loadManifest } from '../src/lib/manifest';
import { getSeries } from '../src/lib/series';

// Design refinement 05: Home is a compact KPI index, one row per KPI.
beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });

describe('Home index model', () => {
  it('one row per KPI in catalogue order; a live KPI has its headline view, and series', () => {
    const rows = homeIndex();
    expect(rows.map((r) => r.kpi.page)).toEqual(KPIS.map((k) => k.page));
    for (const r of rows) {
      expect(r.view).toEqual(headline(r.kpi));
      const s = getSeries(r.view!.series[0].key, r.view!.series[0].land);
      expect(r.series).toBe(s);
    }
  });
  it('a KPI with no public series keeps a row without series (licence not confirmed)', () => {
    const production = loadManifest(false).filter((m) => m.dbnomics_provider !== 'BUBA'); // as if the Bundesbank licence were withdrawn
    const rows = homeIndex(production);
    expect(rows).toHaveLength(KPIS.length);
    for (const r of rows) {
      if (headline(r.kpi, production)) expect(r.series).toBeDefined();
      else expect([r.view, r.series]).toEqual([undefined, undefined]);
    }
    expect(rows.some((r) => !r.series)).toBe(true);
  });
});

describe('sparkline', () => {
  const series = () => getSeries('price-index-de-total-a'); // after the preview env is set
  it('is one small SVG with an accessible label, a single line and no axis text', () => {
    const s = series();
    const doc = new JSDOM(sparkline(s, 'en')).window.document;
    const svg = doc.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe(`Trend of ${s.title.en}`);
    expect(doc.querySelectorAll('path')).toHaveLength(1);
    expect(doc.querySelectorAll('text')).toHaveLength(0);
    expect(+svg.getAttribute('width')!).toBeLessThanOrEqual(160);
  });
  it('DE label is German', () => expect(sparkline(series(), 'de')).toContain(`Verlauf von ${series().title.de}`));
});

describe('document title', () => {
  it('Home is the site name once; other pages are page name then site name', () => {
    expect(documentTitle('en', 'home', 'Real Estate Market Statistics & Analysis')).toBe('Real Estate Market Statistics & Analysis');
    expect(documentTitle('en', 'links', 'Links')).toBe('Links – Real Estate Market Statistics & Analysis');
    expect(documentTitle('de', 'links', 'Verknüpfungen')).toMatch(/^Verknüpfungen – /);
  });
});
