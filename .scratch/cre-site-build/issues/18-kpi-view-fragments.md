# 18: KPI view fragments

**What to build:** A KPI page holds only its first view and that view's Link panels; every other view is a static HTML fragment, built with the site and fetched by the selector script the first time the reader picks it. Charts share one document instead of building a JSDOM each.

**Blocked by:** 12

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 4 and 8. Follow-up named in ticket 12's notes.

- [x] Each KPI page's first-load HTML is at most 300 KB (`tests/page-weight.test.ts`, on a built `dist/`)
- [x] Selecting a view fetches `/<lang>/fragments/<page>/<n>/`, shows it, and keeps the Link panels in page order
- [x] A Links overview URL (`?segment=…&geo=…&freq=…#link-…`) opens the right view and scrolls to the panel once its fragment arrives; until then the first view shows
- [x] A failed fetch leaves the current view on screen
- [x] Without JavaScript the first view, its panels and the "JavaScript is off" message still show
- [x] Chart rendering builds one JSDOM for the module, not one per chart

## Notes

- Construction before: 7.7 MB HTML (EN), 12 s on the first dev request, about 2.9 s on later ones. After: 270 KB HTML, 31 KB gzipped, about 0.07 s in dev. Price index 4.4 MB to 209 KB. Build takes about 8 s.
- The shared document cut warm dev time for Construction from 2.9 s to 1.1 s on its own; the fragments did the rest.
- A fragment holds the view plus the panels that view shows which are not in the page at load. A panel two views share is in both fragments; the script keeps the first copy it receives (ids are unique in the page). `dist/` grows by about 5 MB.
- Ticket 12's live-element budget is replaced by the size cap: the page no longer holds the other views at all.
