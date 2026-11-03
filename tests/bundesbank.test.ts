import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { refresh, HttpError, makeGet, type Snapshot } from '../src/lib/pipeline';
import { BadResponse } from '../src/lib/snapshot';
import { Unavailable } from '../src/lib/snapshot';
import type { ManifestEntry } from '../src/lib/manifest';

const fixture = () => JSON.parse(readFileSync('tests/fixtures/bbk-sdmx-q.json', 'utf8'));
const m = { key: 'price', source: 'bundesbank', dataset: 'BBDZ1', ids: ['Q.B10.N.G000.P0100.A'], laender: [''], frequency: 'quarterly', expected_start: 2013 } as ManifestEntry;
const now = new Date('2026-11-02T12:00:00Z');
const id = 'Q.B10.N.G000.P0100.A';

describe('refresh with source bundesbank', () => {
  it('requests the SDMX-JSON endpoint and keeps the original metadata', async () => {
    const get = vi.fn(async () => fixture());
    const snap = (await refresh(m, undefined, { get, now }))!;
    expect(get).toHaveBeenCalledWith('https://api.statistiken.bundesbank.de/rest/data/BBDZ1/Q.B10.N.G000.P0100.A?format=sdmx_json&lang=en');
    const p = snap.parts[id];
    expect(p.period[0]).toBe('2013-Q1');
    expect(p.period.at(-1)).toBe('2026-Q2');
    expect(p.value).toEqual([98.5, 99.8, 100.7, 101, 169.3, 169.3, 168.6]);
    expect(p.meta).toMatchObject({ source: 'Deutsche Bundesbank', unit: '2013=100', unit_mult: 0, decimals: 1, comment: 'vdpResearch GmbH and Bundesbank calculations.', retrieved_at: now.toISOString() });
    expect(p.meta!.title).toMatch(/Commercial property price index/);
    expect(p.meta!.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(p.meta!.valid_from).toBe('2026-09-04T08:22:42.528Z');
  });
  it('returns null when nothing changed, and a snapshot when a value is revised', async () => {
    const first = (await refresh(m, undefined, { get: async () => fixture(), now }))!;
    expect(await refresh(m, first, { get: async () => fixture(), now })).toBeNull();
    const r = fixture();
    r.data.dataSets[0].series['0:0:0:0:0:0'].observations['0'] = ['98.6'];
    const next = (await refresh(m, first, { get: async () => r, now }))!;
    expect(next.revised_at).toBe(now.toISOString());
  });
  it('unchanged values still rewrite a snapshot that has no source metadata yet (fetched through DBnomics)', async () => {
    const first = (await refresh(m, undefined, { get: async () => fixture(), now }))!;
    const { meta, ...legacy } = first.parts[id];
    const next = await refresh(m, { ...first, parts: { [id]: { ...legacy, indexed_at: 'x' } } as any }, { get: async () => fixture(), now });
    expect(next!.parts[id].meta).toBeTruthy();
    expect(next!.revised_at).toBeNull();
  });
  it('404 and 410 are Unavailable', async () => {
    for (const s of [404, 410]) await expect(refresh(m, undefined, { get: async () => { throw new HttpError(s, 'u'); }, now })).rejects.toBeInstanceOf(Unavailable);
  });
  it('413 and 503 are retried, then succeed', async () => {
    const f = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValueOnce({ ok: false, status: 413 })
      .mockResolvedValue({ ok: true, json: async () => fixture() });
    const snap = await refresh(m, undefined, { get: makeGet(f as any, async () => {}), now });
    expect(snap!.parts[id].value).toHaveLength(7);
    expect(f).toHaveBeenCalledTimes(3);
  });
  it('404 is not retried', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(makeGet(f as any, async () => {})('u')).rejects.toThrow(/^404/);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('an empty body is a failed refresh (not BadResponse), so the old snapshot stays', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError('Unexpected end of JSON input'); } });
    const err = await refresh(m, undefined, { get: makeGet(f as any, async () => {}), now }).catch((e) => e);
    expect(err).toBeInstanceOf(SyntaxError);
  });
  it('a malformed body is BadResponse', async () => {
    for (const body of [{}, { data: { dataSets: [{ series: {} }] } }]) await expect(refresh(m, undefined, { get: async () => body, now })).rejects.toBeInstanceOf(BadResponse);
  });
  it('a changed frequency or unit is rejected', async () => {
    await expect(refresh({ ...m, frequency: 'monthly' }, undefined, { get: async () => fixture(), now })).rejects.toThrow(/frequency/);
    const first = (await refresh(m, undefined, { get: async () => fixture(), now }))!;
    const r = fixture();
    r.data.structure.attributes.series.find((a: any) => a.id === 'BBK_UNIT').values[1].name = 'percent';
    await expect(refresh(m, first, { get: async () => r, now })).rejects.toThrow(/unit changed/);
  });
});

describe('third-party flag', () => {
  it('flags every original source the Bundesbank names besides itself', async () => {
    const { isThirdParty } = await import('../src/lib/bundesbank');
    for (const c of ['vdpResearch GmbH and Bundesbank calculations.', 'vdpResearch GmbH.', 'Bundesbank calculations based on price data provided by bulwiengesa AG.',
      'Bundesbank calculations based on data provided by the Federal Statistical Office.', 'Seasonal adjustment based on data provided by the Federal Employment Agency.']) expect(isThirdParty(c)).toBe(true);
    for (const c of [null, '', 'Bundesbank calculations.', 'Deutsche Bundesbank and ECB']) expect(isThirdParty(c)).toBe(false);
  });
  it('is recorded on the snapshot', async () => {
    const snap = (await refresh(m, undefined, { get: async () => fixture(), now }))!;
    expect(snap.parts[id].meta!.third_party).toBe(true);
  });
  it('validation refuses a flagged series that is not provisional', async () => {
    const { validateSnapshot } = await import('../src/lib/pipeline');
    const snap = (await refresh(m, undefined, { get: async () => fixture(), now }))!;
    expect(() => validateSnapshot({ ...m, provisional: false }, snap)).toThrow(/third-party/);
    validateSnapshot({ ...m, provisional: true }, snap);
  });
});

describe('compareParts', () => {
  it('reports same, changed, new and missing periods', async () => {
    const { compareParts } = await import('../src/lib/compare');
    const c = compareParts({ period: ['2020', '2021', '2022'], value: [1, '2', 'NA'] }, { period: ['2021', '2022', '2023'], value: [2, 5, 9] });
    expect(c).toEqual({ same: 1, changed: [{ period: '2022', was: null, now: 5 }], added: ['2023'], missing: ['2020'] });
  });
});

describe('general comment', () => {
  it('flags a Source of the original data that is not the Bundesbank (GDP: Federal Statistical Office)', async () => {
    const { originalDataSource, isThirdParty } = await import('../src/lib/bundesbank');
    const note = '1 Source of the original data: Federal Statistical Office. - 2 Territorial definition: Germany as of 1991.';
    expect(originalDataSource(note)).toBe('Federal Statistical Office');
    expect(isThirdParty(originalDataSource(note))).toBe(true);
    expect(originalDataSource('2 Methodology only.')).toBeNull();
  });
});
