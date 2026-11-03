import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PALETTE, DIVERGING, rootCss } from '../src/lib/palette';

// Ticket design-refinement 01: the palette lives in one module; the page CSS and the build-time charts both read it.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

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
  it('the diverging scale runs blue, neutral, ochre', () => {
    expect(DIVERGING).toEqual({ neg: PALETTE.data, mid: PALETTE.plate, pos: PALETTE.strong });
  });
});
