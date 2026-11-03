# 02: Notes and source lines on Insights

**What to build:** Under each Insight's chart the reader sees its Notes and one source line per series, in the same pattern as a Link panel, so provenance and caveats are never missing.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 6 (Notes).

- [x] Notes come from the one Note module through a new Insight context: the Insight's short-history Note first, then each series' stale, fetch-failed and revised Notes prefixed with the series title; scope Notes (index, City class, combined) appear once
- [x] One source line per series; calculated series (spread, real, rebased, shifted, annual mean) are tagged as own calculation
- [x] A "How this is calculated" link to Methodology
- [x] Note tests cover the Insight context; no Note ordering logic outside the Note module

## Notes

- Notes order follows the spec: short history, each series' Notes named by series, then scope Notes (index, City class, combined) once each. A City class Note names the class of each series, taken from the KPI view that shows it, so two City classes give two Notes.
- Every series on an Insight carries `own calculation` on its source line, as on Link panels: each one feeds a calculated headline.
- The Methodology link points at `#insights`; the section arrives with ticket 06.
- `renderInsight` now takes the Insight's series.
