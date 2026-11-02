// One-off review before switching a dataset: fetch each series directly and compare it with the committed snapshot.
// Usage: tsx scripts/compare.ts <dataset|series-key>   (writes nothing to data/snapshots)
import { loadAllManifest } from '../src/lib/manifest';
import { makeGet } from '../src/lib/pipeline';
import { refreshBundesbank, originalDataSource } from '../src/lib/bundesbank';
import { compareParts, describe } from '../src/lib/compare';
import { readFileSync } from 'node:fs';

const want = process.argv[2];
if (!want) throw new Error('usage: tsx scripts/compare.ts <dataset|series-key>');
const deps = { get: makeGet(), now: new Date() };
for (const m of loadAllManifest().filter((m) => m.dbnomics_provider === 'BUBA' && (m.dataset === want || m.key === want))) {
  const old = JSON.parse(readFileSync(`data/snapshots/${m.key}.json`, 'utf8'));
  const next = (await refreshBundesbank({ ...m, source: 'bundesbank' }, undefined, deps))!;
  const [id, part] = Object.entries(next.parts)[0];
  const c = compareParts(Object.values<any>(old.parts)[0], part);
  console.log(describe(m.key, c) + (part.meta!.third_party ? `  [third party: ${part.meta!.comment ?? originalDataSource(part.meta!.general_comment)}]` : ''));
  if (id !== Object.keys(old.parts)[0]) console.log(`  !! part id differs: ${id}`);
}
