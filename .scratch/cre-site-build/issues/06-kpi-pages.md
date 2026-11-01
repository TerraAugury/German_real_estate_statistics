# 06: All six KPI pages

**What to build:** Each of the six KPIs has a citable page with a full chart and selectors for Segment, geography and frequency, all reflected in the URL.

**Blocked by:** 01, 04

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Sections 4, 8 and 9.

- [ ] Selectors use language-neutral parameters `segment`, `geo`, `freq`; the language switcher keeps them
- [ ] City classes labelled as classes; Land level for Construction only; transaction volume 127 series labelled as administrative districts
- [ ] Scope Notes (index, City class, combined) and short-history Note with the fixed texts
- [ ] Construction shows Destatis (converted to million m2, marked own calculation) beside the Bundesbank G650 series; Germany Destatis figure is the sum of the Länder with the Partial total Note when a Land is missing
- [ ] Commercial overall construction shows office and administrative and commercial buildings as two series
- [ ] Every chart carries its source line
