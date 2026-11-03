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

> Historical (2026-11-02). Gaps 1, 2, 3 (retrieval date), 5, 7 and 8 were closed by direct-source-migration tickets 01 to 09. See "Gaps remaining" in section 9.

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

Destatis series (construction, CPI, construction price index), Euribor (ECB) and the two OECD series. Euribor and the OECD series were not tested against their own APIs. The Destatis series are covered in section 7a.

## 7a. Destatis series: direct fetch from GENESIS-Online

Nine series come from DBnomics provider `DESTATIS`, all marked `provisional: false` with licence Datenlizenz Deutschland – Namensnennung – 2.0:

| Series | DBnomics dataset | Notes |
|---|---|---|
| Building permits: office, commercial, warehouse | `31111LJ001` | 3 series, each summed from the 16 Länder, annual |
| Building completions: office, commercial, warehouse | `31121LJ001` | 3 series, each summed from the 16 Länder, annual |
| Consumer price index | `61111BM001` | monthly |
| Construction price index: office, commercial | `61261BV001` | 2 series, quarterly |

Findings (2026-11-02):

- The official Destatis page ([GENESIS-Online API and web services](https://destatis.de/EN/Service/OpenData/api-webservice.html)) says GENESIS-Online is free to use without registration, under the licence above, and describes a RESTful/JSON interface. It states no rate limits.
- Third-party client libraries (pystatis, restatis) say the web service needs a registered user, with a username and password or a token. The two statements conflict and the current policy is **unverified**.
- The Swagger documentation at `https://genesis.destatis.de/genesisWS/swagger-ui/index.html` loads the spec `https://genesis.destatis.de/genesisWS/rest/2020/GOJsonApi.json` (OpenAPI 3.0.1, title "GENESIS-Online RESTful-JSON-API").
- Endpoints are POST requests with form-encoded parameters, except `GET helloworld/whoami`, which answered 200 without a login. Data endpoints: `data/table`, `data/tablefile`, `data/timeseries`, `data/cube` and `data/result`. Matching `catalogue`, `metadata` and `find` endpoints exist.
- Every endpoint except `whoami` takes `username` and `password` as headers. The spec marks neither as required and declares no security scheme.
- `data/tablefile` takes `name`, `area` (default `free`), `startyear`, `endyear`, `contents`, `transpose` and `compress`. Responses are `application/octet-stream`, consistent with the flat-file CSV format named on the Destatis page.
- The service host `www-genesis.destatis.de` redirects to `genesis.destatis.de`. The regional database has its own REST host, `www.regionalstatistik.de/genesisws/rest/2020/`, which answered but was not examined.
- The Länder-level permits and completions tables may be in the regional database, not in GENESIS-Online, and the GENESIS table names probably differ from the DBnomics ids (for example `31111-LJ001`). Both are **unverified**.

Decision recorded: the project owner will supply a Destatis username and password for testing. Credentials must never be committed. If a login is needed in production, store it as a CI secret and read it from the environment.

### Results of the live checks (2026-11-03, ticket 07)

- **A login is required.** `catalogue/tables` without credentials answers HTTP 401 ("not authorised"); only `helloworld/whoami` is open. The Destatis page says GENESIS-Online is usable "without registering"; for the API that did not hold in this test. Credentials go in the headers `username` and `password` of a POST. A valid login answers 200. Locally they live in `.env` (`DESTATIS_USER`, `DESTATIS_PASSWORD`, git-ignored), in CI they are secrets of the same names. A password with a `#` must not be read by `process.loadEnvFile` (it treats `#` as a comment); `src/lib/env.ts` reads `.env` without that rule.
- **The DBnomics dataset ids are GENESIS cube names.** `31111LJ001`, `31121LJ001`, `61111BM001` and `61261BV001` work as `name` in `data/cube` on `genesis.destatis.de`, with the same classifying codes as DBnomics (`DLAND`, `BAUBR1`, `BAUTK1`, `BAUGB1`, `DINSG`, `BAUAR1`, ...) and the same measures (`FLC002` and so on). No mapping to table ids like `31111-0100` is needed. The Länder data is in GENESIS-Online, so the regional database is not used.
- **Format:** `data/cube` with `format=csv` returns JSON whose `Object.Content` is a flat CSV: header blocks (`K;DQA` axes, `K;DQZ` time, `K;DQI` measures with unit) and one `D;` row per axis combination holding a value and a quality flag for every measure. `data/tablefile` and `data/table` return a ZIP or a printed table layout and are not used.
- **Time axis:** the cube's time is always the year. For the monthly CPI the month is an axis (`MONAT01`..`MONAT12`); for the construction price index the quarter is the reporting month (`QUARM1`: `MONAT02`, `05`, `08`, `11` stand for Q1 to Q4).
- **Quality flags:** `e` real value, `-` nothing to report (a true zero), `x` secret or not applicable, `.` not known. Only `e` and `-` carry a number; the number shown with `x` or `.` is meaningless.
- **Errors:** a cube that does not exist or is withdrawn answers HTTP 200 with `Status.Code` 104 ("no objects for the selection"); success is `Status.Code` 0. The fetcher must read the body status, not only the HTTP status.
- **Metadata:** `metadata/cube` gives a title (`Content`), the time slices and an `Updated` timestamp; the CSV itself carries the unit but no title.
- **Comparison with the committed snapshots:** permits office, 288 values over 16 Länder and 18 years, identical; completions office, all 16 Länder identical; CPI, 429 months identical; construction price office and commercial, 275 quarters each identical. The DBnomics copies are as current as GENESIS, so the gain of the switch is provenance, not fresher values.
- **Limits:** no rate limit is documented. The login check states that requests running longer than 15 minutes are ended when more than 3 run in parallel. The fetcher runs one request at a time.

## 8. Proposed plan (implemented as direct-source-migration tickets 01 to 06)

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
- Does GENESIS-Online need a login for data calls, and are the Länder-level construction tables there or in the regional database?

### Original source of the 42 Bundesbank series (checked 2026-11-03)

Read from the `BBK_COMM_SRC_ENG` attribute of the Bundesbank SDMX-JSON response for each series in `manifest/series.yaml` (`source: bundesbank`); all 42 answered HTTP 200. The attribute names the originator only. It says nothing about reuse terms, so each third-party row still needs an answer to "do the ESCB terms cover this".

| Source comment | Dataset | Series (manifest keys) | To ask |
|---|---|---|---|
| vdpResearch GmbH and Bundesbank calculations | BBDZ1 | 18: `price-index-{de,cities,excl}-{total,office,retail}-{a,q}` | vdp |
| vdpResearch GmbH | BBDZ1 | 4: `rent-index-de-{office,retail}-{a,q}` | vdp |
| Bundesbank calculations based on price data provided by bulwiengesa AG | BBDZ1 | 9: `rent-index-combined-{127,120,7}`, `initial-yield-combined-{127,120,7}`, `office-vacancy-{127,120,7}` | bulwiengesa |
| Bundesbank calculations based on the extrapolation by vdpResearch GmbH on the basis of purchase price data provided by surveyor committees, excluding share-deals | BBDZ1 | 3: `transaction-volume-{de,127,7}` | vdp, and the surveyor committees as the underlying source |
| Bundesbank calculations based on data provided by the Federal Statistical Office | BBDZ1 | 4: `construction-bbk-{permits,completions}-{office,wholesale-warehouse}` | Destatis |
| Seasonal adjustment based on data provided by the Federal Employment Agency | BBDL1 | 1: `unemployment-rate` | Federal Employment Agency |
| none | BBSIS, BBIM1, BBNZ1 | 3: `bund-yield-10y`, `loan-rate-nfc`, `gdp-real` | `bund-yield-10y` and `loan-rate-nfc`: nothing (their general comment is methodology only). `gdp-real`: its general comment (`BBK_COMM_GEN_ENG`) says "Source of the original data: Federal Statistical Office", so it is third-party and is flagged by the fetcher (`third_party: true`) | Destatis (`gdp-real` only) |

38 of 42 name a third party in `BBK_COMM_SRC_ENG`; `gdp-real` makes 39 through its general comment. Only `bund-yield-10y` and `loan-rate-nfc` look like plain Bundesbank/ESCB series. The fetcher (`isThirdParty`, ticket direct-source-migration/03) already sets `third_party` on these from both fields, and `validateSnapshot` fails the build when a third-party series is not `provisional: true`.

### Gaps remaining (checked 2026-11-03)

- **Rule 1, terms statement.** The source line gives publisher, service, series id and "New data last retrieved {date}", but no page text says "original statistics and metadata used unmodified" or names the ESCB terms (nothing in `src/i18n`). The licence label still reads "public reuse not confirmed" by design until ticket licence-checks/01 clears a series.
- **Rule 1, snapshots.** `data/snapshots/*.json` carry source, url and retrieval time in `meta`, but no attribution or terms field. Whether committing them to a public repository is redistribution is undecided (question above).
- **Rule 2, rounding.** Displayed numbers are rounded by `Intl`. The original title and unit are now shown beside the site's wording; whether that satisfies "metadata unaltered" is undecided (question above).
- **Rule 5, audit trail.** Fetches still log to the console only. The snapshot keeps the source URL and retrieval time, so only a separate run log is missing.
- **Exports.** The site has no CSV, JSON or other download, so the export-attribution rules and tests do not apply yet. Any future export must carry the required block.
- **Not Bundesbank.** `euribor-3m`, `oecd-confidence-construction` and `oecd-confidence-retail` are still on DBnomics without source metadata.
