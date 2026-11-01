import { parse } from 'yaml';
import { readFileSync } from 'node:fs';

export type Localized = { en: string; de: string };

export interface ManifestEntry {
  key: string; provider: string; dataset: string;
  ids: string[]; lands: string[]; scale: number;
  publisher: string; licence: { name: string; url: string }; provisional: boolean;
  title: Localized; unit: Localized; frequency: string; expected_start: number;
}

export function loadManifest(): ManifestEntry[] {
  const entries = parse(readFileSync('manifest/series.yaml', 'utf8')) as ManifestEntry[];
  for (const m of entries) for (const l of ['en', 'de'] as const)
    if (!m.title?.[l] || !m.unit?.[l]) throw new Error(`manifest: ${m.key} needs en and de title and unit`);
  return entries;
}
