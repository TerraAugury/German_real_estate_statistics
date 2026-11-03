// The only source of slugs. Page key -> slug per language (spec section 8).
export const langs = ['en', 'de'] as const;
export type Lang = (typeof langs)[number];

export const routes = {
  home: { en: '', de: '' },
  'segment-office': { en: 'segments/office', de: 'segmente/buero' },
  'segment-retail': { en: 'segments/retail', de: 'segmente/einzelhandel' },
  'segment-commercial-overall': { en: 'segments/commercial-overall', de: 'segmente/gewerbe-gesamt' },
  'kpi-price-index': { en: 'kpis/price-index', de: 'kennzahlen/preisindex' },
  'kpi-rent-index': { en: 'kpis/rent-index', de: 'kennzahlen/mietindex' },
  'kpi-initial-yield': { en: 'kpis/initial-yield', de: 'kennzahlen/anfangsrendite' },
  'kpi-office-vacancy': { en: 'kpis/office-vacancy', de: 'kennzahlen/bueroleerstand' },
  'kpi-transaction-volume': { en: 'kpis/transaction-volume', de: 'kennzahlen/transaktionsvolumen' },
  construction: { en: 'kpis/construction', de: 'kennzahlen/bautaetigkeit' },
  links: { en: 'links', de: 'verknuepfungen' },
  insights: { en: 'insights', de: 'einblicke' },
  availability: { en: 'availability', de: 'verfuegbarkeit' },
  methodology: { en: 'methodology', de: 'methodik' },
  sources: { en: 'sources', de: 'quellen' },
  about: { en: 'about', de: 'ueber-uns' },
  terms: { en: 'terms', de: 'nutzungsbedingungen' },
  privacy: { en: 'privacy', de: 'datenschutz' },
  'legal-notice': { en: 'legal-notice', de: 'impressum' },
} as const satisfies Record<string, Record<Lang, string>>;
export type PageKey = keyof typeof routes;

/** Pages that exist so far; each later ticket adds its pages here. A page missing from `routes` fails the build. */
export const built = ['home', 'segment-office', 'segment-retail', 'segment-commercial-overall', 'kpi-price-index', 'kpi-rent-index', 'kpi-initial-yield', 'kpi-office-vacancy', 'kpi-transaction-volume',
  'construction', 'links', 'insights', 'availability', 'methodology', 'sources'] as const satisfies readonly PageKey[];
export type BuiltPage = (typeof built)[number];

export function slug(key: PageKey, lang: Lang): string {
  const s = routes[key]?.[lang];
  if (s === undefined) throw new Error(`Route table: no ${lang} slug for "${key}"`);
  return s;
}
export const href = (key: PageKey, lang: Lang) => `/${lang}${slug(key, lang) ? '/' + slug(key, lang) : '/'}`;
/** Same page in the other language; selector params pass through unchanged. */
export const otherLang = (l: Lang): Lang => (l === 'en' ? 'de' : 'en');
