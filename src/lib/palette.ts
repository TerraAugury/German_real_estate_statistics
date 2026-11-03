// The one place colours are written. src/layouts/Base.astro turns it into CSS custom properties; src/lib/chart.ts reads the
// same values for the SVG it renders at build time, where CSS variables would not reach Plot's own styles.
export const PALETTE = {
  page: '#f3f5f6', plate: '#ffffff', ink: '#17202a', muted: '#4a5562', rule: '#d3d9df', hair: '#e3e7eb',
  data: '#1f4e79', strong: '#b26a00', field: '#7b8794',
  /** Ochre for text: `strong` is 4.2:1 on the plate, this is 5.4:1. Lines and bars keep `strong`. */
  'strong-text': '#9a5b00',
  above: '#4e79a7', below: '#c0392b',
  /** Availability: an available cell and its border; a Not available cell's hatch. */
  yes: '#e3ecf5', 'yes-rule': '#b9cde1', na: '#e9ecef',
  shadow: 'rgb(23 32 42 / .12)',
} as const;

/** Diverging scale for signed values: negative blue, neutral, positive ochre. */
export const DIVERGING = { neg: PALETTE.data, mid: PALETTE.plate, pos: PALETTE.strong } as const;

/** Deepest share of hue in a heat shade: ink text stays at 4.5:1 or better on it (tests/heat.test.ts). */
export const HEAT_MAX = 0.55;

/** The `:root` rule that declares every palette token as `--name`, and the heat cap as `--heat-max`. */
export const rootCss = () => `:root { ${Object.entries(PALETTE).map(([k, v]) => `--${k}: ${v}`).join('; ')}; --heat-max: ${HEAT_MAX * 100}%; }`;
