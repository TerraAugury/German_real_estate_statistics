// One-off review before switching a dataset: fetch each series from its direct source and compare it with the committed snapshot.
// Usage: tsx scripts/compare.ts <dataset|series-key>   (writes nothing to data/snapshots)
// Bundesbank needs no login; Destatis reads DESTATIS_USER and DESTATIS_PASSWORD (.env or environment).
import { loadAllManifest } from '../src/lib/manifest';
import { makeGet, makePost, refresh } from '../src/lib/pipeline';
import { originalDataSource } from '../src/lib/bundesbank';
import { compareParts, describe, type Comparison } from '../src/lib/compare';
import { loadEnv } from '../src/lib/env';
import { readFileSync } from 'node:fs';

loadEnv();
const want = process.argv[2];
if (!want) throw new Error('usage: tsx scripts/compare.ts <dataset|series-key>');
const direct = { BUBA: 'bundesbank', DESTATIS: 'destatis' } as const;
const deps = { get: makeGet(), post: makePost(), now: new Date() };
for (const m of loadAllManifest().filter((m) => m.dbnomics_provider in direct && (m.dataset === want || m.key === want))) {
  const old = JSON.parse(readFileSync(`data/snapshots/${m.key}.json`, 'utf8'));
  const next = (await refresh({ ...m, source: direct[m.dbnomics_provider as keyof typeof direct] }, undefined, deps))!;
  const total: Comparison = { same: 0, changed: [], added: [], missing: [] };
  for (const [id, part] of Object.entries(next.parts)) {
    if (!old.parts[id]) { console.log(`  !! part id missing in the snapshot: ${id}`); continue; }
    const c = compareParts(old.parts[id], part), tag = m.laender.length > 1 ? id.slice(0, 2) + ' ' : '';
    total.same += c.same;
    total.changed.push(...c.changed.map((x) => ({ ...x, period: tag + x.period })));
    total.added.push(...c.added.map((p) => tag + p));
    total.missing.push(...c.missing.map((p) => tag + p));
  }
  const meta = Object.values(next.parts)[0].meta!;
  console.log(describe(m.key, total) + (meta.third_party ? `  [third party: ${meta.comment ?? originalDataSource(meta.general_comment)}]` : ''));
}
