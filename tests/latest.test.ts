import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { latestOf } from '../src/lib/latest';
import { latestBlock } from '../src/lib/panel';
import type { Series } from '../src/lib/series';

// Design refinement 02: every KPI plate leads with the latest value and its change since the previous period.
const s = (obs: [string, number][], over: Partial<Series> = {}) => ({
  obs: obs.map(([period, value]) => ({ period, value })), change: 'pct', unit: { en: 'index, 2013=100', de: 'Index, 2013=100' }, ...over,
}) as unknown as Series;

describe('latestOf', () => {
  it('a percent-change series gives the relative change since the previous period', () => {
    const r = latestOf(s([['2024', 160], ['2025', 168.3]]));
    expect(r).toMatchObject({ value: 168.3, period: '2025', change: { kind: 'pct', direction: 'up', since: '2024' } });
    expect(r.change!.amount).toBeCloseTo(0.051875);
  });
  it('a difference series gives the difference in points, downward when it fell', () => {
    const r = latestOf(s([['2024', 8.4], ['2025', 7.9]], { change: 'diff' }));
    expect(r.change).toMatchObject({ kind: 'diff', direction: 'down', since: '2024' });
    expect(r.change!.amount).toBeCloseTo(-0.5);
  });
  it('quarterly series compare with the previous quarter', () => {
    expect(latestOf(s([['2025-Q4', 100], ['2026-Q1', 101]])).change).toMatchObject({ since: '2025-Q4', direction: 'up' });
  });
  it('a change that rounds to zero at the shown precision is flat', () => {
    expect(latestOf(s([['2024', 160], ['2025', 160.01]])).change!.direction).toBe('flat');
  });
  it('one observation has a value and no change', () => {
    expect(latestOf(s([['2025', 5]]))).toEqual({ value: 5, period: '2025' });
  });
  it('a previous value of zero has no relative change', () => {
    expect(latestOf(s([['2024', 0], ['2025', 5]])).change).toBeUndefined();
  });
});

describe('latestBlock', () => {
  const text = (html: string) => new JSDOM(html).window.document.body.textContent!.replaceAll('[DRAFT] ', '').replace(/\s+/g, ' ').trim();
  it('EN: value, unit, period and a signed change with its direction in words and glyph', () => {
    const doc = new JSDOM(latestBlock(s([['2024', 160], ['2025', 168.3]]), 'en')).window.document;
    expect(doc.querySelector('.num')!.textContent).toBe('168.3');
    expect(text(doc.body.innerHTML)).toBe('168.3 index, 2013=100 2025 ▲ +5.2% compared with 2024');
    expect(doc.querySelector('.delta')!.getAttribute('class')).toContain('up');
  });
  it('a percent unit shows the value as a percentage and the change in points', () => {
    const html = latestBlock(s([['2024', 8.4], ['2025', 7.9]], { change: 'diff', unit: { en: '%', de: '%' } }), 'en');
    expect(text(html)).toBe('7.9% 2025 ▼ -0.5 points compared with 2024');
  });
  it('DE uses German number format and wording', () => {
    expect(text(latestBlock(s([['2024', 160], ['2025', 168.3]]), 'de'))).toMatch(/^168,3 Index, 2013=100 2025 ▲ \+5,2\s%\sgegenüber 2024$/);
  });
  it('a flat change says so; one observation shows no change', () => {
    expect(text(latestBlock(s([['2024', 160], ['2025', 160.01]]), 'en'))).toContain('▬ No change compared with 2024');
    expect(latestBlock(s([['2025', 5]]), 'en')).not.toContain('delta');
  });
});
