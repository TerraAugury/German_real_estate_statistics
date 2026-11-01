# Data pipeline

Label: wayfinder:grilling
Type: grilling (HITL)
Status: resolved
Blocked by: 06 (resolved)

## Question

How does the build fetch, compute and publish? Settle: refresh cadence per source, caching so DBnomics is not hammered, handling revisions and gaps, source attribution and licence display per chart, how Links are computed and tested at build time (including re-verifying the eight indicator series ids and start dates, the unadjusted OECD confidence series, and the unchecked transaction volume index history), and how provisional series are held back until ticket 08 resolves.

## Answer

The build is a daily GitHub Actions job that fetches from DBnomics into committed snapshots, validates against a hand-written series manifest, computes Links, runs tests and deploys to Cloudflare Pages by direct upload.

**Cadence and caching**
- One cron per day plus manual trigger. Per series, the cheap `indexed_at` is checked first; observations are downloaded only for series whose `indexed_at` moved. No per-source schedules.
- The last response per series is committed as JSON in `data/snapshots/` by the bot. Fetches are sequential, one request per series (about 25), descriptive User-Agent, retry with backoff. No API call at page view.
- Job order: fetch and diff, commit changed snapshots to `main`, run tests, build, deploy. If no snapshot changed, steps build and deploy are skipped. A person's push to `main` runs the same job; pull requests get a preview build with `INCLUDE_PROVISIONAL=1`.

**Failure**
- DBnomics unreachable or a series fetch errors: reuse the last snapshot, record `fetch_failed` with its date, still deploy.
- The build fails only if (a) a series has no snapshot, (b) manifest validation fails (id missing, frequency or start date differs from the manifest), or (c) a Link invariant fails.

**Freshness, revisions, gaps (pipeline only; wording belongs to ticket 11)**
- Recorded per series: `indexed_at`, `retrieved_at`, `last_period`, `stale`. `stale` is true when the last period is older than a per-frequency threshold held in one config file: monthly 150 days, quarterly 240, annual 540. `indexed_at` age alone is not used (the Bundesbank mirror was last indexed June to July 2026, about four months old, while its last periods are current).
- Revisions: DBnomics serves only the latest vintage. Each fetch is diffed against the snapshot; if any value older than the latest period changed, the build logs it and sets `revised_at`. It does not block the build. No vintage archive and no revision view.
- Gaps: null or missing observations stay as gaps (no interpolation). Resampling drops incomplete periods. Link pairing uses only periods where both series have a value; n counts those pairs.

**Series manifest.** One hand-written YAML entry per series: key, provider, dataset, DBnomics series id, publisher, licence name and URL, attribution text, `provisional`, EN and DE title, unit, frequency, seasonal adjustment, resampling rule, change rule, expected start. The build adds first and last period, n, `indexed_at`, `retrieved_at`, `stale`, `revised_at`, `fetch_failed`. The same record builds the chart source line (publisher, DBnomics series id, licence, data-to period; both series on a Link chart) and the Sources & licences row.

**Provisional**
- `provisional: true` removes that series, and every Link using it, from public output when the flag is excluded (the default). Preview builds set `INCLUDE_PROVISIONAL=1`. The production deploy stays disabled until tickets 08 and 14 resolve.
- Meaning widened to "licence not confirmed", for any series, not only the Bundesbank CRE series. At launch these are provisional: BBDZ1 and BBDR1 CRE series, OECD confidence, and the Bundesbank macro indicators (BBSIS, BBIM1, BBNZ1, BBDL1). ECB is verified; Destatis passes (dl-de/by-2-0).
- On a refusal the flag stays and the affected cells become Not available with a licence reason, decided then.
- The source line adds "own calculation" ("eigene Berechnung") wherever the chart shows a derived value (resampled, year-on-year change, Link), as the Destatis licence requires for modifications.

**Links: build tests**
- The Link computation is a plain TypeScript module: resampling, year-on-year change, Spearman with ties, lag shift, minimum overlap, "Link not shown". Unit tests use small fixtures whose expected values were computed independently with scipy and committed. They cover the sign convention (positive lag = indicator earlier).
- Build-time invariants (fail the build): |rho| at most 1; n at or above the minimum on every shown lag; a Link shows only if lag 0 passes. The Links overview table is built from the same results. CI runs tests before every deploy.

**Indicator series re-verified 2026-11-01** (live DBnomics API; id and start date match ticket 06's set)

| Indicator | Series | Freq | First | Last | `indexed_at` |
|---|---|---|---|---|---|
| 10y Bund yield | BUBA/BBSIS `M.I.ZAR.ZI.EUR.S1311.B.A604.R10XX.R.A.A._Z._Z.A` | M | 1972-09 | 2026-06 | 2026-07-04 |
| Euribor 3M | ECB/FM `M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA` | M | 1994-01 | 2026-09 | 2026-10-31 |
| ECB deposit rate (event-dated, not used as an indicator) | ECB/FM `B.U2.EUR.4F.KR.DFR.LEV` | event | 1999-01-01 | 2026-09-16 | 2026-10-31 |
| Corporate loan rate, over EUR 1m | BUBA/BBIM1 `M.DE.B.A2A.D.R.1.2240.EUR.N` | M | 2010-06 | 2026-05 | 2026-07-04 |
| CPI | DESTATIS/61111BM001 `DG.PREIS1` (annual: 61111BJ001) | M | 1991-01 | 2026-09 | 2026-10-13 |
| Real GDP | BUBA/BBNZ1 `Q.DE.N.H.0000.L` (annual `A.`) | Q | 1970-Q1 | 2026-Q1 | 2026-05-23 |
| Unemployment, registered | BUBA/BBDL1 `M.DE.Y.UNE.UBA000.A0000.A01.D00.0.R00.A` (`Q.` variant too) | M | 1991-12 | 2026-06 | 2026-07-01 |
| Construction price index, office buildings / industrial and commercial | DESTATIS/61261BV001 `DG.BAULEISTBW.BPNG1.STEMW1.PRE002` / `BPNG2` | Q | 1958-Q1 | 2026-Q3 | 2026-10-09 |
| OECD business confidence, construction / retail | OECD/DSD_STES@DF_BTS `DEU.M.BCICP.PB.F.Y._Z._Z.N` / `...G47...N` | M | 1985-01 | 2026-05 | 2026-06-10 |

- Every series has dataset and series `updated_at` null, so `indexed_at` is the only freshness signal.
- The ECB policy rate is event-dated (69 observations): forward-fill to daily, then period mean, as ticket 06 says.

**OECD unadjusted confidence.** The series (`...N`) is a percentage balance. Its Link correlates on year-on-year difference in points, not percent (this amends ticket 06's percent rule for balance series); the Methodology page and the series metadata say "not seasonally adjusted".

**Transaction volume index.** `A.B30.N.G800.R0800/R0810/R0820.A` has 18 annual observations (2007 to 2024), so 17 changes, below the 20-pair annual minimum: it gets no Link, only "Link not shown: too few observations (n = 17)". Quarterly price index (53 observations, 49 changes) passes 40 pairs at lag 0 and has 41 at lag +-8.

**Constraints on siblings**
- 08 and new 14 gate the production deploy together. Until both resolve, the public site has no live series from the provisional list.
- 11 trust and framing: the pipeline supplies `stale`, `revised_at`, `fetch_failed`, `provisional`, `last_period` and n per series; the thresholds above are inputs it may change; wording is its own.
- 10 bilingual workflow: the manifest holds EN and DE titles, so it must say who authors them and what a missing translation does at build time.
- 13 legal pages: the Privacy policy mentions GitHub Actions only as build infrastructure; no visitor data flows through it. Cloudflare logs only.
