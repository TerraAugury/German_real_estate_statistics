// Page models (spec section 8): what the KPI pages, the Links overview and the Availability grid show, as data with no
// language in it. The page file translates and renders; tests call these directly, without a build.
import { INDICATORS, linkResult, viewLinks, type Indicator, type Pair } from './links';
import { getSeries, type Series } from './series';
import { GEO_GROUPS, KPIS, SEGMENTS, cell, geoGroup, headline, liveViews, type Cell, type Freq, type GeoGroup, type Kpi, type Segment, type View } from './kpis';
import { lagFor, noiseBand, targetOf, type LinkResult } from '../link/link';
import { insightsFor } from './insights';
import type { InsightEntry } from './manifest';
import { heat, type Heat } from './heat';
import { loadManifest } from './manifest';

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export interface KpiPage {
  /** Every live view in catalogue order; `links` are its panel ids. Only the first is live at load (ticket 12). */
  views: { view: View; links: string[]; live: boolean }[];
  /** Each Link pair once, in indicator order; `geo` is the geography of the first view showing it (its scope label). */
  panels: { id: string; pair: Pair; geo: string; live: boolean }[];
  /** Insights using this KPI, below the Link panels; empty when none passes the Provisional gate. */
  insights: InsightEntry[];
  /** Selector options in view order; geographies grouped, empty groups dropped. */
  selectors: { segment: Segment[]; geo: { group: GeoGroup; geos: string[] }[]; freq: Freq[] };
}

export function kpiPage(kpi: Kpi): KpiPage {
  const live = liveViews(kpi);
  const panels = new Map<string, KpiPage['panels'][number]>();
  const views = live.map((view, i) => {
    const pairs = viewLinks(view);
    for (const pair of pairs) if (!panels.has(pair.id)) panels.set(pair.id, { id: pair.id, pair, geo: view.geo, live: i === 0 });
    return { view, links: pairs.map((p) => p.id), live: i === 0 };
  });
  const geos = uniq(live.map((v) => v.geo));
  return {
    views,
    panels: [...panels.values()].sort((a, b) => INDICATORS.indexOf(a.pair.name) - INDICATORS.indexOf(b.pair.name)),
    insights: insightsFor(kpi.page),
    selectors: {
      segment: uniq(live.map((v) => v.segment)),
      geo: GEO_GROUPS.map((group) => ({ group, geos: geos.filter((g) => geoGroup(g) === group) })).filter((g) => g.geos.length),
      freq: uniq(live.map((v) => v.freq)),
    },
  };
}

/**
 * One matrix cell. `lags[y]` is the value with the indicator taken y years earlier (0 = same year, the headline), read
 * from the same lag list the Link panel draws; a lag under the minimum overlap has no rho and no heat.
 */
export interface OverviewCell {
  pair: Pair; result: LinkResult; heat?: Heat;
  lags: CellLag[];
}
/** `band` and `noise` exist where there is a rho: noise = inside the ±2/√(n−1) band of that lag's own n. */
export interface CellLag { rho: number | null; n: number; heat?: Heat; band?: number; noise?: boolean }

export interface LinksOverview {
  /** Indicators that some row has a public pair for, in indicator order. */
  columns: Indicator[];
  /** Each KPI at its headline view (none = licence not confirmed), one cell per indicator it has a pair for. */
  rows: { kpi: Kpi; view?: View; cells: Map<Indicator, OverviewCell> }[];
}

export function linksOverview(): LinksOverview {
  const rows = KPIS.map((kpi) => {
    const view = headline(kpi);
    const pairs = view ? viewLinks(view) : [];
    return { kpi, view, cells: new Map(pairs.map((pair) => {
      const result = linkResult(getSeries(pair.kpi, pair.land), getSeries(pair.indicator));
      const at = (years: 0 | 1 | 2): CellLag => {
        if (!result.shown) return { rho: null, n: result.n0 };
        const freq = getSeries(pair.kpi, pair.land).freq;
        const { rho, n } = result.lags.find((l) => l.lag === lagFor(freq, years))!;
        if (rho === null) return { rho, n };
        const band = noiseBand(n, targetOf(freq));
        return { rho, n, heat: heat(rho), band, noise: Math.abs(rho) <= band };
      };
      return [pair.name, { pair, result, heat: result.shown ? heat(result.headline.rho!) : undefined, lags: [at(0), at(1), at(2)] }];
    })) };
  });
  return { columns: INDICATORS.filter((n) => rows.some((r) => r.cells.has(n))), rows };
}

/** Availability grid: one row per KPI, one cell per Segment with the geography groups its live views cover. */
export const availability = () => KPIS.map((kpi) => ({
  kpi,
  cells: SEGMENTS.map((segment): { segment: Segment; cell: Cell; geos: GeoGroup[] } => ({
    segment, cell: cell(kpi, segment), geos: uniq(liveViews(kpi).filter((v) => v.segment === segment).map((v) => geoGroup(v.geo))),
  })),
}));

/** A view's first series: the one its compact chart, Home row and Link pairs are about. */
export const firstSeries = (v: View) => getSeries(v.series[0].key, v.series[0].land);

export interface HomeRow {
  kpi: Kpi;
  /** The KPI's headline view and its first series; both absent when no series is public (licence not confirmed). */
  view?: View; series?: Series;
}

/** Home's KPI index: one row per KPI at its headline view. */
export function homeIndex(live = loadManifest()): HomeRow[] {
  return KPIS.map((kpi): HomeRow => {
    const view = headline(kpi, live);
    if (!view) return { kpi };
    const series = firstSeries(view);
    return { kpi, view, series };
  });
}
