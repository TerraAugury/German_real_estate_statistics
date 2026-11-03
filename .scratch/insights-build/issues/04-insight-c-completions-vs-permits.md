# 04: Insight C: completions vs permits two years earlier

**What to build:** The second public Insight. The reader sees office completions as a ratio of the permits issued two years before, with the headline, verdict, reading and small multiples.

**Blocked by:** 02, 03

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 2 (C) and Section 4 (ratio template).

- [x] Shift transform: moves one series forward by whole years and records it; tests show the shift changing the shared period
- [x] Ratio headline and its reading template ("Completions were {latest} times the permits issued two years earlier, {verdict} the {from}-{to} average of {mean}")
- [x] The permits line is labelled "permits, two years earlier" in both languages
- [x] Production shows exactly J and C; a test pins that no other Insight is public today

## Notes

- Declaration options: `shift: 2` pairs the reference of year t - 2 with the KPI of year t; `insight.shift.<n>` is the label ("two years earlier") and a shift with no label fails the build. A year with a zero reference has no ratio and is left out.
- The template is `completions-permits`; Insight G gets its own ratio template. Ratios show two decimals and the unit "times"; the headline unit key follows the headline kind (`insight.unit.spread`, `insight.unit.ratio`).
- Production shows J and C; a test pins exactly that.
