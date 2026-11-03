# 12: Review the German text

**What to build:** A named human reviews all Insights German so a production build passes. Human task.

**Blocked by:** 11

**Status:** ready-for-human

Spec: `.scratch/insights/spec.md`, Section 8 and Section 10 (German wording).

- [ ] List the unreviewed items with `npx tsx scripts/review.ts`: the `insight.*` strings, the ten German titles and the Methodology prose
- [ ] Stamp them with `npx tsx scripts/review.ts "<reviewer>" <items>`; bulk stamping is refused
- [ ] A production build passes the German review check
