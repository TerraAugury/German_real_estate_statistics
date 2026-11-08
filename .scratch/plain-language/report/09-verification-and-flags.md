# Ticket 9: verification and consolidated flags

Branch `plain-language`. Baseline = `work` at `52903bb`, preview build (`INCLUDE_PROVISIONAL=1`).

## 1. Checks

| Check | Result |
|---|---|
| `vitest run` (26 files) | 413 passed (run with `--testTimeout=30000`: on this loaded machine two tests exceed the default 5 s without any code cause) |
| `tsc --noEmit` | clean |
| `astro check` | 0 errors, 0 warnings, 7 hints |
| Preview build (`INCLUDE_PROVISIONAL=1 astro build`) | passes, 197 pages |
| Production build / review gate (`scripts/check-review.ts`) | **fails as expected**: 93 German strings and pages are unreviewed (every changed German string, plus `page:about` and `page:methodology`). It passes again only after ticket 10, when a named human records the review. Nothing records a review automatically. |

## 2. Numbers against the baseline

`extract-numbers.mjs compare … --delta` on the preview build, 197 pages, both languages (main pages, KPI pages, KPI-view fragments, Insights, Links, Methodology, Sources, Availability, Segments, About):

- **SVG values (path data, coordinates, transforms, data attributes): identical on all 197 pages.**
- Displayed text numbers: no number removed. Only numbers added inside new prose:

| Token | Where it comes from |
|---|---|
| `1`, `-1` | Link panel sentence "from -1 … to +1" (ticket 6; 170 pages) |
| `100` | "set to 100 in the base year", index notes and Methodology (tickets 4, 5, 8) |
| `2013` | price-index note "we set 2013 to 100" (ticket 4) |
| `4`, `5` | Insights page example "from 4% to 5% is 1 percentage point" (ticket 5) |
| `3`, `10` | Methodology: "3 months" (Euribor explanation), "10-year German government bonds" (ticket 7) |
| `2008` | German Methodology "WZ 2008" (ticket 8, glossary term) |

No data value, threshold, formula or decimal rule changed.

## 3. English and German side by side (Methodology)

Section by section (Links, eight indicators, Insights, How to read): same number of list items, same number of bold lead-ins, and the same numbers except the additions above and the spelled-out "zehnjährige" against "10-year". The two language versions of the Links and Insights sections were also read paragraph by paragraph (by me and by a review agent). No difference in meaning remains. The differences that were found and how they were settled:

| Difference | Settled |
|---|---|
| German said "Zeitversatz" / "Versatz" / "Zeitpunkt" for the shift; English "lag" in the interface and "shift" on Methodology | both say shift / Verschiebung (tickets 6, 7, review fix) |
| German "Frequenz" / "Geografie" against the German selectors "Häufigkeit" / "Gebiet" | Methodology uses the selector words (ticket 7) |
| English "Indicator timing" against German "Verschiebung des Indikators" | English now "Indicator shift" (review fix) |
| German About: "Sie enthält keine Werbung und verkauft nichts." not in English | deleted on the owner's instruction (ticket 3) |
| German "im Feld „Verknüpfung nicht angezeigt“" against English "the panel says" | German now "die Grafik zeigt" (review fix) |
| English table title "7 major cities" against German "A-Städte" | same group (`geo.7-cities` says both); left |

## 4. Glossary scan (both languages)

Searched `en.yaml`, `de.yaml`, `content/*`, `manifest/*`:

- "reference series": only in Methodology as a gloss, "comparison line (the reference series)" (intended).
- "standard deviation" / "Standardabweichung": once per language, in brackets, in the Period bullet (intended).
- "rebased", "year-on-year", "lag", "Versatz", "Zeitversatz", "umbasiert", "Beobachtungen", "observations": none left in visitor text. Hits remain only in YAML key names (`insight.axis.rebased`, `link.lag.label`, …), comments in `manifest/insights.yaml`, and the URL anchors `#lag-0` and `#lag-2` (code-read; not changed).
- "points" on its own: `latest.change.diff` only (see flags). "Punkte": same key in German.
- Remaining stray: `GLOSSARY.md` Verdict entry still says "standard deviation" (internal doc).

## 5. Layout check (375 px and 1280 px, English and German, preview build)

Pages: Home, Insights, Links overview and matrix, KPI pages (initial yield, office vacancy), Methodology, About, in both languages (14 pages × 2 widths, scripted: right-edge, clipped text, buttons and tags; plus a screenshot of a German KPI page at 375 px).

- No broken text, cut-off buttons, tags or labels, and no missing labels. Visually hidden screen-reader text (`.vh`) is clipped by design and ignored.
- **German Link chart axis label** ("Verschiebung in Jahren (positiv: Indikator lief voraus, negativ: lief nach)") ran past the right edge at 375 px (399 px). Fixed by shortening the text to "Verschiebung in Jahren (positiv: Indikator früher, negativ: später)". With the preview-only "[DRAFT] " prefix it still measures 382 px; without the prefix, as in production, it fits.
- **Links matrix page: unresolved, existing.** The page already scrolled sideways before this work: the baseline overflow was +516 px (English) and +847 px (German) at 375 px, and +146 px (German) at 1280 px. The matrix sits in its own scroll area, but something on the page still makes the whole document wider. After this work it is +540 px (English) and +1079 px (German) at 375 px, and +378 px (German) at 1280 px with the "[DRAFT] " prefix (+233 px without it). Cause of the extra width: the German cell label "vorab gewählte Verschiebung: N-1" is longer than the old "vorab gewählter Versatz: N-1", and the label cannot wrap (`white-space: nowrap` in `Base.astro`). The remaining cause is CSS and is **left alone**, as the spec says. Options if you want it fixed: wrap the label (CSS), or shorten the German cell label (this would no longer match the quoted Methodology wording).

## 6. Consolidated flags

**Possibly wrong, contradictory or unclear (nothing changed unless stated)**

1. **ECB sentence exists** (Methodology, Insights, "Base year"): English "2015 is only a reference point (the year the ECB began buying assets)." and German line. The spec says it does not exist; it does. Per your decision it is **not rewritten and marked to be reviewed**. The next sentence ("The site does not claim that it caused anything.") is unclear about what "it" is.
2. **Legend against Methodology.** `insight.multiples.legend_growth_real` says "the gap between the lines in the latest year is the big number", while Methodology says the big number is the real growth for real office rents and real construction costs.
3. **Construction KPI definition** describes permits only, while the title says "permits, completions" (English and German agree).
4. **"Capital spending" / "investment"** and **"employment totals"**: the Methodology does not say whether the employment totals or their growth rates are added (the series is a total of persons, so the text says "add the two employment groups").
5. **Euribor, "percentage balances", "seasonally adjusted" and WZ 2008 explanations** come from general knowledge, not from other pages of the site. A reviewer should confirm them.
6. **Jargon left unexplained:** OECD "% balance" / "Saldo in %"; "core properties" (price and yield note); "appraisal-based" in indicator names; "supra-regional" (source's own name).
7. **German "von" / "mit überregionaler Bedeutung"** differ between series titles and the selector label.
8. **German "Fertigstellungen"** (Insight titles) against the glossary term "Baufertigstellungen".
9. **"Ratio" (English) against "Anteil" (German)** for Insight c; "Anteil" suggests at most 1.
10. **Insight titles and `measure` strings** still say "spread".
11. **"points"** in `latest.change.diff` (Home and KPI pages) because it also covers series that are not percentages.
12. **"pairs" (Methodology) against "periods compared" (interface)**; "yearly" (interface) against "annual" (Methodology).
13. **The word "shift"** also names the permits shift in the Insights section, a different thing from a Link shift.

**English/German differences:** see section 3. All found differences are settled; the open ones above are listed because they involve both languages.

**Text that also works as a key or ID (not changed):** Methodology headings (`Insights` / `Einblicke` are referenced by `slug('insights', lang)` in `panel.ts`; `Links`, `The eight indicators`, `How to read these figures` and the German headings are public anchors), series titles ending ", Germany" / ", Deutschland" (`landTitle()`), all YAML, series and Insight keys (including the "lag" key names and `links.lag.*`), `template:` and `shift:` values, URL anchors `#lag-0` / `#lag-2`, geographic proper names, attribution and credit lines.

**Mixed number formats (flagged, not fixed):** none found. German pages use decimal comma and English pages decimal point; the preview build shows no mixed format on the pages checked.

**Terms, Privacy and Impressum (out of scope, flags only; lawyer-reviewed text, not edited):**
- Terms section 6 lets visitors reuse charts and figures when they keep the source line, and also says "We grant no open licence to the site's own text". These can be read as pulling in different directions.
- Privacy "Server logs": "Cloudflare keeps them for the period set for its service" does not say how long.
- Terms and Privacy use "Links" in the sense of ordinary web links, while the site elsewhere uses "Link" for a KPI-to-indicator relationship (Terms section 4 uses it in that second sense). The same word has two meanings across the site.
- German versions were not compared line by line with the English legal texts.

**Overflow not fixed by text:** Links matrix page (section 5).

**Process flags:** the German `en_hash` and review dates in `content/de/about.md` and `content/de/methodology.md` are stale (front matter untouched on purpose); production build fails until ticket 10. The German is entirely unreviewed `[DRAFT]` in preview.
