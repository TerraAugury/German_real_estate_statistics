# 09: Logistics hint in the Segments menu

**What to build:** The Segments dropdown ends with a muted line "Logistics: not available, see Availability" linking to the Availability page. Logistics still has no Segment page (cre-site spec section 8) and the route table does not change.

**Blocked by:** 07

**Status:** done

- [x] The line shows in both languages and links to Availability
- [x] It is not marked as the current page on any Segment page
- [x] No new route and no new page; `built` is unchanged
- [x] The new string exists in EN and DE

## Notes

- The line is the last item of the Segments dropdown, muted and ruled off, linking to Availability. It never takes `aria-current`, so Office, Retail and Commercial overall stay the only marked Segment pages. `routes` and `built` are untouched.
- New string `nav.logistics` (DE draft until ticket 11). No automated test: it is navigation markup in the layout; checked in the preview in EN and DE.
