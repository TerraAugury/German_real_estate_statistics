import { HEAT_MAX } from './palette';

export interface Heat { side: 'neg' | 'pos' | 'zero'; /** Percent of the hue mixed into the plate colour, 0 to the cap. */ share: number }

/**
 * Shade of a Link cell: blue where the changes moved in opposite directions, ochre where they moved together, deeper
 * for a larger rank correlation. The cap keeps ink text at 4.5:1 or better on the deepest shade.
 */
export function heat(rho: number): Heat {
  const share = Math.round(Math.abs(rho) * HEAT_MAX * 100);
  return { side: share === 0 ? 'zero' : rho < 0 ? 'neg' : 'pos', share };
}
