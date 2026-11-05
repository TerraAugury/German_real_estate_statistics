import { describe, expect, it } from 'vitest';
import { notesFor } from '../src/lib/notes';
import type { Series } from '../src/lib/series';

// Note order per context (spec section 9), through the one interface every chart uses.
const base = { publisher: 'Deutsche Bundesbank', fetchedFrom: 'Deutsche Bundesbank', title: { en: 'Rents', de: 'Mieten' }, freq: 'Q', stale: false, fetchFailed: null, revisedAt: null, lastPeriod: '2026-Q1',
  retrievedAt: '2026-10-01T00:00:00Z', obs: [{ period: '2013-Q1', value: 100 }, { period: '2026-Q1', value: 120 }],
  scope: [], shortWindow: false, partial: [] } as unknown as Series;
const at = new Date('2026-11-01');
const kpi = { on: 'kpi', geography: '' } as const;

describe('Home cards and Segment charts', () => {
  const s = { ...base, stale: true, lastPeriod: '2023', fetchFailed: '2026-10-30T01:00:00Z', retrievedAt: '2026-10-01T01:00:00Z', revisedAt: '2026-09-01T00:00:00Z' } as Series;
  it('stale and fetch failed only, EN and DE, dates written out', () => {
    const en = notesFor(s, 'en', { on: 'compact' }, at);
    expect(en).toHaveLength(2);
    expect(en[0]).toMatch(/^Note: Latest observation: 2023\./);
    expect(en[1]).toBe('Note: Could not refresh from Deutsche Bundesbank on 30 October 2026; showing data retrieved on 1 October 2026.');
    // the changed German is unreviewed until the owner stamps it, so it carries [DRAFT]
    expect(notesFor(s, 'de', { on: 'compact' }, at)[1].replace('[DRAFT] ', '')).toBe('Hinweis: Aktualisierung (Deutsche Bundesbank) am 30. Oktober 2026 fehlgeschlagen; dargestellt sind die am 1. Oktober 2026 abgerufenen Daten.');
  });
  it('revised Note comes last on KPI charts and expires after 90 days', () => {
    expect(notesFor(s, 'en', kpi, at)[2]).toMatch(/detected 1 September 2026/);
    const fresh = { ...s, stale: false, fetchFailed: null } as Series;
    expect(notesFor(fresh, 'en', kpi, new Date('2026-11-30'))).toHaveLength(1);
    expect(notesFor(fresh, 'en', kpi, new Date('2026-12-01T01:00:00Z'))).toHaveLength(0);
  });
});

describe('unavailable at the source', () => {
  it('replaces the failed-refresh Note and names the publisher', () => {
    const s = { ...base, fetchFailed: '2026-10-30T01:00:00Z', unavailable: '2026-10-30T01:00:00Z' } as Series;
    expect(notesFor(s, 'en', { on: 'compact' }, at)).toEqual(['Note: Deutsche Bundesbank no longer provides this series (not found on 30 October 2026); showing data retrieved on 1 October 2026.']);
  });
});

describe('fetched through DBnomics', () => {
  it('the failed-refresh Note names DBnomics, the stale Note the publisher', () => {
    const s = { ...base, publisher: 'Statistisches Bundesamt (Destatis)', fetchedFrom: 'DBnomics', stale: true, fetchFailed: '2026-10-30T01:00:00Z' } as Series;
    const en = notesFor(s, 'en', { on: 'compact' }, at);
    expect(en[0]).toMatch(/Statistisches Bundesamt \(Destatis\) has not published/);
    expect(en[1]).toMatch(/Could not refresh from DBnomics/);
  });
});

describe('KPI page charts', () => {
  it('scope, short history with the cycle sentence, then stale, in the fixed order and prefixed', () => {
    const s = { ...base, scope: ['index', 'city_class'], shortWindow: 'note.short_cycle', stale: true } as Series;
    expect(notesFor(s, 'en', { on: 'kpi', geography: 'Cities of supra-regional importance' }, at)).toEqual([
      'Note: Index (2013 = 100): shows change over time, not a price level in euros.',
      'Note: Aggregate for cities of supra-regional importance, not an individual city.',
      'Note: Short history (Q1 2013 to Q1 2026). This window contains essentially one interest-rate cycle, so the pattern may not hold in other periods.',
      'Note: Latest observation: Q1 2026. Deutsche Bundesbank has not published newer data within the expected interval, so this series may be out of date.',
    ]);
  });
  it('combined scope and short history without the cycle sentence, in German', () => {
    const s = { ...base, scope: ['combined'], shortWindow: true } as Series;
    // Unreviewed German carries [DRAFT] (ticket 09), so match the text, not the whole line.
    expect(notesFor(s, 'de', kpi, at)).toEqual([
      expect.stringContaining('Büro und Einzelhandel zusammen; keine getrennten Werte.'),
      expect.stringContaining('Kurze Zeitreihe (Q1 2013 bis Q1 2026).'),
    ]);
  });
  it('Partial total names the missing Länder per year', () => {
    const s = { ...base, partial: [{ period: '2019', laender: ['04', '11'] }] } as Series;
    expect(notesFor(s, 'en', kpi, at)).toEqual(['Note: Germany total is the sum of the Länder with data; no value for Bremen, Berlin in 2019.']);
  });
});

describe('Link panels', () => {
  const annual = { ...base, key: 'kpi-x', freq: 'A', obs: [{ period: '2015', value: 1 }, { period: '2025', value: 2 }], lastPeriod: '2025' } as Series;
  const ind = { ...base, key: 'ind-x', title: { en: 'Euribor', de: 'Euribor' } } as Series;
  it('KPI short history, small sample, KPI series Notes, indicator series Notes; series Notes name their series', () => {
    const k = { ...annual, shortWindow: true, stale: true, scope: ['index'] } as Series;
    const i = { ...ind, fetchedFrom: 'DBnomics', fetchFailed: '2026-10-30T01:00:00Z' } as Series;
    const out = notesFor(k, 'en', { on: 'link', indicator: i, pairs: 12 }, at);
    expect(out).toEqual([
      'Note: Rents: Short history (2015 to 2025).',
      expect.stringMatching(/^Note: Based on only 12 annual observations\./),
      expect.stringMatching(/^Note: Rents: Latest observation: 2025\./),
      expect.stringMatching(/^Note: Euribor: Could not refresh from DBnomics/),
    ]); // no scope Note: it belongs to the KPI chart
  });
  it('small sample only for an annual KPI under 20 pairs, and only when the Link is shown', () => {
    const small = (s: Series, pairs?: number) => notesFor(s, 'en', { on: 'link', indicator: ind, pairs }, at).some((n) => n.includes('Based on only'));
    expect(small(annual, 19)).toBe(true);
    expect(small(annual, 20)).toBe(false);
    expect(small(annual)).toBe(false);
    expect(small({ ...base, key: 'kpi-y' } as Series, 12)).toBe(false);
  });
});

describe('Insights', () => {
  const a = { ...base, key: 'kpi-a', title: { en: 'Rent index', de: 'Mietindex' }, scope: ['index'] } as Series;
  const b = { ...base, key: 'ref-b', title: { en: 'CPI', de: 'VPI' }, scope: ['index'], stale: true, lastPeriod: '2023' } as Series;
  const ctx = (rest: Series[], short?: { from: string; to: string; n: number }) => ({ on: 'insight', rest, short }) as const;
  it('the short-history Note first, then each series\' Notes named by series, then scope Notes once', () => {
    expect(notesFor(a, 'en', ctx([b], { from: '2013', to: '2025', n: 13 }), at)).toEqual([
      'Note: Short history (13 years, 2013 to 2025): the average rests on little data.',
      'Note: CPI: Latest observation: 2023. Deutsche Bundesbank has not published newer data within the expected interval, so this series may be out of date.',
      'Note: Index (2013 = 100): shows change over time, not a price level in euros.',
    ]);
  });
  it('no short-history Note without short history, and nothing when every series is fresh', () => {
    expect(notesFor({ ...a, scope: [] } as Series, 'en', ctx([{ ...b, stale: false, scope: [] } as Series]), at)).toEqual([]);
  });
  it('a City class scope Note names the class of each series', () => {
    const c7 = { ...base, key: 'initial-yield-combined-7', scope: ['city_class', 'combined'] } as Series;
    const c127 = { ...base, key: 'initial-yield-combined-127', scope: ['city_class', 'combined'] } as Series;
    expect(notesFor(c7, 'en', ctx([c127]), at)).toEqual([
      'Note: Aggregate for 7 major cities (A-Städte), not an individual city.',
      'Note: Aggregate for 127 towns and cities, not an individual city.',
      'Note: Office and retail combined; no separate office or retail figure.',
    ]);
  });
});
