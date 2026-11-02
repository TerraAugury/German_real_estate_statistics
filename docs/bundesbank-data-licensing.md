# Bundesbank data: licensing audit and source options

Findings from 2026-11-02. This is an engineering note, not legal advice. Items marked **unverified** were not checked.

## 1. Scope

44 series in `manifest/series.yaml` are `provisional: true` (public-redisplay licence unconfirmed):

- 42 from the Deutsche Bundesbank: datasets `BBDZ1` (38 property series), `BBSIS`, `BBIM1`, `BBNZ1`, `BBDL1`.
- 2 from the OECD (business confidence), not covered here.

The requirement document (ESCB Terms of Use) asks for: source attribution everywhere, original statistics and metadata unmodified, derived data separated, third-party data identified and not redistributed without permission, and no assumption that series stay available.

## 2. What the ESCB terms say

Source: Bundesbank page "Terms of use regarding the reuse of ESCB statistics".

- Public ESCB statistics may be reused free of charge.
- The source must be quoted, for example "Source: ECB statistics".
- Statistics and metadata must stay unaltered and be used in their published format.
- Series may be revised or discontinued.
- Third-party data is excluded unless the originator gave prior permission.
- The terms say nothing about automated access or rate limits.

## 3. Audit of the code against the requirements

The site fetches the Bundesbank series through DBnomics (`src/lib/pipeline.ts`), not from the Bundesbank API.

| # | Gap | Rule |
|---|---|---|
| 1 | The snapshot keeps only name, `indexed_at`, frequency, dimension codes, periods and values. Unit, multiplier, source comment, flags and the raw response are lost. Units shown on the site are hand-written in the manifest. | 2 |
| 2 | Third-party content is controlled only by the manual `provisional` flag. Nothing detects third-party sources automatically. | 4 |
| 3 | Pages show no retrieval date, no "original statistics unmodified" statement, and the licence label reads "public reuse not confirmed". | 1 |
| 4 | Titles and units are the site's own wording, and displayed numbers are rounded by `Intl`. | 2 |
| 5 | Link panels average monthly indicators to quarters or years, but the methodology text calls the overlay "as published". The `derived` flag is never set for Bundesbank series. | 3 |
| 6 | `data/snapshots/*.json` carry no source or terms fields. Preview builds upload provisional series as artifacts. | 1, 2 |
| 7 | A response with no series doc throws `BadResponse` and fails the whole build. HTTP errors are all treated the same way. | 5 |
| 8 | Fetches log to the console only. The snapshot does not store the source URL. | 5 |

Already in place: retries with exponential backoff, stale and failed-fetch notes, "Not available" entries, a 90-day revision note, and the Bundesbank name on every source line. The tests were **not reviewed**.

## 4. DBnomics as the route

- DBnomics data keeps the original provider's terms, so the Bundesbank terms still apply, plus DBnomics' own terms (aggregated datasets under ODbL; whether the committed snapshots count as a database under ODbL is a legal question).
- A DBnomics forum post of 12 Dec 2025 says requests without an API key will get rate limits, then be blocked after a three-month grace period. The start date is not stated. Requests without a key still worked on 2026-11-02. `pipeline.ts` sends no key.
- DBnomics lags the Bundesbank. The Bund yield snapshot has `indexed_at` 2026-07-04 and data to 2026-06. The Bundesbank has data to 2026-10.
- The stale and revised notes say "the source", which with DBnomics in the chain may be wrong.
- No official DBnomics rate limit or fair-use page was found. The "Legal Terms" page could not be read. **Unverified.**

## 5. Direct Bundesbank API: comparison

Checked once, on 2026-11-02, against the committed snapshots, for all 42 Bundesbank series.

- All 42 exist under the same dataset and series ids, with the same frequency and start period. No period in the snapshots is missing at the Bundesbank.
- The Bundesbank is newer: 2026-Q2 for the quarterly price and rent series, 2026-Q2 and Q3 for GDP, and 3 to 4 extra months for the Bund yield, loan rate and unemployment series.
- Values differ in 25 of 42 series (17 identical). Differences look like revisions, for example 168.9 against 168.8 for the Germany total price index in 2025-Q3. Every GDP value differs, which looks like a revision or rebase and was not investigated.
- No API key was needed.

Original sources named in the Bundesbank metadata:

| Series group | Named source |
|---|---|
| Price and rent indices, transaction volume | vdpResearch GmbH |
| Yield, vacancy, combined rent | bulwiengesa AG (Bundesbank calculations) |
| Bundesbank construction series, GDP | Federal Statistical Office (Destatis) |
| Unemployment | Federal Employment Agency (seasonally adjusted) |
| Loan rate | Eurosystem harmonised statistics |
| 10-year Bund yield | none named |

The Bundesbank's own calculations on third-party data may still fall outside the free-reuse permission. **Unverified.**

## 6. API facts

- Base URL: `https://api.statistiken.bundesbank.de/rest`. Data endpoint: `/data/{flow}/{key}`.
- Formats: SDMX-JSON works with `Accept: application/vnd.sdmx.data+json;version=1.0.0`, with `application/json`, or with `format=sdmx_json`. Generic SDMX-ML 2.1 is the default. Structure-specific XML returned 406.
- The JSON carries `BBK_ID`, `BBK_UNIT`, `BBK_UNIT_MULT`, `BBK_DECIMALS`, `BBK_TITLE_ENG`, `BBK_COMM_SRC_ENG` (original source), `TIME_FORMAT`, `WEB_CATEGORY`, a `validFrom` timestamp and the Bundesbank's own `BBK_DIFF` and `BBK_DIFF_Y` changes. Observation values are strings. `lang=en` selects English attributes.
- Status codes: 404 no result, 406 unsupported format, 410 resource no longer supported, 413 retry later, 503 service unavailable.
- `POST /data/tsIdList` returns a ZIP of CSVs, so it does not give JSON. `preparedAfter` gives 404 when nothing is newer, which is the same code as a missing series, so it cannot tell the two apart.
- The documentation page lists no rate limit. **Unverified** beyond that.
- An earlier CSV request was a poor choice. SDMX-JSON is closer to the "lossless original" requirement.

## 7. What stays on DBnomics

Destatis series (construction, CPI, construction price index), Euribor (ECB) and the two OECD series. They were not tested against their own APIs.

## 8. Proposed plan (not started)

1. Add a Bundesbank fetcher for the 42 entries, selected by a `source` field in the manifest. Use `format=sdmx_json&lang=en`, with the existing retry and backoff.
2. Store the raw JSON response unmodified, and extend the snapshot with unit, multiplier, original title, source comment, `validFrom`, source URL and retrieval time.
3. Map status codes: 404 and 410 mark the series unavailable, and 413 and 503 retry. Keep the old snapshot with a note on failure.
4. Flag a series for review when `BBK_COMM_SRC_ENG` names anyone other than the Bundesbank or ESCB, and keep it out of the public site until verified.
5. Source lines: "Source: Deutsche Bundesbank, SDMX Web Service. Retrieved YYYY-MM-DD", with the original title and unit shown.
6. Add mocked-network tests like the existing pipeline tests.

Defaults assumed, not yet confirmed: no DBnomics fallback for Bundesbank series, and raw response files kept out of the repository until the third-party permissions are clear.

## 9. Open questions

- Is DBnomics acceptable as the route, or should the switch happen?
- Do the ESCB terms extend to the vdpResearch, bulwiengesa, Destatis and Federal Employment Agency data? Ask the Bundesbank.
- Is automated access to the SDMX service allowed, and at what rate? Ask the Bundesbank.
- Is showing the original title and unit enough to meet "metadata unaltered" while the site also uses its own wording and rounding?
- Is the repository public, and does that make the snapshots a redistribution?
