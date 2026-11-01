# Second "open source" candidates for German CRE gaps in DBnomics

Researched 2026-11-01 from first-party endpoints (live calls) and official terms pages. Test applied: free to call, documented API, licence allows public redisplay on a website, and fetchable at build time with no credentials.

## Bottom line

**No candidate fills any of the six gaps.** Named-city logistics rent/yield/vacancy/transactions, standalone retail yield, vacancy outside offices, and named-city series do not exist in any open, credential-free, redisplay-licensed API I could find. Only two small things are gained from a second source:

1. Eurostat `STS_COBP_*` gives German building permits (floor area) split office vs. other non-residential, annual from 1992. This is supply-pipeline context, not a market indicator, and only partly overlaps the Destatis-by-Land data DBnomics already carries.
2. Bundesbank direct is the *origin* of the BBDZ1/BBDR1 data DBnomics mirrors. It is not a second source and has the same gaps.

## Verification summary

| Candidate | Fills a gap? | No-credential build-time fetch? | Redisplay licence OK? | Verdict |
|---|---|---|---|---|
| Bundesbank SDMX API (direct) | No (same data as DBnomics) | Yes | Conditional: third-party series unverified | Not a second source |
| Destatis GENESIS-Online API | No CRE market data | **No** (401 on tested calls) | Yes (dl-de/by-2.0 for the web interface) | Rule out |
| Eurostat dissemination API | Partial: permits by building type only | Yes | Yes (CC BY 4.0 / Decision 2011/833/EU) | Optional supplement |
| ECB Data Portal (SDMX) | No German CRE | Yes | Conditional | Rule out |
| OECD SDMX | No (residential only) | Yes | Conditional | Rule out |
| City / Gutachterausschuss open data | No usable series found | n/a | n/a | Rule out (not found) |
| Broker reports (Colliers, JLL, etc.) | Yes in content, but PDFs | n/a | **No** | Rule out |

## 1. Bundesbank SDMX API (direct) -- not a second source

- **API / access:** `https://api.statistiken.bundesbank.de/rest/data/{flow}/{key}`, SDMX REST; CSV via `Accept: text/csv` (the `format=csvdata` query parameter returns 406). Live call returned data with no key, no auth header. Docs page (statistiken.bundesbank.de/content/991448) mentions no registration or key; it notes CSV is limited to 200 series per request and HTTP 413 for oversized queries. No rate limit is stated.
- **Content verified live:** dataflow `BBDZ1` = "System of indicators for the German commercial property market" (5,423 observations in a `lastNObservations=1` pull, 101 distinct series IDs). `BBDR1` is the Bundesbank's commercial-property price index by RegioStaR class (182 series; e.g. `BBDR1.A.5R51.N.GIP.GBUK.S.I22.A`, "Büro / RegioStaR Gem5: Metropole"). This is exactly what DBnomics mirrors, so it adds nothing new.
- **Geography:** classes only ("7 Großstädte (A-Städte)", "120 Städte", "127 Städte", "Städte mit überregionaler Bedeutung", RegioStaR classes). No named city anywhere in the 101 BBDZ1 titles (I searched for Berlin, München, Frankfurt, Hamburg, Köln, Düsseldorf, Stuttgart, logistics, Lager: only class labels matched).
- **Gap check inside BBDZ1:**
  - Vacancy: office only (`BBDZ1.A.B30.N.G850.R1000/R1010/R1020`, 127 / 7 A-cities / 120 cities, annual 1995-2025, percent).
  - Yield: net initial yield for *office and retail combined* (`...G300.P0800/0810/0820`, annual 1995-2025). No standalone retail yield.
  - Rents: office and retail combined index (`...G250.P0600/0610/0620`, annual 1995-2025).
  - Transactions: Verband deutscher Pfandbriefbanken transaction-volume *index* for commercial real estate total (`...G800.R0800/0810/0820`, annual 2007-2024). No sector split.
  - Retail price: `BBDZ1.Q.B10.N.G010.P0114.A` retail price index for cities of supra-regional importance, quarterly 2013-Q1 to 2026-Q2 (54 obs), base 2013=100.
  - Permits/completions (Destatis-sourced): includes "Handels- und Lagergebäude" (retail and warehouse buildings combined) floor area, e.g. `BBDZ1.A.B30.N.G650.R0230.A` completions in m², 1992-2025. This is the only warehouse-adjacent series I found, and it merges retail with warehouses.
- **Licence:** Bundesbank states published content is free to use under its terms. The ESCB reuse terms (bundesbank.de ... terms-of-use-regarding-the-reuse-of-escb-statistics-621188) allow reuse including commercial use if the source is quoted and data/metadata are not changed, **but "The right of free reuse does not apply to third-party data without a prior permission from the originator."** BBDZ1/BBDR1 series carry source notes naming vdpResearch GmbH and bulwiengesa AG. **I could not verify whether the Bundesbank holds redistribution permission for those series; treat redisplay of vdp and bulwiengesa-derived series as unverified.** Series sourced from Destatis ("Eigene Berechnungen auf Basis von Angaben des Statistischen Bundesamtes") are the safer ones.
- **Frequency / history:** annual (1992/1995 onward) and quarterly (from 2013) as above.
- **Build-time without credentials:** yes.
- **Verdict:** keep as primary-source provenance for the DBnomics series; not a gap-filler.

## 2. Destatis GENESIS-Online -- ruled out (credentials)

- **Licence:** Destatis states GENESIS-Online can be used free of charge without registration under "Datenlizenz Deutschland - Namensnennung - Version 2.0" (destatis.de/EN/Service/OpenData/api-webservice.html). That statement is about the web interface; the page does not say the API is credential-free. The API user guide PDF (v5.1) metadata says reproduction is permitted with source mention.
- **API:** REST/JSON at `https://genesis.destatis.de/genesisWS/rest/2020/...`; SOAP has been switched off and GET-with-credentials methods were replaced by POST, per the user guide.
- **Live tests:** `POST helloworld/logincheck` with `username=GAST&password=GAST` returned 200 (guest user recognised). But `POST catalogue/tables` returned HTTP 401 / error code 15 ("not authorised ... header does not contain all required details") with credentials sent as form fields, as `username`/`password` headers, as HTTP Basic, and as a bearer header. Old GET URLs on `www-genesis.destatis.de` now return an HTML page, not JSON. I could not find a working credential-free data call, and could not read the PDF's authentication chapter (text was unextractable). Community sources (pystatis, an n8n node) say a registered account is needed. **Status: unverified that any anonymous data call works; the evidence I have points to credentials being required.** That fails the build-time test.
- **Content:** even if reachable, it carries construction statistics (permits, completions by building type; Land level and below via Regionalstatistik), not rents, yields, vacancy or transaction values. DBnomics already carries Destatis construction by Land. No gap closed.
- **Verdict:** rule out.

## 3. Eurostat -- partial, optional

- **API:** `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{dataset}` (JSON-stat) and SDMX 2.1 at `.../sdmx/2.1/`. No key. Both responded 200 live.
- **Relevant datasets (found by scanning the full dataflow list):** `STS_COBP_A` / `_Q` / `_M` (building permits by type of building), `PRC_COLC_RENTS` (rents in cities, dwellings only), `PRC_HPI_*` / `TIPSHO*` (house prices, residential). No commercial property price, rent, yield, vacancy or transaction dataset exists in the dataflow list.
- **`STS_COBP_A` for `geo=DE`:** useful floor area (`BPRM_SQM`) by `cpa2_1`: Buildings, Residential, Non-residential, Non-residential except office, **Office buildings**. Annual from 1992 (latest 2025), also quarterly and monthly. National level only. There is no retail or warehouse split, so it does not address logistics.
- **Licence:** Eurostat copyright notice: free reuse, commercial or not, with source credit, under Commission Decision 2011/833/EU; editorial content CC BY 4.0. Data marked as from other sources may be non-commercial only; STS permits are Eurostat/national statistical institute data.
- **Build-time without credentials:** yes.
- **Verdict:** can supply an office vs. other non-residential permits series. It does not fill any listed gap and largely duplicates Destatis data already in DBnomics (only without the Land split).

## 4. ECB Data Portal -- ruled out

- **API:** `https://data-api.ecb.europa.eu/service/data/{flow}/{key}`, open, no key (200 live).
- **Content verified:** dataflows `CPP` ("Commercial Property Price Statistics") and `RESC` ("Commercial Property Prices"). Live pulls show only euro-area aggregates: `CPP.Q.I7...` and `CPP.Q.I8...`, and `RESC` series for `B6`, `I8`, `I9` (aggregates). No `DE` series in either. `RESR` has Germany, but only residential indices (`RESR.Q.DE._T.N._TR.TVAL.10.TB.N.IX` etc.); no commercial series for Germany.
- **Licence:** not established from the ECB disclaimer page, which says it sets no statistics policy. The ESCB reuse policy (same text as the Bundesbank page above) applies; third-party data excluded.
- **Verdict:** rule out: no German commercial data.

## 5. OECD -- ruled out

- **API:** `https://sdmx.oecd.org/public/rest/...`, open (dataflow list returned 200).
- **Content:** property-related flows found: `DSD_AN_HOUSE_PRICES@DF_HOUSE_PRICES`, `DSD_RHPI@DF_RHPI_ALL`, `DF_RHPI_TRANSACTIONS`, `DF_RHPI_TARGET` (residential house price indices and housing transactions), plus subnational property-tax revenue. No commercial property flow. Residential only.
- **Licence:** per OECD terms (via search summary; the terms page itself returned 403 to my fetcher): data may be reused for any purpose including commercial, with the OECD citation format, subject to dataset-specific restrictions and third-party ownership.
- **Verdict:** rule out: no commercial real estate.

## 6. City-level open data and publishers -- nothing usable found

- Searched for German city open-data portals (Hamburg Transparenzportal, Berlin, München, Frankfurt, Bremen, NRW CKAN) with office vacancy, take-up, prime rent. **Found no dataset.** One result was a Zurich vacancy dataset (not Germany).
- Gutachterausschüsse hold Kaufpreissammlungen under section 193 BauGB; these feed Bodenrichtwerte (land values). Nuremberg and Recklinghausen mention them; the Recklinghausen/RVR record on Open NRW appears flagged non-open (per search summary, not verified at source). Bodenrichtwerte are land values, not rent/yield/vacancy; Düren sells commercial rent overviews for a fee.
- Named-city rent, yield, vacancy and take-up figures *exist* in broker reports (Colliers Berlin and München, German Property Partners Düsseldorf, found as PDFs; examples: Berlin Q3 2025 office vacancy 8.1% per Colliers vs. 6.7% per IVD). These are PDF marketing reports with copyright and no API or open licence. Redisplay fails the test, and definitions differ by broker.
- **Not checked:** bulwiengesa, JLL, CBRE, Savills, Catella, Statista pages, GREIX/Europace (residential), BBSR/INKAR, Regionalstatistik, individual state statistical offices. Absence of evidence here is not proof of absence.
- **Verdict:** rule out (nothing open found; commercial sources fail the licence test).

## What could not be verified

- Whether Bundesbank has permission to redistribute vdpResearch and bulwiengesa series (the redisplay licence for the exact series DBnomics mirrors).
- Whether any GENESIS-Online API call works anonymously; the authentication chapter of the Destatis user guide was unreadable and all tested call styles returned 401 except `logincheck`.
- The OECD terms page (HTTP 403 to my fetcher) and the ECB's own statistics reuse page; relied on search summaries and the Bundesbank's ESCB-policy text.
- DBnomics's own coverage claims (taken from the question, not tested).
- Whether the Eurostat permits series differs from what DBnomics holds from Destatis.

## Sources

- https://api.statistiken.bundesbank.de/rest/ (live calls: `metadata/dataflow/BBK/BBDZ1`, `metadata/datastructure/BBK/BBK_DOSC`, `data/BBDZ1`, `data/BBDR1`)
- https://statistiken.bundesbank.de/content/991448 (API usage)
- https://www.bundesbank.de/en/homepage/user-information/terms-of-use-regarding-the-reuse-of-escb-statistics-621188
- https://data-api.ecb.europa.eu/service/ (dataflow list, `CPP`, `RESC`, `RESR`)
- https://ec.europa.eu/eurostat/api/dissemination/ (dataflow list; `STS_COBP_A`, `STS_COBP_Q`)
- https://ec.europa.eu/eurostat/help/copyright-notice
- https://sdmx.oecd.org/public/rest/dataflow/all
- https://www.oecd.org/en/about/terms-conditions.html
- https://www.destatis.de/EN/Service/OpenData/api-webservice.html
- https://genesis.destatis.de/datenbank/online/docs/GENESIS-Webservices_Introduction.pdf
- https://genesis.destatis.de/genesisWS/rest/2020/ (live POST tests)
