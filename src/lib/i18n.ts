import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import type { Lang, PageKey } from './routes';
import { DRAFT, draft, readLock, unreviewedKeys } from './review';

const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

export function validate(en: Record<string, string>, de: Record<string, string>): void {
  const errs: string[] = [];
  for (const k of new Set([...Object.keys(en), ...Object.keys(de)])) {
    if (!(k in en) || !(k in de)) { errs.push(`missing key: ${k}`); continue; }
    if (!String(en[k]).trim() || !String(de[k]).trim()) errs.push(`empty value: ${k}`);
    else if (ph(en[k]) !== ph(de[k])) errs.push(`placeholder mismatch: ${k}`);
  }
  if (errs.length) throw new Error('i18n: ' + errs.join('; '));
}

/** Interface strings for one language, as committed. */
export const loadStrings = (l: Lang) => parse(readFileSync(`src/i18n/${l}.yaml`, 'utf8')) as Record<string, string>;
const strings = { en: loadStrings('en'), de: loadStrings('de') };
validate(strings.en, strings.de);
// German not reviewed against the current English shows [DRAFT]; production builds fail before this matters (scripts/check-review.ts).
const unreviewed = new Set(unreviewedKeys(strings.en, readLock()));

/** Whether an interface string exists, for text an Insight may bring its own version of. */
export const hasKey = (key: string) => key in strings.en;

export function t(lang: Lang, key: string, vars: Record<string, string> = {}): string {
  const s = strings[lang][key];
  if (s === undefined) throw new Error(`i18n: missing key ${key}`);
  let nested = false; // a [DRAFT] value inside this string moves to the front, so the marker never sits mid-sentence
  const out = s.replace(/\{(\w+)\}/g, (_, n) => {
    const v = vars[n];
    if (v === undefined) throw new Error(`i18n: ${key} needs ${n}`);
    nested ||= v.includes(DRAFT);
    return v.replaceAll(DRAFT, '');
  });
  return draft(out, nested || (lang === 'de' && unreviewed.has(key)));
}

/** The `<title>`: page name, then site name; Home is the site name once. */
export const documentTitle = (lang: Lang, page: PageKey, title: string) => (page === 'home' ? title : `${title} – ${t(lang, 'site.title')}`);

const locale = { en: 'en-GB', de: 'de-DE' } as const;
// Building an Intl formatter is far dearer than using one, and a build formats thousands of numbers.
const numberFormats = new Map<string, Intl.NumberFormat>(), dateFormats = new Map<string, Intl.DateTimeFormat>();
const cached = <T>(m: Map<string, T>, lang: Lang, o: object, make: (locale: string) => T): T => {
  const k = lang + JSON.stringify(o);
  if (!m.has(k)) m.set(k, make(locale[lang]));
  return m.get(k)!;
};
const dateFormat = (lang: Lang, o: Intl.DateTimeFormatOptions) => cached(dateFormats, lang, o, (l) => new Intl.DateTimeFormat(l, o));
/** An ISO timestamp as a long UTC date: "3 November 2026". */
export const day = (lang: Lang, iso: string) => dateFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
// Page-locale number formatting: EN "1,234.5", DE "1.234,5".
export const fmt = (lang: Lang, n: number, o: Intl.NumberFormatOptions = {}) => cached(numberFormats, lang, o, (l) => new Intl.NumberFormat(l, o)).format(n);
/** Number format for a series' own values: the decimals its source published when it has them, else at most two. */
export const valueFormat = (s: { decimals?: number }): Intl.NumberFormatOptions =>
  s.decimals == null ? { maximumFractionDigits: 2 } : { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals };
/** A period as shown (spec section 10): "2026-Q1" -> "Q1 2026" in both languages, "2026" as is, months through Intl. */
export function period(lang: Lang, p: string): string {
  const [y, rest] = p.split('-');
  if (!rest) return y;
  if (rest[0] === 'Q') return `${rest} ${y}`;
  return dateFormat(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(+y, +rest - 1));
}
