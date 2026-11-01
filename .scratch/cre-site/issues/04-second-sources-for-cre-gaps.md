# Open second sources for CRE KPIs DBnomics cannot supply

Label: wayfinder:research
Status: resolved
Blocked by: 01 (resolved)

## Question

DBnomics supplies no named-city CRE series, no logistics rent, yield, vacancy or transactions, no standalone retail yield, vacancy outside offices, and transactions only as a commercial total. Which other Open source (free, documented API, licence allowing public redisplay) covers each gap? Candidates: Bundesbank direct, Destatis GENESIS-Online, Eurostat, ECB, OECD, and any city-level publishers with open APIs.

For each report the API, access method, licence, geographic level (named cities or classes), frequency, history length and whether it can be fetched at build time without credentials. Rule out candidates that fail the Open source test, with the reason.

## Answer

No open, credential-free, redisplay-licensed source closes any of the gaps. Named-city CRE series, logistics rent, yield, vacancy and transactions, standalone retail yield, and vacancy outside offices are not available from an Open source.

- **Bundesbank direct** (open SDMX API, no key, live-tested): it is the origin of BBDZ1/BBDR1, so not a second source. Same gaps, same class-level geography, same unverified third-party (vdp, bulwiengesa) redistribution question.
- **Destatis GENESIS-Online**: every data call returned 401 even with the guest login, so it fails the no-credentials build-time test. It also has no rent, yield or vacancy data. Ruled out.
- **Eurostat** (CC BY 4.0): `STS_COBP` gives German permits split office vs other non-residential, annual since 1992. Optional supplement for supply-pipeline context only.
- **ECB** (euro-area aggregates only) and **OECD** (residential only): ruled out.
- **City open-data portals and Gutachterausschuss data**: no open CRE series found.
- **Broker reports**: named-city figures exist but only in PDFs with no open licence. Ruled out.

Not verified: Destatis anonymous access beyond the tested calls, the OECD terms page (403), BBSR and Regionalstatistik.

Findings: [research/second-sources-for-cre-gaps.md](../research/second-sources-for-cre-gaps.md)
