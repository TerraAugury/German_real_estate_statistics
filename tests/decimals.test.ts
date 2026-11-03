import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { loadSeries, type Series } from '../src/lib/series';
import { latestBlock } from '../src/lib/panel';
import { lineChart } from '../src/lib/chart';

// ESCB compliance 01: a direct Bundesbank value is shown at the decimals the Bundesbank published, not rounded further.
let original: Series; // BBK_DECIMALS 1, not derived
beforeAll(() => { process.env.INCLUDE_PROVISIONAL = '1'; original = loadSeries('price-index-de-total-a'); }); // provisional series load only in a preview build
afterAll(() => { delete process.env.INCLUDE_PROVISIONAL; });
const at = (s: Series, ...values: number[]): Series => ({ ...s, obs: values.map((value, i) => ({ period: String(2020 + i), value })) });
const text = (html: string) => new JSDOM(html).window.document.body.textContent!.replace(/\s+/g, ' ');

describe('published decimals', () => {
  it('are carried by an original Bundesbank series only', () => {
    expect(original.decimals).toBe(1);
    expect(loadSeries('bund-yield-10y').decimals).toBeUndefined(); // resampled to annual: derived
    expect(loadSeries('construction-permits-office').decimals).toBeUndefined(); // Destatis: none published
  });
  it('the latest value keeps a trailing zero, in both languages', () => {
    expect(text(latestBlock(at(original, 160, 168), 'en'))).toContain('168.0');
    expect(text(latestBlock(at(original, 160, 168), 'de'))).toContain('168,0');
  });
  it('the latest value is not cut below the published count', () => {
    expect(text(latestBlock(at({ ...original, decimals: 3 }, 160, 168.1234), 'en'))).toContain('168.123');
  });
  it('a count of 0 shows no decimals', () => {
    expect(text(latestBlock(at({ ...original, decimals: 0 }, 160, 168), 'en'))).toMatch(/168(?!\.)/);
  });
  it('a percent unit keeps the count too', () => {
    const pct = { ...original, decimals: 2, unit: { en: '%', de: '%' } };
    expect(text(latestBlock(at(pct, 2.5, 2.1), 'en'))).toContain('2.10%');
  });
  it('the chart label and tooltips use it', () => {
    const svg = lineChart(at(original, 160, 168), 'en');
    expect(svg).toContain('168.0');
    expect(svg).toContain('160.0');
  });
  it('a series without a count keeps the two-decimal maximum', () => {
    const none = { ...original, decimals: undefined };
    expect(text(latestBlock(at(none, 160, 168.1234), 'en'))).toContain('168.12');
    expect(text(latestBlock(at(none, 160, 168), 'en'))).not.toContain('168.0');
  });
});
