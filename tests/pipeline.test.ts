import { describe, expect, it, vi } from 'vitest';
import { makeGet, refresh, markFailed, validateSnapshot, isStale, revised, type Snapshot, type Part } from '../src/lib/pipeline';
import { notes } from '../src/lib/notes';
import type { ManifestEntry } from '../src/lib/manifest';
import type { Series } from '../src/lib/series';

const m = { key: 'k', provider: 'P', dataset: 'D', ids: ['{land}.X'], lands: ['01'], frequency: 'annual', expected_start: 2008 } as ManifestEntry;
const part = (indexed_at: string, value: number[], start = 2008): Part =>
  ({ name: 'n', indexed_at, frequency: 'annual', period: value.map((_, i) => String(start + i)), value });
const snap = (p: Part, extra: Partial<Snapshot> = {}): Snapshot => ({ retrieved_at: '2026-01-01T00:00:00.000Z', fetch_failed: null, parts: { '01.X': p }, ...extra });
const now = new Date('2026-11-01T12:00:00Z');
// fake DBnomics: metadata call has no ?observations=1
const api = (doc: Part) => vi.fn(async (u: string) => ({ series: { docs: [{ series_name: doc.name, indexed_at: doc.indexed_at, '@frequency': doc.frequency, period: doc.period, value: doc.value }] } }));

describe('refresh', () => {
  it('skips the download when indexed_at is unchanged', async () => {
    const old = snap(part('t1', [1, 2]));
    const get = api(part('t1', [9, 9]));
    expect(await refresh(m, old, { get, now })).toBeNull();
    expect(get).toHaveBeenCalledTimes(1);
  });
  it('downloads when indexed_at moved and flags a revision of an older value', async () => {
    const old = snap(part('t1', [1, 2]));
    const get = api(part('t2', [1, 5, 7]));
    const next = (await refresh(m, old, { get, now }))!;
    expect(get).toHaveBeenCalledTimes(2);
    expect(next.revised_at).toBe(now.toISOString());
    expect(next.retrieved_at).toBe(now.toISOString());
  });
  it('a new latest period is not a revision', async () => {
    const next = (await refresh(m, snap(part('t1', [1, 2])), { get: api(part('t2', [1, 2, 3])), now }))!;
    expect(next.revised_at).toBeNull();
  });
  it('clears fetch_failed on a successful unchanged check', async () => {
    const old = snap(part('t1', [1]), { fetch_failed: '2026-10-01T00:00:00.000Z' });
    const next = (await refresh(m, old, { get: api(part('t1', [1])), now }))!;
    expect(next.fetch_failed).toBeNull();
    expect(next.retrieved_at).toBe(old.retrieved_at);
  });
  it('revised() ignores the latest period', () => expect(revised(part('a', [1, 2]), part('b', [1, 3]))).toBe(false));
});

describe('failure', () => {
  it('reuses the snapshot and records the date', () => {
    const s = markFailed('k', snap(part('t1', [1])), now, 'boom');
    expect(s.fetch_failed).toBe(now.toISOString());
    expect(s.parts['01.X'].value).toEqual([1]);
  });
  it('fails without a snapshot', () => expect(() => markFailed('k', undefined, now, 'boom')).toThrow(/no snapshot/));
});

describe('makeGet', () => {
  it('retries with backoff, sending a User-Agent', async () => {
    const f = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue({ ok: true, json: async () => ({ a: 1 }) });
    const sleep = vi.fn(async () => {});
    expect(await makeGet(f as any, sleep)('u')).toEqual({ a: 1 });
    expect(sleep).toHaveBeenCalledWith(1000);
    expect(f.mock.calls[0][1].headers['User-Agent']).toMatch(/german-cre/);
  });
  it('gives up after 3 tries', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(makeGet(f as any, async () => {})('u')).rejects.toThrow('503');
    expect(f).toHaveBeenCalledTimes(3);
  });
});

describe('validateSnapshot', () => {
  it('passes', () => validateSnapshot(m, snap(part('t', [1]))));
  it('fails on missing id', () => expect(() => validateSnapshot(m, { ...snap(part('t', [1])), parts: {} })).toThrow(/id missing/));
  it('fails on frequency', () => expect(() => validateSnapshot(m, snap({ ...part('t', [1]), frequency: 'monthly' }))).toThrow(/frequency/));
  it('fails on start date', () => expect(() => validateSnapshot(m, snap(part('t', [1], 2010)))).toThrow(/starts/));
});

describe('isStale', () => {
  const d = { monthly: 150, quarterly: 240, annual: 540 };
  it('annual: 2024 data is fresh until mid 2026', () => {
    expect(isStale('2024', 'annual', new Date('2026-06-20'), d)).toBe(false);
    expect(isStale('2024', 'annual', new Date('2026-07-01'), d)).toBe(true);
  });
  it('quarterly and monthly', () => {
    expect(isStale('2025-Q4', 'quarterly', new Date('2026-08-27'), d)).toBe(false);
    expect(isStale('2025-Q4', 'quarterly', new Date('2026-09-01'), d)).toBe(true);
    expect(isStale('2026-02', 'monthly', new Date('2026-07-27'), d)).toBe(false);
    expect(isStale('2026-02', 'monthly', new Date('2026-08-01'), d)).toBe(true);
  });
  it('reads the config file by default', () => expect(isStale('2025', 'annual', now)).toBe(false));
});

describe('notes', () => {
  const s = { stale: true, lastPeriod: '2023', fetchFailed: '2026-10-30T01:00:00Z', retrievedAt: '2026-10-01T01:00:00Z', revisedAt: '2026-09-01T00:00:00Z' } as Series;
  it('fixed order, EN and DE, dates written out', () => {
    const en = notes(s, 'en', now);
    expect(en).toHaveLength(3);
    expect(en[0]).toMatch(/^Note: Latest observation: 2023\./);
    expect(en[1]).toBe('Note: Could not refresh from DBnomics on 30 October 2026; showing data retrieved on 1 October 2026.');
    expect(en[2]).toMatch(/detected 1 September 2026/);
    expect(notes(s, 'de', now)[1]).toBe('Hinweis: Aktualisierung über DBnomics am 30. Oktober 2026 fehlgeschlagen; dargestellt sind die am 1. Oktober 2026 abgerufenen Daten.');
  });
  it('revised note expires after 90 days; nothing else when fresh', () => {
    expect(notes({ ...s, stale: false, fetchFailed: null }, 'en', new Date('2026-11-30'))).toHaveLength(1);
    expect(notes({ ...s, stale: false, fetchFailed: null }, 'en', new Date('2026-12-01T01:00:00Z'))).toHaveLength(0);
  });
});
