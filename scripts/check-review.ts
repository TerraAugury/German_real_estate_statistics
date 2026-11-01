// Build step: production build fails on unreviewed German; preview (INCLUDE_PROVISIONAL=1) lists it and continues.
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { allUnreviewed, assertReviewed, isProduction } from '../src/lib/review';

const en = parse(readFileSync('src/i18n/en.yaml', 'utf8')) as Record<string, string>;
const un = allUnreviewed(en);
assertReviewed(un, isProduction());
if (un.length) console.warn(`review: ${un.length} unreviewed German item(s) will show [DRAFT]`);
