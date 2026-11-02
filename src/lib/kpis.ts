// KPI catalogue (spec section 4): which series each KPI page shows for every Segment x geography x frequency.
// Selector values are language-neutral English keys (spec section 8); labels come from i18n (`segment.*`, `geo.*`, `freq.*`).
import { loadManifest, type ManifestEntry } from './manifest';
import { t } from './i18n';
import { href, type Lang, type PageKey } from './routes';

export type Segment = 'office' | 'retail' | 'logistics' | 'commercial-overall';
export type Freq = 'annual' | 'quarterly';
/** One selector state; `land` picks one Land of a Destatis series (absent = Germany, the sum of the Länder). */
export interface View { segment: Segment; geo: string; freq: Freq; series: { key: string; land?: string }[] }
export interface Kpi { page: PageKey; title: string; views: View[] }

/** Destatis Land code -> ISO 3166-2 key (`geo` value). */
const LAENDER: Record<string, string> = {
  '01': 'de-sh', '02': 'de-hh', '03': 'de-ni', '04': 'de-hb', '05': 'de-nw', '06': 'de-he', '07': 'de-rp', '08': 'de-bw',
  '09': 'de-by', '10': 'de-sl', '11': 'de-be', '12': 'de-bb', '13': 'de-mv', '14': 'de-sn', '15': 'de-st', '16': 'de-th',
};
export const landKey = (code: string) => LAENDER[code] ?? (() => { throw new Error(`no Land ${code}`); })();
/** Land name in the page language, from its Destatis code. */
export const landName = (lang: Lang, code: string) => t(lang, `geo.${landKey(code)}`);
export const isLand = (geo: string) => geo.startsWith('de-');
/** City class geographies (labelled as classes, never as cities). */
export const CITY_CLASSES = ['supra-regional', '7-cities', '120-towns', '127-towns', '127-districts'];
/** How selectors and the Availability grid group geographies: Germany-wide (incl. "excluding supra-regional"), City classes, Länder. */
export const GEO_GROUPS = ['germany', 'city_classes', 'laender'] as const;
export type GeoGroup = (typeof GEO_GROUPS)[number];
export const geoGroup = (geo: string): GeoGroup => (isLand(geo) ? 'laender' : CITY_CLASSES.includes(geo) ? 'city_classes' : 'germany');

const v = (segment: Segment, geo: string, freq: Freq, ...keys: string[]): View => ({ segment, geo, freq, series: keys.map((key) => ({ key })) });
const AQ = [['annual', 'a'], ['quarterly', 'q']] as const;
const CLASSES = [['7-cities', '7'], ['120-towns', '120'], ['127-towns', '127']] as const;

const price = (['office', 'retail', 'commercial-overall'] as const).flatMap((seg) =>
  ([['germany', 'de'], ['supra-regional', 'cities'], ['excl-supra-regional', 'excl']] as const).flatMap(([geo, g]) =>
    AQ.map(([freq, f]) => v(seg, geo, freq, `price-index-${g}-${seg === 'commercial-overall' ? 'total' : seg}-${f}`))));
const rent = [
  ...(['office', 'retail'] as const).flatMap((seg) => AQ.map(([freq, f]) => v(seg, 'germany', freq, `rent-index-de-${seg}-${f}`))),
  ...CLASSES.map(([geo, n]) => v('commercial-overall', geo, 'annual', `rent-index-combined-${n}`)),
];
const yields = CLASSES.map(([geo, n]) => v('commercial-overall', geo, 'annual', `initial-yield-combined-${n}`));
const vacancy = CLASSES.map(([geo, n]) => v('office', geo, 'annual', `office-vacancy-${n}`));
// The Bundesbank 127 series is administrative districts (Kreise), not towns (spec open question 4).
const transactions = ([['germany', 'de'], ['127-districts', '127'], ['7-cities', '7']] as const)
  .map(([geo, g]) => v('commercial-overall', geo, 'annual', `transaction-volume-${g}`));

// Construction: Destatis per Land or summed for Germany, with the Bundesbank G650 Germany series beside it (spec section 4).
// Commercial overall shows office and commercial buildings as two series, never summed; the lumped Bundesbank
// wholesale/retail/warehouse series appears only there.
const CONSTRUCTION: Record<'office' | 'logistics' | 'commercial-overall', { destatis: string[]; bbk: string[] }> = {
  office: { destatis: ['office'], bbk: ['office'] },
  logistics: { destatis: ['warehouse'], bbk: [] },
  'commercial-overall': { destatis: ['office', 'commercial'], bbk: ['office', 'wholesale-warehouse'] },
};
const construction = Object.entries(CONSTRUCTION).flatMap(([seg, { destatis, bbk }]) =>
  // sorted: integer-like keys ('10') would otherwise come before '01'
  ['germany', ...Object.keys(LAENDER).sort()].map((land): View => {
    const germany = land === 'germany';
    const series = ['permits', 'completions'].flatMap((w) => [
      ...destatis.map((b) => ({ key: `construction-${w}-${b}`, ...(germany ? {} : { land }) })),
      ...(germany ? bbk.map((b) => ({ key: `construction-bbk-${w}-${b}` })) : []),
    ]);
    return { segment: seg as Segment, geo: germany ? 'germany' : landKey(land), freq: 'annual', series };
  }));

/** The six KPIs in catalogue order, with every view before the provisional gate. */
export const KPIS: Kpi[] = [
  { page: 'kpi-price-index', title: 'kpi.price-index.title', views: price },
  { page: 'kpi-rent-index', title: 'kpi.rent-index.title', views: rent },
  { page: 'kpi-initial-yield', title: 'kpi.initial-yield.title', views: yields },
  { page: 'kpi-office-vacancy', title: 'kpi.office-vacancy.title', views: vacancy },
  { page: 'kpi-transaction-volume', title: 'kpi.transaction-volume.title', views: transactions },
  { page: 'construction', title: 'kpi.construction.title', views: construction },
];

/** Views whose series survive the provisional gate; a view with none left is dropped. Empty = licence not confirmed. */
export function liveViews(kpi: Kpi, live: ManifestEntry[] = loadManifest()): View[] {
  const keys = new Set(live.map((m) => m.key));
  return kpi.views.map((vw) => ({ ...vw, series: vw.series.filter((s) => keys.has(s.key)) })).filter((vw) => vw.series.length);
}

/** Availability grid columns; Logistics has a column but no Segment page (spec section 8). */
export const SEGMENTS: Segment[] = ['office', 'retail', 'logistics', 'commercial-overall'];
export const SEGMENT_PAGES = SEGMENTS.filter((s) => s !== 'logistics') as Exclude<Segment, 'logistics'>[];
/**
 * One KPI x Segment cell: the Segment's first live view, a licence gap (empty kind 3), or no Open source with the
 * i18n key of its reason (`na.<page>.<segment>`, spec section 9).
 */
export type Cell = { view: View } | { na: 'licence' } | { na: 'source'; reason: string };
export function cell(kpi: Kpi, segment: Segment, live: ManifestEntry[] = loadManifest()): Cell {
  if (!kpi.views.some((x) => x.segment === segment)) return { na: 'source', reason: `na.${kpi.page}.${segment}` };
  const view = liveViews(kpi, live).find((x) => x.segment === segment);
  return view ? { view } : { na: 'licence' };
}
/** The greyed placeholder text of a Not available cell. */
export const naText = (c: Exclude<Cell, { view: View }>, lang: Lang) =>
  c.na === 'licence' ? t(lang, 'kpi.not_available.licence') : t(lang, 'na.source', { reason: t(lang, c.reason) });
/** The Home card view: commercial overall at Germany where the KPI has it, else its first live view. */
export function headline(kpi: Kpi, live: ManifestEntry[] = loadManifest()): View | undefined {
  const views = liveViews(kpi, live);
  return views.find((x) => x.segment === 'commercial-overall' && x.geo === 'germany') ?? views[0];
}
/** KPI page URL naming one view, so a compact chart opens the same view in full. */
export const viewHref = (kpi: Kpi, x: View, lang: Lang) => `${href(kpi.page, lang)}?${new URLSearchParams({ segment: x.segment, geo: x.geo, freq: x.freq })}`;
