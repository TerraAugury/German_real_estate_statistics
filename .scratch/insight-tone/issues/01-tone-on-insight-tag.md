# 01: Tone on the Insight tag

**What to build:** Each Insight's verdict tag is coloured better, worse or neutral, so a visitor scanning the Insights page sees at a glance which headline values are favourable for an office investor. Each Insight declares which direction is better; the tone is the Verdict read through that direction, never the sign of the number. The colour shows wherever the tag shows: the Insights index, each Insight section and the Home lead. A one-line legend above the grid explains the colours. See `spec.md` for the direction of each Insight.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Every Insight in the declaration states its better direction (higher, lower or none); G and C are none; the build fails when one is missing or unknown
- [x] A pure, tested rule gives the tone from the Verdict and the direction: in line is neutral; higher is better where higher is better, and worse where lower is better; and the reverse for lower; a direction of none is always neutral
- [x] Tests cover negative values both ways: a negative vacancy change reads better, and a negative spread above a more negative average is "higher than" and reads by its direction, not its sign
- [x] A neutral Insight (G, C) shows the plain verdict tag, as today
- [x] The tag shows the better or worse colour and a word for it ("better" / "worse"); a neutral tag shows no extra word; colour is never the only signal
- [x] The better and worse colours are new tokens for light and dark, distinct from the blue/ochre of the Links overview and the above/below hues of the small charts, with the contrast checks in the palette tests extended to them
- [x] A one-line legend above the Insights index explains better, worse and in line (and that some Insights carry no better or worse), and states the office-investor perspective
- [x] The Insights index, an Insight section and the Home lead agree for the same Insight; a test covers all three from one result
- [x] New strings have English and a German draft, and `GLOSSARY.md` gains a **Tone** term (DE draft) that keeps Verdict's meaning unchanged
- [x] Checked in the preview at 1024 px and 375 px in light and dark: no horizontal scroll, text still readable on every tone
- [x] `vitest`, `tsc`, `astro check` and the preview build pass; the production build stops only at the German review gate (ticket 03), as it did before this effort

## Notes

- `tone(verdict, better)` lives in `src/insight/insight.ts`; `better` is a required field of every Insight in `manifest/insights.yaml` (higher, lower or none) and the build check rejects a missing or unknown value. Directions: A, F, B, D, I higher; E, M, J lower; G, C none.
- `headlineSpans` in `src/lib/panel.ts` adds the tone word after the verdict tag, so the Insights index, each section and the Home lead agree; a neutral Insight gets no word. The verdict text on the tag is unchanged.
- New tokens `better` and `worse` in `src/lib/palette.ts` (light and dark), checked at 4.5:1 on the page and plate. The word always goes with the colour.
- Preview checks: three tiles per row at 1024 px; one column at 375 px in dark mode with no horizontal scroll; Insight D reads "-0.1, higher than the average, better".
- New strings: `insight.tone.better`, `insight.tone.worse`, `insights.tone.legend` (German drafts). The legend does not yet link to the Methodology section; ticket 02 adds that link.
- The production build's review gate lists 82 unreviewed German strings, 3 of them from this ticket.
