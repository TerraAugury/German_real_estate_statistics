# 10: Office employment series and Insight M

**What to build:** The Destatis office-employment series is fetched and a Provisional Insight shows 127-town office vacancy change alongside office employment growth, in previews.

**Blocked by:** 02, 03, 06

**Status:** done

Spec: `.scratch/insights/spec.md`, Sections 2 (M) and 3; research in `.scratch/insights/research/office-employment.md`.

- [x] The persons-in-employment series for WZ 2008 sections K-N (annual, Germany) is added to the series manifest and fetched through the GENESIS fetcher; GENESIS credentials in `.env` are required, and if absent set this ticket to `needs-info`
- [x] A Destatis `0.0` for an unpublished year counts as missing, so M may end in 2024; the pipeline tests cover this and the unavailable case
- [x] Both series plotted as year-on-year change on one axis (vacancy in points, employment in percent); only the vacancy change gets the verdict
- [x] No sum over named cities, so the glossary's City class line stays as it is
- [x] Reading template and EN and DE titles from the catalogue; Methodology gains M's year-on-year paragraph, EN and DE

## Notes

- The series is `office-employment` (cube 13311BJ002, `DG.WZ08-K-N.ERW063`), fetched through the GENESIS fetcher with the login in `.env`: 1991 to 2025, 7,802 thousand persons in 2025, so M runs 1996 to 2025 (the spec's open question about 2025 is answered: K-N has it).
- The "0.0 for an unpublished year" was GENESIS's `..` flag (data still to come), where the cube prints 0. `..` and `...` are now missing values in the cube parser, like `.`; a test pins it. Existing snapshots may hold such zeros: the next CI refresh will replace them and flag the series as revised.
- New headline kind `change`: year-on-year change of the KPI in points, with the reference's growth over the same years as `context`, shown on the same axis in ochre and never given a verdict. Only years with both count.
- Resampling is `none` for an annual series; the manifest test's rule now says so.
- The employment fetch used a scratch script with the same code path as `scripts/fetch.ts` for this one key, so no other snapshot changed.
