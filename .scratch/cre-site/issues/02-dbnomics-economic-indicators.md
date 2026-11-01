# DBnomics inventory: economic indicators relevant to German CRE

Label: wayfinder:research
Status: resolved
Blocked by: none

## Question

Which DBnomics series for Germany serve as Economic indicators plausibly related to commercial real estate: interest rates (Bundesbank, ECB), inflation, GDP, unemployment, credit and lending, construction costs and permits, business confidence (e.g. ifo if available), and any others you find? For each give the provider, dataset code, series id, frequency, start date and last update, and licence.

Note frequency mismatches against typical CRE KPIs (quarterly or annual) and any series with short histories that would make a Link misleading.

## Answer

DBnomics has usable Economic indicators for Germany, with caveats on freshness, frequency and licence.

- **Available**: interest rates (ECB/FM, BUBA/BBIN1, BBSIS, BBIM1, ECB/MIR), HICP/CPI, GDP, unemployment, bank lending including the Bank Lending Survey, building permits, and Destatis construction price indices for office and for industrial and commercial buildings (`61261BV001`, quarterly from 1958).
- **ifo is not on DBnomics.** Substitutes: Eurostat EC surveys (`ei_bssi_m_r2`) and OECD business tendency surveys (`OECD/DSD_STES@DF_BTS`).
- **Freshness varies by mirror**: Eurostat ends Nov/Dec 2025, ECB `ICP` for Germany ends 2025-12; Destatis and BUBA are fresher. Prefer Destatis or BUBA over Eurostat for Germany.
- **Frequency**: most macro series are monthly or daily and must be aggregated to quarters with a documented rule. Daily and event series (Bund yield, ECB key rates) must be resampled first.
- **Short history**: the Bundesbank commercial price indices start 2013-Q1 (about 53 quarters), dominated by one rate regime change, so Links on them are misleading unless flagged.
- **Licences largely unverified**: only the ECB terms page was readable. Eurostat and Destatis names are from memory (Destatis is confirmed separately in the licence ticket).
- **Not isolated**: total non-residential permits in Destatis.

Findings: [research/dbnomics-economic-indicators.md](../research/dbnomics-economic-indicators.md)
