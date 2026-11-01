# DBnomics inventory: German commercial real estate KPIs

Label: wayfinder:research
Status: resolved
Blocked by: none

## Question

Which providers and datasets on DBnomics (https://docs.db.nomics.world/web-api/) carry German Real estate KPIs for office, retail, logistics or commercial overall? For each candidate give the provider, dataset code, series ids, frequency, start date and last update, the KPI it measures (rent, yield, vacancy, capital value, transactions, construction), geographic level (national, which cities), and the licence of the underlying provider.

Confirm or refute the working premise that DBnomics has city-level data. List which cities, for which KPIs. Report gaps: KPI and Segment combinations with no DBnomics series.

## Answer

German CRE KPIs on DBnomics come almost entirely from the Bundesbank, with no market vendor data. The working premise of named-city data is mostly refuted.

- **BUBA/BBDZ1** (101 series, annual and quarterly): capital value (total, office, retail), rent (office, retail, Germany; combined office+retail by city class), initial yield (office+retail combined, annual), office vacancy (annual), commercial transaction volume index (total only, to 2024), non-residential construction. Latest observation 2026-Q1.
- **BUBA/BBDR1**: duplicates the price index with RegioStaR city-class breakdowns. Holds the only logistics series, a capital growth index frozen at 2014.
- **BIS/WS_CPP**: five Germany price series, older than BUBA.
- **DESTATIS 31111LJ001 and 31121LJ001**: permits and completions by Land, with office, commercial and warehouse building types.
- **Geography**: no named-city series. Only city classes ("7 major cities (A cities)", 120/127 towns, supra-regional cities) and the 16 Länder for construction.
- **Gaps**: logistics has no rent, yield, vacancy or transactions; retail has no standalone yield; vacancy is office only; transactions are a commercial total only.
- **Licences are unverified** (Bundesbank terms URL is 404; BIS terms only partly read; Destatis from memory). See the licence ticket.

Findings: [research/dbnomics-cre-inventory.md](../research/dbnomics-cre-inventory.md)
