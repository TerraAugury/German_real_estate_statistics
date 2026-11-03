# 08: Spread Insights F, E, D and I

**What to build:** Four more Provisional spread Insights, visible in previews: initial yield over the corporate loan rate (F), office vacancy of 7 cities vs 127 towns (E), office rents vs construction costs (D), office rents vs GDP (I).

**Blocked by:** 02, 03, 06

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 2 (catalogue rows F, E, D, I).

- [x] Each Insight declared with its series, shared period (F 2011-2025; E 1995-2025; D and I 2004-2025), EN and DE titles and the spread reading template
- [x] D and I use year-on-year growth of both series before the spread
- [x] Each passes the 10-observation minimum with fixtures and is hidden in production, shown in previews
- [x] Their series are listed in the KPI-page lists (ticket 05) in previews

## Notes

- Insight E has no second KPI role: the 127 towns are its `reference`, so its KPI-page list is the Office vacancy page only (the 7 cities are the `kpi`).
- D and I are growth Insights, so their shared period starts a year after the levels (2005, 21 observations); D and I rebase their small charts to 2015 = 100, F and E show levels in per cent.
- The tests for these four were written together with the declarations, so there was no separate red step.
