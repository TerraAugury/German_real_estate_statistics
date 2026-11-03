// Insights page model (insights spec sections 6, 7): which Insights are public, and the result of each. The page file renders it.
import { computeInsight, type InsightResult } from '../insight/insight';
import { checkInsights, loadAllInsights, loadAllManifest, loadManifest, type InsightEntry, type ManifestEntry } from './manifest';
import { loadStrings } from './i18n';
import { KPIS } from './kpis';
import { getSeries, type Series } from './series';
import type { PageKey } from './routes';

// The KPI page of each Real estate KPI series: every KPI view's series, and the construction prices, which sit with the
// Construction KPI (Insight J has no other Real estate KPI).
const KPI_PAGE = new Map<string, PageKey>([
  ...KPIS.flatMap((k) => k.views.flatMap((v) => v.series.map((s): [string, PageKey] => [s.key, k.page]))),
  ['construction-price-office', 'construction'], ['construction-price-commercial', 'construction'],
]);
const KPI_SERIES = new Set(KPI_PAGE.keys());

/** Every declared Insight, hidden ones included, after the build checks. */
export function loadInsights(): InsightEntry[] {
  const entries = loadAllInsights();
  checkInsights(entries, { series: new Set(loadAllManifest().map((m) => m.key)), kpis: KPI_SERIES }, loadStrings('en'));
  return entries;
}

/** Provisional gate: an Insight is public only if all its series are. Its status is derived, never declared. */
export const visibleInsights = (entries: InsightEntry[], live: ManifestEntry[] = loadManifest()) => {
  const keys = new Set(live.map((m) => m.key));
  return entries.filter((e) => e.series.every((s) => keys.has(s.key)));
};

/** `series` are the Insight's series in declaration order. */
export interface InsightModel { entry: InsightEntry; series: Series[]; result: InsightResult }

/** The visible Insights in page order, each with its result. */
export const insightsPage = (): InsightModel[] => visibleInsights(loadInsights()).map((entry) => {
  const series = entry.series.map((s) => getSeries(s.key));
  const [kpi, reference] = (['kpi', 'reference'] as const).map((role) => series[entry.series.findIndex((s) => s.role === role)]);
  return { entry, series, result: computeInsight(kpi, reference, { headline: entry.headline, growth: entry.growth, base: entry.base, shift: entry.shift }) };
});

/** The visible Insights whose Real estate KPI series belong to a KPI page, in page order. */
export const insightsFor = (page: PageKey): InsightEntry[] =>
  visibleInsights(loadInsights()).filter((e) => e.series.some((s) => s.role === 'kpi' && KPI_PAGE.get(s.key) === page));
