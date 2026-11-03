# 05: "Insights using this KPI" on KPI pages

**What to build:** A reader on a KPI page sees which Insights use that KPI and can jump to them.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 6 (KPI pages).

- [x] Below the Link panels, one link per Insight (title, to its section on the Insights page), only for Insights that pass the Provisional gate; the list is absent when none do
- [x] The list is derived from each Insight's declared series roles, not a second hand-kept list; the spec's mapping (initial yield A, F; rent index B, D, G, I; price index G; office vacancy E, M; construction C, J) is a test fixture
- [x] Production: Construction shows J (and C once ticket 04 lands); a preview build shows every Insight; tests cover both through the Provisional switch

## Notes

- Mapping: a KPI page lists an Insight when one of its `kpi`-role series belongs to that page. Construction prices count as the Construction KPI's series (see ticket 01), so J lists there; D's construction price is a `reference`, so D does not.
- Production: Construction lists C and J (the Insights file is in catalogue order, C before J); no other KPI page has a list yet. The spec's page mapping for all ten Insights is a fixture in `tests/insights.test.ts`, checked for the Insights declared so far.
