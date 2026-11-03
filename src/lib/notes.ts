// Notes (spec section 9): every chart gets its Notes here, so the fixed order lives in one place.
import { day, period, t } from './i18n';
import { KPIS, landName } from './kpis';
import { SCOPES } from './manifest';
import type { Lang } from './routes';
import type { Series } from './series';

const REVISED_DAYS = 90;
const SMALL = 20; // annual Links with fewer lag-0 pairs get the Small sample Note

/**
 * Where the Notes appear:
 * - `kpi`: a KPI page chart. `geography` is the selector label; English lowercases its first letter mid-sentence.
 * - `compact`: a Home card or Segment chart.
 * - `link`: a Link panel for this KPI series against `indicator`. `pairs` is the lag-0 n when the Link is shown.
 * - `insight`: an Insight led by this series, with `rest` its other series. `short` is set when the shared period is under 20 years.
 */
export type NoteContext =
  | { on: 'kpi'; geography: string }
  | { on: 'compact' }
  | { on: 'link'; indicator: Series; pairs?: number }
  | { on: 'insight'; rest: Series[]; short?: { from: string; to: string; n: number } };

/** English lowercases the first letter of a geography label mid-sentence. */
const lowerFirst = (lang: Lang, geo: string) => (lang === 'en' ? geo.charAt(0).toLowerCase() + geo.slice(1) : geo);

/** The geography label of a series, from the KPI view that shows it. */
function geographyOf(s: Series, lang: Lang): string {
  const view = KPIS.flatMap((k) => k.views).find((v) => v.series.some((x) => x.key === s.key));
  if (!view) throw new Error(`${s.key}: no KPI view names its geography`);
  return t(lang, `geo.${view.geo}`);
}

/** Stale, unavailable or fetch failed, then revised (within REVISED_DAYS). */
function freshness(s: Series, lang: Lang, now: Date, revised = true): string[] {
  const out: string[] = [];
  if (s.stale) out.push(t(lang, 'note.stale', { period: period(lang, s.lastPeriod), source: s.publisher }));
  if (s.unavailable) out.push(t(lang, 'note.unavailable', { source: s.publisher, date: day(lang, s.unavailable), snapshot: day(lang, s.retrievedAt) }));
  else if (s.fetchFailed) out.push(t(lang, 'note.fetch_failed', { source: s.fetchedFrom, date: day(lang, s.fetchFailed), snapshot: day(lang, s.retrievedAt) }));
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
 * - Insight: the Insight's short history, then each series' stale, fetch failed and revised, named by series, then each
 *   scope Note once.
 * - Link panel: the KPI's short history (it carries the one-cycle caveat over), small sample, the KPI's stale, fetch
 *   failed and revised, then the indicator's; each series Note names its series.
 * Plain text: callers escape it for HTML.
 */
export function notesFor(s: Series, lang: Lang, ctx: NoteContext, now = new Date()): string[] {
  const note = (n: string) => `${t(lang, 'note.prefix')}: ${n}`;
  if (ctx.on === 'compact') return freshness(s, lang, now, false).map(note);
  if (ctx.on === 'kpi') {
    const cls = lowerFirst(lang, ctx.geography);
    return [
      ...s.scope.map((k) => t(lang, `note.scope.${k}`, k === 'city_class' ? { class: cls } : {})),
      ...short(s, lang),
      ...s.partial.map((p) => t(lang, 'note.partial_total', { laender: p.laender.map((l) => landName(lang, l)).join(', '), year: p.period })),
      ...freshness(s, lang, now),
    ].map(note);
  }
  if (ctx.on === 'insight') {
    const all = [s, ...ctx.rest];
    const short = ctx.short ? [t(lang, 'insight.short_history', { n: String(ctx.short.n), from: period(lang, ctx.short.from), to: period(lang, ctx.short.to) })] : [];
    const scopes = SCOPES.flatMap((k) => all.filter((x) => x.scope.includes(k)).map((x) => t(lang, `note.scope.${k}`, k === 'city_class' ? { class: lowerFirst(lang, geographyOf(x, lang)) } : {})));
    return [...short, ...all.flatMap((x) => freshness(x, lang, now).map((n) => `${x.title[lang]}: ${n}`)), ...new Set(scopes)].map(note);
  }
  const of = (x: Series, ns: string[]) => ns.map((n) => note(`${x.title[lang]}: ${n}`));
  const small = s.freq === 'A' && ctx.pairs !== undefined && ctx.pairs < SMALL ? [note(t(lang, 'link.small_sample', { n: String(ctx.pairs) }))] : [];
  return [...of(s, short(s, lang)), ...small, ...of(s, freshness(s, lang, now)), ...of(ctx.indicator, freshness(ctx.indicator, lang, now))];
}
