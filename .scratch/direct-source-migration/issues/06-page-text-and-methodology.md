# 06: Source lines, notes and methodology text

**What to build:** Pages show the real source, retrieval date, original title and unit for direct-source series, and the methodology separates original from derived data.

**Blocked by:** 02

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decisions 8, 12, story 3-6, 25.

- [x] Source line reads "Source: Deutsche Bundesbank, SDMX Web Service. Retrieved YYYY-MM-DD" (Destatis equivalent with licence) in EN and DE
- [x] Original title and unit shown beside the site's wording
- [x] Stale, failed and revised notes name the real source rather than "the source"
- [x] `derived` flag set for resampled Bundesbank series and the Länder sum; methodology no longer says "as published" for them
- [x] New German strings marked for review under the existing bilingual workflow
- [x] Page and note tests extended with direct-source fixtures
