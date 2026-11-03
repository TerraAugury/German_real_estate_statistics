import { describe, expect, it, vi } from 'vitest';
import { refresh, makePost, HttpError, type Snapshot } from '../src/lib/pipeline';
import { BadResponse, Unavailable } from '../src/lib/snapshot';
import { MissingCredentials, parseCube, extractSeries } from '../src/lib/destatis';
import type { ManifestEntry } from '../src/lib/manifest';

// Flat cubes as GENESIS returns them (shortened): axes, time, measures, then one row per combination.
const head = (axes: string[], measures: string[][]) => ['* Export', 'K;DQ;FACH-SCHL;"nur Werte"', 'D;X', 'K;DQ-ERH;FACH-SCHL', 'D;1', 'K;DQA;NAME', ...axes.map((a) => `D;${a}`),
  'K;DQZ;NAME', 'D;JAHR', 'K;DQI;NAME;ME-NAME;DST;TYP;NKM-STELLEN', ...measures.map(([n, u]) => `D;${n};${u};GANZ;FALL;0`), 'K;QEI;FACH-SCHL;ZI-WERT;WERT;QUALITAET'];
const laender = [...head(['DLAND', 'BAUBR1', 'BAUTK1', 'BAUGB1'], [['BAU015', 'Anzahl'], ['FLC002', '1000 qm']]),
  'D;01;BAUART1;BTK-GEB;GBD-NW-BV;2008;5;e;62;e', 'D;01;BAUART1;BTK-GEB;GBD-NW-BV;2009;0;-;0;-', 'D;02;BAUART1;BTK-GEB;GBD-NW-BV;2008;5;e;7;x', 'D;02;BAUART1;BTK-GEB;GBD-NW-BV;2009;5;e;9;e',
  'D;01;BAUART1;BTK-GEB;GBD-NW-S;2008;5;e;99;e', ''].join('\n');
const cpi = [...head(['DINSG', 'MONAT'], [['PREIS1', '2020=100']]), 'D;DG;MONAT01;1991;60.5;e', 'D;DG;MONAT02;1991;60.9;e', 'D;DG;MONAT01;1992;.;.', ''].join('\n');
const quarterly = [...head(['DINSG', 'BAUAR4', 'BAUAR1', 'STEMW1', 'QUARM1'], [['PRE002', '2021=100']]),
  'D;DG;BAULEISTBW;BPNG1;STEMW1;MONAT02;1958;10.1;e', 'D;DG;BAULEISTBW;BPNG1;STEMW1;MONAT05;1958;10.4;e', 'D;DG;BAULEISTBW;BPNG1;STEMW1;MONAT11;1958;10.9;e', ''].join('\n');

const bad = (l: string): never => { throw new BadResponse(l); };
const entry = (over: Partial<ManifestEntry>) => ({ key: 'k', source: 'destatis', dataset: 'D', ids: ['{land}.BAUART1.BTK-GEB.GBD-NW-BV.FLC002'], laender: ['01', '02'], frequency: 'annual', expected_start: 2008, ...over }) as ManifestEntry;
const now = new Date('2026-11-03T08:00:00Z');
const env = { DESTATIS_USER: 'u', DESTATIS_PASSWORD: 'p#1' };
/** A fake GENESIS: data/cube returns `content`, metadata/cube the title. */
const genesis = (content: string, status = 0, updated = '14.09.2026 18:22:09h') => vi.fn(async (url: string, _form?: Record<string, string>, _headers?: Record<string, string>) => url.endsWith('metadata/cube')
  ? { Status: { Code: 0 }, Object: { Content: 'Statistik der Baugenehmigungen', Updated: updated } }
  : { Status: { Code: status, Content: status ? 'no objects' : 'erfolgreich' }, Object: status ? undefined : { Content: content } });
const get = vi.fn();

describe('parseCube and extractSeries', () => {
  it('provisional and estimated flags still carry a number; x . and / do not', () => {
    const c = parseCube(laender.replace('2009;5;e;9;e', '2009;5;p;9;s').replace('GBD-NW-S;2008;5;e;99;e', 'GBD-NW-S;2008;5;e;99;/'), bad);
    expect(extractSeries(c, '02.BAUART1.BTK-GEB.GBD-NW-BV.FLC002', 'annual').value).toEqual([null, 9]);
    expect(extractSeries(c, '01.BAUART1.BTK-GEB.GBD-NW-S.FLC002', 'annual').value).toEqual([null]);
  });
  it('only e and - carry a number; x and . are missing', () => {
    const c = parseCube(laender, bad);
    expect(extractSeries(c, '02.BAUART1.BTK-GEB.GBD-NW-BV.FLC002', 'annual')).toMatchObject({ period: ['2008', '2009'], value: [null, 9], unit: '1000 qm' });
    expect(extractSeries(c, '01.BAUART1.BTK-GEB.GBD-NW-BV.FLC002', 'annual').value).toEqual([62, 0]);
  });
  it('a value still to come (flag "..") is missing although GENESIS prints 0, so an unpublished year does not read as zero employment', () => {
    const employment = [...head(['DINSG', 'WZ08R1'], [['ERW063', '1000']]), 'D;DG;WZ08-K-N;2024;7844;p', 'D;DG;WZ08-K-N;2025;0;..', ''].join('\n');
    expect(extractSeries(parseCube(employment, bad), 'DG.WZ08-K-N.ERW063', 'annual')).toMatchObject({ period: ['2024', '2025'], value: [7844, null], unit: '1000' });
  });
  it('a month axis makes monthly and quarterly periods (reporting months 2, 5, 8, 11 are Q1 to Q4)', () => {
    expect(extractSeries(parseCube(cpi, bad), 'DG.PREIS1', 'monthly').period).toEqual(['1991-01', '1991-02', '1992-01']);
    const q = extractSeries(parseCube(quarterly, bad), 'DG.BAULEISTBW.BPNG1.STEMW1.PRE002', 'quarterly');
    expect(q.period).toEqual(['1958-Q1', '1958-Q2', '1958-Q4']);
    expect(q.value).toEqual([10.1, 10.4, 10.9]);
  });
  it('an id that leaves an axis open would mix series and is refused', () => {
    expect(() => extractSeries(parseCube(laender, bad), '01.BAUART1.BTK-GEB.FLC002', 'annual')).toThrow(/axes/);
  });
  it('a body that is no cube is BadResponse', () => expect(() => parseCube('hello', bad)).toThrow(BadResponse));
});

describe('refresh with source destatis', () => {
  it('logs in per request, one cube for the whole dataset, and keeps the original metadata', async () => {
    const post = genesis(laender);
    const snap = (await refresh(entry({}), undefined, { get, post, env, now }))!;
    expect(post).toHaveBeenCalledTimes(2); // metadata/cube and data/cube, for 2 Länder
    expect(post.mock.calls[0][2]).toEqual({ username: 'u', password: 'p#1' });
    expect(post.mock.calls[1][1]).toMatchObject({ name: 'D', format: 'csv' });
    const p = snap.parts['02.BAUART1.BTK-GEB.GBD-NW-BV.FLC002'];
    expect(p.value).toEqual([null, 9]);
    expect(p.meta).toMatchObject({ source: 'Statistisches Bundesamt (Destatis)', unit: '1000 qm', title: 'Statistik der Baugenehmigungen', valid_from: '2026-09-14T18:22:09', third_party: false });
    expect(p.meta!.sha256).toMatch(/^[0-9a-f]{64}$/);
  });
  it('skips the download when the cube update time matches the snapshot', async () => {
    const first = (await refresh(entry({}), undefined, { get, post: genesis(laender), env, now }))!;
    const post = genesis(laender);
    expect(await refresh(entry({}), first, { get, post, env, now })).toBeNull();
    expect(post).toHaveBeenCalledTimes(1); // metadata/cube only
    const moved = vi.fn(async (url: string) => url.endsWith('metadata/cube') ? { Status: { Code: 0 }, Object: { Content: 't', Updated: '15.09.2026 09:00:00h' } } : { Status: { Code: 0 }, Object: { Content: laender } });
    expect(await refresh(entry({}), first, { get, post: moved, env, now })).toBeNull(); // downloaded, values equal
    expect(moved).toHaveBeenCalledTimes(2);
  });
  it('series of one dataset share one cube per run', async () => {
    const post = genesis(laender), deps = { get, post, env, now };
    await refresh(entry({ laender: ['01'] }), undefined, deps);
    await refresh(entry({ key: 'k2', laender: ['02'] }), undefined, deps);
    expect(post).toHaveBeenCalledTimes(2);
  });
  it('without credentials nothing is requested and the failure is not BadResponse', async () => {
    const post = genesis(laender);
    const err = await refresh(entry({}), undefined, { get, post, env: {}, now }).catch((e) => e);
    expect(err).toBeInstanceOf(MissingCredentials);
    expect(err).not.toBeInstanceOf(BadResponse);
    expect(post).not.toHaveBeenCalled();
  });
  it('null when unchanged, a revision when an older value moves', async () => {
    const first = (await refresh(entry({}), undefined, { get, post: genesis(laender), env, now }))!;
    expect(await refresh(entry({}), first, { get, post: genesis(laender), env, now })).toBeNull();
    const next = (await refresh(entry({}), first, { get, post: genesis(laender.replace(';62;e', ';63;e').replace('2009;5;e;9;e', '2010;5;e;9;e'), 0, '15.09.2026 09:00:00h'), env, now }))!;
    expect(next.revised_at).toBe(now.toISOString());
  });
  it('a snapshot without source metadata is rewritten even when the values are equal', async () => {
    const first = (await refresh(entry({}), undefined, { get, post: genesis(laender), env, now }))!;
    const legacy: Snapshot = { ...first, parts: Object.fromEntries(Object.entries(first.parts).map(([k, { meta, ...p }]) => [k, p])) };
    expect((await refresh(entry({}), legacy, { get, post: genesis(laender), env, now }))!.parts[Object.keys(first.parts)[0]].meta).toBeTruthy();
  });
  it('status 104 (no such cube) is Unavailable; another status is a plain failed refresh', async () => {
    await expect(refresh(entry({}), undefined, { get, post: genesis('', 104), env, now })).rejects.toBeInstanceOf(Unavailable);
    const err = await refresh(entry({}), undefined, { get, post: genesis('', 22), env, now }).catch((e) => e);
    expect(err).toBeInstanceOf(Error); expect(err).not.toBeInstanceOf(BadResponse); expect(err).not.toBeInstanceOf(Unavailable);
  });
  it('a malformed or empty cube, a missing measure and a changed unit are BadResponse', async () => {
    for (const c of ['hello', head(['DLAND'], []).join('\n')]) await expect(refresh(entry({}), undefined, { get, post: genesis(c), env, now })).rejects.toBeInstanceOf(BadResponse);
    await expect(refresh(entry({ ids: ['{land}.BAUART1.BTK-GEB.GBD-NW-BV.NOPE'] }), undefined, { get, post: genesis(laender), env, now })).rejects.toBeInstanceOf(BadResponse);
    const first = (await refresh(entry({}), undefined, { get, post: genesis(laender), env, now }))!;
    await expect(refresh(entry({}), first, { get, post: genesis(laender.replace('1000 qm', '1000 sqm'), 0, '15.09.2026 09:00:00h'), env, now })).rejects.toThrow(/unit changed/);
  });
  it('monthly series from a cube with a month axis', async () => {
    const snap = (await refresh(entry({ ids: ['DG.PREIS1'], laender: [''], frequency: 'monthly', expected_start: 1991 }), undefined, { get, post: genesis(cpi), env, now }))!;
    expect(snap.parts['DG.PREIS1'].period).toEqual(['1991-01', '1991-02', '1992-01']);
  });
});

describe('makePost', () => {
  it('sends the form with the headers, and does not retry a rejected login', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 401 });
    await expect(makePost(f as any, async () => {})('u', { a: '1' }, { username: 'x' })).rejects.toBeInstanceOf(HttpError);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0][1]).toMatchObject({ method: 'POST', headers: { username: 'x' } });
    expect(String(f.mock.calls[0][1].body)).toBe('a=1');
  });
  it('retries a 503', async () => {
    const f = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValue({ ok: true, json: async () => ({ ok: 1 }) });
    expect(await makePost(f as any, async () => {})('u', {}, {})).toEqual({ ok: 1 });
  });
});
