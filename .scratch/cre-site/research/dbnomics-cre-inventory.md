# DBnomics inventory: German commercial real estate KPIs

Researched 2026-11-01 against the live API (`https://api.db.nomics.world/v22`): `/providers`, `/search`, `/series/{provider}/{dataset}`, `/datasets/...`. Series codes, frequencies and date ranges below were read from API responses on that date.

## Answer in brief

- DBnomics has no vendor CRE data (no JLL, CBRE, Colliers, current bulwiengesa). The usable German CRE KPIs come via the **Bundesbank (BUBA)** provider (datasets `BBDZ1`, `BBDR1`), plus **BIS** `WS_CPP` (price index) and **DESTATIS** construction statistics (`31111LJ001`, `31121LJ001`).
- Premise "DBnomics has city-level data": **mostly refuted**. There are no named-city series. A name scan of BBDZ1, BBDR1 and BIS WS_CPP found "Berlin" only in East-Germany residential labels. Geography is aggregate city *classes*: "7 major cities (A cities)", "120 / 127 towns and cities", "cities of supra-regional importance", RegioStaR Gem5 classes. The only named units are the 16 Länder in DESTATIS construction data (state level; Berlin, Hamburg, Bremen are city-states).
- Logistics is covered only by one stale series (capital growth, 1995-2014). No vacancy outside offices; no yield or rent for logistics or retail-only.

## Candidates

BUBA datasets: provider `BUBA` (Bundesbank). `indexed_at`: BBDZ1 2026-06-06, BBDR1 2026-06-26. The API's dataset `updated_at` is null, so `indexed_at` is the only "last update" signal. Latest observation: quarterly 2026-Q1, annual 2025.

### 1. BUBA/BBDZ1 - System of indicators for the German commercial property market (101 series)

Series ids are `{FREQ}.{GROUP}.N.{SLIDE}.{NAME}.A`; `A.` = annual, `Q.` = quarterly.

| KPI | Segment | Geography | Series id | Range |
|---|---|---|---|---|
| Capital value (price index) | total, office, retail, multi-family | Germany | `A.B10.N.G000.P0100/P0102/P0104/P0106.A` (and `Q.`) | A 2013-2025; Q 2013-Q1..2026-Q1 |
| same | same | cities of supra-regional importance | `A.B10.N.G010.P0110/P0112/P0114/P0116.A` (and `Q.`) | same |
| same | same | Germany excl. those cities | `A.B10.N.G020.P0120/P0122/P0124/P0126.A` (and `Q.`) | same |
| Capital growth | office+retail core | 127 towns / 120 towns / 7 major cities | `A.B10.N.G150.P0200 / P0210 / P0220.A` | A 1995-2025 |
| Rent (VDP index, new lettings) | office, retail | Germany | `A.B10.N.G200.P0410` (office), `P0420` (retail); `Q.` same codes | A 2004-2025; Q 2010-Q1..2026-Q1 |
| Rent (VDP index) | multi-family | Germany | `...G200.P0430` | 2013- |
| Rent index | office+retail core | 127 / 120 towns / 7 major cities | `A.B10.N.G250.P0600 / P0610 / P0620.A` | A 1995-2025 |
| Yield (initial yield) | office+retail core | 127 / 120 towns / 7 major cities | `A.B10.N.G300.P0800 / P0810 / P0820.A` | A 1995-2025 (annual only) |
| Yield spread | office+retail core | 120 towns vs 7 cities | `A.B10.N.G350.P1000.A` | 1995-2025 |
| Vacancy rate | office only | 127 / 7 major cities / 120 towns | `A.B30.N.G850.R1000 / R1010 / R1020.A` | 1995-2025 (annual only) |
| Transactions | commercial total | Germany / 127 districts / 7 major cities | `A.B30.N.G800.R0800 / R0810 / R0820.A` (VDP transaction volume index, euro values) | A 2007-2024 |
| Construction | non-residential: office/admin; wholesale/retail/warehouses | Germany | `A.B30.N.G600.R0010/R0020/R0030.A`, `G650.R0200-R0230` (and `Q.`) | A 1992-2025; Q 2010-Q1..2026-Q1 |
| Construction (investment, % of GDP / constant prices) | commercial building | Germany | `A.B30.N.G700.R0400.A`, `G750.R0600.A`; `Q.B30.Y.G700.R0420.A`, `Q.B30.Y.G750.R0620.A` | to 2026-Q1 |
| Bank lending exposure (credit, not a property KPI) | by sector | Germany | group `B20` (`F0010`..`F0940`) | 2000/2003-2025 |

### 2. BUBA/BBDR1 - Real Estate Prices (225 series)

- Commercial price index ("GIP", smoothed): `{A|Q}.DE.N.GIP.{GGESK total | GBUK office | GEHK retail | GBEK office+retail | GMFHK multi-family}.S.I22.A`. A 2013-2025; Q 2013-Q1..2026-Q1. Largely the same content as BBDZ1 price block.
- Same by RegioStaR Gem5 class: `A.5R51`..`5R55` and `5RX51` (supra-regional cities, regional cities, local cities, urban area, village area, total excl. supra-regional) for GBUK/GEHK (plus GGESK/GMFHK for 5R52-5R55; Q. variants exist). Class level, not named cities.
- **Only logistics series found**: `A.DE0125.N.BUL.BGPIGCAGR.R.I10.A` (bulwiengesa German Property Index, logistics/industrial, capital growth, 127 cities), 1995-2014 only (frozen). Siblings, same range: `BGPIBCAGR` (office), `BGPIHCAGR` (retail), `BGPICAGRBH` (office+retail), `BGPICAGR` (all).
- The rest is residential (Destatis HPI, Hypoport, VDP owner-occupied, bulwiengesa up to 2014): out of scope.

### 3. BIS/WS_CPP - Commercial property prices (68 series, all countries)

Germany (indexed 2025-06-27, so older than BUBA):
- `Q.DE.0.B.0.2.6.0` office, whole country, 2008-Q1..2025-Q1
- `Q.DE.0.C.0.2.6.0` retail, whole country, 2003-Q1..2025-Q1
- `Q.DE.0.D.0.2.6.0` office & retail, whole country, 2008-Q1..2025-Q1
- `A.DE.4.D.0.2.6.0` office & retail, big cities, 1995-2024
- `A.DE.9.D.0.2.6.0` office & retail, urban areas, 1995-2024

KPI: capital value (price index). Probably a re-publication of Bundesbank/bulwiengesa data (not verified).

### 4. DESTATIS construction statistics (construction KPI only)

- `31121LJ001` (completions; indexed 2026-06-27) and `31111LJ001` (permits; indexed 2026-10-18). About 14,784 series each, annual, by Land (16 Länder, incl. Berlin, Hamburg).
- Building-type dimension `BAUGB1` includes `GBD-NW-BV` office/administrative, `GBD-NW-NLW-H` commercial buildings, `GBD-NW-NLW-HL` commercial and storage, `GBD-NW-NLW-WL` warehouse buildings, `GBD-NW-NLW-FW` factory/workshop. Example live id: `01.BAUART1.BTK-GEB-BST.GBD-NW-NLW-WL.BAU003` (Schleswig-Holstein, warehouse buildings, work on existing buildings, construction projects), 2015-2025. Retail has no separate code (falls under commercial buildings). Measures: projects, floor space, costs.

## Licences (partially verified)

- **Bundesbank**: DBnomics provider metadata points to `https://www.bundesbank.de/Redaktion/EN/Dossier/Service/terms_of_use.html?notFirst=true&docId=109018`, which returns 404 today. I could not retrieve current Bundesbank data terms (the "reproduction regulations" page found is about banknotes). **Licence unverified.** The inputs of BBDZ1/BBDR1 come from third parties (bulwiengesa AG, Verband deutscher Pfandbriefbanken); their redistribution terms are also unverified. Resolve with the Bundesbank before commercial redistribution.
- **BIS**: `https://www.bis.org/terms_conditions.htm` (fetched): BIS owns its statistical data; users may use it without written permission under listed conditions (download, display, copy, with acknowledgement). I read only the opening of that clause; exact conditions (for example commercial reuse) not fully read. Verify before use. DBnomics lists no terms URL for BIS.
- **DESTATIS**: no terms in DBnomics provider metadata, and my fetch of a Destatis terms page failed. Destatis commonly uses Data licence Germany - attribution 2.0, but that is from memory and **unverified** here.

## Gaps (KPI x Segment with no DBnomics series)

| KPI | Office | Retail | Logistics | Commercial overall |
|---|---|---|---|---|
| Rent | Germany VDP (2004+); 7 cities/120/127 only as office+retail | Germany VDP; city level only combined | none | none |
| Yield | office+retail combined only; no office-only | combined only | none | none |
| Vacancy | office only (127 / 7 cities / 120), annual | none | none | none |
| Capital value | yes (DE, city classes, BIS) | yes | stale growth index only (to 2014) | yes (BBDZ1 total) |
| Transactions | none by segment | none | none | commercial volume index only (VDP, to 2024) |
| Construction | yes (office/admin) | partial (wholesale/retail/warehouse lumped; DESTATIS "commercial buildings") | warehouse buildings (DESTATIS, Land level) | yes (non-residential totals) |
| Named cities (any KPI) | none | none | none | none |

Also absent: prime vs secondary, take-up (sqm), pipeline/supply, per-city rents/yields for Berlin/Munich/Frankfurt/Hamburg etc., quarterly yield or vacancy.

## Method notes and caveats

- Searched `/search` for: office, commercial property, real estate, rent, vacancy, property prices, construction, logistics, warehouse, non-residential, industrial property, shopping, and city names. Hits from SCB, Statcan, Eurostat, OECD were not German CRE. ECB `SHI`/`RESH` are housing indicators and were not examined for CRE.
- The provider list has 94 providers; no German CRE vendor among them.
- "7 major cities (A cities)": series labels do not list the cities. The usual A-city set (Berlin, Düsseldorf, Frankfurt, Hamburg, Cologne, Munich, Stuttgart) is general knowledge, not read from the API.
- Date ranges are first/last non-null observation as returned by the API for each series on 2026-11-01.
