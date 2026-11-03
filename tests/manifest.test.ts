import { describe, expect, it } from 'vitest';
import { checkEntries, loadAllManifest, loadManifest, gate, publicLinks, seriesId, type ManifestEntry } from '../src/lib/manifest';

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
  it('every Bundesbank and OECD series is cleared with a recorded permission; nothing is provisional', () => {
    for (const m of all) {
      expect(m.provisional, m.key).toBe(false);
      expect(!!m.cleared, m.key).toBe(['BUBA', 'OECD'].includes(m.dbnomics_provider));
    }
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
  it('default build keeps every series', () => {
    expect(loadManifest(false)).toHaveLength(all.length);
  });
});

it('manifest carries the spec section 11 fields', () => {
  expect(byKey('unemployment-rate').seasonal_adjustment).toBe('sa');
  expect(byKey('cpi').resampling).toBe('mean');
  expect(byKey('price-index-de-office-q')).toMatchObject({ short_window: true, short_window_sentence: 'note.short_cycle', scope: ['index'] });
  expect(byKey('rent-index-combined-7').scope).toEqual(['city_class', 'combined']);
  expect(byKey('construction-permits-commercial').short_window).toBe(true);
  for (const m of all) expect(m.resampling, m.key).toBe(m.dbnomics_provider === 'BUBA' && m.dataset === 'BBDZ1' || m.dataset.endsWith('LJ001') || m.frequency === 'annual' ? 'none' : 'mean');
});

it('unreviewed German manifest text is marked [DRAFT]; English never is', () => {
  // An empty lock, so the test does not depend on what has been reviewed so far.
  const m = loadAllManifest({}).find((x) => x.key === 'cpi')!;
  expect(m.title.de.startsWith('[DRAFT] ')).toBe(true);
  expect(m.title.en).not.toContain('[DRAFT]');
});

it('the committed manifest is loaded once while its files are unchanged; a passed lock gets its own copy', () => {
  expect(loadAllManifest()).toBe(loadAllManifest());
  const before = structuredClone(loadAllManifest());
  expect(loadAllManifest({})).not.toBe(loadAllManifest());
  expect(loadAllManifest()).toEqual(before); // the passed lock never leaks into the shared copy
});

it('seriesUrl links the series, or the dataset for a sum of Länder', async () => {
  const { seriesUrl } = await import('../src/lib/manifest');
  expect(seriesUrl(byKey('cpi'))).toBe('https://genesis.destatis.de/datenbank/online/statistic/61111');
  expect(seriesUrl(byKey('euribor-3m'))).toBe('https://db.nomics.world/ECB/FM/M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA');
  expect(seriesUrl(byKey('price-index-de-total-q'))).toBe('https://api.statistiken.bundesbank.de/rest/data/BBDZ1/Q.B10.N.G000.P0100.A?lang=en');
});

it('seriesId collapses Länder', () => {
  expect(seriesId(byKey('construction-permits-office'))).toBe('31111LJ001/{01–16}.BAUART1.BTK-GEB.GBD-NW-BV.FLC002');
  expect(seriesId(byKey('cpi'))).toBe('61111BM001/DG.PREIS1');
  expect(seriesId(byKey('euribor-3m'))).toMatch(/^ECB\/FM\//);
});

it('Sources table has one row per live series with publisher, id, licence, attribution in both languages', async () => {
  const { sourcesTable } = await import('../src/lib/sources');
  const live = loadManifest(false);
  for (const lang of ['en', 'de'] as const) {
    const html = sourcesTable(live, lang);
    expect(html.match(/<tr>/g)).toHaveLength(live.length + 1); // + header
    expect(html).toContain(live[0].attribution[lang].replace(/&/g, '&amp;'));
    expect(html).toContain('31111LJ001/{01–16}');
    expect(html).toContain('BBDZ1');
  }
});

describe('source field', () => {
  it('is dbnomics unless the entry names another source', () => {
    expect(byKey('euribor-3m').source).toBe('dbnomics');
    expect(all.filter((m) => m.dbnomics_provider === 'BUBA').every((m) => m.source === 'bundesbank')).toBe(true);
    expect(all.filter((m) => m.dbnomics_provider === 'DESTATIS').every((m) => m.source === 'destatis')).toBe(true);
    expect(all.filter((m) => m.source === 'dbnomics').map((m) => m.key).sort()).toEqual(['euribor-3m', 'oecd-confidence-construction', 'oecd-confidence-retail']);
  });
  it('rejects an unknown source', () => {
    const bad = { ...byKey(all[0].key), source: 'ftp' } as unknown as ManifestEntry;
    expect(() => checkEntries([bad], { })).toThrow(/source must be one of/);
  });
});

describe('committed snapshots', () => {
  it('validate against the manifest, and no third-party series is public', async () => {
    const { readFileSync } = await import('node:fs');
    const { validateSnapshot } = await import('../src/lib/pipeline');
    for (const m of all) validateSnapshot(m, JSON.parse(readFileSync(`data/snapshots/${m.key}.json`, 'utf8')));
  });
});

describe('Destatis login', () => {
  it('is a CI secret on the fetch step only and .env is git-ignored', async () => {
    const { readFileSync } = await import('node:fs');
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    expect(ci.match(/secrets\.DESTATIS_/g)).toHaveLength(2);
    expect(ci.split('preview:')[1].split('main:')[0]).not.toMatch(/DESTATIS/);
    expect(readFileSync('.gitignore', 'utf8').split('\n')).toContain('.env');
  });
});
