# 04: Comparison report: new fetcher against committed snapshots

**What to build:** A one-off command prints, per series, the periods and values that differ between the direct fetch and the committed snapshot, so each dataset can be reviewed before flipping.

**Blocked by:** 02

**Status:** ready-for-agent

Spec: `.scratch/direct-source-migration/spec.md`, decision 11, story 20.

- [ ] Command takes a dataset or series key and prints new periods, changed values and missing periods; makes no change to snapshots
- [ ] Runs for all 42 Bundesbank series; output explains or flags the GDP-wide difference (revision or rebase) in a short note in the report file
- [ ] Report for each Bundesbank dataset saved under the feature folder
- [ ] Test on fixtures: identical, revised, extended and missing-period cases
