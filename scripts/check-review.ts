// Review gate, run by astro build (astro.config.mjs) so no production build skips it: production fails on unreviewed
// German (interface strings, manifest text, prose pages); preview (INCLUDE_PROVISIONAL=1) lists it and continues.
// A prose page with no German file fails every build: no English fallback ever ships.
import { allUnreviewed, assertReviewed, isPreview, missingGerman, readProse } from '../src/lib/review';
import { reviewStrings } from '../src/lib/manifest';

const pages = readProse();
const missing = missingGerman(pages);
if (missing.length) throw new Error(`review: no German file for ${missing.map((n) => `content/de/${n}.md`).join(', ')}`);
const unreviewed = allUnreviewed(reviewStrings(), pages);
assertReviewed(unreviewed, !isPreview());
if (unreviewed.length) console.warn(`review: ${unreviewed.length} unreviewed German item(s) will show [DRAFT]`);
