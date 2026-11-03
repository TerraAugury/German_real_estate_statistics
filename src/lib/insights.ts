// Insights page model (insights spec sections 6, 7): which Insights are public, and the result of each. The page file renders it.
import { computeInsight, type InsightResult } from '../insight/insight';
import { checkInsights, loadAllInsights, loadAllManifest, loadManifest, type InsightEntry, type ManifestEntry } from './manifest';
import { loadStrings } from './i18n';
import { KPIS } from './kpis';
import { getSeries } from './series';

// The series whose Insights count as having a Real estate KPI: every KPI view's series, and the construction prices
// the Construction KPI sits beside (Insight J has no other Real estate KPI).
const KPI_SERIES = new Set([...KPIS.flatMap((k) => k.views.flatMap((v) => v.series.map((s) => s.key))), 'construction-price-office', 'construction-price-commercial']);

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

export interface InsightModel { entry: InsightEntry; result: InsightResult }

/** The visible Insights in page order, each with its result. */
export const insightsPage = (): InsightModel[] => visibleInsights(loadInsights()).map((entry) => {
  const [kpi, reference] = (['kpi', 'reference'] as const).map((role) => getSeries(entry.series.find((s) => s.role === role)!.key));
  return { entry, result: computeInsight(kpi, reference, { growth: entry.growth }) };
});
