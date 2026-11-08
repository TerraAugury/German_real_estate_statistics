# 09: Verification and consolidated report

**What to build:** Proof that the rewrite changed words and nothing else, plus one flags report that gathers everything for the user. This ticket changes text only to fix overflow found here.

**Blocked by:** 2, 3, 4, 5, 6, 7, 8

**Status:** done

See `spec.md` for the scope, writing rules and decisions.

- [x] Displayed numbers, chart data and SVG values on every main page match the baseline, in both languages, and the comparison is recorded
- [x] The Insights and Links methodology pages are checked side by side, English against German, and any difference in meaning is listed
- [x] A scan confirms glossary terms are used the same way on every page in both languages, and any stray old term ("reference series", "rebased", "standard deviation" on its own) is fixed or listed
- [x] On a preview build at 375px and on desktop, in both languages, Home, one Insight, the Links overview and matrix, one KPI page and Methodology show no broken text, overflow, cut-off buttons, tags, chart labels or tooltips, or missing labels; overflow is fixed by shortening text only
- [x] Overflow that text alone cannot fix is flagged and the CSS is left alone
- [x] `vitest`, `tsc`, `astro check` and a preview build pass; the production review gate is expected to fail until ticket 10 and this is stated
- [x] One flags report lists anything factually wrong, contradictory or unclear; every English/German difference found and how it was settled; texts that double as keys or IDs; mixed number formats (flagged, not fixed); passages to review in Terms, Privacy and Impressum; the ECB sentence (it exists; not rewritten, to be reviewed); and any unresolved overflow
- [x] The commit sets `**Status:** done` and ticks every criterion met

## Comments

Report: `report/09-verification-and-flags.md`. One text fix for overflow (German Link chart axis label). The Links matrix page already overflowed before this work and is wider in German now; it is flagged and the CSS is left alone. The production review gate fails with 93 unreviewed German items until ticket 10.
