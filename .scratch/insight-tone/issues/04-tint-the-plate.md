# 04: Tint the Insight plate by tone

**What to build:** A better Insight shows a light green tint and a worse Insight a light magenta tint across its whole plate: its tile on the Insights index, its Insight section and the Home lead. The coloured better/worse pill and its visible word are gone. The plain verdict pill ("higher than the average", "in line with the average") stays. An Insight that reads in line, or has no better side (G, C), keeps the plain plate. The tint comes from the same tone rule as before (verdict read through the declared direction), so it still never follows the sign of the number. Because the tint is now the only visible cue, the words "better" and "worse" stay as visually hidden text for screen readers.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The Insights index tile, the Insight section and the Home lead each carry a tone mark that the same Insight shares across the three; a test covers the three from one result, in both languages, as the pill test does today
- [ ] A better tone gives a light green tint and a worse tone a light magenta tint on the whole plate; in line, and G and C, give no tint
- [ ] The coloured tone pill and its visible word are removed; the verdict pill is unchanged
- [ ] The words "better" and "worse" remain in the page as visually hidden text on a tinted plate, so colour is not the only cue; a test checks the hidden word is present on a tinted plate and absent on a plain one
- [ ] The tints are tokens for light and dark; ink and muted text stay at least 4.5:1 on each tint, and the verdict pill and the headline number stay readable on it (palette tests extended)
- [ ] The tints stay distinct in hue from the Links overview shades and from each other
- [ ] The legend above the index and the Methodology "Better and worse" bullet describe a tinted plate instead of a pill, and no longer say "tag" for the tone; English and German drafts
- [ ] Section and Home lead plates are padded, rounded boxes when tinted, and a plain Insight keeps its current layout
- [ ] Checked in the preview at 1024 px and 375 px, in light and dark, in English and German: no horizontal scroll, text readable on every tint
- [ ] `vitest`, `tsc`, `astro check` and the preview build pass

## Notes

- Decisions (owner, 2026-11-03): tint only, no visible word; in line stays plain; the tint also goes on sections and the Home lead; the verdict pill stays. See `spec.md`.
- This changes strings ticket 03 lists (`insights.tone.legend`, the Methodology bullet), so 03 is blocked by this ticket.
