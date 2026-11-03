# 02: Latest value and change on plates

**What to build:** Each KPI plate (KPI pages, Home cards, Segment pages) leads with the latest value in large Condensed numerals, its unit and period, and the change since the previous period of the same frequency, with a direction marker that is not colour alone. The change is described, never judged: no "up is good".

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A pure function gives value, period and change (points or percent, following the series' `change` kind) for a Series; a test covers annual, quarterly, percent-unit and a one-observation series
- [ ] The value, unit, period and change show above the chart on every plate; the change has text and a direction glyph, readable without colour
- [ ] A series with fewer than two observations shows the value without a change
- [ ] Numbers use the page locale (EN "3.2%", DE "3,2 %")
- [ ] New strings exist in EN and DE (DE a draft until ticket 11)
- [ ] KPI pages stay within the page-weight limit
