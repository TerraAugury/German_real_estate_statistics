# 01: Licence checks for every data source

**What to build:** Every licence and redisplay question that gates launch is settled and recorded in one place. Human task: the terms pages block fetchers, and the requests are sent by the owner. It replaces the three scattered tickets listed under Consolidates; they stay open until this one is done.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

Consolidates:
- `.scratch/cre-site/issues/08-licence-permission-for-cre-series.md`
- `.scratch/cre-site/issues/14-licences-for-indicator-sources.md`
- `.scratch/direct-source-migration/issues/10-legal-enquiries.md`

Background: `.scratch/cre-site/issues/07-licences-for-core-sources.md`, `docs/bundesbank-data-licensing.md`. The Bundesbank questions below overlap, so one message to the Bundesbank can cover them all.

## Bundesbank CRE series (BBDZ1, BBDR1)

- [ ] Written confirmation from the Bundesbank statistics service, and where needed bulwiengesa AG and vdp, that the series may be redisplayed on a public website with attribution, including commercial use
- [ ] BIS "Terms of permitted use of BIS statistics" opened in a browser and recorded verbatim
- [ ] Each answer, or its absence, recorded per series; a refusal or no reply moves the series to Out of scope

## Economic indicator sources

- [ ] OECD, Bundesbank macro datasets (BBSIS, BBIM1, BBNZ1, BBDL1) and ECB terms read on the primary pages
- [ ] Per provider: licence name, required attribution and any commercial-use limit, recorded in the Sources & licences wording (ECB is already verified, record its wording)

## Direct sources and the repository

- [ ] Bundesbank asked: do the ESCB terms cover vdpResearch, bulwiengesa, Destatis and Federal Employment Agency data; is automated access allowed and at what rate
- [ ] Decided whether the public repository counts as redistribution of the snapshots
- [ ] Answers recorded in `docs/bundesbank-data-licensing.md` section 9, with the list of series that may be set `provisional: false`

## Closing

- [ ] Manifest updated: each cleared series `provisional: false`, each refused series moved to Out of scope
- [ ] Tickets 08, 14 and `direct-source-migration/10` resolved with a pointer to this ticket
