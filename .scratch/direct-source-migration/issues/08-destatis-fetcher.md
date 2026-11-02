# 08: Destatis GENESIS fetcher

**What to build:** A series with `source: destatis` is fetched from GENESIS and stored with the same metadata as Bundesbank series.

**Blocked by:** 01, 07

**Status:** ready-for-agent

Spec: `.scratch/direct-source-migration/spec.md`, decisions 6, 7, 8, 14, 15, story 14-15.

- [ ] POST `data/tablefile` with form parameters, flat-file parsed into parts, retry and backoff, User-Agent
- [ ] Credentials read from environment; when absent, existing snapshots are kept and a Note is added, build continues
- [ ] Länder sum and unit scaling reproduce the committed values for unchanged periods
- [ ] Empty, malformed or discontinued-table responses are failed refreshes
- [ ] Tests with canned flat-file responses, including missing credentials
