# Design refinement

Source: the 2026-11-03 design review of the built site (desktop and 375 px, EN and DE). Direction: the value of the series is the loudest element on each plate; sources stay present but quiet.

Decisions (owner, 2026-11-03):

- Logistics keeps no Segment page (cre-site spec section 8); the Segments menu only gains a note line pointing to Availability.
- Home may lead with an Insight. This reopens the insights spec's "Home feature stays out" decision; the lead is an Insight that passes the Provisional gate in the production build, and Home falls back to the KPI index when none does.
- The source block collapses into a short citation line plus a details disclosure. A closed plate still names publisher, licence and data date.
- Dark mode follows the system setting (`prefers-color-scheme`); there is no toggle, so it adds no interface strings.

Constraints: no new third-party host; page weight (ticket 12 of cre-site-build) unchanged; copy follows GLOSSARY.md (co-movement, never cause or forecast); every new string gets German and a human review before production (the review gate).
