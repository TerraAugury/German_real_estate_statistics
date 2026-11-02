# 06: Source lines, notes and methodology text

**What to build:** Pages show the real source, retrieval date, original title and unit for direct-source series, and the methodology separates original from derived data.

**Blocked by:** 02

**Status:** ready-for-agent

Spec: `.scratch/direct-source-migration/spec.md`, decisions 8, 12, story 3-6, 25.

- [ ] Source line reads "Source: Deutsche Bundesbank, SDMX Web Service. Retrieved YYYY-MM-DD" (Destatis equivalent with licence) in EN and DE
- [ ] Original title and unit shown beside the site's wording
- [ ] Stale, failed and revised notes name the real source rather than "the source"
- [ ] `derived` flag set for resampled Bundesbank series and the Länder sum; methodology no longer says "as published" for them
- [ ] New German strings marked for review under the existing bilingual workflow
- [ ] Page and note tests extended with direct-source fixtures
