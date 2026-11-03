# 06: Methodology: Insights section

**What to build:** A reader who follows "How this is calculated" lands on a Methodology section that explains Insights in plain language, in English and German.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 8.

- [x] An "Insights" section in the English and German Methodology pages, with an anchor the Insight source lines link to
- [x] Covers what exists after ticket 01: what an Insight is (no cause, no forecast), annual frequency and period means, shared period and the 10 and 20 observation thresholds, the three headline kinds, the verdict rule (mean, population standard deviation, plus or minus half)
- [x] The German page carries the review hash and shows `[DRAFT]` in previews until reviewed
- [x] Later tickets each add their own paragraph: 2015 = 100 as a reference point only, C's two-year shift, flow vs stock deflating, M's year-on-year change

## Notes

- The section also covers rebasing (2015 as a reference point, first shared year as fallback) and C's two-year shift, because tickets 03 and 04 built them before this ticket. Tickets 09 (flow vs stock deflating) and 10 (M's year-on-year change) add their paragraphs.
- The anchor is the heading's own slug, `#insights` in English and `#einblicke` in German; the source-line link takes it from the Insights page slug, so the heading text and the slug must stay equal (a test pins it).
- The English page changed, so the German page's review hash no longer matches: it shows `[DRAFT]` in previews until ticket 12.
