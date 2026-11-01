// Build step: production build fails on unreviewed German; preview (INCLUDE_PROVISIONAL=1) lists it and continues.
// A prose page with no German file fails every build: no English fallback ever ships.
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { allUnreviewed, assertReviewed, missingGerman, readProse } from '../src/lib/review';
import { isPreview } from '../src/lib/manifest';

const en = parse(readFileSync('src/i18n/en.yaml', 'utf8')) as Record<string, string>;
const pages = readProse();
const missing = missingGerman(pages);
if (missing.length) throw new Error(`review: no German file for ${missing.map((n) => `content/de/${n}.md`).join(', ')}`);
const un = allUnreviewed(en, pages);
assertReviewed(un, !isPreview());
if (un.length) console.warn(`review: ${un.length} unreviewed German item(s) will show [DRAFT]`);
