import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PALETTE, SCHEMES, rootCss } from '../src/lib/palette';
import { lineChart, lagChart, multiplesChart } from '../src/lib/chart';
import { loadSeries } from '../src/lib/series';

// Ticket design-refinement 01: the palette lives in one module; the page CSS and the build-time charts both read it.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const hue = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const d = Math.max(r, g, b) - Math.min(r, g, b);
  const h = d === 0 ? 0 : Math.max(r, g, b) === r ? ((g - b) / d) % 6 : Math.max(r, g, b) === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
const hueGap = (a: string, b: string) => { const d = Math.abs(hue(a) - hue(b)); return Math.min(d, 360 - d); };

describe('palette', () => {
  it('Base.astro and chart.ts hold no colour literal of their own', () => {
    for (const f of ['src/layouts/Base.astro', 'src/lib/chart.ts']) {
      const src = readFileSync(f, 'utf8');
      expect(src.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g) ?? [], f).toEqual([]);
    }
  });
  it('the root CSS declares every palette token as a custom property', () => {
    const css = rootCss();
    for (const [name, value] of Object.entries(PALETTE)) expect(css).toContain(`--${name}: ${value}`);
  });
  it('ochre text is at least 4.5:1 on the page and the plate; ochre graphics at least 3:1', () => {
    for (const bg of [PALETTE.plate, PALETTE.page]) {
      expect(contrast(PALETTE['strong-text'], bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(PALETTE.strong, bg)).toBeGreaterThanOrEqual(3);
    }
  });
  it('dark mode declares every token for prefers-color-scheme: dark, and the root asks for both schemes', () => {
    const css = rootCss();
    expect(css).toContain('color-scheme: light dark');
    const dark = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'));
    expect(dark).not.toBe('');
    expect(Object.keys(SCHEMES.dark)).toEqual(Object.keys(SCHEMES.light));
    for (const [name, value] of Object.entries(SCHEMES.dark)) expect(dark).toContain(`--${name}: ${value}`);
  });
  describe.each(['light', 'dark'] as const)('%s scheme contrast', (scheme) => {
    const c = SCHEMES[scheme];
    it('text is at least 4.5:1 on the page, the plate and the availability tints', () => {
      for (const bg of [c.page, c.plate, c.yes, c.na]) {
        for (const fg of [c.ink, c.muted, c.data, c['strong-text']]) expect(contrast(fg, bg), `${scheme} ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    });
    it('the better and worse colours are readable as text on the page and the plate, and differ from every other hue', () => {
      for (const bg of [c.page, c.plate]) for (const fg of [c.better, c.worse]) expect(contrast(fg, bg), `${scheme} ${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      // At least 25 degrees of hue from the above/below of the small charts and the two heat hues, and from each other.
      for (const fg of [c.better, c.worse]) for (const other of [c.above, c.below, c['heat-neg'], c['heat-pos']]) expect(hueGap(fg, other), `${scheme} ${fg} vs ${other}`).toBeGreaterThanOrEqual(25);
      expect(hueGap(c.better, c.worse)).toBeGreaterThanOrEqual(25);
    });
    it('graphics (lines, bars, borders of controls) are at least 3:1 on the plate', () => {
      for (const g of [c.data, c.strong, c.field, c.above, c.below]) expect(contrast(g, c.plate), `${scheme} ${g}`).toBeGreaterThanOrEqual(3);
    });
  });
  it('charts name their colours as CSS variables, so they follow the scheme without a rebuild', () => {
    const s = loadSeries('construction-permits-office');
    const lags = [{ lag: -1, rho: 0.1 }, { lag: 0, rho: -0.5 }, { lag: 1, rho: 0.3 }];
    const pts = [{ period: '2000', value: 1 }, { period: '2001', value: 2 }];
    const out = [lineChart(s, 'en'), lagChart(lags, 0, { lag: 'l', rho: 'r', mark: 'm', title: 't' }, 'en'),
      multiplesChart({ kpi: pts, reference: pts }, { unit: 'u', title: 't' }, [0, 3], 'en')].join('');
    expect(out).toContain('var(--data)');
    expect(out).toContain('var(--strong)');
    expect(out.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g) ?? []).toEqual([]);
  });
});
