# 16: Visual design

**What to build:** the look from the 2026-11-02 design mockup (claude.ai artifact "German CRE statistics redesign"), using only the interface strings that already exist. A cool grey page, blue-black ink, one data blue and an ochre highlight; IBM Plex Sans with Condensed for chart axes and Mono for DBnomics series ids, all self-hosted. Every chart sits on a white plate that holds its title, notes and source line, so a screenshot of the plate is a citation. Charts render twice, wide and narrow, and CSS shows the one that fits, so phone axis text stays legible.

**Status:** done

- [x] Fonts are self-hosted through the build; the site requests nothing from a third-party host
- [x] Colours are custom properties on `:root`; chart code uses the same values
- [x] The header nav wraps at phone width, with no horizontal page scroll at 375 px
- [x] The Segments and KPIs dropdowns open as a panel over the page instead of pushing the header apart
- [x] The current page is marked in the nav with `aria-current`
- [x] Every chart figure is a plate with no browser-default figure indent
- [x] Line, level and lag charts render a wide and a narrow SVG; below 560 px the narrow one shows, with axis text at least 11 px
- [x] Line charts label the latest value at the end of the line and keep a tooltip on every point
- [x] The strongest lag bar is ochre, not the error red
- [x] A Link panel shows its two level charts side by side on wide screens and stacked on phones
- [x] DBnomics series ids are monospace and wrap anywhere
- [x] Availability and Links cells are coloured by kind: available, licence not confirmed, no Open source
- [x] Selectors are at least 44 px tall with their labels above
- [x] Visible keyboard focus on links, buttons and selects
- [x] KPI pages stay within the ticket 12 page weight

## Notes

- Copy changes from the mockup need new strings and a German review, so they are ticket 17: Availability footnotes, Home "Other KPIs" grouping, the per-indicator list above the Link panels.
- The mockup's phone menu button needs a new "Menu" string; the nav wraps instead.
- The wide or narrow chart is picked by a container query on the chart's own box (narrow below 640 px), not the viewport, so Home cards, Link panel level charts and tablet widths all get legible text. Narrow renders at 320 px with 13 px text and stretches to at most 28rem.
- Code review fixes: edge-lag "strongest" labels anchor away from the plot edge; DBnomics ids are monospace on the Sources page too, and its table scrolls in its own box; grey bars and select borders darkened to 3:1; dropdowns close on Escape and on focus elsewhere; empty Links overview cells are blank; a test checks the wide/narrow pair.
- Available cells are a light blue tint, not the mockup's solid blue: with provisional series included, most of the grid is available and solid blue drowned the gaps.
- Fonts come from `@fontsource` packages (Plex Sans 400/500/600, Condensed 400/500, Mono 400); Astro copies the woff2 files into `dist/_astro`.
