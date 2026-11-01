# Spec: German commercial real estate statistics site

Status: assembled from resolved tickets; launch gated on open tickets 08, 14, 15.
Source of truth for decisions: the tickets in `issues/`. This document synthesises them and decides nothing new. Anything a builder would need that no ticket settles is under [Open questions](#16-open-questions). Section headings carry the source ticket as `(T##)`.

Ticket status at assembly:

| Ticket | Subject | Status |
|---|---|---|
| 01, 02, 03, 04, 07 | Research (CRE inventory, indicator inventory, share prices, second sources, core licences) | resolved |
| 05 | Release-one KPI catalogue | resolved |
| 06 | Economic indicator set and Link method | resolved |
| 08 | Written permission to redisplay the Bundesbank CRE series | **open (launch gate)** |
| 09 | Site information architecture | resolved |
| 10 | Bilingual workflow | resolved |
| 11 | Trust and framing | resolved |
| 12 | Data pipeline | resolved |
| 13 | Legal pages content and operator identity | resolved |
| 14 | Licences for the Economic indicator sources | **open (launch gate)** |
| 15 | Legal review of the final legal pages | **open (launch gate)** |

---

## 1. Purpose, audience, scope (map, T05, T09)

A bilingual (EN/DE) static website presenting German commercial real estate Real estate KPIs from Open sources (office, retail, logistics, commercial overall) at national and City class level, and relating them to Economic indicators through Links. Audience: investors, analysts, journalists, academics. Release one is an information site operated by Terra Augury Ltd; no promotional content or sales contact (T13).

Source rule: only Open sources (free, documented API, licence allowing public redisplay). DBnomics first. Never silently mix sources: every chart names its source and licence.

**Out of scope** (map):
- Residential real estate (house price index, rents, mortgages as a market). Macro indicators such as mortgage rates stay in scope only as Economic indicators linked to CRE KPIs.
- Hotel and other segments beyond office, retail, logistics and commercial overall.
- Forecasting and regression models. Links are descriptive only.
- Sources that fail the Open source test: excluded, not scraped or worked around.
- Named-city series: no Open source supplies them; release one shows City classes only (T05). Reopens only if an Open source for named cities appears.
- Listed property company share prices: no Deutsche Börse API or alternative passes the Open source test (T03). Reopens only on written confirmation from Deutsche Börse (data.services@deutsche-boerse.com) that free public display of the delayed feed is allowed.
- Also not in release one (T09): data download, CSV, embeds, cookies, analytics, maps, separate City class or Land pages. BIS and Eurostat series are excluded (T05).

## 2. Glossary terms used (`GLOSSARY.md`)

Use these exactly, EN and DE. German is canonical for translators (T10).

| EN | DE |
|---|---|
| Real estate KPI | Immobilienkennzahl |
| Economic indicator | Wirtschaftsindikator |
| Link (relationship: co-movement) | Verknüpfung (Gleichlauf) |
| Lag | Verschiebung (in Perioden) |
| Segment | Segment |
| City class | Städtegruppe |
| Not available | Nicht verfügbar |
| Open source | Offene Quelle |
| Provisional | Vorläufig |
| Stale | Nicht aktuell |
| Revised | Revidiert |
| Note | Hinweis |
| Reviewed (German text) | Geprüft |
| Provider | Diensteanbieter |

Avoid: correlation as a name for a Link, prediction, impact, driver, effect, lead time, "city level", "missing", "coming soon", "warning", and "disclaimer" for a Note (see GLOSSARY.md `_Avoid_` lines).

## 3. Data sources and licence status (T01, T02, T04, T07, T12, T14)

DBnomics aggregation is ODbL; the underlying data keeps the publisher's licence (T07). Every series has dataset and series `updated_at` null, so `indexed_at` is the only freshness signal (T01, T12).

| Publisher / provider | Used for | Licence status | `provisional` |
|---|---|---|---|
| Statistisches Bundesamt (Destatis) | Construction KPI, CPI, construction price index | Passes. Data licence Germany – attribution – 2.0 (dl-de/by-2-0). Source note: provider, licence name with link, dataset URI where supplied; own calculations and modifications must be marked | no |
| ECB (`ECB/FM`) | Euribor 3M | Verified (T12). Terms wording to be recorded under ticket 14 | no |
| Deutsche Bundesbank, BBDZ1 and BBDR1 CRE series | Price index, rent index, initial yield, office vacancy, transaction volume index | **Unconfirmed**: no named licence; reuse allowed if unaltered and credited "Source: Deutsche Bundesbank", but ESCB policy excludes third-party data without the originator's permission, and the bulwiengesa AG and vdp redistribution terms are unknown. Ticket 08 | **yes** |
| Deutsche Bundesbank, macro: BBSIS, BBIM1, BBNZ1, BBDL1 | Bund yield, corporate loan rate, GDP, unemployment | Unconfirmed. Ticket 14 | **yes** |
| OECD (`OECD/DSD_STES@DF_BTS`) | Business confidence | Terms unread (page returned 403). Ticket 14 | **yes** |
| BIS (`BIS/WS_CPP`) | none in release one | Statistics terms unconfirmed; excluded from release one | n/a |
| Eurostat | none in release one | CC BY 4.0, but excluded (stale mirror; permits by building type optional only) | n/a |

**The `provisional` set at launch** (T12): all BBDZ1 and BBDR1 CRE series, OECD confidence (both series), and the four Bundesbank macro series (BBSIS, BBIM1, BBNZ1, BBDL1). Not provisional: ECB, Destatis.

Meaning of `provisional` (widened by T12 from T05/T06): licence for public redisplay not confirmed, for any series. A provisional series and every Link that uses it are absent from the public build.

**If a licence is refused** (T05, T09, T11, T12; per the assembly brief): the series stays flagged, the affected cells become Not available with the licence reason (section 9 wording), and the Terms are reviewed only if clause 6 depends on the refused licence (T13).

### Rejected sources (T03, T04)
Deutsche Börse (no REST API, redistribution needs paid MDDA); Twelve Data, EODHD (public display forbidden on free plans); Alpha Vantage, Yahoo, Financial Modeling Prep, Stooq (unconfirmed or no usable terms); Destatis GENESIS-Online (every data call 401, fails the no-credentials build test, no rent, yield or vacancy data); ECB (euro-area aggregates only); OECD for CRE (residential only); city open-data portals and Gutachterausschuss data (no open CRE series); broker reports (PDF, no open licence); Bundesbank direct (same data as BBDZ1/BBDR1, not a second source).

## 4. Release-one KPI catalogue and availability (T05)

Six Real estate KPIs. Geography: Germany plus City classes (7 major cities, 120 towns, 127 towns, cities of supra-regional importance), labelled as classes; construction also at Land level (16 Länder).

| # | EN | DE | Unit | Segments | Geography | Frequency |
|---|---|---|---|---|---|---|
| 1 | Commercial property price index | Gewerbeimmobilien-Preisindex | Index, 2013=100 | office, retail, commercial overall | Germany; cities of supra-regional importance; Germany excl. those | Quarterly, annual |
| 2 | Rent index | Mietindex (Neuvermietung) | Index | office, retail (Germany); office and retail combined (City classes) | Germany; 7 / 120 / 127 | Germany quarterly, annual; classes annual |
| 3 | Initial yield | Anfangsrendite | % | office and retail combined | 7 / 120 / 127 | Annual |
| 4 | Office vacancy rate | Büroleerstandsquote | % | office | 7 / 120 / 127 | Annual |
| 5 | Transaction volume index | Transaktionsvolumenindex | Index | commercial overall | Germany; 7 / 127 | Annual |
| 6 | Construction (permits, completions) | Bautätigkeit (Genehmigungen, Fertigstellungen) | Floor space, m2 | office, logistics (warehouse buildings), commercial overall | Germany; 16 Länder | Annual |

**Availability** (Y ships; N/A Not available; combined = office and retail combined):

| KPI | Office | Retail | Logistics | Commercial overall |
|---|---|---|---|---|
| Price index | Y | Y | N/A | Y |
| Rent index | Y (Germany only) | Y (Germany only) | N/A | Y combined (City classes) |
| Initial yield | N/A | N/A | N/A | Y combined (City classes) |
| Office vacancy rate | Y (City classes) | N/A | N/A | N/A |
| Transaction volume index | N/A | N/A | N/A | Y |
| Construction | Y (Land) | N/A | Y (Land) | Y (Land) |

Rules:
- A real gap is an explicit Not available with the reason; a meaningless combination is dropped; nothing is deferred.
- "Office and retail combined" ("Büro und Einzelhandel zusammen") is a scope label, not a Segment. Shown under commercial overall; Not available on office-only and retail-only views.
- Capital growth is not a KPI. The stale bulwiengesa logistics capital growth series (1995–2014) is not shipped; logistics capital value is Not available.
- Retail construction is Not available (no separate building code); the lumped commercial-buildings series appears only under commercial overall.
- Logistics has no Segment page (section 8).

### Series ids (T05 gives datasets; ids and ranges are from `research/dbnomics-cre-inventory.md`, read 2026-11-01)

Bundesbank BBDZ1 ids are `{FREQ}.{GROUP}.N.{SLIDE}.{NAME}.A`; `A.` annual, `Q.` quarterly. All BBDZ1/BBDR1 series are `provisional: true`.

| KPI | Series (provider/dataset) | Range |
|---|---|---|
| Price index, Germany (total / office / retail) | `BUBA/BBDZ1` `A.B10.N.G000.P0100` / `P0102` / `P0104` `.A`, and `Q.` | A 2013–2025; Q 2013-Q1 to 2026-Q1 |
| Price index, cities of supra-regional importance (total / office / retail) | `A.B10.N.G010.P0110` / `P0112` / `P0114` `.A`, and `Q.` | same |
| Price index, Germany excl. those cities (total / office / retail) | `A.B10.N.G020.P0120` / `P0122` / `P0124` `.A`, and `Q.` | same |
| Rent index, Germany (office / retail) | `A.B10.N.G200.P0410` / `P0420`; `Q.` same codes | A 2004–2025; Q 2010-Q1 to 2026-Q1 |
| Rent index, office and retail combined (127 / 120 / 7) | `A.B10.N.G250.P0600` / `P0610` / `P0620.A` | A 1995–2025 |
| Initial yield, office and retail combined (127 / 120 / 7) | `A.B10.N.G300.P0800` / `P0810` / `P0820.A` | A 1995–2025 |
| Office vacancy rate (127 / 7 / 120, order as listed in the research) | `A.B30.N.G850.R1000` / `R1010` / `R1020.A` | A 1995–2025 |
| Transaction volume index (Germany / 127 / 7, order as listed in the research) | `A.B30.N.G800.R0800` / `R0810` / `R0820.A` | A 2007–2024 (18 observations, T12) |
| Construction, permits | `DESTATIS/31111LJ001` (indexed 2026-10-18), annual, by Land; building types `GBD-NW-BV` office/administrative, `GBD-NW-NLW-WL` warehouse buildings, `GBD-NW-NLW-H` commercial buildings | example id `01.BAUART1.BTK-GEB-BST.GBD-NW-NLW-WL.BAU003` runs 2015–2025 |
| Construction, completions | `DESTATIS/31121LJ001` (indexed 2026-06-27), same structure | same |

Latest observations: quarterly 2026-Q1, annual 2025 (BBDZ1/BBDR1 `indexed_at` 2026-06-06 and 2026-06-26).

**Construction, commercial overall** (owner decision, 2026-11-01): shown as two series side by side, office and administrative buildings (`GBD-NW-BV`) and commercial buildings (`GBD-NW-NLW-H`), not summed. Office keeps `GBD-NW-BV`; Logistics keeps `GBD-NW-NLW-WL`. Each series is labelled with its building type. Whether the codes overlap is still to be checked on the Destatis API when the manifest is written.

**Construction, Destatis Land series** (owner decisions, 2026-11-01; ids checked on the live API): `DESTATIS/31111LJ001` (permits) and `DESTATIS/31121LJ001` (completions), series `{Land 01–16}.BAUART1.BTK-GEB.{building type}.FLC002`. Scope `BTK-GEB` (new buildings plus work on existing buildings) is the only scope shown. Measure `FLC002` useful floor space, native unit thousand m2, shown converted to million m2 so it matches the Bundesbank G650 series (the conversion is a marked own calculation). Building types and first/last years (identical for permits and completions): `GBD-NW-BV` office and administrative 2008–2025 (18 annual observations); `GBD-NW-NLW-H` commercial buildings 2015–2025 (11); `GBD-NW-NLW-WL` warehouse buildings 2015–2025 (11). **DBnomics has no Germany total** for any of these (16 Land series only), so the Germany figure on the Destatis side is the sum of the 16 Länder, marked "own calculation" / "eigene Berechnung". Consequence for Links (annual minimum 10, section 6): `GBD-NW-BV` (17 changes) passes at every lag; `H` and `WL` (11 observations, 10 changes) pass at lag 0 only if no value is missing, and every other lag is blank; a Land with any missing year shows "Link not shown". The Bundesbank G650 Germany series (34 observations) passes at all lags while not refused.

**Construction, Germany-level Bundesbank series** (owner decision, 2026-11-01; extends T05): `BUBA/BBDZ1` `A.B30.N.G650.R0200` (permits, office and administrative), `R0210` (permits, wholesale, retail and warehouses), `R0220` (completions, office and administrative), `R0230` (completions, wholesale, retail and warehouses); floor space; Germany only; annual 1992–2025 (34 observations, `Q.` variants from 2010-Q1). All `provisional`. The office pair sits under Office and Commercial overall; the lumped wholesale/retail/warehouse pair appears only under Commercial overall (T05 rule for lumped series), labelled by its building group. They sit beside the Destatis Land series on the Construction KPI page, with their own source line. Unit: million m2 of floor space (checked 2026-11-01: DBnomics metadata states no unit, but the sum of the 16 Länder in Destatis 31111LJ001, office and administrative buildings, new and existing, useful floor space `FLC002`, 2024, is 3,030 thousand m2, and `G650.R0200` for 2024 is 3.031). Destatis Land series are in thousand m2, so the two Construction sources use different units and must be converted or labelled separately. If the Bundesbank permission is refused they become Not available like the other Bundesbank KPIs.

**Fallback if the Bundesbank CRE series are refused** (T05): Destatis construction KPIs remain. T05 also names BIS as a price-index fallback; see Open question 5.

## 5. Economic indicator set (T06, T12)

Eight indicators (ten series; see Open question 8). Nothing from the stale Eurostat mirror. Series ids and start dates re-verified 2026-11-01 on the live DBnomics API (T12):

| # | Indicator | Series | Freq | First | Last | `indexed_at` | `provisional` |
|---|---|---|---|---|---|---|---|
| 1 | 10-year Bund yield | `BUBA/BBSIS` `M.I.ZAR.ZI.EUR.S1311.B.A604.R10XX.R.A.A._Z._Z.A` | M | 1972-09 | 2026-06 | 2026-07-04 | yes |
| 2 | Euribor 3M, monthly average (stands in for the event-dated ECB policy rate) | `ECB/FM` `M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA` | M | 1994-01 | 2026-09 | 2026-10-31 | no |
| 3 | New-business loan rate, non-financial corporations, over EUR 1m | `BUBA/BBIM1` `M.DE.B.A2A.D.R.1.2240.EUR.N` | M | 2010-06 | 2026-05 | 2026-07-04 | yes |
| 4 | Consumer price index | `DESTATIS/61111BM001` `DG.PREIS1` (annual: `61111BJ001`) | M | 1991-01 | 2026-09 | 2026-10-13 | no |
| 5 | Real GDP | `BUBA/BBNZ1` `Q.DE.N.H.0000.L` (annual `A.`) | Q | 1970-Q1 | 2026-Q1 | 2026-05-23 | yes |
| 6 | Registered unemployment rate | `BUBA/BBDL1` `M.DE.Y.UNE.UBA000.A0000.A01.D00.0.R00.A` (a `Q.` variant exists) | M | 1991-12 | 2026-06 | 2026-07-01 | yes |
| 7 | Construction price index, office buildings / industrial and commercial buildings | `DESTATIS/61261BV001` `DG.BAULEISTBW.BPNG1.STEMW1.PRE002` / `BPNG2` | Q | 1958-Q1 | 2026-Q3 | 2026-10-09 | no |
| 8 | OECD business confidence, construction / retail (substitute for the absent ifo) | `OECD/DSD_STES@DF_BTS` `DEU.M.BCICP.PB.F.Y._Z._Z.N` / `...G47...N` | M | 1985-01 | 2026-05 | 2026-06-10 | yes |

Not an indicator: ECB deposit rate `ECB/FM` `B.U2.EUR.4F.KR.DFR.LEV` (event-dated, 69 observations, 1999-01-01 to 2026-09-16), used only to document the event-series rule.

Dropped (T06): Bank Lending Survey (too short), insolvencies, residential indices, wage rates, HICP rents, BBDZ1 lending volumes (same licence caveat as the KPIs).

OECD confidence is unadjusted (`N`) and a percentage balance; the Methodology page and series metadata say "not seasonally adjusted" (T12).

## 6. Link method (T06, amended by T12, T11)

A Link = levels overlay + Spearman rank correlation on changes + lag profile, computed at build time, worded as co-movement ("Gleichlauf").

- **Pairs.** Every KPI × indicator pair passing the minimum overlap is offered; no curated "driver" list. A failing pair is shown, never hidden: "Link not shown: too few observations (n = ...)". With the annual minimum at 10 (amends T06 and T12): the annual price index (12 changes) now gets a Link (lag 0 and ±1, ±2 only; ±3 has 9 pairs and is blank), and the transaction volume index (18 observations, 17 changes) now gets a Link at all lags ±3 (14 pairs at the widest), reversing T12's "n = 17" not-shown example. Quarterly price and rent indices and annual class-level KPIs also get Links. The quarterly price index has 53 observations and 49 changes: passes 40 pairs at lag 0 and has 41 at lag ±8.
- **Geography.** Links for every geography in the catalogue (Germany, City classes, Länder). Every Link says "national indicator against [geography]".
- **Frequency.** Native KPI frequency; nothing upsampled. Indicator resampled down: rates, indices, levels = period mean; flows = period sum (none in the set yet); event-dated series forward-filled to daily, then period mean. Calendar years; incomplete periods dropped.
- **Transformation.** Overlay shows levels. Correlation uses changes: year-on-year percent change for indices and money amounts; percentage-point difference for rates; annual change for annual Links. **Amendment (T12 amends T06):** balance series (OECD confidence) use year-on-year difference in points, not percent.
- **Measure.** Spearman with ties, always shown with n and period. No p-values or stars.
- **Lag.** Quarterly: −8 to +8, step 1. Annual: −3 to +3, step 1. Positive lag = the indicator moved earlier than the KPI.
- **Minimum overlap.** Per lag, at least 40 paired observations (quarterly) or 10 (annual); a lag below the minimum is blank. A Link shows only if lag 0 passes. **Amendment (owner decision, 2026-11-01; reduces T06's annual minimum of 20 and changes T12's build invariant and examples accordingly):** the annual minimum is 10. Spearman on 10 to 12 pairs is weak evidence; the wording (co-movement, n and period always shown, no significance) carries the caution, and the owner added one fixed Note, "Small sample", for annual Links with n below 20 at lag 0 (section 9). The minimum is one constant in the Link module; tests and the build invariant use it.
- **Headline** is lag 0. Full lag profile as a bar chart with the strongest lag marked and the note "strongest of N lags tested; chosen after looking at the data, so likely overstated". The site never states a lead time as a finding.
- **Wording.** "Co-movement" / "Gleichlauf"; never impact, driver, effect, Einfluss, Treiber. Lead and lag read "moved earlier / later" ("lief voraus / lief nach"). Under every Link chart (not only the footer):
  - EN: "This shows how two series moved together over [period] (n = [n]). It does not show that one causes the other, and it is not a forecast."
  - DE: "Dargestellt ist, wie sich zwei Reihen im Zeitraum [Zeitraum] (n = [n]) gemeinsam entwickelt haben. Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose."
- **Short-window caveat** on Links over the Bundesbank 2013-based price indices: the fixed Short history Note text in section 9 (T11 replaced T06's placeholder).
- **Provisional.** Links inherit `provisional` from either series; computed in the build, absent from public output while flagged, dropped if refused. Destatis construction Links with non-provisional indicators (Euribor, CPI, construction price index) are unaffected.
- **Own calculation.** The source line adds "own calculation" ("eigene Berechnung") wherever a derived value is shown (resampled, year-on-year change, Link) (T12).

## 7. Stack (map, already chosen)

Astro static site; build-time fetch from the DBnomics API; Observable Plot (owner decision, 2026-11-01; charts render as SVG, interactivity limited to tooltips, crosshair and re-render on selector change; no built-in zoom or brush); scheduled rebuild via GitHub Actions cron; Cloudflare Pages by direct upload (T12). Link computation is a plain TypeScript module (T12). Fonts and scripts self-hosted; no request to any third-party host (T13 build rule). No API call at page view.

## 8. Page set, navigation, URLs (T09, T10)

18 pages per language, identical in `/en/` and `/de/`.

- **Home** (1): one-paragraph purpose, six KPI cards (national headline chart, latest value and period), Segment entry points.
- **Segment pages** (3): Office, Retail, Commercial overall. One compact national chart per KPI in catalogue order, each linking to its KPI page; Not available KPIs as greyed placeholders "Not available: no Open source for [reason]". Logistics has no Segment page (its warehouse Construction series is on the Construction KPI page; the gap is stated on Availability).
- **KPI pages** (6): canonical, citable. Full chart; selectors for Segment, geography (Germany; the four City classes where the KPI has them; 16 Länder for construction only) and frequency, all reflected in the URL; source line; one Link panel per Economic indicator (eight), including "Link not shown" panels. No separate City class or Land pages, no map.
- **Links overview** (1): table of all KPI × indicator pairs showing lag-0 co-movement or the not-shown state; each cell deep-links to the KPI page; no full charts.
- **Availability** (1): the full KPI × Segment grid with the reason for each Not available cell; linked from footer and every Segment page.
- **Methodology** (1): Link method, the eight indicators, "How to read these figures" (section 9), "not seasonally adjusted" for OECD confidence.
- **Sources & licences** (1): one row per series: publisher, DBnomics series id, licence, attribution.
- **About** (1): names the operator.
- **Legal** (3): Terms and conditions, Privacy policy, Impressum (EN label "Legal notice", T13).

**Navigation.** Header: Home, Segments (dropdown of three), KPIs (dropdown of six), Links, Availability, Methodology, language switch. Footer: Sources & licences, About, Terms, Privacy, Impressum ("Legal notice" in EN). Breadcrumbs on Segment and KPI pages.

**URLs.** Prefix `/en/` and `/de/`. `/` redirects by `Accept-Language`, stores nothing. Slugs are translated through one route table (page key → slug per language), e.g. `/en/segments/office` and `/de/segmente/buero`; a missing entry fails the build and the two page sets must match one-to-one. Selector parameters `segment`, `geo`, `freq` and their values are language-neutral English keys; the language switcher goes to the same page in the other language and passes them through unchanged. No cookies, no analytics, no consent banner.

**Route table** (owner approved 2026-11-01; German slugs ASCII, ä ö ü as ae oe ue):

| Page | EN | DE |
|---|---|---|
| Home | `/en/` | `/de/` |
| Segment: Office / Retail / Commercial overall | `/en/segments/office`, `/retail`, `/commercial-overall` | `/de/segmente/buero`, `/einzelhandel`, `/gewerbe-gesamt` |
| KPI: Price index | `/en/kpis/price-index` | `/de/kennzahlen/preisindex` |
| KPI: Rent index | `/en/kpis/rent-index` | `/de/kennzahlen/mietindex` |
| KPI: Initial yield | `/en/kpis/initial-yield` | `/de/kennzahlen/anfangsrendite` |
| KPI: Office vacancy rate | `/en/kpis/office-vacancy` | `/de/kennzahlen/bueroleerstand` |
| KPI: Transaction volume index | `/en/kpis/transaction-volume` | `/de/kennzahlen/transaktionsvolumen` |
| KPI: Construction | `/en/kpis/construction` | `/de/kennzahlen/bautaetigkeit` |
| Links overview | `/en/links` | `/de/verknuepfungen` |
| Availability | `/en/availability` | `/de/verfuegbarkeit` |
| Methodology | `/en/methodology` | `/de/methodik` |
| Sources & licences | `/en/sources` | `/de/quellen` |
| About | `/en/about` | `/de/ueber-uns` |
| Terms | `/en/terms` | `/de/nutzungsbedingungen` |
| Privacy | `/en/privacy` | `/de/datenschutz` |
| Legal notice / Impressum | `/en/legal-notice` | `/de/impressum` |

## 9. Notices (T09, T11, T12)

**Source and licence line** under every chart on every page, inside the chart container so a screenshot keeps it:
"Source: [publisher], DBnomics series [id] / Licence: [name] / Data to [last period]". The series id links to the series on DBnomics, the licence to Sources & licences. Link charts list both series and carry the co-movement sentence. Add "own calculation" / "eigene Berechnung" for derived values. Built from the series manifest. DE wording of the line is authored in the build phase (Open question 9).

**No provisional notice on any live view.** The `provisional` flag keeps flagged series out of the public build (section 11).

**Disclaimer.** Only in the Terms (clause 2). No footer line, banner or KPI-page notice. Short form, fixed:
- EN: "For information only. This site presents public statistics and is not investment, tax or legal advice, and not an offer or recommendation to buy or sell any asset. Figures come from third-party sources and may be incomplete, delayed or revised."
- DE: "Nur zur Information. Diese Seite stellt öffentliche Statistiken dar und ist keine Anlage-, Steuer- oder Rechtsberatung und kein Angebot und keine Empfehlung zum Kauf oder Verkauf von Vermögenswerten. Die Zahlen stammen von Dritten und können unvollständig, verspätet oder revidiert sein."

**Notes.** One line each, inside the chart container above the source line, prefixed "Note" / "Hinweis" (not colour or icon alone). Fixed order: scope, short history, small sample, stale, fetch failed, revised. All shown, never collapsed. Plain, descriptive tone: no "warning", no exclamation marks, no emoji.

| Note | Shown when | EN | DE |
|---|---|---|---|
| Scope: index | index series | "Index (2013 = 100): shows change over time, not a price level in euros." | "Index (2013 = 100): zeigt die Entwicklung, nicht ein Preisniveau in Euro." |
| Scope: City class | City class geography | "Aggregate for [class], not an individual city." | "Aggregat für [Klasse], keine einzelne Stadt." |
| Scope: combined | office and retail combined | "Office and retail combined; no separate office or retail figure." | "Büro und Einzelhandel zusammen; keine getrennten Werte." |
| Short history | manifest `short_window` (series starting after 2010) | "Short history ([start] to [end])." plus, only on the Bundesbank 2013-based price indices: "this window contains essentially one interest-rate cycle, so the pattern may not hold in other periods." | "Kurze Zeitreihe ([Beginn] bis [Ende])." plus: "Der Zeitraum umfasst im Wesentlichen einen Zinszyklus; das Muster muss in anderen Zeiträumen nicht gelten." |
| Small sample (Link panels only) | Annual Link whose n at lag 0 is below 20 (owner decision, 2026-11-01; adds to T11) | "Based on only [n] annual observations. With a sample this small the pattern may be coincidental." | "Auf nur [n] Jahresbeobachtungen beruhend. Bei so kleiner Stichprobe kann das Muster zufällig sein." |
| Stale | `stale` | "Latest observation: [period]. The source has not published newer data within the expected interval, so this series may be out of date." | "Letzte Beobachtung: [Zeitraum]. Die Quelle hat innerhalb des erwarteten Zeitraums keine neueren Daten veröffentlicht; die Reihe ist möglicherweise nicht aktuell." |
| Fetch failed | `fetch_failed`, until next successful fetch | "Could not refresh from DBnomics on [date]; showing data retrieved on [date of last snapshot]." | "Aktualisierung über DBnomics am [Datum] fehlgeschlagen; dargestellt sind die am [Datum] abgerufenen Daten." |
| Revised | 90 days after `revised_at` | "The source revised earlier values; detected [date]. This chart shows the latest published version." | "Die Quelle hat frühere Werte revidiert (festgestellt am [Datum]). Dargestellt ist die zuletzt veröffentlichte Fassung." |

The Small sample wording is a draft for the owner to approve (the owner chose the Note and its trigger, not the exact text). The cycle sentence is carried by the series (manifest sentence key), not the short-history rule. Dates inside Notes are written out ("1 November 2026" / "1. November 2026"); periods follow section 10.

**Where Notes appear.** KPI pages: all. Link panels: inherit the Notes of both series, each prefixed with the series title; a stale or fetch-failed series does not suppress its Link. Home cards and Segment compact charts: only stale and fetch failed (Home also shows the latest period beside the value). Scope, short-history and revised Notes appear on KPI pages only.

**Three kinds of empty, kept distinct** (never "missing" or "coming soon"):
1. "Not available: no Open source for [reason]" (T05, T09).
2. "Link not shown: too few observations (n = ...)" (T06).
3. If a licence is refused: "Not available: licence for public redisplay not confirmed" / "Nicht verfügbar: Lizenz für die öffentliche Wiedergabe nicht bestätigt" (T11).

**Methodology "How to read these figures"** (T11): DBnomics is an aggregator and the publishers are not responsible for this site; derived values are our own calculation; the site shows only the latest vintage and keeps no revision history; the Bundesbank CRE series are compiled from third-party data (bulwiengesa, vdp); points to Sources & licences. No claim that the series are valuation-based.

## 10. Bilingual workflow and build rules (T10; T13 for legal pages)

- **Source language.** English. German is a machine draft at most; only German reviewed by a named human ships. Reviewer: the project owner. Review recorded per file (`reviewed_by`, `reviewed_on`).
- **Where text lives.**
  - Series data: manifest holds `title: {en, de}`, the `short_window` sentence key and scope keys. City class names and Not available reasons are keyed enums defined once with EN and DE.
  - Interface strings and Notes: `src/i18n/en.yaml` and `de.yaml`, identical key sets. Placeholders are plain `{name}` with the same placeholder set in EN and DE per key. No ICU or plural library.
  - Prose pages (Methodology, About, legal pages): one Markdown file per page per language, e.g. `content/en/methodology.md`, `content/de/methodology.md`. No translation service, no database.
  - The Note, disclaimer short-form and Link texts fixed by T06 and T11 are seeded as already reviewed.
- **Slugs.** Section 8.
- **Formatting.** All through `Intl` with the page locale, including chart axes and tooltips. DE `1.234,5` and `3,2 %` (no-break space); EN `1,234.5` and `3.2%`. Periods "Q1 2026" in both languages; annual "2026"; months and years via `Intl`.
- **Legal pages (T13 reverses T10 for them).** English is binding; German is a reviewed translation, written in plain German for German visitors. They follow the ordinary EN-first flow, same files, review record and production build rule. (T10's DE-authoritative rule for Impressum, Privacy and Terms no longer applies.) Methodology and About are EN-first.
- **Sync.** Interface strings: committed `de.reviewed.lock` stores a hash of each English string at the time its German was reviewed. Prose pages carry `en_hash` of the English file in the German file's front matter. A mismatch means the German is unreviewed. Reviewing updates the lock or hash and nothing else.
- **Build behaviour.**
  - Always fails: missing key, empty value, placeholder mismatch, missing route-table entry, a manifest entry without both `en` and `de`.
  - Production build also fails on unreviewed German (no review record or hash mismatch).
  - Preview builds (`INCLUDE_PROVISIONAL=1`) show unreviewed German with a visible "[DRAFT]" marker.
  - No fallback to English ever reaches the public site.
- **Source-provided names.** Every title shown is our manifest title in EN and DE; a DBnomics series or dataset name is never displayed. Publisher names are proper nouns shown the same in both languages (German form where one exists, e.g. "Deutsche Bundesbank"); DBnomics ids stay untranslated. The snapshot stores the DBnomics name; a change logs a warning listing the series for a human to re-check titles. A change in id, frequency or unit fails the build (T12).
- **Strings fixed in tickets** are the Link sentence, the Notes (the Small sample Note excepted: owner-chosen, wording draft pending approval), the disclaimer short form, the licence-refused Not available text, and the glossary terms. All other UI strings (navigation labels, source line, "Link not shown", "Not available: no Open source for [reason]" in DE, Not available reasons, "strongest of N lags tested" in DE, the Methodology and About text) are authored in the build phase under this workflow.

## 11. Data pipeline (T12)

**Cadence and caching.** One GitHub Actions cron per day plus manual trigger; no per-source schedules. Per series the cheap `indexed_at` is checked first; observations are downloaded only for series whose `indexed_at` moved. The last response per series is committed as JSON in `data/snapshots/` by the bot. Fetches are sequential, one request per series (about 25), descriptive User-Agent, retry with backoff.

**Job order.** Fetch and diff → commit changed snapshots to `main` → run tests → build → deploy to Cloudflare Pages by direct upload. If no snapshot changed, build and deploy are skipped. A person's push to `main` runs the same job. Pull requests get a preview build with `INCLUDE_PROVISIONAL=1`. CI runs tests before every deploy.

**Failure.** DBnomics unreachable or a series fetch errors: reuse the last snapshot, record `fetch_failed` with its date, still deploy. The build fails only if (a) a series has no snapshot, (b) manifest validation fails (id missing; frequency or start date differs from the manifest), or (c) a Link invariant fails.

**Series manifest.** One hand-written YAML entry per series: key, provider, dataset, DBnomics series id, publisher, licence name and URL, attribution text, `provisional`, EN and DE title, unit, frequency, seasonal adjustment, resampling rule, change rule, expected start; plus the `short_window` flag with its extra sentence key and scope keys (T11, T10). The build adds: first and last period, n, `indexed_at`, `retrieved_at`, `stale`, `revised_at`, `fetch_failed`. The same record builds the chart source line and the Sources & licences row. The manifest build step also checks `title.en`/`title.de`, `short_window` and scope keys, and warns on a changed DBnomics name (T10).

**Staleness thresholds** (one config file; unchanged by T11): `stale` is true when the last period is older than monthly 150 days, quarterly 240 days, annual 540 days. `indexed_at` age alone is not used (the Bundesbank mirror was last indexed June to July 2026 while its last periods are current).

**Revisions.** DBnomics serves only the latest vintage. Each fetch is diffed against the snapshot; if any value older than the latest period changed, the build logs it and sets `revised_at`. It does not block the build. No vintage archive, no revision view. The Revised Note shows for 90 days after `revised_at`.

**Gaps.** Null or missing observations stay gaps (no interpolation). Resampling drops incomplete periods. Link pairing uses only periods where both series have a value; n counts those pairs.

**Tests and invariants.**
- Link module: resampling, year-on-year change, Spearman with ties, lag shift, minimum overlap, "Link not shown". Unit tests use small fixtures whose expected values were computed independently with scipy and committed. They cover the sign convention (positive lag = indicator earlier).
- Build-time invariants (fail the build): |rho| ≤ 1; n at or above the minimum on every shown lag; a Link shows only if lag 0 passes. The Links overview table is built from the same results.
- Manifest validation as under Failure (b).

**Provisional gate.** `provisional: true` removes the series and every Link using it from public output when the flag is excluded (the default). `INCLUDE_PROVISIONAL=1` includes them (preview builds only). The production deploy stays disabled until tickets 08, 14 and 15 resolve.

## 12. Legal pages: outline and owner-supplied facts (T13)

Not legal advice. No legal text is drafted in this spec. The build phase drafts EN then German from this outline; the owner records review per file.

**Frame.** Provider and GDPR controller: Terra Augury Ltd (Cyprus). GDPR applies in full; complaint authority: the Cyprus Commissioner for Personal Data Protection. Terms governed by Cypriot law, consumers' mandatory local rights unaffected, no jurisdiction clause against consumers. German law (DDG section 5) is not assumed to bind a Cyprus provider; the Impressum is kept anyway as the page German readers expect. English binding (section 10).

**Impressum / "Legal notice".** Fields: company name and legal form; address; Cyprus registration number and the Registrar of Companies; VAT number if registered; directors or authorised representative; email (plain text, no mailto, role mailbox) plus phone as second contact; named person responsible for content (cautious nod to MStV section 18(2), flagged for the reviewer, not asserted as required). Address: postcode and city only, chosen by the owner to limit spam and scams. Accepted risk: EU rules ask for a geographic address, so this is likely non-compliant; fallback is the registered office address from the Cyprus register.

**Privacy policy.** Controller Terra Augury Ltd and contact; server logs (IP, time, URL, user agent) at Cloudflare as processor with its DPA and transfer basis (Data Privacy Framework or standard contractual clauses); legal basis Art. 6(1)(f); retention as set by Cloudflare; no cookies, no local storage, no analytics, no third-party requests; the language redirect reads `Accept-Language` and stores nothing; email enquiries processed only to reply; outbound links (DBnomics, publishers) lead to separate controllers; rights Art. 15–21; complaint to the Cyprus Commissioner; no obligation to provide data, no automated decisions; privacy contact if different.

**Terms and conditions** (ten clauses): (1) scope and provider; (2) the fixed short-form disclaimer, EN and DE (section 9); (3) no warranty on completeness, accuracy, timeliness, data from third parties; (4) no endorsement by source publishers or DBnomics, derived values (Links) are our own calculation; (5) liability limited only as mandatory law permits; (6) data and attribution: Sources & licences governs each series; charts and figures may be reused with the source line kept and a link to the site; no open licence for the site's own text in release one; (7) external links; (8) changes to the Terms; (9) Cypriot law, consumer rights unaffected; (10) severability. If 08 or 14 end in a refusal the affected series leaves the site; the Terms change only if clause 6's reuse permission depends on a refused licence.

**Facts the owner must supply** (private, uncommitted facts file; none are in the repo, map, tickets or this spec): company name and legal form; registered address (or the postcode and city chosen above); registration number; VAT number if any; directors; responsible person; general email; phone; privacy email.

## 13. Launch gates

They gate the production deploy, not the build or this spec. Until all three resolve, the production deploy stays disabled and the public site has no live series from the provisional list; preview builds use `INCLUDE_PROVISIONAL=1`.

| Ticket | Gate | Status | If refused or no reply |
|---|---|---|---|
| 08 | Written confirmation from the Bundesbank statistics service (and where needed bulwiengesa AG and vdp) that BBDZ1 and BBDR1 may be redisplayed publicly with attribution, including commercial use; record the BIS "Terms of permitted use of BIS statistics" verbatim | open | Affected series stay `provisional`; their cells become Not available with the licence reason; their Links drop |
| 14 | Primary-page confirmation of redisplay terms for OECD, Bundesbank macro (BBSIS, BBIM1, BBNZ1, BBDL1) and ECB (record wording); licence name, attribution and commercial limits go into Sources & licences | open | Same treatment for the affected indicator |
| 15 | Lawyer review (Cyprus- or EU-qualified, reads German; or Cypriot lawyer plus German-language check) of Terms, Privacy and Impressum in EN and DE. Reviewer rules on: postcode-and-city-only address, MStV section 18(2), Cypriot provider-information duties, Cloudflare transfer basis, the Terms reuse clause and any effect of 08 and 14. The owner records the review per file | open | n/a; deploy waits |

Note: with every provisional series held back, the only live content would be the Destatis construction KPI with Links to Euribor, CPI and the Destatis construction price index. The tickets accept this as the pre-launch state.

## 14. Done criteria for the build handoff

- All always-fail checks in section 10 and the failure rules in section 11 implemented and tested.
- Production build excludes `provisional` series and their Links; preview includes them with "[DRAFT]" German markers where unreviewed.
- Every chart shows its source line; every Link chart shows the co-movement sentence; every empty state is one of the three kinds.

## 15. Ticket index

Research: [01](issues/01-dbnomics-cre-inventory.md), [02](issues/02-dbnomics-economic-indicators.md), [03](issues/03-deutsche-boerse-share-prices.md), [04](issues/04-second-sources-for-cre-gaps.md), [07](issues/07-licences-for-core-sources.md). Decisions: [05](issues/05-release-one-kpi-catalogue.md), [06](issues/06-economic-indicator-set-and-link-method.md), [09](issues/09-site-information-architecture.md), [10](issues/10-bilingual-workflow.md), [11](issues/11-trust-and-framing.md), [12](issues/12-data-pipeline.md), [13](issues/13-legal-pages-content.md). Open gates: [08](issues/08-licence-permission-for-cre-series.md), [14](issues/14-licences-for-indicator-sources.md), [15](issues/15-legal-review.md).

## 16. Open questions

None of these is decided here. Each needs an owner decision (or a build-time lookup where noted) before or during the build.

1. ~~Chart library~~ Decided by the owner: Observable Plot (see section 7).
2. ~~Construction series ids and measure~~ Decided/checked: commercial overall shows `GBD-NW-BV` and `GBD-NW-NLW-H`; Destatis scope `BTK-GEB`, measure `FLC002`, converted to million m2; Germany = sum of 16 Länder (section 4). Still open: how a Germany sum treats a year where one Land value is missing (`NA`); no ticket or owner decision says.
3. ~~BBDZ1 G600/G650~~ Decided by the owner: `G650.R0200/R0210/R0220/R0230` added as Germany-level Construction series (section 4). `G600` (permit index, not m2) is not used. Unit checked: million m2 (see section 4).
4. **Code-to-geography mapping.** Checked against series names 2026-11-01: rent `G250.P0600/P0610/P0620` = 127 / 120 / 7; yield `G300.P0800/P0810/P0820` = 127 / 120 / 7; vacancy `G850.R1000/R1010/R1020` = 127 / 7 / 120; transaction volume `G800.R0800/R0810/R0820` = Germany / 127 / 7. The section 4 table is correct. One snag: the transaction `R0810` series is "127 administrative districts" (Kreise), not "127 towns and cities", so it needs its own City class label. BBDR1 holds only RegioStaR price-index classes (`A.5R51`…); the catalogue geographies do not need them, so no BBDR1 series ship unless the owner adds them.
5. **Fallback if the Bundesbank CRE series are refused.** Owner decision: keep the Bundesbank data in the spec as provisional for now; the refusal treatment is decided only if a refusal happens (the Not available default in section 3 stays the working assumption). T05 names BIS `WS_CPP` as the price-index fallback "if its terms pass" and T08 says a refusal "moves the affected series to Out of scope". T09/T11/T12 and the assembly brief say the cells become Not available with a licence reason. Which governs, and whether BIS is then added to the manifest, is not decided.
6. ~~Privacy policy and GitHub Actions.~~ Decided by the owner: no mention (T13 stands; T12's line is superseded). Original conflict: T12 says the Privacy policy mentions GitHub Actions only as build infrastructure; T13 (the later, specific ticket) says GitHub Actions is not mentioned because no visitor data flows through it. T13 does not say it amends T12. The reviewer or owner must pick.
7. ~~Full route table~~ Decided by the owner: see section 8.
8. **Series count.** T06 says "eight indicators, nine series"; with construction price index (2 series) and OECD confidence (2 series) the verified table has ten series for eight indicators (T12). Not harmful; the builder should treat the T12 table as the series list. Expected total snapshots is "about 25" per T12.
9. **German wording not fixed anywhere.** Source line (T09 gives English only), "Link not shown: too few observations", "Not available: no Open source for [reason]" in German, the Not available reason texts, and "strongest of N lags tested" German are not fixed in any ticket. Under T10 they are authored EN-first in the build phase and reviewed by the owner; flagged so the builder does not treat them as missing decisions.
10. **Link availability on short Land-level construction series.** With the annual minimum at 10 (owner decision, section 6), Destatis `H` and `WL` series (11 observations) pass at lag 0 only if complete, and show a one-lag profile; the Links overview for construction will therefore mix shown and not-shown cells, particularly for small Länder with missing values. Whether a one-lag profile (lag 0 only) is acceptable to show as a lag chart is not decided.
11. **Tickets 08, 14, 15 outcomes** are unknown by design; the spec records the treatment above. If 08/14 refusals change the Terms' clause 6, the Terms are reopened then (T13).
