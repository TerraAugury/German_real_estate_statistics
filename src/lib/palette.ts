// The one place colours are written. src/layouts/Base.astro turns it into CSS custom properties for both colour schemes, and
// src/lib/chart.ts names the same properties (`var(--data)`) in the SVG it renders at build time, so charts follow the scheme.
const LIGHT = {
  page: '#f3f5f6', plate: '#ffffff', ink: '#17202a', muted: '#4a5562', rule: '#d3d9df', hair: '#e3e7eb',
  data: '#1f4e79', strong: '#b26a00', field: '#7b8794',
  /** Ochre for text: `strong` is 4.2:1 on the plate, this is 5.4:1. Lines and bars keep `strong`. */
  'strong-text': '#9a5b00',
  above: '#4e79a7', below: '#c0392b',
  /** Insight tone (src/insight/insight.ts): a verdict that is better or worse for an office investor. Neither is the hue of the small charts' above and below, and a word always goes with the colour. */
  better: '#1c6b4a', worse: '#9a2c5c',
  /** Availability: an available cell and its border; a Not available cell's hatch. */
  yes: '#e3ecf5', 'yes-rule': '#b9cde1', na: '#e9ecef',
  /** The two hues of a heat shade (src/lib/heat.ts): negative blue, positive ochre. */
  'heat-neg': '#1f4e79', 'heat-pos': '#b26a00',
  shadow: 'rgb(23 32 42 / .12)',
} as const;

/** Dark mode: the same tokens. Text is at least 4.5:1 on page, plate and tints; lines and control borders at least 3:1 on the plate (tests/palette.test.ts). */
const DARK = {
  page: '#0e141a', plate: '#171f27', ink: '#e8edf2', muted: '#a7b3bf', rule: '#33414d', hair: '#26313b',
  data: '#7db4e8', strong: '#d99a3d', field: '#8996a3',
  'strong-text': '#e3ae5c',
  above: '#6a9fd0', below: '#e0705f',
  better: '#5bc093', worse: '#e88ab4',
  yes: '#1c3045', 'yes-rule': '#30506f', na: '#202a33',
  // Darker hues than the lines: a heat shade mixes them into the plate, and light ink must stay 4.5:1 on the result.
  'heat-neg': '#3d7ab5', 'heat-pos': '#b8741a',
  shadow: 'rgb(0 0 0 / .5)',
} as const satisfies Record<keyof typeof LIGHT, string>;

export const SCHEMES = { light: LIGHT, dark: DARK } as const;
/** The light scheme, which the page uses unless the system asks for dark. */
export const PALETTE = SCHEMES.light;

/** Deepest share of hue in a heat shade: ink text stays at 4.5:1 or better on it in both schemes (tests/heat.test.ts). */
export const HEAT_MAX = 0.55;

const declare = (c: Record<string, string>) => Object.entries(c).map(([k, v]) => `--${k}: ${v}`).join('; ');

/** `:root` with the light tokens, the heat cap and `color-scheme`, then the dark tokens under `prefers-color-scheme: dark`. */
export const rootCss = () => `:root { color-scheme: light dark; ${declare(SCHEMES.light)}; --heat-max: ${HEAT_MAX * 100}%; }\n@media (prefers-color-scheme: dark) { :root { ${declare(SCHEMES.dark)}; } }`;
