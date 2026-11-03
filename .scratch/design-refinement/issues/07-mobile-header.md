# 07: Mobile header

**What to build:** At phone width the header takes about one row of masthead (name and language switch) and one row of navigation, so the content starts higher. Opening a menu does not cover the selectors on a KPI page unreadably, and Escape and outside focus still close it.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] At 375 px the header is at most 110 px tall in EN and DE (measured in the preview)
- [ ] The language switch sits on the masthead row; the nav stays reachable by keyboard
- [ ] Menus open as a panel with its own background and close on Escape and on focus elsewhere
- [ ] The current page is still marked with aria-current
- [ ] No horizontal page scroll at 320 px
- [ ] Any new string (for example a menu button) exists in EN and DE
