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

// Machado et al. (2009) simulation of the three kinds of colour-vision deficiency, on linear RGB.
const CVD = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const toLinear = (rgb: number[]) => rgb.map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const lab = (linear: number[]) => {
  const [x, y, z] = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]].map((r, i) => (r[0] * linear[0] + r[1] * linear[1] + r[2] * linear[2]) / [0.95047, 1, 1.08883][i]);
  const f = (v: number) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};
const deltaE = (a: number[], b: number[]) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const seen = (rgb: number[], k: keyof typeof CVD) => CVD[k].map((r) => Math.min(1, Math.max(0, r[0] * toLinear(rgb)[0] + r[1] * toLinear(rgb)[1] + r[2] * toLinear(rgb)[2])));

describe('heat', () => {
  it.each(['light', 'dark'] as const)('%s scheme: the deepest violet and olive shades stay apart (colour difference of at least 15) for protan, deutan and tritan vision', (scheme) => {
    const c = SCHEMES[scheme];
    const [neg, pos] = [mixed(c['heat-neg'], HEAT_MAX * 100, c.plate), mixed(c['heat-pos'], HEAT_MAX * 100, c.plate)];
    for (const k of Object.keys(CVD) as (keyof typeof CVD)[]) expect(deltaE(seen(neg, k), seen(pos, k)), `${scheme} ${k}`).toBeGreaterThanOrEqual(15);
  });
  it('negative runs violet, positive olive, zero is neutral; the shade grows with |rho| up to the cap', () => {
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
