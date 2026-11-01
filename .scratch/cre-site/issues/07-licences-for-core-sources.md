# Licences for the core DBnomics CRE sources

Label: wayfinder:research
Status: resolved
Blocked by: none

## Question

Do the data behind the core CRE series pass the Open source test (licence allows public redisplay)? Establish from primary sources: the Bundesbank's current data terms of use for BBDZ1 and BBDR1 (DBnomics lists a URL that returns 404), the redistribution terms of the third-party inputs (bulwiengesa AG, Verband deutscher Pfandbriefbanken), the BIS terms (read the full reuse clause), and the Destatis licence (is it Data licence Germany - attribution 2.0?). Also state DBnomics' own terms for redistributing what it serves.

For each give the licence name or URL, whether public redisplay is allowed, attribution wording required, and any commercial-use restriction. Say plainly where a licence cannot be confirmed.

## Answer

Destatis passes the Open source test. The Bundesbank CRE series (BBDZ1, BBDR1) cannot be confirmed as passing; BIS statistics are also unconfirmed.

- **Destatis**: Data licence Germany - attribution - 2.0 (dl-de/by-2-0). Public and commercial reuse allowed with a source note naming the provider, the licence and a link; modifications and own calculations must be marked. Passes.
- **Bundesbank**: current terms are at bundesbank.de/en/homepage/user-information/terms-of-use-642972. Reuse is allowed if unaltered and credited "Source: Deutsche Bundesbank", but the ESCB reuse policy excludes third-party data without the originator's permission. No named licence. Medium confidence.
- **bulwiengesa and vdp** (the inputs behind BBDZ1/BBDR1): no redistribution terms found; bulwiengesa's imprint allows copies for private non-commercial use only. Unconfirmed. This is the blocker for the core CRE series.
- **BIS**: general material is non-commercial only; the statistics-specific terms could not be read (403/404). Unconfirmed.
- **DBnomics**: the aggregation is ODbL; the underlying data keeps the provider's licence.

Written confirmation is needed before the Bundesbank CRE series can be shown publicly. See the permission ticket.

Findings: [research/licences-for-core-sources.md](../research/licences-for-core-sources.md)
