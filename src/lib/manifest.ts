import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { langs } from './routes';

export type Localized = { en: string; de: string };
export const SCOPES = ['index', 'city_class', 'combined'] as const;

export interface ManifestEntry {
  key: string; provider: string; dataset: string;
  /** Series id; `{land}` is replaced by each code in `laender` (Destatis Land series summed to Germany). */
  ids: string[]; laender: string[]; scale: number; change: 'pct' | 'diff';
  publisher: string; attribution: Localized; licence: { name: string; url: string }; provisional: boolean;
  title: Localized; unit: Localized; frequency: string; expected_start: number;
  seasonal_adjustment: 'nsa' | 'sa'; resampling: 'mean' | 'none';
  short_window: boolean; short_window_sentence?: string; scope: (typeof SCOPES)[number][];
}

/** Preview builds (INCLUDE_PROVISIONAL=1) include provisional series and show unreviewed German as [DRAFT]. */
export const isPreview = () => process.env.INCLUDE_PROVISIONAL === '1';
/** Germany figure is our sum of the Länder: an own calculation. */
export const isDerived = (m: ManifestEntry) => m.laender.length > 1;

/** Every hand-written entry, provisional ones included (fetching and previews need them all). */
export function loadAllManifest(): ManifestEntry[] {
  const entries = parse(readFileSync('manifest/series.yaml', 'utf8')) as ManifestEntry[];
  for (const m of entries) { m.laender ??= ['']; m.scale ??= 1; m.provisional ??= false; m.change ??= 'pct'; m.scope ??= []; }
  const en = parse(readFileSync('src/i18n/en.yaml', 'utf8')) as Record<string, string>;
  checkEntries(entries, en);
  return entries;
}

/** Provisional gate (spec section 11): provisional series are out unless this is a preview build. */
export const gate = (entries: ManifestEntry[], include: boolean) => (include ? entries : entries.filter((m) => !m.provisional));
/** The public manifest: what pages, Links and the Sources page may use. */
export const loadManifest = (include = isPreview()) => gate(loadAllManifest(), include);

/** A Link survives only if both its series are in the public manifest. */
export function publicLinks<T extends { kpi: string; indicator: string }>(pairs: T[], live: ManifestEntry[] = loadManifest()): T[] {
  const keys = new Set(live.map((m) => m.key));
  return pairs.filter((p) => keys.has(p.kpi) && keys.has(p.indicator));
}

/** DBnomics series id as shown on source lines; the 16 Länder collapse into one range. */
export const dbnomicsId = (m: ManifestEntry) => `${m.provider}/${m.dataset}/`
  + m.ids[0].replace('{land}', isDerived(m) ? `{${m.laender[0]}–${m.laender.at(-1)}}` : m.laender[0]);

/** Manifest build checks (spec sections 10, 11); any failure fails the build. */
export function checkEntries(entries: ManifestEntry[], en: Record<string, string>): void {
  const errs: string[] = [];
  const seen = new Set<string>();
  for (const m of entries) {
    if (seen.has(m.key)) errs.push(`duplicate key ${m.key}`);
    seen.add(m.key);
    for (const l of langs) if (!m.title?.[l] || !m.unit?.[l] || !m.attribution?.[l]) errs.push(`${m.key} needs en and de title, unit and attribution`);
    if (!['nsa', 'sa'].includes(m.seasonal_adjustment)) errs.push(`${m.key}: seasonal_adjustment must be nsa or sa`);
    if (!['mean', 'none'].includes(m.resampling)) errs.push(`${m.key}: resampling must be mean or none`);
    if (m.short_window !== m.expected_start > 2010) errs.push(`${m.key}: short_window must be ${m.expected_start > 2010} (starts ${m.expected_start})`);
    if (m.short_window_sentence && !(m.short_window_sentence in en)) errs.push(`${m.key}: no i18n key ${m.short_window_sentence}`);
    for (const s of m.scope) if (!SCOPES.includes(s)) errs.push(`${m.key}: unknown scope ${s}`);
  }
  if (errs.length) throw new Error('manifest: ' + errs.join('; '));
}
