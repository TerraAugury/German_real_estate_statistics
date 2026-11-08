import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { sourceBlock } from '../src/lib/panel';
import { getSeries } from '../src/lib/series';
import type { Series } from '../src/lib/series';

// Design refinement 03: a short citation (publisher, licence, data date) and a details disclosure holding the lineage.
describe('source block', () => {
  const direct = { title: { en: 'Price index', de: 'Preisindex' }, publisher: 'Deutsche Bundesbank', service: 'SDMX Web Service', seriesId: 'BBDZ1.Q.B10', seriesUrl: 'https://x/y?lang=en',
    licence: { name: 'L', url: 'u' }, lastPeriod: '2026-Q2', retrievedAt: '2026-11-03T08:00:00Z', derived: false, provisional: false,
    original: { title: 'Commercial property price index', unit: '2013=100' } } as unknown as Series;
  const parse = (html: string) => new JSDOM(`<figcaption>${html}</figcaption>`).window.document;
  // Visible text: every tag and <br> is a space, so a line break never glues two words together.
  const flat = (el: Element | null) => el!.innerHTML.replaceAll('[DRAFT] ', '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  it('the citation names publisher, licence and data date, and nothing about the series id or retrieval', () => {
    const doc = parse(sourceBlock(direct, 'en'));
    expect(flat(doc.querySelector('.cite'))).toBe('Source: Deutsche Bundesbank / Licence: L / Data to Q2 2026');
    expect(doc.querySelector('.cite a')!.getAttribute('href')).toBe('/en/sources');
  });
  it('the details hold the service, series id link, retrieval date, and original title and unit', () => {
    const doc = parse(sourceBlock(direct, 'en'));
    expect(doc.querySelector('details')!.hasAttribute('open')).toBe(false);
    expect(flat(doc.querySelector('details'))).toBe('Series details Price index Deutsche Bundesbank, SDMX Web Service, series BBDZ1.Q.B10 / New data last retrieved 3 November 2026 Original series as published: Commercial property price index; unit: 2013=100');
    expect(doc.querySelector('details a')!.getAttribute('href')).toBe('https://x/y?lang=en');
  });
  it('DE keeps German wording for citation and lineage', () => {
    const doc = parse(sourceBlock(direct, 'de'));
    expect(flat(doc.querySelector('.cite'))).toBe('Quelle: Deutsche Bundesbank / Lizenz: L / Daten bis Q2 2026');
    expect(flat(doc.querySelector('details'))).toMatch(/Letzte neue Daten abgerufen am 3\. November 2026.*Originalreihe wie veröffentlicht/);
  });
  it('a series without an original title (Destatis) shows only the unit', () => {
    const html = sourceBlock({ ...direct, original: { unit: '1000 qm' } } as Series, 'en');
    expect(flat(parse(html).querySelector('details'))).toMatch(/Original unit as published: 1000 qm$/);
    expect(html).not.toMatch(/Original series/);
  });
  describe('credit to the original source', () => {
    const credited = { ...direct, credit: 'bulwiengesa AG', original: { title: 'Rents, 127 towns', unit: '2010=100', source: 'Bundesbank calculations based on price data provided by bulwiengesa AG.' } } as Series;
    it('the citation credits the firm first and names the Bundesbank as publisher', () => {
      expect(flat(parse(sourceBlock(credited, 'en')).querySelector('.cite'))).toBe('Source: bulwiengesa AG, published by Deutsche Bundesbank / Licence: L / Data to Q2 2026');
      expect(flat(parse(sourceBlock(credited, 'de')).querySelector('.cite'))).toBe('Quelle: bulwiengesa AG, Veröffentlichung: Deutsche Bundesbank / Lizenz: L / Daten bis Q2 2026');
    });
    it('the details give the Bundesbank comment on the original source', () => {
      expect(flat(parse(sourceBlock(credited, 'en')).querySelector('details'))).toMatch(/Original source as named by the publisher: Bundesbank calculations based on price data provided by bulwiengesa AG\./);
      expect(flat(parse(sourceBlock(credited, 'de')).querySelector('details'))).toMatch(/Ursprungsquelle laut Herausgeber: Bundesbank calculations/);
    });
    it('a series without a credit keeps the plain citation and no source comment line', () => {
      const html = sourceBlock(direct, 'en');
      expect(flat(parse(html).querySelector('.cite'))).toBe('Source: Deutsche Bundesbank / Licence: L / Data to Q2 2026');
      expect(html).not.toMatch(/Original source as named/);
    });
  });
  describe('terms of use', () => {
    const terms = { name: 'ESCB Terms of Use for the Reuse of Statistics', url: 'https://t/escb' };
    const lineageOf = (s: Series, lang: 'en' | 'de' = 'en') => parse(sourceBlock(s, lang)).querySelector('details')!;
    it('an original series states the terms and that its statistics and metadata are used unchanged', () => {
      const d = lineageOf({ ...direct, terms } as Series);
      expect(flat(d)).toMatch(/We use the original statistics and metadata unchanged, under the ESCB Terms of Use for the Reuse of Statistics ?\.$/);
      expect(d.querySelector('a[href="https://t/escb"]')!.textContent).toBe(terms.name);
    });
    it('a derived series says it is calculated from Bundesbank data and does not claim to be unchanged', () => {
      const text = flat(lineageOf({ ...direct, terms, derived: true } as Series));
      expect(text).toMatch(/We calculated this from Deutsche Bundesbank data, under the ESCB Terms of Use for the Reuse of Statistics ?\.$/);
      expect(text).not.toMatch(/unchanged/);
    });
    it('DE has the same two statements', () => {
      expect(flat(lineageOf({ ...direct, terms } as Series, 'de'))).toMatch(/Wir verwenden die Originalstatistik und die Metadaten unverändert, gemäß ESCB Terms of Use for the Reuse of Statistics ?\.$/);
      expect(flat(lineageOf({ ...direct, terms, derived: true } as Series, 'de'))).toMatch(/Wir haben dies aus Daten der Deutschen Bundesbank berechnet, gemäß ESCB Terms/);
    });
    it('a series without terms (Destatis, DBnomics, OECD) shows no terms line', () => {
      expect(flat(lineageOf(direct))).not.toMatch(/unchanged|We calculated this/);
    });
  });
  it('a DBnomics series keeps the DBnomics wording and has no original line', () => {
    const html = sourceBlock({ ...direct, service: undefined, original: undefined } as Series, 'en');
    expect(flat(parse(html).querySelector('details'))).toMatch(/Deutsche Bundesbank, DBnomics series BBDZ1\.Q\.B10$/);
    expect(html).not.toMatch(/Original series/);
  });
  it('own calculation is marked in the citation', () => {
    expect(flat(parse(sourceBlock(direct, 'en', true)).querySelector('.cite'))).toMatch(/Data to Q2 2026 \/ own calculation$/);
    expect(flat(parse(sourceBlock({ ...direct, derived: true } as Series, 'en')).querySelector('.cite'))).toMatch(/own calculation$/);
  });
  it('a provisional licence is a chip and the licence name drops its running-text caveat', () => {
    const doc = parse(sourceBlock({ ...direct, provisional: true, licence: { name: 'Terms of use (public reuse not confirmed)', url: 'u' } } as Series, 'en'));
    expect(flat(doc.querySelector('.chip'))).toBe('Provisional');
    expect(flat(doc.querySelector('.cite'))).not.toContain('not confirmed');
  });
  it('several series share one citation per series and one disclosure with every lineage', () => {
    const doc = parse(sourceBlock([direct, { ...direct, title: { en: 'Euribor', de: 'Euribor' }, seriesId: 'EUR3M' } as Series], 'en', true));
    expect(doc.querySelectorAll('.cite')).toHaveLength(2);
    expect(doc.querySelectorAll('details')).toHaveLength(1);
    expect(doc.querySelectorAll('details .lineage-item')).toHaveLength(2);
  });
  it('real Bundesbank series carry their original metadata from the snapshot', () => {
    vi.stubEnv('INCLUDE_PROVISIONAL', '1'); // every Bundesbank series is still provisional
    const s = getSeries('price-index-de-total-q');
    expect(s.service).toBe('SDMX Web Service');
    expect(s.original).toMatchObject({ unit: '2013=100', title: expect.stringMatching(/Commercial property/) });
    expect(s.fetchedFrom).toBe('Deutsche Bundesbank');
  });
});
