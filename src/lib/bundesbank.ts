// Bundesbank SDMX-JSON fetcher. Dataset = dataflow, ids[0] = series key. Keeps the original metadata with the data.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { BBK_API, type ManifestEntry } from './manifest';
import { BadResponse, Unavailable, type Part, type Snapshot } from './snapshot';
import { HttpError, partIds, revised, type Deps } from './pipeline';

const FREQ: Record<string, string> = { A: 'annual', Q: 'quarterly', M: 'monthly' };

export const bundesbankUrl = (m: ManifestEntry) => `${BBK_API}/${m.dataset}/${m.ids[0]}?format=sdmx_json&lang=en`;

let own: Set<string> | undefined;
/** True when a Bundesbank source comment names anyone else; null or empty means the Bundesbank's own series. */
export function isThirdParty(comment: string | null, words = (own ??= new Set((parse(readFileSync('manifest/original-sources.yaml', 'utf8')) as { own: string[] }).own.map((w) => w.toLowerCase())))): boolean {
  return (comment ?? '').split(/[^\p{L}\p{N}]+/u).filter(Boolean).some((w) => !words.has(w.toLowerCase()));
}

/** The "Source of the original data: X." part of a general comment; null when it has none. */
export const originalDataSource = (note: string | null) => note?.match(/Source of the original data:\s*([^.]*)/i)?.[1] ?? null;

/** Parse one SDMX-JSON response into a Part. Throws BadResponse when it is not shaped as expected. */
export function parseSdmx(res: any, m: ManifestEntry, url: string, retrievedAt: string): Part {
  const id = partIds(m)[0];
  const data = res?.data;
  const series = data?.dataSets?.[0]?.series && Object.values<any>(data.dataSets[0].series)[0];
  const times: any[] | undefined = data?.structure?.dimensions?.observation?.[0]?.values;
  if (!series?.observations || !Array.isArray(times)) throw new BadResponse(`${id}: not an SDMX-JSON series response`);

  const attr: Record<string, string | null> = {};
  (data.structure.attributes?.series ?? []).forEach((a: any, i: number) => { attr[a.id] = a.values?.[series.attributes?.[i]]?.name ?? null; });
  const dim = (data.structure.dimensions.series as any[]).find((d) => d.id === 'BBK_STD_FREQ');
  const freq = FREQ[dim?.values?.[0]?.id];
  if (freq !== m.frequency) throw new BadResponse(`${id}: frequency ${freq}, manifest says ${m.frequency}`);

  const idx = Object.keys(series.observations).map(Number).sort((a, b) => a - b);
  if (!idx.length) throw new BadResponse(`${id}: no observations`);
  const period = idx.map((i) => times[i].id as string);
  const value = idx.map((i) => { const v = Number(series.observations[i][0]); return Number.isFinite(v) ? v : null; });
  return {
    name: attr.BBK_TITLE_ENG ?? id, frequency: freq, period, value,
    meta: {
      source: 'Deutsche Bundesbank', url, title: attr.BBK_TITLE_ENG ?? '', unit: attr.BBK_UNIT ?? '',
      unit_mult: Number(attr.BBK_UNIT_MULT ?? 0), decimals: attr.BBK_DECIMALS == null ? null : Number(attr.BBK_DECIMALS),
      comment: attr.BBK_COMM_SRC_ENG ?? null, general_comment: attr.BBK_COMM_GEN_ENG ?? null,
      third_party: isThirdParty(attr.BBK_COMM_SRC_ENG ?? null) || isThirdParty(originalDataSource(attr.BBK_COMM_GEN_ENG ?? null)), valid_from: data.dataSets[0].validFrom ?? null, retrieved_at: retrievedAt,
      sha256: createHash('sha256').update(JSON.stringify(res)).digest('hex'),
    },
  };
}

/** Refresh one Bundesbank series. Returns null when the values are unchanged and the snapshot already carries source metadata. Throws Unavailable on 404/410, BadResponse on a malformed response. */
export async function refreshBundesbank(m: ManifestEntry, old: Snapshot | undefined, { get, now }: Deps): Promise<Snapshot | null> {
  const id = partIds(m)[0], url = bundesbankUrl(m), iso = now.toISOString();
  let res: any;
  try { res = await get(url); } catch (e) {
    if (e instanceof HttpError && (e.status === 404 || e.status === 410)) throw new Unavailable(`${id}: ${(e as Error).message} at ${url}`);
    throw e;
  }
  const next = parseSdmx(res, m, url, iso);
  const prev = old?.parts[id];
  if (prev?.meta && (prev.meta.unit !== next.meta!.unit || prev.meta.unit_mult !== next.meta!.unit_mult))
    throw new BadResponse(`${id}: unit changed from ${prev.meta.unit}/${prev.meta.unit_mult} to ${next.meta!.unit}/${next.meta!.unit_mult}`);
  if (prev?.meta && !old!.fetch_failed && JSON.stringify([prev.period, prev.value]) === JSON.stringify([next.period, next.value])) return null;
  return { retrieved_at: iso, fetch_failed: null, revised_at: prev && revised(prev, next) ? iso : old?.revised_at ?? null, parts: { [id]: next } };
}
