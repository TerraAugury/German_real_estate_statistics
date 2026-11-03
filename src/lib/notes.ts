// Notes (spec section 9): every chart gets its Notes here, so the fixed order lives in one place.
import { day, period, t } from './i18n';
import { landName } from './kpis';
import type { Lang } from './routes';
import type { Series } from './series';

const REVISED_DAYS = 90;
const SMALL = 20; // annual Links with fewer lag-0 pairs get the Small sample Note

/**
 * Where the Notes appear:
 * - `kpi`: a KPI page chart. `geography` is the selector label; English lowercases its first letter mid-sentence.
 * - `compact`: a Home card or Segment chart.
 * - `link`: a Link panel for this KPI series against `indicator`. `pairs` is the lag-0 n when the Link is shown.
 */
export type NoteContext =
  | { on: 'kpi'; geography: string }
  | { on: 'compact' }
  | { on: 'link'; indicator: Series; pairs?: number };

/** Stale, fetch failed, then revised (within REVISED_DAYS). */
function freshness(s: Series, lang: Lang, now: Date, revised = true): string[] {
  const out: string[] = [];
  if (s.stale) out.push(t(lang, 'note.stale', { period: period(lang, s.lastPeriod), source: s.publisher }));
  if (s.fetchFailed) out.push(t(lang, 'note.fetch_failed', { source: s.fetchedFrom, date: day(lang, s.fetchFailed), snapshot: day(lang, s.retrievedAt) }));
  if (revised && s.revisedAt && (now.getTime() - Date.parse(s.revisedAt)) / 864e5 <= REVISED_DAYS) out.push(t(lang, 'note.revised', { source: s.publisher, date: day(lang, s.revisedAt) }));
  return out;
}

/** Short history, with the series' extra sentence if it has one. */
function short(s: Series, lang: Lang): string[] {
  if (!s.shortWindow) return [];
  const text = t(lang, 'note.short_window', { start: period(lang, s.obs[0].period), end: period(lang, s.lastPeriod) });
  return [typeof s.shortWindow === 'string' ? `${text} ${t(lang, s.shortWindow)}` : text];
}

/**
 * A chart's Notes, prefixed, in the fixed order for its context:
 * - KPI chart: scope, short history, partial total, stale, fetch failed, revised.
 * - Compact chart: stale, fetch failed.
 * - Link panel: the KPI's short history (it carries the one-cycle caveat over), small sample, the KPI's stale, fetch
 *   failed and revised, then the indicator's; each series Note names its series.
 * Plain text: callers escape it for HTML.
 */
export function notesFor(s: Series, lang: Lang, ctx: NoteContext, now = new Date()): string[] {
  const note = (n: string) => `${t(lang, 'note.prefix')}: ${n}`;
  if (ctx.on === 'compact') return freshness(s, lang, now, false).map(note);
  if (ctx.on === 'kpi') {
    const cls = lang === 'en' ? ctx.geography.charAt(0).toLowerCase() + ctx.geography.slice(1) : ctx.geography;
    return [
      ...s.scope.map((k) => t(lang, `note.scope.${k}`, k === 'city_class' ? { class: cls } : {})),
      ...short(s, lang),
      ...s.partial.map((p) => t(lang, 'note.partial_total', { laender: p.laender.map((l) => landName(lang, l)).join(', '), year: p.period })),
      ...freshness(s, lang, now),
    ].map(note);
  }
  const of = (x: Series, ns: string[]) => ns.map((n) => note(`${x.title[lang]}: ${n}`));
  const small = s.freq === 'A' && ctx.pairs !== undefined && ctx.pairs < SMALL ? [note(t(lang, 'link.small_sample', { n: String(ctx.pairs) }))] : [];
  return [...of(s, short(s, lang)), ...small, ...of(s, freshness(s, lang, now)), ...of(ctx.indicator, freshness(ctx.indicator, lang, now))];
}
