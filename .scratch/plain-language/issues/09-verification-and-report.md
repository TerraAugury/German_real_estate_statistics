# 09: Verification and consolidated report

**What to build:** Proof that the rewrite changed words and nothing else, plus one flags report that gathers everything for the user. This ticket changes text only to fix overflow found here.

**Blocked by:** 2, 3, 4, 5, 6, 7, 8

**Status:** ready-for-agent

See `spec.md` for the scope, writing rules and decisions.

- [ ] Displayed numbers, chart data and SVG values on every main page match the baseline, in both languages, and the comparison is recorded
- [ ] The Insights and Links methodology pages are checked side by side, English against German, and any difference in meaning is listed
- [ ] A scan confirms glossary terms are used the same way on every page in both languages, and any stray old term ("reference series", "rebased", "standard deviation" on its own) is fixed or listed
- [ ] On a preview build at 375px and on desktop, in both languages, Home, one Insight, the Links overview and matrix, one KPI page and Methodology show no broken text, overflow, cut-off buttons, tags, chart labels or tooltips, or missing labels; overflow is fixed by shortening text only
- [ ] Overflow that text alone cannot fix is flagged and the CSS is left alone
- [ ] `vitest`, `tsc`, `astro check` and a preview build pass; the production review gate is expected to fail until ticket 10 and this is stated
- [ ] One flags report lists anything factually wrong, contradictory or unclear; every English/German difference found and how it was settled; texts that double as keys or IDs; mixed number formats (flagged, not fixed); passages to review in Terms, Privacy and Impressum; the ECB sentence not found; and any unresolved overflow
- [ ] The commit sets `**Status:** done` and ticks every criterion met
