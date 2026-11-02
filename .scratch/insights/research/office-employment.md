# Office employment: is there an Open source?

Researched 2026-11-02 for [ticket 01](../issues/01-office-employment-open-source.md). DBnomics ids, periods and values come from live calls to `https://api.db.nomics.world/v22/...` made that day.

## Summary

**Yes. Destatis' employment accounts on DBnomics pass the Open source test.** Recommended series: **`DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063`**, persons in employment (domestic concept) in WZ 2008 sections K-N (finance and insurance, real estate, professional and scientific, administrative and support services). It is annual, runs 1991-2025, covers Germany, and is a single published aggregate, so no summing is needed. It is licensed under Datenlizenz Deutschland - Namensnennung 2.0, the same Destatis licence the site already uses.

- **Länder:** the same series exists by Land in `DESTATIS/13311LJ002`, e.g. `02.WZ08-K-N.ERW063` (Hamburg), `11.WZ08-K-N.ERW063` (Berlin).
- **Quarterly alternative:** Eurostat `namq_10_a10_e`, J + K + L + M_N, seasonally and calendar adjusted, 1991-Q1 to 2025-Q3.
- **City class:** no source publishes a City class aggregate. Eurostat `nama_10r_3empers` has K-N for each NUTS 3 district, including the seven A-cities (2000-2022), so a "7 major cities" sum could be an own calculation. That is a design decision, see below.
- **Ruled out:** the Bundesagentur für Arbeit API has no WZ split. Destatis GENESIS needs credentials and is not needed, because DBnomics mirrors the same Destatis tables.

## What "office-using" can be built from

WZ 2008 / NACE Rev. 2 sections usually counted as office-using: J (information and communication), K (finance and insurance), L (real estate), M (professional, scientific, technical), N (administrative and support), and partly O (public administration). Sources publish the aggregate **K-N** directly. J and O are published separately, so J-N or J-O must be summed as an own calculation. N includes temp agencies, cleaning and security, so it is only partly office-based. Every source has this limit.

## Candidates

| Source | Dataset / series | Sectors | Freq | Periods (live) | Geography | Passes? |
|---|---|---|---|---|---|---|
| Destatis via DBnomics | `13311BJ002` | K-N aggregate; J, K, L, M, N, M-N, O separately | A | K-N 1991-2025; J etc. 2000-2024 | Germany | **Yes** |
| Destatis via DBnomics | `13311LJ002` | same | A | 1991-2025 (K-N) | 16 Länder | Yes |
| Eurostat via DBnomics | `nama_10_a64_e` | J, K, L, M, N, M_N, O, O-Q | A | 1995-2024 | Germany | Yes |
| Eurostat via DBnomics | `namq_10_a10_e` | J, K, L, M_N, O-Q | Q | 1991-Q1 to 2025-Q3 | Germany | Yes |
| Eurostat via DBnomics | `nama_10r_3empers` | K-N, G-J, O-Q (J only at NUTS 2 and above) | A | 2000-2022 (NUTS 3) | NUTS 0-3 | Yes, but see City class |
| Eurostat via DBnomics | `lfsq_egan2` (Labour Force Survey) | J, K, L, M, N, O | Q | 2008-Q1 to 2025-Q3 | Germany | Licence yes; survey-based, 2008 start, weaker than national accounts |
| Destatis via DBnomics | `13111BV007` (employees subject to social insurance, BA data) | J, K, L, M, N, O | Quarterly reference dates | 2008-2025 | Germany | **No, fetcher defect**: periods are stored as years, so each year appears four times |
| Destatis via DBnomics | `13111LV003` | only "J-U other services" | as above | 2008-2025 | Länder | No: no office split |
| Bundesagentur für Arbeit API | `EckwerteZeitreiheBST*` | none (totals only) | M | recent months | DE, Land, Kreis | No: no WZ split |
| Destatis GENESIS-Online | 13311-*, 13111-* | as above | | | | No: needs credentials, and DBnomics already mirrors these tables |
| OECD on DBnomics | searched "employment", "employed persons" | only business demography and trade-in-employment datasets | | | | No fit found |

### 1. Destatis employment accounts (Erwerbstätigenrechnung) on DBnomics, recommended

- **Datasets:** `DESTATIS/13311BJ002` (Germany, 90 series) and `DESTATIS/13311LJ002` (Länder, 1,440 series): "Regional employment accounts ... WZ2008 (Sections, aggregations): Regional accounts, Year". Indexed by DBnomics 2026-06-27.
- **Dimensions:** `DINSG` = `DG` (Germany) or `DLAND` = `01`-`16`; `WZ08R1` = `WZ08-J`, `WZ08-K`, `WZ08-K-N`, `WZ08-L`, `WZ08-M`, `WZ08-M-N`, `WZ08-N`, `WZ08-O`, ...; `ind` = `ERW063` persons in employment, `ERW061` employees, `ERW062` self-employed.
- **Series code pattern:** `{geo}.{WZ}.{ind}`, e.g. `DG.WZ08-K-N.ERW063`.
- **Live values:** `DG.WZ08-K-N.ERW063` runs 1991 = 3,785 to 2024 = 7,844 and 2025 = 7,802 (thousand persons, a first estimate). Hamburg K-N 2025 = 335.8, Hessen 764.8, Berlin 521.0.
- **Gotcha:** the single sections (J, M-N, O ...) are `NA` before 2000, and show **`0.0` for 2025** where Destatis has not yet published the split. The pipeline must treat a 0 there as missing. K-N already has 2025.
- **Licence:** Destatis, Datenlizenz Deutschland - Namensnennung - Version 2.0 (https://www.govdata.de/dl-de/by-2-0), already confirmed for this site in `.scratch/cre-site/research/licences-for-core-sources.md` from https://www.destatis.de/EN/Service/Legal-Notice/CopyrightGENESISOnline.html. Note: the 13311 tables are compiled by the Länder working group "Erwerbstätigenrechnung des Bundes und der Länder" and published by Destatis. I found no licence note that differs from the Destatis one, but the source line should name the working group as Destatis does.

### 2. Eurostat national and regional accounts on DBnomics

- **`Eurostat/nama_10_a64_e`** (dimensions `freq.unit.nace_r2.na_item.geo`): `A.THS_PER.{J|K|L|M|N|M_N|O|O-Q|TOTAL}.EMP_DC.DE`, 1995-2024. 2024 values: J 1,571, K 1,086, L 520, M_N 6,238, O 2,915, total 45,987 (thousand persons). No J-N aggregate (`J-N` is not a code). These are the same Destatis figures under Eurostat's licence, with one year less.
- **`Eurostat/namq_10_a10_e`** (`freq.unit.nace_r2.s_adj.na_item.geo`): `Q.THS_PER.{J|K|L|M_N|TOTAL}.SCA.EMP_DC.DE`, 1991-Q1 to 2025-Q3. The DBnomics mirror was indexed 2026-01-22, so it is about three quarters behind Eurostat today.
- **`Eurostat/nama_10r_3empers`** (`freq.unit.wstatus.nace_r2.geo`): `A.THS.EMP.K-N.{NUTS}`, 2000-2022 at NUTS 3 (totals to 2023). Live K-N 2022: Berlin `DE300` 509.9, München `DE212` 335.3, Hamburg `DE600` 329.4, Frankfurt `DE712` 259.2, Köln `DEA23` 211.7, Düsseldorf `DEA11` 172.3, Stuttgart `DE111` 140.4. Indexed 2025-07-21.
- **`Eurostat/lfsq_egan2`** (`freq.unit.sex.age.nace_r2.geo`): `Q.THS_PER.T.Y15-74.{J|K|L|M|N}.DE`, 2008-Q1 to 2025-Q3. This is survey-based and has a 2008 break, so it is weaker than the national accounts above.
- **Licence:** Eurostat copyright notice (https://ec.europa.eu/eurostat/web/main/help/copyright-notice): reuse "for commercial or non-commercial purposes" is authorised with source acknowledgement, under Commission Decision 2011/833/EU. Changes must be stated. Exceptions cover non-Eurostat or third-party data, not national-accounts data for Germany.

### 3. Bundesagentur für Arbeit statistics API, ruled out

- Since December 2025 the BA has offered `https://statistik-dr.arbeitsagentur.de/bifrontend/bids-api/ct/v1/tableFetch/{csv|xlsx}/EckwerteZeitreiheBST...` with filters for Germany, Land, Kreis, Agentur and labour-market region (https://statistik.arbeitsagentur.de/DE/Statischer-Content/Service/API/API-BST-Zeitreihe.html). The page names no key.
- It returns only headline totals (employees, employees subject to social insurance, mini-jobs) for the latest few months. **There is no Wirtschaftszweig parameter**, so it cannot give office employment. BA tables by sector exist only as web exports.
- **Licence:** the API page shows "© Bundesagentur für Arbeit" and names no licence. Notices quoted in BA reports allow redistribution with a source credit, ask for no changes and for own calculations to be labelled. That was not verified on a first-party terms page.
- DBnomics mirrors the BA's sector data as Destatis `13111BV007`, but its periods collapse quarterly reference dates into repeated years (e.g. `2025` four times). It is unusable until the fetcher is fixed.

### 4. Destatis GENESIS-Online, ruled out

The 2026-11-01 research (`.scratch/cre-site/research/second-sources-for-cre-gaps.md` §2) found that data calls return 401 without a registered account. Not retested. GENESIS adds nothing here: the 13311 and 13111 tables it would serve are already on DBnomics.

## City class

No Open source publishes office employment by City class. Two options for a spec decision:

1. Use **Länder** (`13311LJ002`). Berlin (`11`) and Hamburg (`02`) are city-states, so their Land figures are city figures.
2. Sum Eurostat NUTS 3 K-N for the seven A-cities as an own-calculated "7 major cities" series (2000-2022, ending three years before the KPIs). It matches the City class definition but is built from named districts, and the glossary line "no Open source supplies named-city series" would need narrowing to Real estate KPIs.

There is no source for the 120/127-town classes.

## Recommendation

Use **`DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063`** (annual, 1991-2025, Germany, dl-de/by-2-0). Insight M is feasible as national office employment vs office vacancy or rent. Its frequency matches the annual Real estate KPIs, and the series is published as one aggregate, so no own calculation is needed. If the Insight needs J (ICT) included, sum `WZ08-J` + `WZ08-K-N` from 2000 and label it as an own calculation.
