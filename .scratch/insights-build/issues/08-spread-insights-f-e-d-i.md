# 08: Spread Insights F, E, D and I

**What to build:** Four more Provisional spread Insights, visible in previews: initial yield over the corporate loan rate (F), office vacancy of 7 cities vs 127 towns (E), office rents vs construction costs (D), office rents vs GDP (I).

**Blocked by:** 02, 03, 06

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 2 (catalogue rows F, E, D, I).

- [ ] Each Insight declared with its series, shared period (F 2011-2025; E 1995-2025; D and I 2004-2025), EN and DE titles and the spread reading template
- [ ] D and I use year-on-year growth of both series before the spread
- [ ] Each passes the 10-observation minimum with fixtures and is hidden in production, shown in previews
- [ ] Their series are listed in the KPI-page lists (ticket 05) in previews
