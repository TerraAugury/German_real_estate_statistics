// Snapshot shapes shared by every fetcher. Fields in `SourceMeta` are the series' original metadata, kept as received.

/** The API answered but not as expected (or the frequency or unit changed). Fails the build; never a reason to reuse the snapshot. */
export class BadResponse extends Error {}

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
export interface Snapshot { retrieved_at: string; fetch_failed: string | null; revised_at?: string | null; parts: Record<string, Part> }
