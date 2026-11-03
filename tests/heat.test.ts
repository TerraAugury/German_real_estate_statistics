import { describe, expect, it } from 'vitest';
import { heat } from '../src/lib/heat';
import { HEAT_MAX, SCHEMES } from '../src/lib/palette';

// Design refinement 04: a Link cell is shaded by the sign and size of its rank correlation.
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** What CSS `color-mix(in srgb, hue share%, plate)` paints. */
const mixed = (hue: string, share: number, plate: string) => channels(hue).map((c, i) => c * (share / 100) + channels(plate)[i] * (1 - share / 100));

describe('heat', () => {
  it('negative runs blue, positive ochre, zero is neutral; the shade grows with |rho| up to the cap', () => {
    expect(heat(-1)).toEqual({ side: 'neg', share: 55 });
    expect(heat(1)).toEqual({ side: 'pos', share: 55 });
    expect(heat(0)).toEqual({ side: 'zero', share: 0 });
    expect(heat(-0.52)).toEqual({ side: 'neg', share: 29 });
    expect(heat(0.2).share).toBeLessThan(heat(0.6).share);
  });
  it('the cap is the one the CSS uses', () => expect(HEAT_MAX).toBe(0.55));
  it.each(['light', 'dark'] as const)('%s scheme: ink on every shade, on either side, is at least 4.5:1', (scheme) => {
    const c = SCHEMES[scheme], d = { neg: c['heat-neg'], pos: c['heat-pos'] };
    for (let r = -100; r <= 100; r++) {
      const { side, share } = heat(r / 100);
      const bg = side === 'neg' ? mixed(d.neg, share, c.plate) : side === 'pos' ? mixed(d.pos, share, c.plate) : channels(c.plate);
      expect(contrast(channels(c.ink), bg), `${scheme} rho ${r / 100}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
