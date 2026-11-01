// Record a human review: tsx scripts/review.ts "<reviewer>" <key | page:<name> | prefix*> ...  (with no items: list what is unreviewed)
import { allUnreviewed, recordReview } from '../src/lib/review';
import { reviewStrings } from '../src/lib/manifest';

const en = reviewStrings();
const [who, ...items] = process.argv.slice(2);
if (!who || !items.length) {
  console.error('usage: tsx scripts/review.ts "<reviewer>" <key | page:<name> | prefix*> ...');
  console.error(`unreviewed: ${allUnreviewed(en).join(' ') || 'none'}`);
  process.exit(1);
}
recordReview(en, who, new Date().toISOString().slice(0, 10), items);
