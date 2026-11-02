# 05: Switch Bundesbank datasets to the direct source

**What to build:** The 42 Bundesbank manifest entries use `source: bundesbank`, dataset by dataset, with the site reading the new snapshots. Series stay provisional unless cleared by the flag and an owner decision.

**Blocked by:** 02, 03, 04

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decisions 11, 12, story 1-2.

- [x] Datasets switched in order BBDZ1, BBSIS, BBIM1, BBNZ1, BBDL1, each after its comparison report is reviewed
- [x] Snapshots regenerated; build, tsc, vitest and astro check pass after each dataset
- [x] No DBnomics fallback remains for switched series
- [x] Provisional flags unchanged by this ticket (lifting them is out of scope)
