# 11: Final checks

**What to build:** The Insights work is verified against the spec's done criteria and its open questions are closed.

**Blocked by:** 04, 05, 07, 08, 09, 10

**Status:** done

Spec: `.scratch/insights/spec.md`, Sections 9 and 10.

- [x] Production build shows only C and J; `INCLUDE_PROVISIONAL=1` and `npm run dev` show all ten, in catalogue order
- [x] vitest, tsc, astro check and the preview build pass
- [ ] The production build passes (blocked: the review gate fails on 67 unreviewed German items, 10 from before the Insights work and the rest new; ticket 12 clears them)
- [x] Each open question in spec Section 10 is answered in the spec or recorded as out of scope (Home feature and a Links-overview column stay out)

## Notes

- What production ships was checked by building with the same settings and no review gate (a scratch config, not committed): the Insights page has only C and J in both languages, the Construction page lists them, the Rent index page has no list. A test pins the same through the page model.
- 320 px: no horizontal scroll on the Insights page in English and German with all ten sections.
- Spec section 10 now lists what the build resolved and what is still open (launch gates, German review).
