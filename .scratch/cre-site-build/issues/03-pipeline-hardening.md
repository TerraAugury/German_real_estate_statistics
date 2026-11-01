# 03: Pipeline hardening: caching, failure and freshness

**What to build:** The fetch step is polite and resilient: unchanged series are not re-downloaded, an unreachable DBnomics never breaks the site, and each chart tells the truth about freshness.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Section 11 (cadence, failure, revisions, thresholds) and section 9 (Notes).

- [x] Per series, `indexed_at` is checked first and observations downloaded only if it moved; sequential requests, descriptive User-Agent, retry with backoff
- [x] Failed fetch reuses the last snapshot, records `fetch_failed` with its date, and the site still builds; a series with no snapshot fails the build
- [x] `stale` computed from the last period against 150 / 240 / 540 days (monthly / quarterly / annual) held in one config file
- [x] Revisions detected by diffing against the snapshot, `revised_at` set, build not blocked
- [x] Stale, fetch-failed and revised Notes appear with the fixed EN and DE texts, in the fixed order, inside the chart container
- [x] Manifest validation fails the build when an id is missing or frequency or start date differs
