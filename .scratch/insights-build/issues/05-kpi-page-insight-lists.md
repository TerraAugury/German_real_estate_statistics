# 05: "Insights using this KPI" on KPI pages

**What to build:** A reader on a KPI page sees which Insights use that KPI and can jump to them.

**Blocked by:** 01

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 6 (KPI pages).

- [ ] Below the Link panels, one link per Insight (title, to its section on the Insights page), only for Insights that pass the Provisional gate; the list is absent when none do
- [ ] The list is derived from each Insight's declared series roles, not a second hand-kept list; the spec's mapping (initial yield A, F; rent index B, D, G, I; price index G; office vacancy E, M; construction C, J) is a test fixture
- [ ] Production: Construction shows J (and C once ticket 04 lands); a preview build shows every Insight; tests cover both through the Provisional switch
