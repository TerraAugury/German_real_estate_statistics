import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';
import { enHash, unreviewedKeys, unreviewedProse, missingGerman, assertReviewed, draft, readLock, recordReview, type Lock } from '../src/lib/review';
import { refresh, type Snapshot } from '../src/lib/pipeline';
import { checkEntries } from '../src/lib/manifest';

const en = { a: 'Hello', b: 'World' };
const rev = (s: string, o: object = {}) => ({ en_hash: enHash(s), reviewed_by: 'Owner', reviewed_on: '2026-11-01', ...o });

describe('interface strings', () => {
  it('reviewed when hash matches', () => expect(unreviewedKeys(en, { a: rev('Hello'), b: rev('World') })).toEqual([]));
  it('English change makes German unreviewed', () => expect(unreviewedKeys({ ...en, a: 'Hi' }, { a: rev('Hello'), b: rev('World') })).toEqual(['a']));
  it('no lock entry is unreviewed', () => expect(unreviewedKeys(en, { a: rev('Hello') })).toEqual(['b']));
  it('entry without reviewer is unreviewed', () => expect(unreviewedKeys(en, { a: rev('Hello', { reviewed_by: '' }), b: rev('World') })).toEqual(['a']));
});

describe('prose pages', () => {
  const body = 'English text';
  it('reviewed', () => expect(unreviewedProse({ m: { en: body, de: rev(body) } })).toEqual([]));
  it('hash mismatch', () => expect(unreviewedProse({ m: { en: 'changed', de: rev(body) } })).toEqual(['m']));
  it('no record', () => expect(unreviewedProse({ m: { en: body, de: rev(body, { reviewed_by: undefined }) } })).toEqual(['m']));
  it('missing German file is unreviewed and missing', () => {
    expect(unreviewedProse({ m: { en: body } })).toEqual(['m']);
    expect(missingGerman({ m: { en: body }, n: { en: body, de: rev(body) } })).toEqual(['m']);
  });
});

describe('build behaviour', () => {
  it('production fails on unreviewed', () => expect(() => assertReviewed(['a'], true)).toThrow(/unreviewed German.*a/));
  it('preview does not fail', () => assertReviewed(['a'], false));
  it('draft marker only when unreviewed', () => {
    expect(draft('Hallo', true)).toBe('[DRAFT] Hallo');
    expect(draft('Hallo', false)).toBe('Hallo');
  });
});

describe('recordReview', () => {
  const setup = () => {
    const dir = mkdtempSync(join(tmpdir(), 'review-'));
    mkdirSync(join(dir, 'en')); mkdirSync(join(dir, 'de'));
    writeFileSync(join(dir, 'en/about.md'), 'About us');
    writeFileSync(join(dir, 'de/about.md'), '---\ntitle: Über uns\n---\nÜber uns');
    writeFileSync(join(dir, 'en/terms.md'), 'Terms');
    const lock = join(dir, 'lock');
    writeFileSync(lock, 'b: { en_hash: x, reviewed_by: Earlier, reviewed_on: "2026-01-01" }\n');
    return { dir, lock };
  };
  it('stamps only the named key and leaves other records alone', () => {
    const { dir, lock } = setup();
    recordReview(en, 'Owner', '2026-11-02', ['a'], dir, lock);
    const l: Lock = readLock(lock);
    expect(l.a).toEqual(rev('Hello', { reviewed_on: '2026-11-02' }));
    expect(l.b.reviewed_by).toBe('Earlier');
  });
  it('writes en_hash and the reviewer into the German front matter', () => {
    const { dir, lock } = setup();
    recordReview(en, 'Owner', '2026-11-02', ['page:about'], dir, lock);
    const raw = readFileSync(join(dir, 'de/about.md'), 'utf8');
    expect(parse(raw.split('---\n')[1])).toEqual({ title: 'Über uns', ...rev('About us', { reviewed_on: '2026-11-02' }) });
    expect(raw.endsWith('Über uns')).toBe(true);
  });
  it('refuses to stamp everything when nothing is named', () => expect(() => recordReview(en, 'Owner', 'd', [], setup().dir)).toThrow(/at least one/));
  it('explains a missing German page instead of crashing', () => {
    const { dir, lock } = setup();
    expect(() => recordReview(en, 'Owner', 'd', ['page:terms'], dir, lock)).toThrow(/no German page/);
    expect(existsSync(join(dir, 'de/terms.md'))).toBe(false);
  });
  it('a typed prefix stamps exactly the keys it names', () => {
    const { dir, lock } = setup();
    recordReview({ 'manifest:cpi.title': 'CPI', 'manifest:cpi.unit': 'index', 'manifest:gdp.title': 'GDP' }, 'Owner', 'd', ['manifest:cpi.*'], dir, lock);
    expect(Object.keys(readLock(lock)).sort()).toEqual(['b', 'manifest:cpi.title', 'manifest:cpi.unit']);
    expect(() => recordReview(en, 'Owner', 'd', ['zzz*'], dir, lock)).toThrow(/nothing matches/);
  });
  it('rejects an unknown key', () => expect(() => recordReview(en, 'Owner', 'd', ['zzz'], setup().dir, setup().lock)).toThrow(/no English key/));
});

describe('manifest checks', () => {
  const e: any = { key: 'k', title: { en: 'a', de: 'b' }, unit: { en: 'u', de: 'v' }, attribution: { en: 's', de: 'q' },
    seasonal_adjustment: 'nsa', resampling: 'none', expected_start: 2013, short_window: true, short_window_sentence: 'x', scope: ['index'] };
  const i18n = { x: 'X' };
  it('passes', () => checkEntries([e], i18n));
  it('needs de title', () => expect(() => checkEntries([{ ...e, title: { en: 'a' } }], i18n)).toThrow(/en and de/));
  it('needs de attribution', () => expect(() => checkEntries([{ ...e, attribution: { en: 'a' } }], i18n)).toThrow(/attribution/));
  it('short_window must match a start after 2010', () => expect(() => checkEntries([{ ...e, short_window: false }], i18n)).toThrow(/short_window/));
  it('short_window_sentence must be an i18n key', () => expect(() => checkEntries([e], {})).toThrow(/no i18n key x/));
  it('scope keys come from the fixed set', () => expect(() => checkEntries([{ ...e, scope: ['city'] }], i18n)).toThrow(/unknown scope/));
  it('seasonal adjustment and resampling are required', () => {
    expect(() => checkEntries([{ ...e, seasonal_adjustment: undefined }], i18n)).toThrow(/seasonal_adjustment/);
    expect(() => checkEntries([{ ...e, resampling: 'sum' }], i18n)).toThrow(/resampling/);
  });
  it('duplicate keys fail', () => expect(() => checkEntries([e, e], i18n)).toThrow(/duplicate key k/));
});

describe('DBnomics name change', () => {
  const m: any = { key: 'k', dbnomics_provider: 'P', dataset: 'D', ids: ['X'], laender: [''], frequency: 'annual' };
  const doc = (name: string, at: string) => ({ series: { docs: [{ series_name: name, indexed_at: at, '@frequency': 'annual', period: ['2020'], value: [1] }] } });
  const old: Snapshot = { retrieved_at: 'x', fetch_failed: null, parts: { X: { name: 'Old', indexed_at: 'a', frequency: 'annual', period: ['2020'], value: [1] } } };
  it('warns, does not throw', async () => {
    const w: string[] = [];
    await refresh(m, old, { get: async () => doc('New', 'b'), now: new Date(), warn: (s) => w.push(s) });
    expect(w.join()).toMatch(/X: DBnomics name changed/);
  });
});

describe('[DRAFT] placement', () => {
  it('a drafted value inside another string moves the marker to the front', async () => {
    const { t } = await import('../src/lib/i18n');
    const out = t('en', 'link.title', { kpi: '[DRAFT] Büro', indicator: 'CPI' });
    expect(out.startsWith('[DRAFT] ')).toBe(true);
    expect(out.indexOf('[DRAFT]', 1)).toBe(-1);
  });
});
