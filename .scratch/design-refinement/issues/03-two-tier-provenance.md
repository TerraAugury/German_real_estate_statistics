# 03: Two-tier provenance

**What to build:** Every plate (KPI, Home, Segment, Link panel, Insight) shows a short citation line: publisher, licence and data date. Everything else (series id, service, retrieval date, original series and unit) sits in a native details disclosure that works without JavaScript. "Licence not confirmed" shows as a status chip, not as running text.

**Blocked by:** 01

**Status:** done

- [x] The short line keeps the licence link to Sources and licences and the "own calculation" marker
- [x] The details hold every fact the source line holds today, in the same wording; existing source-line tests still pass or move to the details
- [x] Link panels and Insights keep one citation per series
- [x] The Provisional licence state is a chip with text, visible on every plate that has it
- [x] The details open and close by keyboard; focus is visible
- [x] A plate with the details closed is shorter than today's on Home (no more than two lines of source text at 1024 px)

## Notes

- `sourceBlock` (src/lib/panel.ts) replaces `sourceLine`: one `.cite` per series, then one `<details class="lineage">` holding every series' lineage (title, publisher, service, series id link, retrieval date, original title and unit). Link panels and Insights share one disclosure for their series.
- Strings: `source.line` and `source.line.direct` became `source.cite`, `source.detail.dbnomics`, `source.detail.direct`, `source.details`, `source.chip.provisional`. DE are drafts until ticket 11.
- The chip uses the glossary's term "Provisional" ("Vorläufig"); the licence name drops its "(public reuse not confirmed)" tail when the series is provisional. Production never shows the chip: provisional series are gated out.
- Home card citation is two lines at card width (about 340 px) plus the "Series details" summary.
