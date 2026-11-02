# Office employment: is there an Open source?

Label: wayfinder:research
Type: research (AFK)
Status: resolved
Blocked by:

## Question

Is there an Open source (free to call, documented API, licence allowing public redisplay) for German **office employment**, meaning persons employed in office-using sectors, either nationally or by City class / Land? Look first at Destatis (Erwerbstätigenrechnung, employment by economic sector WZ 2008, e.g. sections J, K, L, M, N, O; Sozialversicherungspflichtig Beschäftigte from the Bundesagentur für Arbeit), on DBnomics first, then Destatis GENESIS (note the earlier finding that GENESIS needs credentials), Eurostat (`nama_10_a64_e`, `lfsq_egan2`) and the Bundesagentur für Arbeit statistics API.

For each candidate report: provider and dataset id, the sectors it can be summed into an "office-using" aggregate, frequency, start year, geography, API access, and licence. Recommend one series or say none passes. This decides whether Insight M (office employment vs a Real estate KPI) is in the catalogue.

## Answer

Yes. Destatis' employment accounts on DBnomics pass the Open source test: persons in employment by WZ 2008 section, annual, Germany and Länder, under dl-de/by-2-0. Eurostat national accounts carry the same figures, also quarterly. The BA API has no sector split, and GENESIS needs credentials. No source publishes a City class aggregate. Eurostat NUTS 3 data would let the site sum the seven A-cities itself (2000-2022), which is a spec decision.

**Recommendation:** `DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063`, persons in employment in sections K-N, annual 1991-2025, Germany. Insight M stays in the catalogue.

Details: [research/office-employment.md](../research/office-employment.md)
