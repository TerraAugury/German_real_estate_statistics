# 10: Office employment series and Insight M

**What to build:** The Destatis office-employment series is fetched and a Provisional Insight shows 127-town office vacancy change alongside office employment growth, in previews.

**Blocked by:** 02, 03, 06

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Sections 2 (M) and 3; research in `.scratch/insights/research/office-employment.md`.

- [ ] The persons-in-employment series for WZ 2008 sections K-N (annual, Germany) is added to the series manifest and fetched through the GENESIS fetcher; GENESIS credentials in `.env` are required, and if absent set this ticket to `needs-info`
- [ ] A Destatis `0.0` for an unpublished year counts as missing, so M may end in 2024; the pipeline tests cover this and the unavailable case
- [ ] Both series plotted as year-on-year change on one axis (vacancy in points, employment in percent); only the vacancy change gets the verdict
- [ ] No sum over named cities, so the glossary's City class line stays as it is
- [ ] Reading template and EN and DE titles from the catalogue; Methodology gains M's year-on-year paragraph, EN and DE
