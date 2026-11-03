import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { loadAllManifest } from '../src/lib/manifest';
import { sourcesTable } from '../src/lib/sources';
import { getSeries } from '../src/lib/series';

// ESCB compliance 03: the firms behind a Bundesbank series are credited by name, from the manifest.
const FIRMS = [['vdpResearch', 'vdpResearch GmbH'], ['bulwiengesa', 'bulwiengesa AG']];
const comment = (key: string): string => Object.values<any>(JSON.parse(readFileSync(`data/snapshots/${key}.json`, 'utf8')).parts)[0].meta?.comment ?? '';

describe('credit in the manifest', () => {
  const all = loadAllManifest().filter((m) => m.source === 'bundesbank');
  it('credits exactly the firms that the Bundesbank metadata names as original source', () => {
    for (const m of all) {
      const firms = FIRMS.filter(([needle]) => comment(m.key).includes(needle)).map(([, name]) => name);
      expect({ key: m.key, credit: m.credit }).toEqual({ key: m.key, credit: firms[0] });
    }
    expect(all.filter((m) => m.credit)).toHaveLength(34);
  });
  it('the attribution wording of a credited series names the firm and the Bundesbank in both languages', () => {
    for (const m of all.filter((x) => x.credit)) for (const l of ['en', 'de'] as const) {
      expect(m.attribution[l]).toContain(m.credit);
      expect(m.attribution[l]).toContain('Bundesbank');
    }
  });
  it('the Sources table shows that wording', () => {
    const html = sourcesTable(all.filter((m) => m.credit).slice(0, 2), 'en');
    expect(html).toMatch(/Source: vdpResearch GmbH, published by Deutsche Bundesbank/);
  });
});

describe('credit on the page', () => {
  beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
  afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });
  it('a loaded series carries the credit and the Bundesbank comment', () => {
    const s = getSeries('rent-index-combined-127');
    expect(s.credit).toBe('bulwiengesa AG');
    expect(s.original?.source).toBe(comment('rent-index-combined-127'));
    expect(getSeries('bund-yield-10y').credit).toBeUndefined();
  });
});
