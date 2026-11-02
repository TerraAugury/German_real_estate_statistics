# 09: Switch Destatis series and wire CI

**What to build:** The 9 Destatis manifest entries use `source: destatis` and CI provides the credentials only where needed.

**Blocked by:** 04, 08

**Status:** ready-for-agent

Spec: `.scratch/direct-source-migration/spec.md`, decision 11, story 26.

- [ ] Comparison report run for the Destatis series and reviewed
- [ ] Manifest entries switched; snapshots regenerated; build, tsc, vitest and astro check pass
- [ ] CI reads the Destatis login from secrets for the data job only; preview builds work without it
- [ ] No credential appears in the repo, logs or artifacts
