import { t } from './i18n';
import type { Lang } from './routes';
import type { Series } from './series';

const locale = { en: 'en-GB', de: 'de-DE' } as const;
const day = (lang: Lang, iso: string) => new Intl.DateTimeFormat(locale[lang], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
export const REVISED_DAYS = 90;

/** Notes in the fixed order: stale, fetch failed, revised. Prefix included. */
export function notes(s: Series, lang: Lang, now = new Date()): string[] {
  const out: string[] = [];
  if (s.stale) out.push(t(lang, 'note.stale', { period: s.lastPeriod }));
  if (s.fetchFailed) out.push(t(lang, 'note.fetch_failed', { date: day(lang, s.fetchFailed), snapshot: day(lang, s.retrievedAt) }));
  if (s.revisedAt && (now.getTime() - Date.parse(s.revisedAt)) / 864e5 <= REVISED_DAYS) out.push(t(lang, 'note.revised', { date: day(lang, s.revisedAt) }));
  return out.map((n) => `${t(lang, 'note.prefix')}: ${n}`);
}
