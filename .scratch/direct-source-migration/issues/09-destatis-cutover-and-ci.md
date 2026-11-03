# 09: Switch Destatis series and wire CI

**What to build:** The 9 Destatis manifest entries use `source: destatis` and CI provides the credentials only where needed.

**Blocked by:** 04, 08

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decision 11, story 26.

- [x] Comparison report run for the Destatis series and reviewed
- [x] Manifest entries switched; snapshots regenerated; build, tsc, vitest and astro check pass
- [x] CI reads the Destatis login from secrets for the data job only; preview builds work without it
- [x] No credential appears in the repo, logs or artifacts
