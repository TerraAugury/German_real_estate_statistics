// Links on KPI pages and the Links overview (spec sections 5, 6, 8). Both read `linkResult`, so they show the same results.
import { computeLink, type LinkResult } from '../link/link';
import { loadManifest, publicLinks, type ManifestEntry } from './manifest';
import type { Segment, View } from './kpis';
import type { Series } from './series';

/** The eight Economic indicators in order (spec section 5); labels are `indicator.<name>`. */
export const INDICATORS = ['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc', 'cpi', 'gdp-real', 'unemployment-rate',
  'construction-price', 'oecd-confidence'] as const;
export type Indicator = (typeof INDICATORS)[number];

/**
 * Construction prices and OECD confidence have two series each; the view's Segment picks one. A Construction KPI series
 * picks construction prices by its own building type, since Commercial overall leads with office buildings.
 */
const seriesOf = (name: Indicator, segment: Segment, kpi: string) =>
  name === 'construction-price'
    ? ((kpi.startsWith('construction-') ? kpi.endsWith('-office') : segment === 'office') ? 'construction-price-office' : 'construction-price-commercial')
    : name === 'oecd-confidence' ? (segment === 'retail' ? 'oecd-confidence-retail' : 'oecd-confidence-construction')
      : name;

/** Pairs that are computable but say nothing: dropped from every KPI page and the Links overview. */
const NO_INFORMATION = new Set(['office-vacancy-7|cpi']);

/**
 * One view's Link pairs: its first series against each indicator, minus pairs the provisional gate drops. `id` is the
 * panel's HTML id, which KPI pages and the Links overview anchors share.
 */
export function viewLinks(v: View, live: ManifestEntry[] = loadManifest()) {
  const { key, land } = v.series[0];
  return publicLinks(INDICATORS.map((name) => {
    const indicator = seriesOf(name, v.segment, key);
    return { name, kpi: key, land, indicator, id: `link-${key}-${land ?? 'de'}-${indicator}` };
  }).filter((p) => !NO_INFORMATION.has(`${p.kpi}|${p.indicator}`)), live);
}
export type Pair = ReturnType<typeof viewLinks>[number];

const results = new Map<string, LinkResult>();
/** The Link of two series, computed once per build. */
export function linkResult(kpi: Series, ind: Series): LinkResult {
  const id = `${kpi.key}@${kpi.seriesId}|${ind.key}`; // seriesId names the Land
  if (!results.has(id)) results.set(id, computeLink(kpi, ind));
  return results.get(id)!;
}
