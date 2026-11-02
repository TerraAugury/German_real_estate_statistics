import { parse } from 'yaml';
import { readFileSync, statSync } from 'node:fs';
import { langs, type Lang } from './routes';
import { loadStrings } from './i18n';
import { LOCK_PATH, draft, isPreview, readLock, unreviewedKeys, type Lock } from './review';

export type Localized = { en: string; de: string };
export const SCOPES = ['index', 'city_class', 'combined'] as const;
export const ADJUSTMENTS = ['nsa', 'sa'] as const;
export const RESAMPLING = ['mean', 'none'] as const;
export const SOURCE_KINDS = ['dbnomics', 'bundesbank', 'destatis'] as const;
/** Manifest fields with German text; each goes through the review workflow like an interface string. */
const TEXT_FIELDS = ['title', 'unit', 'attribution'] as const;

export interface ManifestEntry {
  /** DBnomics provider code (BUBA, DESTATIS, ...), not the site operator (GLOSSARY: Provider). */
  key: string; dbnomics_provider: string; dataset: string;
  /** Which fetcher serves the series; dbnomics unless the entry says otherwise. Bundesbank: dataset is the dataflow, ids[0] the series key. */
  source: (typeof SOURCE_KINDS)[number];
  /** Series id; `{land}` is replaced by each code in `laender` (Destatis Land series summed to Germany). */
  ids: string[]; laender: string[]; scale: number; change: 'pct' | 'diff';
  publisher: string; attribution: Localized; licence: { name: string; url: string }; provisional: boolean;
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

/** Everything under review: interface strings plus manifest text, English side. */
export const reviewStrings = () => ({ ...loadStrings('en'), ...manifestStrings(loadAllManifest(), 'en') });

/** Provisional gate (spec section 11): provisional series are out unless this is a preview build. */
export const gate = (entries: ManifestEntry[], includeProvisional: boolean) => (includeProvisional ? entries : entries.filter((m) => !m.provisional));
/** The public manifest: what pages, Links and the Sources page may use. */
export const loadManifest = (includeProvisional = isPreview()) => gate(loadAllManifest(), includeProvisional);

/** A Link survives only if both its series are in the public manifest. */
export function publicLinks<T extends { kpi: string; indicator: string }>(pairs: T[], live: ManifestEntry[] = loadManifest()): T[] {
  const keys = new Set(live.map((m) => m.key));
  return pairs.filter((p) => keys.has(p.kpi) && keys.has(p.indicator));
}

/** DBnomics series id as shown on source lines; the 16 Länder collapse into one range unless one Land is asked for. */
export const dbnomicsId = (m: ManifestEntry, land?: string) => `${m.dbnomics_provider}/${m.dataset}/`
  + m.ids[0].replace('{land}', land ?? (isDerived(m) ? `{${m.laender[0]}–${m.laender.at(-1)}}` : m.laender[0]));
/** The series page on DBnomics; a sum of Länder has no single series, so it links the dataset. */
export const dbnomicsUrl = (m: ManifestEntry, land?: string) => `https://db.nomics.world/${m.dbnomics_provider}/${m.dataset}`
  + (isDerived(m) && !land ? '' : `/${m.ids[0].replace('{land}', land ?? m.laender[0])}`);

/** Manifest build checks (spec sections 10, 11); any failure fails the build. */
export function checkEntries(entries: ManifestEntry[], en: Record<string, string>): void {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const m of entries) {
    if (seen.has(m.key)) errs.push(`duplicate key ${m.key}`);
    seen.add(m.key);
    for (const l of langs) if (TEXT_FIELDS.some((f) => !m[f]?.[l])) errs.push(`${m.key} needs en and de title, unit and attribution`);
    if (!SOURCE_KINDS.includes(m.source)) errs.push(`${m.key}: source must be one of ${SOURCE_KINDS}`);
    if (!ADJUSTMENTS.includes(m.seasonal_adjustment)) errs.push(`${m.key}: seasonal_adjustment must be one of ${ADJUSTMENTS}`);
    if (!RESAMPLING.includes(m.resampling)) errs.push(`${m.key}: resampling must be one of ${RESAMPLING}`);
    if (m.short_window !== m.expected_start > 2010) errs.push(`${m.key}: short_window must be ${m.expected_start > 2010} (starts ${m.expected_start})`);
    if (m.short_window_sentence && !(m.short_window_sentence in en)) errs.push(`${m.key}: no i18n key ${m.short_window_sentence}`);
    for (const s of m.scope) if (!SCOPES.includes(s)) errs.push(`${m.key}: unknown scope ${s}`);
  }
  if (errs.length) throw new Error('manifest: ' + errs.join('; '));
}
