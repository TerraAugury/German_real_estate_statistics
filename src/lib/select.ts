// Selector resolution for the KPI page script. No Node imports: it ships to the browser.
export type Want = { segment: string; geo: string; freq: string };

const WEIGHT = { segment: 4, geo: 2, freq: 1 } as const;
/**
 * The view for a selector state: the closest match, Segment first, then geography, then frequency. The selector just
 * changed (`changed`) must match when any view allows it, so picking a value always shows it. Ties go to catalogue order.
 */
export function pickView<V extends Want>(views: V[], want: Partial<Want>, changed?: keyof Want): V {
  const pool = changed && views.some((x) => x[changed] === want[changed]) ? views.filter((x) => x[changed] === want[changed]) : views;
  const score = (x: V) => (Object.keys(WEIGHT) as (keyof Want)[]).reduce((n, k) => n + (x[k] === want[k] ? WEIGHT[k] : 0), 0);
  return pool.reduce((best, x) => (score(x) > score(best) ? x : best));
}
