// Record a human review: tsx scripts/review.ts "<reviewer>" [key | page:<name> ...]  (no keys = everything currently unreviewed or not)
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { recordReview } from '../src/lib/review';

const [who, ...only] = process.argv.slice(2);
if (!who) throw new Error('usage: tsx scripts/review.ts "<reviewer>" [key ...]');
recordReview(parse(readFileSync('src/i18n/en.yaml', 'utf8')), who, new Date().toISOString().slice(0, 10), only.length ? only : undefined);
