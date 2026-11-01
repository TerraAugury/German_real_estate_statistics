# 01: Walking skeleton: one live series in EN and DE

**What to build:** A visitor can open `/en/` and `/de/`, reach a Construction page and see one real series charted with its source line, in both languages. The series is Destatis office and administrative construction (non-provisional). The path covers the whole stack once: manifest entry, fetch, committed snapshot, Observable Plot chart, i18n strings, translated route table, footer and Home.

**Blocked by:** None (can start immediately)

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 7, 8, 10 and 11.

- [x] Site builds as a static site with `/en/` and `/de/` page sets that match one-to-one; `/` redirects by browser language and stores nothing
- [x] Route table from the spec is the only source of slugs; a missing entry fails the build
- [x] EN and DE interface strings with identical key sets; build fails on a missing key, empty value or placeholder mismatch
- [x] Formatting goes through `Intl` with the page locale (DE `1.234,5`, EN `1,234.5`)
- [x] One series fetched from DBnomics into a committed snapshot and charted with the source line (publisher, series id, licence, data-to period; "own calculation" where derived)
- [x] No request to any third-party host; fonts and scripts self-hosted
