# 10: Dark mode

**What to build:** The site follows the system colour scheme. In dark mode the page, plates, charts, heatmap, chips and tags are readable with the same meaning (blue data, ochre highlight, diverging scale). There is no toggle and no stored preference. Charts follow the scheme without a rebuild.

**Blocked by:** 02, 03, 04, 05, 06, 07, 08, 09

**Status:** ready-for-agent

- [ ] Dark values for every token exist beside the light ones, with the same contrast floors (text 4.5:1, graphics 3:1)
- [ ] Chart colours switch with the scheme (CSS custom properties reach the SVG); a test checks no chart hard-codes a light-only hex
- [ ] Heatmap, chips, tags, hatched not-available cells and the legend are legible in dark
- [ ] Form controls and focus rings follow the scheme (`color-scheme` set)
- [ ] The `<meta name="color-scheme">` or equivalent avoids a white flash on load
- [ ] Checked in the preview at desktop and 375 px, EN and DE, in both schemes
