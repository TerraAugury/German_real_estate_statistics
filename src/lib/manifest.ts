import { parse } from 'yaml';
import { readFileSync } from 'node:fs';

export type Localized = { en: string; de: string };

export interface ManifestEntry {
  key: string; provider: string; dataset: string;
  ids: string[]; lands: string[]; scale: number; change: 'pct' | 'diff';
  publisher: string; attribution: Localized; licence: { name: string; url: string }; provisional: boolean;
  title: Localized; unit: Localized; frequency: string; expected_start: number;
}

/** Every hand-written entry, provisional ones included (fetching and previews need them all). */
export function loadAllManifest(): ManifestEntry[] {
  const entries = parse(readFileSync('manifest/series.yaml', 'utf8')) as ManifestEntry[];
  for (const m of entries) { m.lands ??= ['']; m.scale ??= 1; m.provisional ??= false; m.change ??= 'pct'; }
  checkEntries(entries);
  for (const m of entries) for (const l of ['en', 'de'] as const)
    if (!m.attribution?.[l]) throw new Error(`manifest: ${m.key} needs en and de attribution`);
  const keys = entries.map((m) => m.key);
  const dup = keys.find((k, i) => keys.indexOf(k) !== i);
  if (dup) throw new Error(`manifest: duplicate key ${dup}`);
  return entries;
}

/** Provisional gate (spec section 11): provisional series are out unless INCLUDE_PROVISIONAL=1 (preview builds only). */
export const gate = (entries: ManifestEntry[], include: boolean) => (include ? entries : entries.filter((m) => !m.provisional));
/** The public manifest: what pages, Links and the Sources page may use. */
export const loadManifest = (include = process.env.INCLUDE_PROVISIONAL === '1') => gate(loadAllManifest(), include);

/** A Link survives only if both its series survive the gate. */
export function publicLinks<T extends { kpi: string; indicator: string }>(pairs: T[], entries: ManifestEntry[], include = process.env.INCLUDE_PROVISIONAL === '1'): T[] {
  const live = new Set(gate(entries, include).map((m) => m.key));
  return pairs.filter((p) => live.has(p.kpi) && live.has(p.indicator));
}

/** DBnomics series id as shown on source lines; the 16 Länder collapse into one range. */
export const dbnomicsId = (m: ManifestEntry) => m.lands.length > 1
  ? `${m.provider}/${m.dataset}/{${m.lands[0]}–${m.lands.at(-1)}}.${m.ids[0].split('.').slice(1).join('.')}`
  : `${m.provider}/${m.dataset}/${m.ids[0]}`;

/** Every entry needs both en and de title and unit; always fails the build. */
export function checkEntries(entries: ManifestEntry[]): void {
  for (const m of entries) for (const l of ['en', 'de'] as const)
    if (!m.title?.[l] || !m.unit?.[l]) throw new Error(`manifest: ${m.key} needs en and de title and unit`);
}
