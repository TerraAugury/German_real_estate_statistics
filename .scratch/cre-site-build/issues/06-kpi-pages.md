# 06: All six KPI pages

**What to build:** Each of the six KPIs has a citable page with a full chart and selectors for Segment, geography and frequency, all reflected in the URL.

**Blocked by:** 01, 04

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 4, 8 and 9.

- [x] Selectors use language-neutral parameters `segment`, `geo`, `freq`; the language switcher keeps them
- [x] City classes labelled as classes; Land level for Construction only; transaction volume 127 series labelled as administrative districts
- [x] Scope Notes (index, City class, combined) and short-history Note with the fixed texts
- [x] Construction shows Destatis (converted to million m2, marked own calculation) beside the Bundesbank G650 series; Germany Destatis figure is the sum of the Länder with the Partial total Note when a Land is missing
- [x] Commercial overall construction shows office and administrative and commercial buildings as two series
- [x] Every chart carries its source line

## Comments

Shipped 2026-11-01. Each KPI page renders every Segment x geography x frequency view at build time (`src/lib/kpis.ts`); a small script shows the view the URL names and rewrites the URL to the view shown (`src/lib/select.ts`). In the default build every Bundesbank-only KPI page shows "Not available: licence for public redisplay not confirmed" (spec section 9, empty kind 3); Construction keeps its Destatis series.

Left for other tickets or the owner:
- Breadcrumbs (spec section 8) are not in this ticket's criteria; they belong with ticket 07's Segment pages.
- A selector state with no series (for example Rent index, office, 7 major cities) shows the nearest view, not a Not available line; the explicit gaps live on the Availability grid (ticket 07).
- Owner decision: `rent-index-*` and `transaction-volume-*` carry no `index` scope, so they get no index Note. The fixed text says "2013 = 100", and their base year is unconfirmed.
- The Construction page is about 0.9 MB, because all 51 views are pre-rendered.
- The Partial total Note is unit-tested but does not show: the current snapshots have no missing Land-years.
- New German strings are unreviewed ([DRAFT]) until the owner records a review.

