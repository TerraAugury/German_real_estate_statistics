# Spec: Rewrite all user-facing text on remsa.pages.dev in plain language (English and German)

## Original request

**Goal.** Make every page easy to read for a non-specialist (for example a journalist or a junior investor), without changing what the text means. The site exists in English and German. Rewrite both. After the rewrite, the two versions must say the same thing, page by page.

**Scope.**
- In scope: all text a visitor can read, in both languages, including page copy, methodology pages (Insights, Links, etc.), chart titles, axis labels, tooltips, captions, notes, verdict and tag wording, "Insight not shown" and other messages, and alt text and screen-reader text.
- Out of scope: calculations, data, thresholds, layout, styling, URLs, and code identifiers. Do not rename variables, keys, CSS classes, or anything code reads.
- If a piece of text is also used as a key or ID in code, do not change it. List it in the report instead.

**Writing rules (both languages).**
1. Short sentences, one idea each, about 20 words at most.
2. Everyday words: "KPI" becomes "main line"; "reference series" becomes "comparison line"; "rebased" becomes "set to 100 in the base year"; "standard deviation" becomes "usual spread", with the technical term kept once in brackets on methodology pages.
3. Keep needed technical terms (percentage points, index, real/nominal, GDP, NACE sections) but explain each in plain words the first time it appears on a page.
4. Same term for the same thing everywhere, following the glossary.
5. Active voice; "we" for the site.
6. Keep every warning in place: not a cause, not a forecast, our own reading, rough stand-in, and so on. Plain language must not remove caution.
7. Do not change any number, year, threshold, decimal rule, or formula. Formulas may stay as written.
8. Add no new content, claims, or explanations beyond what the text already says, except the known fixes.

**German version.**
1. "Einfache Sprache" (not "Leichte Sprache").
2. Write the German natively; do not translate the new English line by line. The meaning must match; the wording does not have to.
3. Keep the form of address the site already uses (Sie) everywhere.
4. Avoid long noun chains and passive constructions. Break up long compounds when a short phrase is clearer ("Vorjahresveränderungsrate" becomes "Veränderung zum Vorjahr").
5. Standard German terms for statistics, explained once per page: Prozentpunkte, Verbraucherpreisindex, Bruttoinlandsprodukt (BIP), Leerstandsquote, Baugenehmigungen, Baufertigstellungen, Wirtschaftsabschnitte J und K bis N (WZ 2008).
6. Do not change how numbers are formatted (decimal comma, thousands separator). If English and German formats are mixed anywhere, flag it but do not fix it.

**Known fixes (both languages).**
- ECB: "the year the ECB began buying assets" becomes "the year the ECB started its large government bond-buying programme (PSPP)".
- Growth charts: "The gap between the two lines in the latest year is the big number" must add "except for real office rents" (real growth uses the exact formula).
- Vacancy and employment: "The two are added up" is ambiguous. Make clear that the two employment groups (section J and sections K to N) are added together, not vacancy and employment.
- Add the missing full stop at the end of the "Shift" paragraph.

**Process.**
1. List every file and component holding user-facing text, in both languages. Report before editing.
2. Make the glossary in both languages (English term, plain English term, German term). Report it.
3. Rewrite page by page, with surgical edits only. Do not reformat surrounding code.
4. Report one table per page and per language: original text, new text, reason (only if the meaning could shift).
5. Flag, without changing, anything that seems factually wrong, contradictory, or unclear beyond the known fixes, and any place where English and German say different things.

**Done when.**
- Every user-facing string in scope reviewed in both languages; before/after tables cover all changes.
- No number, threshold, formula, or calculation output has changed (compare displayed values before and after on the main pages).
- English and German say the same thing on every page; spot-check at least the Insights and Links methodology pages side by side.
- Glossary terms used the same way on every page, in both languages.
- The site builds and every page renders with no broken text, overflow, or missing labels, on mobile and desktop. German runs about 20 to 30% longer than English: check buttons, tags, chart labels and tooltips.
- All existing tests pass.

## Decisions from the grilling session

1. **Review gate.** English edits invalidate the German review hashes, and a production build fails on unreviewed German. Agents never record a German review. The build is proven with a preview build (`INCLUDE_PROVISIONAL=1`, which shows `[DRAFT]`). A named human records the review (ticket 10). The production gate is expected to fail until then.
2. **Legal pages.** Terms, Privacy and Impressum (legal notice) are out of scope: they carry lawyer-reviewed wording. Flag unclear passages only. **About is in scope.** Attribution lines in the series manifest are fixed credit lines and stay as they are.
3. **Glossary.** `GLOSSARY.md` stays canonical and gains a plain-English column. "main line" and "comparison line" apply only where the text means a chart line in an Insight. Where "KPI" means the category (the KPI pages), keep "KPI" and explain it once per page.
4. **Tests.** Tests that assert literal wording are updated to the new text. Assertion text only; anything touching a number or threshold is left alone and reported.
5. **New content.** Explaining a technical term is the only allowed addition: at most one short sentence per term, and only where the page has no explanation yet.
6. **Numbers unchanged.** Build the current `work` HEAD first as a baseline. After the rewrite, compare all displayed numbers, chart data and SVG values in both languages. Prose may differ; numbers must match exactly.
7. **Delivery.** A branch cut from `work`. Reports live in `.scratch/plain-language/report/`. One commit per ticket (page group); each commit sets its ticket `done`.
8. **ECB fix.** The sentence "the year the ECB began buying assets" does not exist in the repo. Report "sentence not found" and write nothing new.
9. **Approval gate.** Ticket 1 stops after the inventory and glossary and waits for the user's OK before any text is touched.
10. **Sentence length.** The 20-word limit applies to prose. Formulas and lists are exempt. Split long sentences wherever the meaning survives the split.
11. **Existing EN/DE differences.** Flag in the report and rewrite both sides to the English meaning. Where the English itself looks wrong or unclear, leave both sides and wait for the user.
12. **Overflow.** Check 375px mobile and desktop in both languages on a preview build (Home, one Insight, Links overview and matrix, one KPI page, Methodology). Fix overflow by shortening text only; if that is not enough, flag it and leave CSS alone.
13. **Coverage.** Report tables list changed strings only. Each ticket also keeps a one-line-per-key coverage list of strings already plain and left alone.

## Running order

Tickets 2 to 6 depend only on ticket 1, but they edit the same interface-string files. **Run them one at a time.**

## Tickets

1. Baseline, inventory and glossary
2. Shared interface wording
3. Home and About
4. KPI pages
5. Insights
6. Links
7. Methodology: data and Links sections
8. Methodology: Insights section and known fixes
9. Verification and consolidated report
10. German review (human)
