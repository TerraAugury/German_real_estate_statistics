# Migrate series fetching from DBnomics to Bundesbank and Destatis

**Status:** ready-for-agent

Basis: `docs/bundesbank-data-licensing.md` (audit 2026-11-02), `.scratch/cre-site/spec.md`, `GLOSSARY.md`.

## Problem Statement

Every series on the site is fetched through DBnomics, a third party between us and the **Provider** of the data. This has four costs:

- DBnomics lags the Bundesbank (the Bund yield snapshot ends 2026-06, the Bundesbank has 2026-10) and shows older values: 25 of 42 Bundesbank series differ from the Bundesbank's current numbers.
- DBnomics announced rate limits and blocking for keyless calls. The pipeline sends no key.
- The snapshot discards unit, multiplier, original title, source comment and flags, and carries no source URL, so the ESCB terms of use (source named, metadata unaltered, third-party data identified, series may disappear) cannot be shown to be met.
- The 42 Bundesbank series are all **Provisional**. They, and every **Link** that uses them, stay off the public site until the licence for public redisplay is confirmed.

## Solution

Fetch the 42 Bundesbank series from the Bundesbank SDMX web service and the 9 Destatis series from GENESIS-Online, chosen per series by a `source` field in the manifest. Each snapshot records where, when and in what original form the data came from. Series whose original source (named in the Bundesbank metadata) is not the Bundesbank or ESCB are flagged for licence review and stay **Provisional**. Euribor and the two OECD series stay on DBnomics. Pages show the real retrieval date and original title and unit.

## User Stories

1. As a site visitor, I want the latest published values, so that I am not looking at data months behind the Bundesbank.
2. As a site visitor, I want values that match the Bundesbank's current revisions, so that figures I cite agree with the source.
3. As a site visitor, I want each chart's source line to name the Bundesbank or Destatis and the date the data was retrieved, so that I know how fresh and how direct it is.
4. As a site visitor, I want the original series title and unit shown beside the site's own wording, so that I can find the series at its source.
5. As a site visitor, I want a **Note** when a series is **Stale**, failed to refresh, or was **Revised**, so that I am not misled; and I want that note to name the real source, not "the source" through an intermediary.
6. As a journalist, I want the methodology to say which values are original and which are our calculation (quarterly or annual averages, the sum of 16 Länder), so that I do not quote a derived figure as published.
7. As an analyst, I want a **Not available** entry, with the reason, when a series is withdrawn at the source, so that a missing chart is explained.
8. As the site owner, I want one manifest field choosing the fetcher per series, so that I can move series one dataset at a time and roll back by editing one line.
9. As the site owner, I want unchanged Euribor and OECD series, so that the migration does not touch what has no direct route yet.
10. As the site owner, I want the raw SDMX-JSON response kept with the snapshot or recorded by hash, so that I can prove what was received. (Where the raw file is stored is gated by decision 9.)
11. As the site owner, I want the snapshot to store unit, multiplier, original title, source comment, `validFrom`, source URL and retrieval time, so that the ESCB "metadata unaltered" requirement can be met.
12. As the site owner, I want a series whose original source is a third party (vdpResearch, bulwiengesa, Federal Employment Agency, Destatis) flagged automatically, so that third-party data is never published by accident.
13. As the site owner, I want a flagged series to stay **Provisional** until I record a confirmed permission, so that the public site never carries unlicensed data.
14. As the site owner, I want Destatis credentials read from the environment and never committed, so that secrets stay out of the repository.
15. As the site owner, I want the build to continue without Destatis credentials by keeping the existing snapshots untouched and logging a warning, so that a missing secret neither breaks builds nor shows charts as failed refreshes.
16. As a maintainer, I want HTTP 404 and 410 from the Bundesbank to mark a series unavailable, and 413 and 503 to retry with backoff, so that a withdrawn series is handled differently from a busy service.
17. As a maintainer, I want one bad series to keep its old snapshot with a failure note instead of failing the whole build, so that one outage does not block the site.
18. As a maintainer, I want an empty or malformed response treated as a failed refresh, so that a blank body cannot overwrite good data.
19. As a maintainer, I want Destatis table ids mapped to the existing series keys in the manifest, so that Links, **Insights** and pages keep working unchanged.
20. As a maintainer, I want a one-off comparison report (new fetcher against committed snapshot) per series, so that I can see which values move before switching.
21. As a maintainer, I want every outgoing request to send the identifying User-Agent, so that the Bundesbank and Destatis can contact us.
22. As a maintainer, I want fetch logs to include the source URL and status, so that failures can be diagnosed.
23. As a reviewer, I want the migration shipped as small tickets (Bundesbank fetcher, snapshot metadata, Destatis mapping, Destatis fetcher, page text, flip flags), so that each lands and is checked on its own.
24. As a **Provider** (Terra Augury Ltd), I want the legal question list sent to the Bundesbank and Destatis answered and recorded, so that **Provisional** can be lifted on evidence.
25. As a translator, I want any new site text in the i18n files, with German **Reviewed** before it goes live, so that the bilingual rule still holds.
26. As a CI user, I want the CI job to run the new fetchers with secrets only where needed, so that previews stay safe.

## Implementation Decisions

1. **Per-series `source` field** in the manifest (`bundesbank`, `destatis`, `dbnomics`; default `dbnomics`). The refresh step picks a fetcher from it. No other branching in the build.
2. **Bundesbank fetcher.** Base `https://api.statistiken.bundesbank.de/rest`, path `/data/{flow}/{key}`, query `format=sdmx_json&lang=en`. No key needed. Reuse the existing retry and backoff and the identifying User-Agent. Observation values arrive as strings and are parsed.
3. **Status handling.** 404 and 410 mean the series is unavailable (existing "Not available" path, old snapshot kept with a note). 413 and 503 retry. Other errors keep the old snapshot and add a failed-refresh note. An empty body is a failure. The Bundesbank's 404 for an unchanged `preparedAfter` is ambiguous, so `preparedAfter` is not used.
4. **Snapshot schema extension** (additive, old snapshots stay readable): source name, source URL, original title, unit, unit multiplier, decimals, original-source comment, `validFrom`, and retrieval time per part. DBnomics-fetched parts leave the new fields empty. The `indexed_at` field stays for DBnomics parts only.
5. **Third-party flag.** The original-source comment is compared with an allow-list (Bundesbank, ESCB, Eurosystem). Anything else sets a review flag on the series. A flagged series cannot be `provisional: false` in the manifest; a manifest check enforces this. This is the automated version of the manual flag and does not remove it.
6. **Destatis fetcher.** GENESIS-Online RESTful-JSON API, `data/cube` (flat CSV) via POST with form parameters; the login is required (confirmed 2026-11-03). Credentials via environment variables. Without them the series is skipped with a warning and its snapshot is untouched (story 15). The cube's update time from `metadata/cube` decides whether the data download can be skipped.
7. **Destatis id mapping.** A one-time catalogue lookup maps each DBnomics dataset (`31111LJ001`, `31121LJ001`, `61111BM001`, `61261BV001`) to a GENESIS table and its dimensions, and checks whether the Länder tables sit in GENESIS-Online or the regional database (`regionalstatistik.de`). The result is recorded in the manifest, not discovered at build time.
8. **Derived data stays separate.** The sum of 16 Länder and the period averaging in Links are labelled as our own calculation on the page. The `derived` flag is set for Bundesbank series that are resampled. Methodology text stops saying "as published" for these.
9. **Raw responses are not committed** to the repository until third-party permissions are clear (default assumed in the audit). The snapshot stores a hash and the source URL. A later ticket may add raw storage.
10. **No DBnomics fallback** for series moved to a direct source. A failed direct fetch keeps the last snapshot and says so; it does not silently switch provider.
11. **Migration order.** Bundesbank series by dataset (`BBDZ1`, `BBSIS`, `BBIM1`, `BBNZ1`, `BBDL1`), then Destatis. Before each flip, the comparison report of story 20 is reviewed; GDP differs entirely and needs an explanation (revision or rebase) first.
12. **Wording.** Source line: "Source: Deutsche Bundesbank, SDMX Web Service. Retrieved YYYY-MM-DD" and the Destatis equivalent with the licence. The licence label on Bundesbank series stays "public reuse not confirmed" until decision 5 clears them.
13. **Glossary.** Use **Provisional**, **Stale**, **Revised**, **Not available**, **Note**, **Provider**. Add "Original source" (the third party named in a series' metadata) to `GLOSSARY.md` when the flag lands.
14. No ADR conflicts found (`docs/adr/` does not exist).

## Testing Decisions

- **One seam:** the refresh step, called with an entry, an old snapshot and an injected `get` (the existing `Deps`). Same as the current pipeline tests. All new behaviour is tested by feeding canned Bundesbank SDMX-JSON and Destatis flat-file responses through this seam and asserting on the returned snapshot and the notes. No real network in tests.
- A good test asserts external behaviour: the snapshot returned, notes raised, and whether the old snapshot is kept. It does not assert request internals beyond URL and headers sent.
- Cases: normal fetch (metadata fields filled), string-to-number parsing, 404/410 unavailable, 413/503 retry then success, empty body, malformed body, missing Destatis credentials, third-party original source sets the review flag, old DBnomics snapshot still loads.
- Manifest tests: a review-flagged series with `provisional: false` fails; every `source` value is known; every direct-source entry has the fields its fetcher needs.
- Page-level: the existing page and note tests cover the new source line and notes via fixtures; add cases rather than new seams.
- Prior art: the pipeline tests and the manifest tests.

## Out of Scope

- Euribor (ECB) and the OECD series; they stay on DBnomics.
- Obtaining the legal permissions, and lifting **Provisional** (this spec only builds the mechanism and the evidence).
- Adding new series or new **Segments**.
- A revision history (the site shows only the latest version).
- Committing raw API responses.
- A DBnomics fallback path.

## Further Notes

- Open questions still with the owner (audit section 9): whether the ESCB terms reach vdpResearch, bulwiengesa, Destatis and Federal Employment Agency data; whether automated access has a rate limit; whether the public repository counts as redistribution; whether GENESIS needs a login. The first Destatis ticket and the Bundesbank enquiry should resolve these before any series is flipped to public.
- The Destatis series are marked `provisional: false` today under dl-de/by-2.0 and need no licence work; the migration is for freshness and provenance only.
- Testing seam (single): the refresh step with injected `get`.
