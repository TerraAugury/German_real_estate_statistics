# Insights page and site integration

Label: wayfinder:grilling
Type: grilling (HITL)
Status: resolved
Blocked by: 03

## Question

How do Insights fit into the existing site? Settle:

- the Insights page: route and slug (EN/DE route table), intro text, nav position, and the empty state when every Insight is Provisional in production
- the links from KPI pages to the Insights that use them: wording and placement
- how Insights are declared: a new hand-written file alongside `manifest/series.yaml`, or entries in it, and the build checks on it
- Notes (stale, revised, fetch failed, short window) at Insight level, and the multi-series source line with "own calculation"
- new i18n keys and the German review flow for reading templates
- `npm run dev` showing Provisional series by default
- the Methodology page section for Insights

## Answer

- **Route and nav**: page key `insights`, slug `insights` (EN) / `einblicke` (DE), added to `routes` and `built` in `src/lib/routes.ts`. Nav entry after Links, before Availability ("Insights" / "Einblicke"). Footer unchanged. No Home card and no Insights column on the Links overview (out of this spec).
- **Page**: two-sentence intro, a jump list of the visible Insights' titles, then one section per Insight in catalogue order; section id = the Insight's `key`. If production hides every Insight, the page still builds with one sentence (none published yet, licences being confirmed); the nav entry stays.
- **KPI page links**: an "Insights using this KPI" list below the Link panels, one link per Insight (its title, to `/insights#key`), only Insights that pass the Provisional gate, absent when none do. Initial yield: A, F. Rent index: B, D, G, I. Price index: G. Office vacancy: E, M. Construction: C, J.
- **Declaration**: new hand-written `manifest/insights.yaml`. Entry: `key`, EN/DE `title`, `headline` (spread | growth | ratio), `series` with a `role` (kpi | reference), options (`deflate: flow`, `shift: 2`, `base: 2015`), reading template key. Order is file order. Provisional status is derived from the series, never declared. Build fails on: unknown series key, no KPI series (checked against `KPIS` in `src/lib/kpis.ts`), duplicate key, missing title in either language, unknown headline kind or template. The 10-observation minimum is the "not shown" state, not a build error.
- **Notes**: Link-panel pattern. Order: the Insight's own short-history Note (shared period under 20), then each series' stale, fetch-failed and revised Notes prefixed with the series title; scope Notes (index, city class, combined) once. Source line under the chart: the existing line once per series, calculated series tagged `source.own` (spread, real, rebased, shifted, Bund annual mean), plus a "How this is calculated" link to Methodology.
- **i18n and review**: titles in `insights.yaml` (manifest-text pattern); reading templates, verdict words, intro, empty state, new Notes and list heading as `insight.*` keys in `en.yaml`/`de.yaml`. Covered by the existing `de.reviewed.lock` hash flow (production fails on unreviewed German, previews show `[DRAFT]`); no new mechanism. Numbers through `Intl`.
- **Dev default**: `"dev": "INCLUDE_PROVISIONAL=1 astro dev"`; `build` stays production, `INCLUDE_PROVISIONAL=1 npm run build` is the preview. This also shows all Provisional series and `[DRAFT]` German in dev.
- **Methodology**: new "Insights" section in `content/en/methodology.md` and `content/de/methodology.md`: what an Insight is (no cause or forecast), annual frequency and period means, shared period and the 10/20 thresholds, 2015 = 100 as a reference point only, flow vs stock deflating (only B deflates, as a flow), the three headline kinds, the verdict rule (mean, population SD, +/- half SD), C's two-year shift, M's year-on-year change. German Reviewed through the prose hash.
