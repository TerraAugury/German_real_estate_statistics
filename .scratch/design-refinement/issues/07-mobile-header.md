# 07: Mobile header

**What to build:** At phone width the header takes about one row of masthead (name and language switch) and one row of navigation, so the content starts higher. Opening a menu does not cover the selectors on a KPI page unreadably, and Escape and outside focus still close it.

**Blocked by:** 01

**Status:** done

- [x] At 375 px the header is at most 110 px tall in EN and DE (measured in the preview)
- [x] The language switch sits on the masthead row; the nav stays reachable by keyboard
- [x] Menus open as a panel with its own background and close on Escape and on focus elsewhere
- [x] The current page is still marked with aria-current
- [x] No horizontal page scroll at 320 px
- [x] Any new string (for example a menu button) exists in EN and DE

## Notes

- Measured in the preview: header 61 px at 375 px (EN and DE), 73 px at 320 px in German (a three-line site name), down from about 215 px. No horizontal page scroll at 375 or 320 px.
- One masthead row: site name (15 px, may wrap to two lines), language switch, Menu button. With JavaScript the nav is a panel under the header that opens from Menu and lists Segments and KPIs inline; Escape closes an open group first, then the panel, and returns focus to the button. Without JavaScript the nav stays visible and wraps as before.
- New string `nav.menu` ("Menu" / "Menü", DE draft until ticket 11).
- No automated test: this is layout and an inline script, and the repo has no browser test seam for the layout file. Checked by hand in the preview.
