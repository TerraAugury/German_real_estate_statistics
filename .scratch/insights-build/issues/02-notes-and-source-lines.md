# 02: Notes and source lines on Insights

**What to build:** Under each Insight's chart the reader sees its Notes and one source line per series, in the same pattern as a Link panel, so provenance and caveats are never missing.

**Blocked by:** 01

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 6 (Notes).

- [ ] Notes come from the one Note module through a new Insight context: the Insight's short-history Note first, then each series' stale, fetch-failed and revised Notes prefixed with the series title; scope Notes (index, City class, combined) appear once
- [ ] One source line per series; calculated series (spread, real, rebased, shifted, annual mean) are tagged as own calculation
- [ ] A "How this is calculated" link to Methodology
- [ ] Note tests cover the Insight context; no Note ordering logic outside the Note module
