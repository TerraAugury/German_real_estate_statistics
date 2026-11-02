# 01: Snapshot source metadata and source field

**What to build:** Snapshots can record where and in what original form a series came from, and the manifest chooses the fetcher per series. Behaviour for existing DBnomics series is unchanged.

**Blocked by:** none

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decisions 1, 4, 10.

- [x] Manifest entries accept `source` (bundesbank | destatis | dbnomics, default dbnomics); manifest test rejects unknown values
- [x] Snapshot parts gain optional fields: source name, source URL, original title, unit, unit multiplier, decimals, original-source comment, validFrom, retrieved-at, response hash
- [x] Existing committed snapshots still load and validate unchanged
- [x] The refresh step dispatches on `source`; only the dbnomics path exists yet, others fail clearly
- [x] Tests through the refresh seam with injected `get`
