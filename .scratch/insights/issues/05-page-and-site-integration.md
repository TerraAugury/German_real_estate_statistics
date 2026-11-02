# Insights page and site integration

Label: wayfinder:grilling
Type: grilling (HITL)
Status: open
Blocked by: 03

## Question

How do Insights fit into the existing site? Settle:

- the Insights page: route and slug (EN/DE route table), intro text, nav position, and the empty state when every Insight is Provisional in production
- the links from KPI pages to the Insights that use them: wording and placement
- how Insights are declared: a new hand-written file alongside `manifest/series.yaml`, or entries in it, and the build checks on it
- Notes (stale, revised, fetch failed, short window) at Insight level, and the multi-series source line with "own calculation"
- new i18n keys and the German review flow for reading templates
- `npm run dev` showing Provisional series by default
- the Methodology page section for Insights
