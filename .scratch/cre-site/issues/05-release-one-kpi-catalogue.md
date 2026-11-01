# Release-one KPI catalogue

Label: wayfinder:grilling
Status: resolved
Blocked by: 01 (resolved), 04 (resolved), 07 (resolved)

## Question

Given what the sources can actually supply, which Real estate KPIs ship in release one, for which Segments and at which geographic level (national, which cities)? Settle the canonical KPI names (EN and DE), units, and what happens to KPI and Segment combinations with no Open source: drop, mark "not available", or defer.

Context: DBnomics has no named-city CRE series, only city classes (7 major cities, 120/127 towns, supra-regional cities) and Länder for construction. Decide whether release one shows city classes, requires named cities from a second source, or drops the city requirement.

Licence caveat: the Bundesbank CRE series are not yet confirmed as Open source (see the permission ticket). Treat them as provisional in the catalogue.

Second-source result: no Open source adds named cities, logistics KPIs, retail yield or non-office vacancy. Eurostat could add permits by building type. The catalogue is therefore bounded by DBnomics and Destatis-via-DBnomics.

## Answer

Release one ships six Real estate KPIs from DBnomics (Bundesbank BBDZ1/BBDR1 and Destatis), at national and City class level. Named cities are not offered.

**Decisions**
- **Geography:** national plus City classes (7 major cities, 120 towns, 127 towns, cities of supra-regional importance), labelled as classes. Construction also at Land level. The named-city requirement is dropped; reopens only if an Open source for named cities appears (see Out of scope in the map).
- **No Open source:** a real gap is shown as an explicit "Not available" entry with the reason; a meaningless combination is dropped; nothing is deferred.
- **Provisional:** BBDZ1/BBDR1 series are listed but flagged "provisional (licence unconfirmed)"; nothing so flagged goes live until the permission ticket resolves. Fallback if refused: Destatis construction KPIs, plus BIS if its terms pass.
- **Stale logistics series** (bulwiengesa capital growth, 1995-2014) is not shipped; logistics capital value is Not available.
- **Office+retail combined** series (yield, city-class rent index) carry the scope label "office and retail combined" ("Büro und Einzelhandel zusammen"). It is a scope label, not a Segment. Shown under commercial overall, Not available on office-only and retail-only views.
- **Capital growth** is dropped as a KPI (derivable from the price index); pre-2013 class-level history is lost.
- **Construction:** floor space (m2) only, permits and completions, Land level (Destatis 31111LJ001, 31121LJ001). Retail construction is Not available (no separate building code); the lumped commercial-buildings series appears only under commercial overall.
- **BIS and Eurostat** are excluded from release one (duplicate or unconfirmed). BIS becomes the price-index fallback if BBDZ1/BBDR1 fail the licence check.

**Catalogue**

| # | EN | DE | Unit | Segments | Geography | Frequency |
|---|---|---|---|---|---|---|
| 1 | Commercial property price index | Gewerbeimmobilien-Preisindex | Index, 2013=100 | office, retail, commercial overall | Germany; cities of supra-regional importance; Germany excl. those | Quarterly, annual |
| 2 | Rent index | Mietindex (Neuvermietung) | Index | office, retail (Germany); office and retail combined (City classes) | Germany; 7 / 120 / 127 | Germany quarterly, annual; classes annual |
| 3 | Initial yield | Anfangsrendite | % | office and retail combined | 7 / 120 / 127 | Annual |
| 4 | Office vacancy rate | Büroleerstandsquote | % | office | 7 / 120 / 127 | Annual |
| 5 | Transaction volume index | Transaktionsvolumenindex | Index | commercial overall | Germany; 7 / 127 | Annual |
| 6 | Construction (permits, completions) | Bautätigkeit (Genehmigungen, Fertigstellungen) | Floor space, m2 | office, logistics (warehouse buildings), commercial overall | Germany; 16 Länder | Annual |

**Availability** (Y ships; N/A Not available; combined = office and retail combined)

| KPI | Office | Retail | Logistics | Commercial overall |
|---|---|---|---|---|
| Price index | Y | Y | N/A | Y |
| Rent index | Y (Germany only) | Y (Germany only) | N/A | Y combined (City classes) |
| Initial yield | N/A | N/A | N/A | Y combined (City classes) |
| Office vacancy rate | Y (City classes) | N/A | N/A | N/A |
| Transaction volume index | N/A | N/A | N/A | Y |
| Construction | Y (Land) | N/A | Y (Land) | Y (Land) |

Open check for the spec: which BBDZ1 G600/G650 series are permits and which are completions (the research does not say).
