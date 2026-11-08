# Ticket 1: baseline, inventory and flags

Status: waiting for the user's approval of the inventory and the glossary (`01-glossary.md`, also written into `GLOSSARY.md`). No user-facing text outside `GLOSSARY.md` has been edited.

## 1. Baseline

- Built from `work` HEAD `52903bb`, preview mode (`INCLUDE_PROVISIONAL=1`), existing snapshots, no fetch: 197 HTML pages (en/de pages plus 79 KPI-view fragments per language).
- Location, outside version control: `/Users/olivierelamine/Developer/German_real_estate_statistics-baseline/plain-language/` holding `dist/`, `numbers.json` and `HEAD.txt`.
- A second build of the same commit gave an identical fingerprint, so the extraction is repeatable.
- Existing checks at baseline: `vitest` 26 files / 413 tests pass; `astro check` 0 errors.
- The extractor is `.scratch/plain-language/tools/extract-numbers.mjs`. For every HTML page it records, in order, each numeric token in visible text and in `aria-label`/`title`/`alt`, and every attribute of every SVG element except `class`, `style` and `aria-label` (path data, coordinates, transforms).

## 2. Where user-facing text lives

| # | File | What it holds | EN / DE | Tickets |
|---|---|---|---|---|
| 1 | `src/i18n/en.yaml`, `src/i18n/de.yaml` | 250 interface strings per language, same keys | both files | 2 to 6, split per key in `01-key-assignment.tsv` |
| 2 | `content/{en,de}/about.md` | About page | both | 3 |
| 3 | `content/{en,de}/methodology.md` | Methodology page: Links, eight indicators, Insights, how to read | both | 7 (Links, eight indicators, how to read), 8 (Insights) |
| 4 | `manifest/insights.yaml` | 12 Insights: `title`, `measure`, `definition` inline `{en, de}` | both | 5 |
| 5 | `manifest/series.yaml` | 55 series: `title` and `unit` inline `{en, de}`. `attribution` (55) and `credit` (34) are fixed credit lines | both | 4 (`title`, `unit` only) |
| 6 | `src/pages/index.astro` | Language-redirect page: hard-coded `<title>German CRE statistics</title>` and links "English" / "Deutsch" | English title only | 2 (flag: "CRE" is an unexplained abbreviation) |
| 7 | `content/{en,de}/terms.md`, `privacy.md`, `legal-notice.md` | Legal pages | both | out of scope (flag only) |
| 8 | `GLOSSARY.md` | Vocabulary, edited in this ticket | EN | 1 |

Everything else was checked and holds no visitor-readable text of its own: `src/lib/*.ts`, `src/insight/insight.ts`, `src/link/link.ts`, `src/components/*.astro`, `src/layouts/Base.astro`, `src/pages/[lang]/**` all read their wording through `t(lang, key)`, the manifests or the prose pages. The only literals are separators (` › `, ` – `, `n = ` inside YAML values) and formatting code (`period()` gives "Q1 2026" in both languages; `day()` and `fmt()` use `Intl`). Chart tooltips, axis labels, alt text and screen-reader text all come from YAML keys (`insight.chart.label`, `home.spark.label`, `link.overlay.*`, `insight.axis.*`, `insight.tone.*`, `nav.breadcrumb`, `insights.jump`).

## 3. Assignment of interface keys

Counts of the 250 keys, one line per key in `01-key-assignment.tsv`:

| Ticket | Keys | What |
|---|---|---|
| 2 Shared interface wording | 96 | site name, nav, footer, language switch, Menu, `source.*` (citation and series details), generic Notes (prefix, stale, fetch failed, unavailable, revised), selector and place labels (`select.*`, `segment.*` names, `freq.*`, `geo.*`), `latest.*`, sparkline label, page names (`*.title`), verdict, tag and tone words, "Insight not shown", short history, average, "How this is calculated", back links, `na.source`, `kpi.noscript`, `kpi.not_available.licence` |
| 3 Home and About | 3 | `home.purpose`, `home.segments`, `home.hero.more`, plus `about.md` |
| 4 KPI pages | 42 | KPI titles and definitions, `kpi.insights.heading`, the `na.*` reasons, Segments intro, Availability, Sources page intro and column heads, series notes (`note.scope.*`, `note.short_window`, `note.short_cycle`, `note.partial_total`), plus series `title` and `unit` in `series.yaml` |
| 5 Insights | 53 | Insights page intro, tone legend, templates, units, legends, notes, axes, real construction index, plus `insights.yaml` text |
| 6 Links | 56 | Links intro, matrix, scale, legends, lag wording, Link panel text, `indicator.*` names, `note.nominal.*` |

Choices I made where the tickets are silent or overlap. Please confirm or correct:

1. **Segments pages, Availability and Sources** have no ticket of their own. I put them in ticket 4 (KPI pages), because their wording is KPI and Segment wording.
2. **Ticket 2 and ticket 5 both name "verdict and tone wording".** Ticket 2 takes the words (`insight.verdict.*`, `insight.tag.*`, `insight.tone.better/worse`, "Insight not shown"). Ticket 5 takes the sentences around them (`insight.template.*`, `insights.tone.legend`, notes, legends).
3. **Series `title` and `unit`** (used on KPI pages, Home, Links and Insights) go to ticket 4, which comes before tickets 5 and 6.
4. **Page names** (Methodology, About, Insights, Links, Sources, Availability, and the three legal page names) go to ticket 2 because they are nav labels. The legal page names are out of scope and stay.
5. **Methodology "How to read these figures"** goes to ticket 7, with the other non-Insights sections.

## 4. Text that also serves as a key or ID: do not change

| Text | Why |
|---|---|
| Methodology heading `Insights` (EN) and `Einblicke` (DE) | Astro makes the anchor `#insights` / `#einblicke` from the heading text, and `panel.ts` (lines 119 and 231) links to it through `slug('insights', lang)`. |
| Other Methodology headings: `Links`, `The eight indicators`, `How to read these figures`; DE `Verknüpfungen`, `Die acht Indikatoren`, `So lesen Sie diese Zahlen` | Not read by code, but they make public anchors that outside links may use. I propose leaving all four pairs as they are unless you approve rewording. |
| Destatis series `title` values ending `, Germany` / `, Deutschland` | `landTitle()` in `series.ts` replaces that exact ending for Land series and throws if it is missing (7 series use it). The ending stays; the wording before it may change. |
| All YAML keys, series keys, Insight keys (`a` to `o`), `template:` and `shift:` values | Code reads them. Note `insight.template.<template>` and `insight.shift.<n>` are built from them. |
| Markdown front matter (`en_hash`, `reviewed_by`, `reviewed_on`) | Review gate. Edits to English change the hash; an agent never records a review. |
| `attribution` and `credit` in `series.yaml`, `licence`, `publisher` | Fixed credit lines and proper names (spec decision 2). `credit.test.ts` asserts them. |
| Geographic proper names (`geo.*`, Länder, "A-Städte") | Official names. They are reviewed, not reworded. |

**Cross-copies.** Methodology quotes some interface text word for word: the three lag selector labels (`links.lag.0/1/2`), "Not shown", "Link not shown", "Insight not shown", "pre-set lag", "strongest", and the verdict words "in line with", "higher than", "lower than". Tickets 2, 5 and 6 settle these strings, and tickets 7 and 8 must copy the new wording, so the page and the interface stay the same.

## 5. Tests that assert wording

Files with literal wording assertions (rough count of lines): `insights.test.ts` 57, `source-line.test.ts` 24, `panel.test.ts` 19, `review.test.ts` 9, `notes.test.ts` 7, `links-page.test.ts` 6, `insights-index.test.ts` 5, `bundesbank.test.ts` 5 (upstream Bundesbank titles, not our text), `links.test.ts` 3, `home-index.test.ts` 3, `manifest.test.ts` 2, `home-hero.test.ts` 2, and single hits in `skeleton`, `pipeline`, `palette`, `kpi`, `insight`, `destatis`, `credit`. Number assertions (`decimals.test.ts`, regex digits in `insights.test.ts`) stay as they are.

## 6. Flags for the user

1. **Spec decision 8 is wrong: the ECB sentence exists.** `content/en/methodology.md` line 66 reads "2015 is only a reference point (the year the ECB began buying assets)." and `content/de/methodology.md` line 71 reads "…(das Jahr, in dem die EZB mit den Anleihekäufen begann)." This is the sentence the known fix targets. I plan to apply the fix in ticket 8 (EN "the year the ECB started its large government bond-buying programme (PSPP)" and the matching German). Ticket 8's criterion "report that the ECB sentence was not found" cannot be met; I would replace it with "fix applied".
2. **Shift paragraph already ends with a full stop** in both languages (EN line 67, DE line 72). The known fix has nothing to add there. Is a different paragraph meant? I will report "already present" otherwise.
3. **Growth charts sentence is partly fixed already.** EN reads "…is the big number, except in those two, where the big number is the real growth." The known fix asks for "except for real office rents". I will apply it in ticket 8 and reword so it is clear which Insights are meant; please confirm that "those two" means real office rents and real construction costs.
4. **EN and DE differences found so far.**
   - `about.md` German adds "Sie enthält keine Werbung und verkauft nichts." ("It has no advertising and sells nothing.") that English lacks. Spec decision 11 says rewrite both to the English meaning, which means dropping a claim the owner may want. I will leave it and ask in ticket 3.
   - German uses both "Versatz" (interface: `link.preset.mark`, `links.cell.preset*`) and "Verschiebung" (Methodology, glossary) for lag. I propose "Verschiebung".
   - English uses "headline number" in the growth legends and "big number" in Methodology. The plain term is "big number" (glossary).
   - German Methodology says "Vergleichsreihe" for the reference series; the glossary adds "Vergleichslinie" for chart lines.
5. **Mixed number formats:** not checked at inventory level. Tickets 2 to 8 flag any they meet; ticket 9 checks the built pages.
6. **Redirect page** `src/pages/index.astro` has an English-only `<title>` "German CRE statistics" (abbreviation not used elsewhere). Ticket 2 will use the site name without the abbreviation unless you object.
7. **Legal pages** (Terms, Privacy, Legal notice) were not read for this ticket; flags for unclear passages will come in ticket 9.
8. **Review gate:** any English change makes the German review hashes stale; a production build then fails, as the spec expects. Proof builds use `INCLUDE_PROVISIONAL=1`.
