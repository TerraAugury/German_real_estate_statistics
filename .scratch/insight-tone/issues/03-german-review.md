# 03: German review of the new strings

**What to build:** Every German string added by tickets 01 and 02 is checked by a named human against its English source, and the review lock records it, so the production build's review gate passes.

**Blocked by:** 01, 02

**Status:** ready-for-human

- [ ] The list of new and changed keys, and the changed Methodology prose, is attached under Comments
- [ ] A named reviewer has checked each against its English source, including the better and worse words and the **Tone** term
- [ ] `src/i18n/de.reviewed.lock` is updated through the review script
- [ ] `scripts/check-review.ts` passes

## Comments

Written by the implementing agent after tickets 01 and 02. The four interface strings below are new in this effort; their German is a draft and shows `[DRAFT]` in preview builds. The criteria stay open: a named human has to review them and run the review script; an agent cannot.

| Key | English | German draft |
|---|---|---|
| `insight.tone.better` | better | besser |
| `insight.tone.worse` | worse | schlechter |
| `insights.tone.legend` | “Better” and “worse” show how the latest value reads for an investor in office property. Where a tag carries neither, the value is in line with the average or neither side is better. Colour is never the only cue. | „Besser“ und „schlechter“ zeigen, wie der aktuelle Wert für Anleger in Büroimmobilien zu lesen ist. Trägt ein Etikett keines von beiden, liegt der Wert im Einklang mit dem Durchschnitt oder keine Seite ist besser. Farbe ist nie das einzige Merkmal. |
| `insights.tone.more` | How better and worse are judged | So werden besser und schlechter beurteilt |

Changed prose, in the Insights section of the Methodology (`content/de/methodology.md` against `content/en/methodology.md`, reviewed through the prose hash `page:methodology`):

- The bullet "Besser und schlechter" (EN "Better and worse"), placed after the verdict bullet.
- The table "Welche Richtung als besser gilt, je Einblick" (EN "Which direction counts as better, per Insight"): the column heads, the direction words ("höher", "niedriger", "keines von beiden" for "higher", "lower", "neither") and the one-line reasons. The first column repeats each Insight's German title from `manifest/insights.yaml`. The reasons for E and G were written to say why a value is worse, or why it is neutral.

Notes for the reviewer:

- "Einordnung" already names the Verdict in German ("Das Etikett vergleicht ..."); the new words "besser" and "schlechter" sit next to it, not in place of it.
- Both words describe how a value reads from the point of view of an investor in office property. They must not read as a cause, forecast or advice (GLOSSARY.md, Tone). The table marks two Insights as a judgement ("Redaktionelles Urteil").
- `GLOSSARY.md` gives Tone the German draft "Bewertung"; confirm or replace it.
- Record the review with `npx tsx scripts/review.ts "<your name>" insight.tone.better insight.tone.worse insights.tone.legend insights.tone.more`, then review the Methodology page the same way the earlier ones were. The production build still fails the review gate on many older unreviewed items (83 at the time of writing: the 4 keys above, the Methodology page and 78 from earlier efforts), so this ticket alone does not make a production build pass.
