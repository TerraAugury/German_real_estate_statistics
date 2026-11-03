# 12: Final checks

**What to build:** The design refinement is verified end to end.

**Blocked by:** 10, 11

**Status:** ready-for-human

- [x] vitest, tsc and astro check pass
- [ ] The production build passes, including the review gate and the page-weight test
- [x] No horizontal page scroll at 375 px and 320 px, EN and DE, light scheme
- [ ] The same sweep in the dark scheme (not run; dark was checked by eye at 1024 px and on the German Home at 375 px)
- [ ] The `[DRAFT]` marker appears in no production page
- [x] The glossary has any new term the work introduced (for example the diverging scale or the citation line)
- [x] The branch is reviewed with the code-review skill and its findings are fixed or recorded

## Notes

Run 2026-11-03 on `work`.

- vitest 306 passed; astro check 0 errors (4 pre-existing hints); the preview build (`INCLUDE_PROVISIONAL=1`) builds 31 pages; `PAGE_WEIGHT_STRICT=1` page-weight test passes (12). Home has 493 elements per language, far under the 5,000 limit.
- **Not met: the production build.** `npx astro build` stops at the review gate: German is unreviewed for many items (these 14 new keys, the 67 older ones noted in insights-build ticket 11, manifest text and the Methodology page). Ticket 11 needs a named human; until then this ticket's production-build and `[DRAFT]` boxes stay open. The gate fails the build rather than emitting `[DRAFT]`, so no production page can carry it, but that has not been seen on a built production site.
- Horizontal scroll was measured on all 30 built pages (EN and DE) at 320 px and 375 px in the light scheme, and the header at 110 px or less. It found and fixed three overflows: the Geography select on the price-index page (already too wide at 375 px before this work), long German words in headings and the site name (`hyphens: auto`, `overflow-wrap`), and the nowrap change line. Dark was checked by eye at 1024 px (Home, Links, Availability, a KPI page, Insights) and at 375 px (German Home with the menu open); the layout does not depend on the scheme, and colours are covered by the contrast tests, but the 320/375 px sweep was not repeated in dark.
- Code review (standards and spec axes, subagents) found no hard standards violation. Fixed: a `<details>` inside a `<p>` on the Home index (now a `div`), the unused `spark` field, the unused `DIVERGING` export and its circular test, a `source line` comment, the vague `v` helper and `headline` property names, the repeated first-series lookup (`firstSeries`), stale lock entries, and a missing glossary term (Heat shade). Recorded, not changed: heading sizes follow one scale of named steps but a plate heading (`--step-1`) and a section heading (`--step-2`) differ by role, so ticket 01's "no per-container override" criterion is met by tokens, not by identical sizes; every disclosure item carries its series title (needed to tell several series apart), where ticket 03 said "same wording"; ticket 07 and 09 have no automated test; the Home index rows are written in the page while the hero and Insight index are in panel.ts.
- Status set to `ready-for-human` after code review: what remains (the production build, the `[DRAFT]` check, the dark sweep) waits on ticket 11's named reviewer or on a rerun once German is reviewed.
