# 12: KPI page weight

**What to build:** A KPI page builds only its first view and that view's Link panels into the live page; every other view and panel waits in a `<template>` and is cloned in when the reader selects it.

**Blocked by:** 08

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Sections 4 and 8. Follow-up from the 2026-11-02 review of ticket 08.

- [ ] On first load the page has the initial view and its panels only; the other views and panels sit in `<template>` elements
- [ ] Selecting a view (segment, geo, freq) clones its section and panels in, and the result looks and reads the same as today
- [ ] A link to a panel (`#link-…`, as used by the Links overview) still opens the right view and scrolls to the panel
- [ ] Without JavaScript the initial view, its panels and the "JavaScript is off" message still show, as today
- [ ] Budget, checked by a test on the preview build: no KPI page has more than 5,000 elements in its live DOM on first load
- [ ] Construction and Price index sizes (HTML, gzipped HTML, live elements) recorded below, before and after

## Notes

- Measured in a preview build (`INCLUDE_PROVISIONAL=1`) before this ticket:
  - Construction: 4.7 MB of HTML, 330 KB gzipped, about 58,600 elements, 289 panels over 51 views, about 850 hidden SVGs.
  - Price index: 2.4 MB of HTML, 250 KB gzipped.
- `<template>` content is not rendered or laid out, so it cuts the live element count and the work the phone does on load. It does not shrink the download. If the gzipped size also needs a budget, the follow-up is one HTML fragment per view, fetched on selection.
- Panel ids and the `data-panel` and `data-links` attributes come from `src/pages/[lang]/[...slug].astro` (ticket 08). Keep them, because the Links overview links to them.
