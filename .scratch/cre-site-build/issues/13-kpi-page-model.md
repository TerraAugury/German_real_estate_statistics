# 13: KPI page model

**What to build:** The logic of the KPI pages, the Links overview and the Availability grid moves out of `src/pages/[lang]/[...slug].astro` into `src/lib/pages.ts`, which returns plain data with no language in it. The page file translates and renders it. Output is unchanged.

**Blocked by:** 12

**Status:** done

From the 2026-11-02 architecture review (candidate 1, with the panel id from candidate 4 and the geography grouping from candidate 5).

- [x] `kpiPage(kpi)` returns the views with their panel ids, each Link panel once in indicator order with its scope geography, which view and panels are live at load, and the selector options
- [x] `linksOverview()` returns the columns and, per KPI, the cells with their pair and Link result
- [x] `availability()` returns, per KPI and Segment, the cell and the geography groups it covers
- [x] The panel id is defined once, on the pair returned by `viewLinks` (`links.ts`); KPI pages and Links overview anchors both use it
- [x] `geoGroup` (`kpis.ts`) groups geographies for both the geography selector and the Availability grid
- [x] `tests/pages.test.ts` covers the models without a build
- [x] A preview build (`INCLUDE_PROVISIONAL=1`) is byte-for-byte identical before and after
