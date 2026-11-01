// Record a human review: tsx scripts/review.ts "<reviewer>" <key | page:<name>> ...  (with no items: list what is unreviewed)
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { allUnreviewed, recordReview } from '../src/lib/review';

const en = parse(readFileSync('src/i18n/en.yaml', 'utf8')) as Record<string, string>;
const [who, ...items] = process.argv.slice(2);
if (!who || !items.length) {
  console.error('usage: tsx scripts/review.ts "<reviewer>" <key | page:<name>> ...');
  console.error(`unreviewed: ${allUnreviewed(en).join(' ') || 'none'}`);
  process.exit(1);
}
recordReview(en, who, new Date().toISOString().slice(0, 10), items);
