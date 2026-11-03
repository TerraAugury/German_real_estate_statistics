// Snapshot shapes shared by every fetcher. Fields in `SourceMeta` are the series' original metadata, kept as received.

/** The API answered but not as expected (or the frequency or unit changed). Fails the build; never a reason to reuse the snapshot. */
export class BadResponse extends Error {}

/** The series left its source (Bundesbank 404/410, GENESIS status 104). Handled like any failed refresh: the old snapshot stays. */
export class Unavailable extends Error {}

/** Where a part came from and what the source called it. Absent on parts fetched through DBnomics before direct sources. */
export interface SourceMeta {
  /** Who served the data, e.g. "Deutsche Bundesbank". */
  source: string;
  url: string;
  /** Original title and unit, unaltered. */
  title: string; unit: string; unit_mult: number; decimals: number | null;
  /** Original source named in the metadata (e.g. "vdpResearch GmbH and Bundesbank calculations."); null if none. */
  comment: string | null;
  /** General comment (BBK_COMM_GEN_ENG), where the Bundesbank gives "Source of the original data" for some series; null if none. */
  general_comment: string | null;
  /** True when `comment` or the original data named in `general_comment` is anyone besides the Bundesbank or ESCB: licence review needed before public use. */
  third_party: boolean;
  valid_from: string | null;
  retrieved_at: string;
  /** SHA-256 of the response body as received. */
  sha256: string;
}

/** `dimensions` holds DBnomics' dimension codes; DBnomics has no unit field, so the unit lives there (e.g. `ind: FLC002`). `indexed_at` is DBnomics only. */
export interface Part { name: string; indexed_at?: string; frequency: string; dimensions?: Record<string, string>; period: string[]; value: (number | string | null)[]; meta?: SourceMeta }
/** `unavailable`: when the source stopped providing the series (Bundesbank 404/410, GENESIS 104); the last data stays, with a Note. */
export interface Snapshot { retrieved_at: string; fetch_failed: string | null; unavailable?: string | null; revised_at?: string | null; parts: Record<string, Part> }

export const sameData = (a: Part, b: Part) => JSON.stringify([a.period, a.value]) === JSON.stringify([b.period, b.value]);

/** A direct source that changes a series' unit would silently rescale it: refuse. */
export function checkUnit(id: string, prev: Part | undefined, next: Part): void {
  const a = prev?.meta, b = next.meta!;
  if (a && (a.unit !== b.unit || a.unit_mult !== b.unit_mult)) throw new BadResponse(`${id}: unit changed from ${a.unit}/${a.unit_mult} to ${b.unit}/${b.unit_mult}`);
}
