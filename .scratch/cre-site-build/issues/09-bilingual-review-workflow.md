# 09: Bilingual review workflow

**What to build:** German can only reach production after a named human has reviewed it, and a change in English flags the German as unreviewed.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Section 10.

- [x] `de.reviewed.lock` stores a hash of each English string at review time; prose pages carry `en_hash` in the German front matter; a mismatch means unreviewed
- [x] Review recorded per file (`reviewed_by`, `reviewed_on`)
- [x] Production build fails on unreviewed German; preview builds show it with a visible "[DRAFT]" marker
- [x] No English fallback ever reaches the public site
- [x] Manifest titles need both `en` and `de`; a changed DBnomics series name logs a warning, a changed id, frequency or unit fails the build

## Notes

- `src/lib/review.ts`; lock `src/i18n/de.reviewed.lock` holds one record per key (`en_hash`, `reviewed_by`, `reviewed_on`). Prose pages: `content/{en,de}/<name>.md`, German front matter carries the same three fields.
- Record a review: `npx tsx scripts/review.ts "<reviewer>" <key | page:<name>> ...`; with no items it lists what is unreviewed. Bulk stamping is refused.
- Every `astro build` runs `scripts/check-review.ts` (integration in `astro.config.mjs`): production fails on unreviewed German; preview (`INCLUDE_PROVISIONAL=1`) shows `[DRAFT]` on interface strings. A prose page with no German file fails every build.
- Unit change: DBnomics has no unit field, so a change in the series dimensions (where unit and measure codes live, e.g. `ind: FLC002`) fails the fetch. Existing snapshots were backfilled with dimensions.
- Open: 31 interface strings await the owner's review (only the ticket-fixed Note and Link texts are seeded). No prose page loader yet, so `[DRAFT]` on prose is for the ticket that adds Methodology/About (08, 10).
- Manifest German (`title`, `unit`, `attribution`) is reviewed like interface strings, keyed `manifest:<key>.<field>` in the lock; unreviewed German shows `[DRAFT]`. A typed prefix such as `manifest:cpi.*` reviews a group in one command.
- A `[DRAFT]` value placed inside another string moves the marker to the front of the outer string.

