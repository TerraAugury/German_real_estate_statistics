# 12: Review the German text

**What to build:** A named human reviews all Insights German so a production build passes. Human task.

**Blocked by:** 11

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 8 and Section 10 (German wording).

- [x] List the unreviewed items with `npx tsx scripts/review.ts`: the `insight.*` strings, the ten German titles and the Methodology prose
- [x] Stamp them with `npx tsx scripts/review.ts "<reviewer>" <items>`; bulk stamping is refused
- [x] A production build passes the German review check

Closed 2026-11-03: reviewed by terra augury in commit 6177f20 (123 items, including `insight.tone.*`, `insights.tone.*` and the Methodology prose). `npx tsx scripts/review.ts` reports `unreviewed: none` and `scripts/check-review.ts` passes.
