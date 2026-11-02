# Comparison reports (2026-11-03)

Direct Bundesbank fetch against the committed DBnomics snapshots, from `tsx scripts/compare.ts <dataset>`. One file per dataset.

- No series is missing a period at the Bundesbank; every series has 0 or more new periods at the end.
- BBDZ1 (38 series): the newest quarter or two are revised by the Bundesbank, with one new quarter (2026-Q2). Older periods are identical.
- BBSIS (Bund yield), BBDL1 (loan rate): identical history, 4 new months.
- BBIM1 (unemployment): one revised month (2024-12: 6.2 to 6.1), 4 new months.
- BBNZ1 (real GDP, 2020=100): every one of 225 values differs, by a factor between 0.992 and 1.008, so the entire history was re-chained, not just rebased. The Bundesbank notes the index is a chain-linked Laspeyres index with annual overlap, so a new annual overlap or a Destatis revision explains it. Direction and growth rates of recent years need no change; levels are not comparable with the old snapshot.
- Flagged as third-party (original source is not the Bundesbank): the vdpResearch and bulwiengesa series, the Destatis-sourced construction and GDP series, and unemployment (Federal Employment Agency). Bund yield and loan rate carry no third-party source.
