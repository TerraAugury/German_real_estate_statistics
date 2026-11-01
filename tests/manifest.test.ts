import { describe, expect, it } from 'vitest';
import { loadAllManifest, loadManifest, gate, publicLinks, dbnomicsId, type ManifestEntry } from '../src/lib/manifest';

const all = loadAllManifest();
const byKey = (k: string) => all.find((m) => m.key === k)!;
const e = (key: string, provisional: boolean) => ({ key, provisional }) as ManifestEntry;

describe('provisional gate', () => {
  it('drops provisional series by default and keeps them when included', () => {
    const es = [e('a', false), e('b', true)];
    expect(gate(es, false).map((m) => m.key)).toEqual(['a']);
    expect(gate(es, true).map((m) => m.key)).toEqual(['a', 'b']);
  });
  it('drops every Link that uses an excluded series', () => {
    const pairs = [{ kpi: 'a', indicator: 'c' }, { kpi: 'b', indicator: 'c' }, { kpi: 'a', indicator: 'b' }];
    const es = [e('a', false), e('b', true), e('c', false)];
    expect(publicLinks(pairs, gate(es, false))).toEqual([pairs[0]]);
    expect(publicLinks(pairs, gate(es, true))).toEqual(pairs);
  });
  it('loadManifest honours INCLUDE_PROVISIONAL', () => {
    expect(loadManifest(false).some((m) => m.provisional)).toBe(false);
    expect(loadManifest(true)).toHaveLength(all.length);
  });
});

describe('manifest content (spec sections 3, 4, 5)', () => {
  it('has unique keys and attribution in both languages', () => {
    expect(new Set(all.map((m) => m.key)).size).toBe(all.length);
    for (const m of all) { expect(m.attribution.en).toBeTruthy(); expect(m.attribution.de).toBeTruthy(); }
  });
  it('flags exactly Bundesbank and OECD series as provisional; ECB and Destatis are not', () => {
    for (const m of all) expect(m.provisional, m.key).toBe(['BUBA', 'OECD'].includes(m.dbnomics_provider));
    expect(all.filter((m) => m.dbnomics_provider === 'BUBA' && m.dataset !== 'BBDZ1').map((m) => m.dataset).sort()).toEqual(['BBDL1', 'BBIM1', 'BBNZ1', 'BBSIS']);
  });
  it('covers the economic indicators with spec ids and start years', () => {
    const want: [string, string, number][] = [
      ['bund-yield-10y', 'M.I.ZAR.ZI.EUR.S1311.B.A604.R10XX.R.A.A._Z._Z.A', 1972], ['euribor-3m', 'M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA', 1994],
      ['loan-rate-nfc', 'M.DE.B.A2A.D.R.1.2240.EUR.N', 2010], ['cpi', 'DG.PREIS1', 1991], ['gdp-real', 'Q.DE.N.H.0000.L', 1970],
      ['unemployment-rate', 'M.DE.Y.UNE.UBA000.A0000.A01.D00.0.R00.A', 1991],
      ['construction-price-office', 'DG.BAULEISTBW.BPNG1.STEMW1.PRE002', 1958], ['construction-price-commercial', 'DG.BAULEISTBW.BPNG2.STEMW1.PRE002', 1958],
      ['oecd-confidence-construction', 'DEU.M.BCICP.PB.F.Y._Z._Z.N', 1985], ['oecd-confidence-retail', 'DEU.M.BCICP.PB.G47.Y._Z._Z.N', 1985]];
    for (const [k, id, start] of want) { expect(byKey(k).ids).toEqual([id]); expect(byKey(k).expected_start).toBe(start); }
  });
  it('covers the CRE series', () => {
    expect(all.filter((m) => m.key.startsWith('price-index-'))).toHaveLength(18);
    expect(byKey('price-index-de-office-q').ids).toEqual(['Q.B10.N.G000.P0102.A']);
    expect(byKey('rent-index-de-retail-q').expected_start).toBe(2010);
    expect(byKey('initial-yield-combined-7').ids).toEqual(['A.B10.N.G300.P0820.A']);
    expect(byKey('office-vacancy-7').ids).toEqual(['A.B30.N.G850.R1010.A']);
    expect(byKey('transaction-volume-7').expected_start).toBe(2007);
    expect(byKey('construction-bbk-completions-office').ids).toEqual(['A.B30.N.G650.R0220.A']);
    for (const t of ['office', 'commercial', 'warehouse'] as const) for (const w of ['permits', 'completions'])
      expect(byKey(`construction-${w}-${t}`).laender).toHaveLength(16);
    expect(byKey('construction-completions-warehouse').dataset).toBe('31121LJ001');
    expect(byKey('construction-permits-commercial').expected_start).toBe(2015);
  });
  it('default build keeps only ECB and Destatis series', () => {
    expect(new Set(loadManifest(false).map((m) => m.dbnomics_provider))).toEqual(new Set(['DESTATIS', 'ECB']));
  });
});

it('manifest carries the spec section 11 fields', () => {
  expect(byKey('unemployment-rate').seasonal_adjustment).toBe('sa');
  expect(byKey('cpi').resampling).toBe('mean');
  expect(byKey('price-index-de-office-q')).toMatchObject({ short_window: true, short_window_sentence: 'note.short_cycle', scope: ['index'] });
  expect(byKey('rent-index-combined-7').scope).toEqual(['city_class', 'combined']);
  expect(byKey('construction-permits-commercial').short_window).toBe(true);
  for (const m of all) expect(m.resampling, m.key).toBe(m.dbnomics_provider === 'BUBA' && m.dataset === 'BBDZ1' || m.dataset.endsWith('LJ001') ? 'none' : 'mean');
});

it('unreviewed German manifest text is marked [DRAFT]; English never is', () => {
  const m = byKey('cpi');
  expect(m.title.de.startsWith('[DRAFT] ')).toBe(true);
  expect(m.title.en).not.toContain('[DRAFT]');
});

it('dbnomicsUrl links the series, or the dataset for a sum of Länder', async () => {
  const { dbnomicsUrl } = await import('../src/lib/manifest');
  expect(dbnomicsUrl(byKey('cpi'))).toBe('https://db.nomics.world/DESTATIS/61111BM001/DG.PREIS1');
  expect(dbnomicsUrl(byKey('construction-permits-office'))).toBe('https://db.nomics.world/DESTATIS/31111LJ001');
});

it('dbnomicsId collapses Länder', () => {
  expect(dbnomicsId(byKey('construction-permits-office'))).toBe('DESTATIS/31111LJ001/{01–16}.BAUART1.BTK-GEB.GBD-NW-BV.FLC002');
  expect(dbnomicsId(byKey('cpi'))).toBe('DESTATIS/61111BM001/DG.PREIS1');
});

it('Sources table has one row per live series with publisher, id, licence, attribution in both languages', async () => {
  const { sourcesTable } = await import('../src/lib/sources');
  const live = loadManifest(false);
  for (const lang of ['en', 'de'] as const) {
    const html = sourcesTable(live, lang);
    expect(html.match(/<tr>/g)).toHaveLength(live.length + 1); // + header
    expect(html).toContain(live[0].attribution[lang].replace(/&/g, '&amp;'));
    expect(html).toContain('DESTATIS/31111LJ001/{01–16}');
    expect(html).not.toContain('BBDZ1');
  }
});
