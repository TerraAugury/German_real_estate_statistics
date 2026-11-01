# 08: Links on every KPI page, Links overview and Methodology

**What to build:** Every KPI page carries one Link panel per Economic indicator (eight), a Links overview shows every pair at a glance, and Methodology explains the method.

**Blocked by:** 05, 06

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 5, 6, 8 and 9.

- [x] Eight panels per KPI page including not-shown states; the transaction volume index and annual price index follow the 10-pair annual minimum
- [x] Links overview table of all KPI x indicator pairs with lag-0 co-movement or the not-shown state, each cell deep-linking to its KPI page, built from the same results as the panels
- [x] Methodology page: Link method, the eight indicators, "not seasonally adjusted" for OECD confidence, and "How to read these figures"
- [x] Wording uses Co-movement / Gleichlauf only; never impact, driver, effect

## Comments

Shipped 2026-11-02. `src/lib/links.ts` gives each KPI view its eight pairs (`viewLinks`, the view's first series against each indicator, minus pairs the provisional gate drops) and computes each Link once per build (`linkResult`); KPI pages and the Links overview both read it. Every view of a KPI page has its own panels: each distinct pair renders once and the selector script shows the visible view's eight. The KPI series' Short history Note now carries over to its Link panels (spec section 6, one-cycle caveat on the 2013-based price indices). Methodology is the first prose page (`content/{en,de}/methodology.md`).

Implementer choices and things left for the owner:
- Construction price index and OECD confidence each have two series. A view's Segment picks one: construction prices for office buildings on office views, industrial and commercial buildings on all others; OECD retail confidence on retail views, construction confidence on all others. Construction views pick construction prices by their KPI series' building type instead (review fix, 2026-11-02): Commercial overall leads with office permits, so it pairs with office-building prices. Methodology states the rule.
- The Links overview shows each KPI at its headline view (the Home card view), 6 x 8 cells, not every Segment and geography. Columns for indicators with no public pair are left out, so the default build shows three (Euribor, CPI, construction prices).
- Spec section 6 says lag ±3 of the annual price index is blank. Against Euribor only lag −3 is (9 pairs): Euribor reaches back before 2013, so +3 keeps 12 pairs. The test records the real data.
- Page weight in a preview build: Construction 4.7 MB (330 KB gzipped, 289 panels over 51 views), Price index 2.4 MB (250 KB gzipped).
- Short history Notes are inherited for the KPI side only; spec section 9 limits short-history Notes to KPI pages, section 6 asks for it on price-index Links.
- German Methodology and new strings are unreviewed ([DRAFT]) until the owner records a review.
- Follow-up from the 2026-11-02 review: page weight (Construction about 58,600 elements, about 850 hidden SVGs) needs a budget before launch, for example non-initial views and panels in `<template>`.
