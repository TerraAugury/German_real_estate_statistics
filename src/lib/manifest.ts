import { parse } from 'yaml';
import { readFileSync, statSync } from 'node:fs';
import { langs, type Lang } from './routes';
import { loadStrings } from './i18n';
import { LOCK_PATH, draft, isPreview, readLock, unreviewedKeys, type Lock } from './review';

export type Localized = { en: string; de: string };
export const SCOPES = ['index', 'city_class', 'combined'] as const;
export const ADJUSTMENTS = ['nsa', 'sa'] as const;
export const RESAMPLING = ['mean', 'none'] as const;
export type SourceKind = 'dbnomics' | 'bundesbank' | 'destatis';
/** Manifest fields with German text; each goes through the review workflow like an interface string. */
const TEXT_FIELDS = ['title', 'unit', 'attribution'] as const;

export interface ManifestEntry {
  /** DBnomics provider code (BUBA, DESTATIS, ...), not the site operator (GLOSSARY: Provider). */
  key: string; dbnomics_provider: string; dataset: string;
  /** Which fetcher serves the series; dbnomics unless the entry says otherwise. Bundesbank: dataset is the dataflow, ids[0] the series key. */
  source: SourceKind;
  /** Leave out the years in which one of the summed parts has no value, instead of a partial total (sections, not Länder). */
  complete_only?: boolean;
  /** Series id; `{land}` is replaced by each code in `laender` (Destatis Land series summed to Germany). */
  ids: string[]; laender: string[]; scale: number; change: 'pct' | 'diff';
  /** The original source credited by name next to the figures (vdpResearch GmbH, bulwiengesa AG): Bundesbank series made by a third party. */
  credit?: string;
  publisher: string; attribution: Localized; licence: { name: string; url: string }; provisional: boolean;
  /** The permission that lets a third-party series go public; without it the series must stay provisional. */
  cleared?: string;
  title: Localized; unit: Localized; frequency: string; expected_start: number;
  seasonal_adjustment: (typeof ADJUSTMENTS)[number]; resampling: (typeof RESAMPLING)[number];
  short_window: boolean; short_window_sentence?: string; scope: (typeof SCOPES)[number][];
}

/** Germany figure is our sum of the Länder: an own calculation. */
export const isDerived = (m: ManifestEntry) => m.laender.length > 1;

/** Manifest text in one language as review strings, keyed `manifest:<key>.<field>`. */
export const manifestStrings = (entries: ManifestEntry[], lang: Lang): Record<string, string> =>
  Object.fromEntries(entries.flatMap((m) => TEXT_FIELDS.map((f) => [`manifest:${m.key}.${f}`, m[f][lang]])));

function build(lock: Lock): ManifestEntry[] {
  const entries = parse(readFileSync('manifest/series.yaml', 'utf8')) as ManifestEntry[];
  for (const m of entries) { m.source ??= 'dbnomics'; m.laender ??= ['']; m.scale ??= 1; m.provisional ??= false; m.change ??= 'pct'; m.scope ??= []; }
  checkEntries(entries, loadStrings('en'));
  const unreviewed = new Set(unreviewedKeys(manifestStrings(entries, 'en'), lock));
  for (const m of entries) for (const f of TEXT_FIELDS) // new objects: YAML anchors share them between entries
    m[f] = { ...m[f], de: draft(m[f].de, unreviewed.has(`manifest:${m.key}.${f}`)) };
  return entries;
}

// The files the committed manifest is built from; a change to any reloads it (so `astro dev` sees edits).
const SOURCES = ['manifest/series.yaml', LOCK_PATH, 'src/i18n/en.yaml'];
let committed: { stamp: string; entries: ManifestEntry[] } | undefined;

/**
 * Every hand-written entry, provisional ones included (fetching and previews need them all). Unreviewed German text
 * carries [DRAFT], judged against `lock`; without one, the committed lock. The committed result is built once while its
 * files are unchanged (a build asks for it hundreds of times) and shared, so callers must not change it.
 */
export function loadAllManifest(lock?: Lock): ManifestEntry[] {
  if (lock) return build(lock);
  const stamp = SOURCES.map((f) => statSync(f, { throwIfNoEntry: false })?.mtimeMs ?? 0).join();
  if (committed?.stamp !== stamp) committed = { stamp, entries: build(readLock()) };
  return committed.entries;
}

/** Everything under review: interface strings plus manifest and Insight text, English side. */
export const reviewStrings = () => ({ ...loadStrings('en'), ...manifestStrings(loadAllManifest(), 'en'), ...insightStrings(loadAllInsights(), 'en') });

// Insights (spec insights section 7): hand-written in manifest/insights.yaml, one entry per curated chart, in page order.
export const HEADLINES = ['spread', 'ratio', 'growth', 'change', 'deviation', 'gap'] as const;
export const DEFLATE = ['flow', 'stock'] as const;
export const ROLES = ['kpi', 'reference', 'deflator'] as const;
export const BETTER = ['higher', 'lower', 'none'] as const;
const INSIGHT_TEXT = ['title', 'measure'] as const;
// Text an Insight may carry or not: the plain-language definition of what its number represents.
const INSIGHT_OPTIONAL = ['definition'] as const;
const INSIGHT_FIELDS = [...INSIGHT_TEXT, ...INSIGHT_OPTIONAL] as const;

export interface InsightEntry {
  /** Section id on the Insights page and the target of KPI-page links. */
  key: string; title: Localized;
  /** The headline measure named in the reading: "The latest {measure} is ...". */
  measure: Localized;
  /** What the Insight's number represents, in general terms (no value, year or direction); shown under the reading. Optional. */
  definition?: Localized;
  headline: (typeof HEADLINES)[number];
  /** Which way is better for an office investor: the Insight's tone follows its verdict through this, never the sign of the number. `none` where it depends on whose side you take. */
  better: (typeof BETTER)[number];
  /** Compare year-on-year percent changes instead of levels. */
  growth: boolean;
  /** Rebase the lines behind the headline to this year = 100 (index and differently-united series). */
  base?: number;
  /** Ratio of two index series: take it after rebasing both to `base`. */
  indexed?: boolean;
  /** growth: deflate the KPI by the reference price level (or, for a spread, by the `deflator` series); `flow` uses its annual average (rents), `stock` its December value (prices). */
  deflate?: (typeof DEFLATE)[number];
  /** Pair the reference of year t - shift with the KPI of year t; the label is `insight.shift.<shift>`. */
  shift?: number;
  /** Caveats shown as Notes under the Insight's chart: interface string keys (`insight.note.<name>`), in order. */
  notes?: string[];
  /** Own heading, chart label and legend for the small chart (`insight.small.<small>.title|label|legend`), where the default names would mislabel its lines. */
  small?: string;
  /** Reading template: `insight.template.<template>` in the interface strings. */
  template: string;
  /** The first KPI series against the first reference series is the headline; the order is the order shown. */
  series: { key: string; role: (typeof ROLES)[number] }[];
}

/** Insight text in one language as review strings, keyed `insight:<key>.<field>`. */
export const insightStrings = (entries: InsightEntry[], lang: Lang): Record<string, string> =>
  Object.fromEntries(entries.flatMap((e) => INSIGHT_FIELDS.filter((f) => e[f]).map((f) => [`insight:${e.key}.${f}`, e[f]![lang]])));

function buildInsights(lock: Lock): InsightEntry[] {
  const entries = parse(readFileSync('manifest/insights.yaml', 'utf8')) as InsightEntry[];
  for (const e of entries) e.growth ??= false;
  const unreviewed = new Set(unreviewedKeys(insightStrings(entries, 'en'), lock));
  for (const e of entries) for (const f of INSIGHT_FIELDS) if (e[f]) e[f] = { ...e[f]!, de: draft(e[f]!.de, unreviewed.has(`insight:${e.key}.${f}`)) };
  return entries;
}

let committedInsights: { stamp: string; entries: InsightEntry[] } | undefined;
/** Every declared Insight, hidden ones included; cached like `loadAllManifest`. The page model applies the Provisional gate. */
export function loadAllInsights(lock?: Lock): InsightEntry[] {
  if (lock) return buildInsights(lock);
  const stamp = ['manifest/insights.yaml', LOCK_PATH].map((f) => statSync(f, { throwIfNoEntry: false })?.mtimeMs ?? 0).join();
  if (committedInsights?.stamp !== stamp) committedInsights = { stamp, entries: buildInsights(readLock()) };
  return committedInsights.entries;
}

/** Insight build checks: any failure fails the build. `kpis` are the Real estate KPI series keys, `series` every manifest key. */
export function checkInsights(entries: InsightEntry[], known: { series: Set<string>; kpis: Set<string> }, en: Record<string, string>): void {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const e of entries) {
    if (seen.has(e.key)) errs.push(`duplicate key ${e.key}`);
    seen.add(e.key);
    for (const l of langs) if (INSIGHT_TEXT.some((f) => !e[f]?.[l])) errs.push(`${e.key} needs en and de title and measure`);
    if (e.definition) for (const l of langs) if (!e.definition[l]) errs.push(`${e.key} needs en and de definition`);
    if (!HEADLINES.includes(e.headline)) errs.push(`${e.key}: headline must be one of ${HEADLINES}`);
    if (!BETTER.includes(e.better)) errs.push(`${e.key}: better must be one of ${BETTER}`);
    if (e.base !== undefined && !Number.isInteger(e.base)) errs.push(`${e.key}: base must be a year`);
    if (e.deflate !== undefined && !DEFLATE.includes(e.deflate)) errs.push(`${e.key}: deflate must be one of ${DEFLATE}`);
    if (e.shift !== undefined && !(`insight.shift.${e.shift}` in en)) errs.push(`${e.key}: no i18n key insight.shift.${e.shift}`);
    for (const f of e.small ? ['title', 'label', 'legend'] : []) if (!(`insight.small.${e.small}.${f}` in en)) errs.push(`${e.key}: no i18n key insight.small.${e.small}.${f}`);
    for (const k of e.notes ?? []) if (!(k in en)) errs.push(`${e.key}: no i18n key ${k}`);
    if (!(`insight.template.${e.template}` in en)) errs.push(`${e.key}: no i18n key insight.template.${e.template}`);
    for (const s of e.series) {
      if (!ROLES.includes(s.role)) errs.push(`${e.key}: role must be one of ${ROLES}`);
      if (!known.series.has(s.key)) errs.push(`${e.key}: unknown series ${s.key}`);
    }
    if (!e.series.some((s) => s.role === 'kpi' && known.kpis.has(s.key))) errs.push(`${e.key}: needs a Real estate KPI series`);
    if (!e.series.some((s) => s.role === 'reference')) errs.push(`${e.key}: needs a reference series`);
  }
  if (errs.length) throw new Error('insights: ' + errs.join('; '));
}

/** Provisional gate (spec section 11): provisional series are out unless this is a preview build. */
export const gate = (entries: ManifestEntry[], includeProvisional: boolean) => (includeProvisional ? entries : entries.filter((m) => !m.provisional));
/** The public manifest: what pages, Links and the Sources page may use. */
export const loadManifest = (includeProvisional = isPreview()) => gate(loadAllManifest(), includeProvisional);

/** A Link survives only if both its series are in the public manifest. */
export function publicLinks<T extends { kpi: string; indicator: string }>(pairs: T[], live: ManifestEntry[] = loadManifest()): T[] {
  const keys = new Set(live.map((m) => m.key));
  return pairs.filter((p) => keys.has(p.kpi) && keys.has(p.indicator));
}

export const BBK_API = 'https://api.statistiken.bundesbank.de/rest/data';
/** What differs between the sources a series can come from, as shown on source lines. */
type SourceInfo = {
  /** Name of the web service a direct source is fetched from. */
  service?: string;
  /** Who the figures were fetched from: DBnomics is an aggregator, the others publish themselves. */
  fetchedFrom: (m: ManifestEntry) => string;
  /** Series id as shown on source lines. The 16 Länder collapse into one range unless one Land is asked for. */
  id: (m: ManifestEntry, land?: string) => string;
  /** Where the series can be checked. */
  url: (m: ManifestEntry, land?: string) => string;
  /** Only the Bundesbank gives a title of the series itself; a GENESIS cube's title lists every measure of the cube. */
  originalTitle: boolean;
};
/** The id of one Land's part in the series (the manifest id with `{land}` filled in). */
export const partId = (m: ManifestEntry, land: string) => m.ids[0].replace('{land}', land);
const landPart = (m: ManifestEntry, land?: string) => partId(m, land ?? (isDerived(m) ? (m.complete_only ? `{${m.laender.join(', ')}}` : `{${m.laender[0]}–${m.laender.at(-1)}}`) : m.laender[0]));
export const SOURCE_INFO: Record<SourceKind, SourceInfo> = {
  dbnomics: {
    fetchedFrom: () => 'DBnomics', originalTitle: false,
    id: (m, land) => `${m.dbnomics_provider}/${m.dataset}/${landPart(m, land)}`,
    // a sum of Länder has no single series, so it links the dataset
    url: (m, land) => `https://db.nomics.world/${m.dbnomics_provider}/${m.dataset}` + (isDerived(m) && !land ? '' : `/${partId(m, land ?? m.laender[0])}`),
  },
  bundesbank: {
    service: 'SDMX Web Service', fetchedFrom: (m) => m.publisher, originalTitle: true,
    id: (m) => `${m.dataset}.${m.ids[0]}`,
    url: (m) => `${BBK_API}/${m.dataset}/${m.ids[0]}?lang=en`,
  },
  destatis: {
    service: 'GENESIS-Online', fetchedFrom: (m) => m.publisher, originalTitle: false,
    id: (m, land) => `${m.dataset}/${landPart(m, land)}`,
    // the GENESIS-Online page of the statistic (cubes have no page of their own)
    url: (m) => `https://genesis.destatis.de/datenbank/online/statistic/${m.dataset.slice(0, 5)}`,
  },
};
export const seriesId = (m: ManifestEntry, land?: string) => SOURCE_INFO[m.source].id(m, land);
export const seriesUrl = (m: ManifestEntry, land?: string) => SOURCE_INFO[m.source].url(m, land);

/** Manifest build checks (spec sections 10, 11); any failure fails the build. */
export function checkEntries(entries: ManifestEntry[], en: Record<string, string>): void {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const m of entries) {
    if (seen.has(m.key)) errs.push(`duplicate key ${m.key}`);
    seen.add(m.key);
    for (const l of langs) if (TEXT_FIELDS.some((f) => !m[f]?.[l])) errs.push(`${m.key} needs en and de title, unit and attribution`);
    if (!(m.source in SOURCE_INFO)) errs.push(`${m.key}: source must be one of ${Object.keys(SOURCE_INFO)}`);
    if (!ADJUSTMENTS.includes(m.seasonal_adjustment)) errs.push(`${m.key}: seasonal_adjustment must be one of ${ADJUSTMENTS}`);
    if (!RESAMPLING.includes(m.resampling)) errs.push(`${m.key}: resampling must be one of ${RESAMPLING}`);
    if (m.short_window !== m.expected_start > 2010) errs.push(`${m.key}: short_window must be ${m.expected_start > 2010} (starts ${m.expected_start})`);
    if (m.short_window_sentence && !(m.short_window_sentence in en)) errs.push(`${m.key}: no i18n key ${m.short_window_sentence}`);
    for (const s of m.scope) if (!SCOPES.includes(s)) errs.push(`${m.key}: unknown scope ${s}`);
  }
  if (errs.length) throw new Error('manifest: ' + errs.join('; '));
}
