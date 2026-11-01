// The only source of slugs. Page key -> slug per language.
export const langs = ['en', 'de'] as const;
export type Lang = (typeof langs)[number];

export const routes = {
  home: { en: '', de: '' },
  construction: { en: 'kpis/construction', de: 'kennzahlen/bautaetigkeit' },
  // Remaining pages are added by later tickets; copy slugs from spec section 8.
} as const satisfies Record<string, Record<Lang, string>>;
export type PageKey = keyof typeof routes;

export function slug(key: PageKey, lang: Lang): string {
  const s = routes[key]?.[lang];
  if (s === undefined) throw new Error(`Route table: no ${lang} slug for "${key}"`);
  return s;
}
export const href = (key: PageKey, lang: Lang) => `/${lang}${slug(key, lang) ? '/' + slug(key, lang) : ''}`;
/** Same page in the other language; selector params pass through unchanged. */
export const otherLang = (l: Lang): Lang => (l === 'en' ? 'de' : 'en');
