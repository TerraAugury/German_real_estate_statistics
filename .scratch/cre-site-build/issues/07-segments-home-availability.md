# 07: Segment pages, Home cards and Availability grid

**What to build:** A reader can enter by Segment, see the six headline KPIs on Home, and see every gap explained on Availability.

**Blocked by:** 06

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 4, 8 and 9.

- [x] Office, Retail and Commercial overall pages, one compact national chart per KPI in catalogue order, each linking to its KPI page; no Logistics page
- [x] Not available cells shown as greyed placeholders "Not available: no Open source for [reason]"
- [x] Home: purpose paragraph, six KPI cards with latest value and period, Segment entry points; only stale and fetch-failed Notes on cards and compact charts
- [x] Availability page: full KPI x Segment grid with the reason for each Not available cell, linked from the footer and every Segment page

## Comments

Shipped 2026-11-01. `cell()` in `src/lib/kpis.ts` decides each KPI x Segment cell from the catalogue: a Segment with no catalogue view is "Not available: no Open source for [reason]" (reason strings `na.<page>.<segment>`); a catalogue view with no live series is the licence gap. Segment pages, Home and Availability all read it. Compact charts carry only stale and fetch-failed Notes (`notes()` no longer shows Revised). Also added: breadcrumbs on Segment and KPI pages (ticket 06 left them here), Segments dropdown and Availability in the header, geography coverage on Available cells.

Left for the owner or other tickets:
- A compact chart shows the first series of its view. Commercial overall Construction therefore shows office permits only; the KPI page has both building types.
- Initial yield, Office vacancy and commercial-overall Rent index have no national series, so their Home card and Segment chart show the first City class (7 major cities); the series title names the class.
- In the default build five of six Home cards are the licence placeholder until the Bundesbank permission is confirmed.
- New German strings are unreviewed ([DRAFT]) until the owner records a review.
