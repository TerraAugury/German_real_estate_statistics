# 04: Tint the Insight plate by tone

**What to build:** A better Insight shows a light green tint and a worse Insight a light magenta tint across its whole plate: its tile on the Insights index, its Insight section and the Home lead. The coloured better/worse pill and its visible word are gone. The plain verdict pill ("higher than the average", "in line with the average") stays. An Insight that reads in line, or has no better side (G, C), keeps the plain plate. The tint comes from the same tone rule as before (verdict read through the declared direction), so it still never follows the sign of the number. Because the tint is now the only visible cue, the words "better" and "worse" stay as visually hidden text for screen readers.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] The Insights index tile, the Insight section and the Home lead each carry a tone mark that the same Insight shares across the three; a test covers the three from one result, in both languages, as the pill test does today
- [x] A better tone gives a light green tint and a worse tone a light magenta tint on the whole plate; in line, and G and C, give no tint
- [x] The coloured tone pill and its visible word are removed; the verdict pill is unchanged
- [x] The words "better" and "worse" remain in the page as visually hidden text on a tinted plate, so colour is not the only cue; a test checks the hidden word is present on a tinted plate and absent on a plain one
- [x] The tints are tokens for light and dark; ink and muted text stay at least 4.5:1 on each tint, and the verdict pill and the headline number stay readable on it (palette tests extended)
- [x] The tints stay distinct in hue from the Links overview shades and from each other
- [x] The legend above the index and the Methodology "Better and worse" bullet describe a tinted plate instead of a pill, and no longer say "tag" for the tone; English and German drafts
- [x] Section and Home lead plates are padded, rounded boxes when tinted, and a plain Insight keeps its current layout
- [x] Checked in the preview at 1024 px and 375 px, in light and dark, in English and German: no horizontal scroll, text readable on every tint
- [x] `vitest`, `tsc`, `astro check` and the preview build pass

## Notes

- Decisions (owner, 2026-11-03): tint only, no visible word; in line stays plain; the tint also goes on sections and the Home lead; the verdict pill stays. See `spec.md`.
- This changes strings ticket 03 lists (`insights.tone.legend`, the Methodology bullet), so 03 is blocked by this ticket.
- Done: `toneOf` in `src/lib/panel.ts` gives a plate class (`tone-better`, `tone-worse`) and the visually hidden word (`.vh`); the index tile, `section.insight` and `section.hero` carry the class, so the three agree (tested in both languages). The old `.tone` pill and its `better`/`worse` colour tokens are gone; `better-tint` and `worse-tint` replace them in `src/lib/palette.ts` (light and dark), with ink, muted, `data` and ochre text at 4.5:1 and the chart lines at 3:1 on each, and 25 degrees of hue from the other colours.
- A tinted Insight section keeps its white chart cards (they have their own plate), so charts keep their contrast; only the area around the headline and reading is tinted, with padding and a rounded corner.
- The legend now names the colours ("light green", "light pink") and says screen readers get the words. The Methodology bullet describes a tinted plate. Both have German drafts.
- Checks: `vitest`, `tsc`, `astro check` and the preview build pass; checked in the preview at 1024 px and 375 px (light and dark, English and German) with no horizontal scroll. The Home lead is tinted the same way (tested); the preview's lead, Insight A, reads in line and so shows plain.
- Review gate: 83 unreviewed German strings, as before this ticket (`insights.tone.legend` changed, no key added).
- Review fixes: the hidden word is wrapped as "(better)" / "(worse)" so a screen reader does not read "lower than the average better"; the plate CSS keys on `section.tone-better` and `section.tone-worse` instead of a substring match; a test asserts the legend no longer says "tag", "pill" or "Etikett".
- Known weak spots: the hue-distance check on near-white tints is a loose guarantee, and a tint alone is weak under WCAG 1.4.1 for sighted users (owner chose tint only, so the hidden words are for screen readers).
