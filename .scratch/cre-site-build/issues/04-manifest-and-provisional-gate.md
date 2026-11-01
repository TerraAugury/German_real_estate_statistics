# 04: Full series manifest, provisional gate and Sources & licences

**What to build:** Every series in the spec has a manifest entry, flagged `provisional` where the licence is unconfirmed, and the public build excludes flagged series and their Links. A Sources & licences page lists one row per live series.

**Blocked by:** 01

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Sections 3, 4, 5 and 11.

- [ ] Hand-written manifest covers all CRE series (BBDZ1, Destatis) and all Economic indicator series with the ids and start dates in the spec
- [ ] `provisional: true` set for the BBDZ1 CRE series, the four Bundesbank macro series and OECD confidence; ECB and Destatis not flagged
- [ ] Default build removes provisional series and every Link using them; `INCLUDE_PROVISIONAL=1` includes them for preview builds
- [ ] Sources & licences page: publisher, DBnomics series id, licence, attribution per series, in both languages
- [ ] Open items resolved or listed: remaining Destatis `FLC002` series for other building types and their start dates
