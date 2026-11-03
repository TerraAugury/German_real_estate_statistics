# 01: Shared design tokens

**What to build:** The palette lives in one place that both the page CSS and the build-time chart code read, so a colour changes once. There is one heading scale for page and plate headings. The palette gains a diverging blue-to-ochre scale for later use (Links heatmap, spreads), and every ochre use that carries text meets 4.5:1 on its background.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One module exports the palette; the page CSS custom properties and the chart code both come from it
- [ ] A test fails if the CSS custom properties and the chart colours drift apart
- [ ] Page, plate and card headings share one scale with no per-container overrides of the same level
- [ ] A diverging scale (negative blue, neutral, positive ochre) exists as tokens
- [ ] Text in ochre (or on an ochre tint) is at least 4.5:1; graphics at least 3:1
- [ ] Every page renders as before (no visible change apart from heading sizes)
