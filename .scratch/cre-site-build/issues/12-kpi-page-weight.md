# 12: KPI page weight

**What to build:** A KPI page builds only its first view and that view's Link panels into the live page; every other view and panel waits in a `<template>` and is cloned in when the reader selects it.

**Blocked by:** 08

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 4 and 8. Follow-up from the 2026-11-02 review of ticket 08.

- [x] On first load the page has the initial view and its panels only; the other views and panels sit in `<template>` elements
- [x] Selecting a view (segment, geo, freq) clones its section and panels in, and the result looks and reads the same as today
- [x] A link to a panel (`#link-…`, as used by the Links overview) still opens the right view and scrolls to the panel
- [x] Without JavaScript the initial view, its panels and the "JavaScript is off" message still show, as today
- [x] Budget, checked by a test on the preview build: no KPI page has more than 5,000 elements in its live DOM on first load
- [x] Construction and Price index sizes (HTML, gzipped HTML, live elements) recorded below, before and after

## Notes

- Measured in a preview build (`INCLUDE_PROVISIONAL=1`) before this ticket:
  - Construction: 4.7 MB of HTML, 330 KB gzipped, about 58,600 elements, 289 panels over 51 views, about 850 hidden SVGs.
  - Price index: 2.4 MB of HTML, 250 KB gzipped.
- `<template>` content is not rendered or laid out, so it cuts the live element count and the work the phone does on load. It does not shrink the download. If the gzipped size also needs a budget, the follow-up is one HTML fragment per view, fetched on selection.
- Measured on the same preview build (EN pages) just before and just after this ticket. The "before" row differs from the first bullet (probably other snapshots or another gzip setting; not checked), so compare before and after within this table only. Gzip is Node's default level:

  | Page | HTML | Gzipped | Live elements |
  |---|---|---|---|
  | Construction, before | 4.47 MB | 215 KB | 55,882 |
  | Construction, after | 4.48 MB | 215 KB | 2,116 |
  | Price index, before | 2.37 MB | 189 KB | 27,410 |
  | Price index, after | 2.37 MB | 190 KB | 1,522 |

  As expected, the download is the same size; only the live DOM shrinks.
- The script moves a template's content into the page the first time it is shown, instead of cloning it, and from then on only hides and shows it. So the live DOM grows as a reader browses, up to the old full page. The budget covers first load only.
- A bare `#link-…` with no `?segment=…` still opens the first view, as before. Links overview URLs always carry the query.
- The budget test (`tests/page-weight.test.ts`) reads `dist/`: CI runs it after the preview build. `npm test` skips it when there is no `dist/`, but checks a stale `dist/` if one exists locally.
- Panel ids and the `data-panel` and `data-links` attributes come from `src/pages/[lang]/[...slug].astro` (ticket 08). Keep them, because the Links overview links to them.
- Superseded by ticket 18: the other views are now fetched fragments, and the budget is HTML size per page (300 KB).
