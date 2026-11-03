# 01: Shared design tokens

**What to build:** The palette lives in one place that both the page CSS and the build-time chart code read, so a colour changes once. There is one heading scale for page and plate headings. The palette gains a diverging blue-to-ochre scale for later use (Links heatmap, spreads), and every ochre use that carries text meets 4.5:1 on its background.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] One module exports the palette; the page CSS custom properties and the chart code both come from it
- [x] A test fails if the CSS custom properties and the chart colours drift apart
- [x] Page, plate and card headings share one scale with no per-container overrides of the same level
- [x] A diverging scale (negative blue, neutral, positive ochre) exists as tokens
- [x] Text in ochre (or on an ochre tint) is at least 4.5:1; graphics at least 3:1
- [x] Every page renders as before (no visible change apart from heading sizes)

## Notes

- `src/lib/palette.ts` is the one palette; `Base.astro` injects it as `:root` custom properties and `chart.ts` reads the same values. A test fails if either file gains a colour literal.
- Heading scale: `--step-4` to `--step-0` custom properties (large number, page title, section, plate, body-size sub-heading); phone sizes redefine them in one media query. Plate headings went from 1.3rem to 1.2rem at phone width, the only visible change.
- Ochre text uses the new `strong-text` (5.4:1 on the plate); `strong` (4.2:1) stays for lines and bars. Nothing renders ochre text yet.
