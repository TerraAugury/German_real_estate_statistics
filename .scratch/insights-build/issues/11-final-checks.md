# 11: Final checks

**What to build:** The Insights work is verified against the spec's done criteria and its open questions are closed.

**Blocked by:** 04, 05, 07, 08, 09, 10

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Sections 9 and 10.

- [ ] Production build shows only C and J; `INCLUDE_PROVISIONAL=1` and `npm run dev` show all ten, in catalogue order
- [ ] vitest, tsc, astro check and build pass in production and preview modes
- [ ] Each open question in spec Section 10 is answered in the spec or recorded as out of scope (Home feature and a Links-overview column stay out)
