import { t } from './i18n';
import { landName } from './kpis';
import type { Lang } from './routes';
import type { Series } from './series';

const locale = { en: 'en-GB', de: 'de-DE' } as const;
const day = (lang: Lang, iso: string) => new Intl.DateTimeFormat(locale[lang], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
export const REVISED_DAYS = 90;

/** Note texts in the fixed order: stale, fetch failed, revised. No prefix. */
export function noteTexts(s: Omit<Series, 'notes'>, lang: Lang, now = new Date()): string[] {
  const out: string[] = [];
  if (s.stale) out.push(t(lang, 'note.stale', { period: s.lastPeriod }));
  if (s.fetchFailed) out.push(t(lang, 'note.fetch_failed', { date: day(lang, s.fetchFailed), snapshot: day(lang, s.retrievedAt) }));
  if (s.revisedAt && (now.getTime() - Date.parse(s.revisedAt)) / 864e5 <= REVISED_DAYS) out.push(t(lang, 'note.revised', { date: day(lang, s.revisedAt) }));
  return out;
}

const prefix = (lang: Lang, ns: string[]) => ns.map((n) => `${t(lang, 'note.prefix')}: ${n}`);

/** Prefixed Notes for Home cards and Segment charts: stale, fetch failed, revised. */
export const notes = (s: Series, lang: Lang, now = new Date()): string[] => prefix(lang, noteTexts(s, lang, now));

/**
 * Prefixed Notes for a KPI page chart, all of them in the fixed order: scope, short history, partial total, then `notes`.
 * `geography` is the selector label; English lowercases its first letter mid-sentence, German nouns keep theirs.
 */
export function kpiNotes(s: Series, lang: Lang, geography: string, now = new Date()): string[] {
  const cls = lang === 'en' ? geography.charAt(0).toLowerCase() + geography.slice(1) : geography;
  const out = s.scope.map((k) => t(lang, `note.scope.${k}`, k === 'city_class' ? { class: cls } : {}));
  if (s.shortWindow) {
    const short = t(lang, 'note.short_window', { start: s.obs[0].period, end: s.lastPeriod });
    out.push(typeof s.shortWindow === 'string' ? `${short} ${t(lang, s.shortWindow)}` : short);
  }
  for (const p of s.partial) out.push(t(lang, 'note.partial_total', { laender: p.laender.map((l) => landName(lang, l)).join(', '), year: p.period }));
  return prefix(lang, [...out, ...noteTexts(s, lang, now)]);
}
