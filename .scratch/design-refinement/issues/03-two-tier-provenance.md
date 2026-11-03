# 03: Two-tier provenance

**What to build:** Every plate (KPI, Home, Segment, Link panel, Insight) shows a short citation line: publisher, licence and data date. Everything else (series id, service, retrieval date, original series and unit) sits in a native details disclosure that works without JavaScript. "Licence not confirmed" shows as a status chip, not as running text.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The short line keeps the licence link to Sources and licences and the "own calculation" marker
- [ ] The details hold every fact the source line holds today, in the same wording; existing source-line tests still pass or move to the details
- [ ] Link panels and Insights keep one citation per series
- [ ] The Provisional licence state is a chip with text, visible on every plate that has it
- [ ] The details open and close by keyboard; focus is visible
- [ ] A plate with the details closed is shorter than today's on Home (no more than two lines of source text at 1024 px)
