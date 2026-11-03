# 08: Destatis GENESIS fetcher

**What to build:** A series with `source: destatis` is fetched from GENESIS and stored with the same metadata as Bundesbank series.

**Blocked by:** 01, 07

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decisions 6, 7, 8, 14, 15, story 14-15.

- [x] POST `data/cube` with form parameters, flat-file parsed into parts, retry and backoff, User-Agent
- [x] Credentials read from environment; when absent, the series is skipped with a warning and its snapshot is left untouched (no failure flag), build continues
- [x] Länder sum and unit scaling reproduce the committed values for unchanged periods
- [x] An empty or discontinued-table response is a failed refresh (discontinued is also recorded as unavailable); a malformed cube is a `BadResponse` that fails the build loudly
- [x] Tests with canned flat-file responses, including missing credentials
