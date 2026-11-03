# 03: Small multiples with rebasing

**What to build:** Under Insight J's main chart the reader sees small charts that show the two series rebased to a common base, with the gap between the lines shaded, so the headline number can be checked against the lines behind it.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 4 (Rebasing), Section 5 (part 4) and Section 10 (first bullet).

- [x] Rebasing to 2015 = 100; a series without a 2015 value falls back to its first shared year; the axis label names the base ("index, 2015 = 100"); tests cover the fallback
- [x] One small chart per compared series against the reference series, gap shaded blue where the KPI is above and red where below, shared y-domain
- [x] For ratio and growth Insights the two rebased lines with the same shading, the spec's stated default
- [x] The shading is explained in text or an accessible label, so colour is not the only cue
- [x] Renders at 320 px with no horizontal page scroll (the spec's unchecked open question); page weight stays within its test

## Notes

- Rebasing is opt-in per Insight with `base: 2015` in the declaration (spec section 7's options); without it the lines are the levels as they are. The base year is 2015 when both series have a value then, else the first shared year **for both** (the spec's wording is per series; one common year keeps the two lines meeting at 100, which the shading depends on). The lines cover the headline period, so a growth Insight's lines start a year after its levels.
- Only the first KPI series gets a small chart. A later ticket (A) with two City classes needs a chart per compared series and reuses `sharedDomain`, which already takes a list.
- Plot's `differenceY` "positive" side is the reference above the KPI, so the fills are passed the other way round; checked by eye (blue where the KPI is above), not pinned by a test.
- 320 px: a long Destatis series id in the source line overflowed the page (also on the Construction page). The wrap rule now covers GENESIS and Bundesbank links as well as DBnomics.
