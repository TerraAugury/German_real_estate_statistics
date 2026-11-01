import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import type { Lang } from './routes';

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

const load = (l: Lang) => parse(readFileSync(`src/i18n/${l}.yaml`, 'utf8')) as Record<string, string>;
const strings = { en: load('en'), de: load('de') };
validate(strings.en, strings.de);

export function t(lang: Lang, key: string, vars: Record<string, string> = {}): string {
  const s = strings[lang][key];
  if (s === undefined) throw new Error(`i18n: missing key ${key}`);
  return s.replace(/\{(\w+)\}/g, (_, n) => vars[n] ?? (() => { throw new Error(`i18n: ${key} needs ${n}`); })());
}

const locale = { en: 'en-GB', de: 'de-DE' } as const;
// Page-locale number formatting: EN "1,234.5", DE "1.234,5".
export const fmt = (lang: Lang, n: number, o: Intl.NumberFormatOptions = {}) => new Intl.NumberFormat(locale[lang], o).format(n);
