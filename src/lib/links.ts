// Links on KPI pages and the Links overview (spec sections 5, 6, 8). Both read `linkResult`, so they show the same results.
import { computeLink, type LinkResult } from '../link/link';
import { loadManifest, publicLinks, type ManifestEntry } from './manifest';
import type { Segment, View } from './kpis';
import type { Series } from './series';

/** The eight Economic indicators in order (spec section 5); labels are `indicator.<name>`. */
export const INDICATORS = ['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc', 'cpi', 'gdp-real', 'unemployment-rate',
  'construction-price', 'oecd-confidence'] as const;
export type Indicator = (typeof INDICATORS)[number];

/** Construction prices and OECD confidence have two series each; the view's Segment picks one. */
const seriesOf = (name: Indicator, segment: Segment) =>
  name === 'construction-price' ? (segment === 'office' ? 'construction-price-office' : 'construction-price-commercial')
    : name === 'oecd-confidence' ? (segment === 'retail' ? 'oecd-confidence-retail' : 'oecd-confidence-construction')
      : name;

/** One view's Link pairs: its first series against each indicator, minus pairs the provisional gate drops. */
export function viewLinks(v: View, live: ManifestEntry[] = loadManifest()) {
  const { key, land } = v.series[0];
  return publicLinks(INDICATORS.map((name) => ({ name, kpi: key, land, indicator: seriesOf(name, v.segment) })), live);
}

const results = new Map<string, LinkResult>();
/** The Link of two series, computed once per build. */
export function linkResult(kpi: Series, ind: Series): LinkResult {
  const id = `${kpi.dbnomicsId}|${ind.dbnomicsId}`;
  if (!results.has(id)) results.set(id, computeLink(kpi, ind));
  return results.get(id)!;
}
