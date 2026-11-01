import { describe, expect, it } from 'vitest';
import { hash, unreviewedKeys, unreviewedProse, assertReviewed, draft, type Lock } from '../src/lib/review';
import { refresh, type Snapshot } from '../src/lib/pipeline';
import { checkEntries } from '../src/lib/manifest';

const en = { a: 'Hello', b: 'World' };
const lock = (h: Record<string, string>): Lock => ({ reviewed_by: 'Owner', reviewed_on: '2026-11-01', hashes: h });

describe('interface strings', () => {
  it('reviewed when hash matches', () => expect(unreviewedKeys(en, lock({ a: hash('Hello'), b: hash('World') }))).toEqual([]));
  it('English change makes German unreviewed', () => expect(unreviewedKeys({ ...en, a: 'Hi' }, lock({ a: hash('Hello'), b: hash('World') }))).toEqual(['a']));
  it('no lock entry is unreviewed', () => expect(unreviewedKeys(en, lock({ a: hash('Hello') }))).toEqual(['b']));
  it('lock without reviewer records nothing as reviewed', () =>
    expect(unreviewedKeys(en, { ...lock({ a: hash('Hello'), b: hash('World') }), reviewed_by: '' })).toEqual(['a', 'b']));
});

describe('prose pages', () => {
  const body = 'English text';
  const de = (o: object) => ({ en_hash: hash(body), reviewed_by: 'Owner', reviewed_on: '2026-11-01', ...o });
  it('reviewed', () => expect(unreviewedProse({ m: { en: body, de: de({}) } })).toEqual([]));
  it('hash mismatch', () => expect(unreviewedProse({ m: { en: 'changed', de: de({}) } })).toEqual(['m']));
  it('no record', () => expect(unreviewedProse({ m: { en: body, de: de({ reviewed_by: undefined }) } })).toEqual(['m']));
  it('missing German file', () => expect(unreviewedProse({ m: { en: body, de: undefined } })).toEqual(['m']));
});

describe('build behaviour', () => {
  it('production fails on unreviewed', () => expect(() => assertReviewed(['a'], true)).toThrow(/unreviewed German.*a/));
  it('preview does not fail', () => assertReviewed(['a'], false));
  it('draft marker only when unreviewed', () => {
    expect(draft('Hallo', true)).toBe('[DRAFT] Hallo');
    expect(draft('Hallo', false)).toBe('Hallo');
  });
});

describe('manifest checks', () => {
  const e: any = { key: 'k', title: { en: 'a', de: 'b' }, unit: { en: 'u', de: 'v' } };
  it('passes', () => checkEntries([e]));
  it('needs de title', () => expect(() => checkEntries([{ ...e, title: { en: 'a' } }])).toThrow(/en and de/));
});

describe('DBnomics name change', () => {
  const m: any = { key: 'k', provider: 'P', dataset: 'D', ids: ['X'], lands: [''], frequency: 'annual' };
  const doc = (name: string, at: string) => ({ series: { docs: [{ series_name: name, indexed_at: at, '@frequency': 'annual', period: ['2020'], value: [1] }] } });
  const old: Snapshot = { retrieved_at: 'x', fetch_failed: null, parts: { X: { name: 'Old', indexed_at: 'a', frequency: 'annual', period: ['2020'], value: [1] } } };
  it('warns, does not throw', async () => {
    const w: string[] = [];
    await refresh(m, old, { get: async () => doc('New', 'b'), now: new Date(), warn: (s) => w.push(s) });
    expect(w.join()).toMatch(/X: DBnomics name changed/);
  });
});
