import { day, fmt, period, t, valueFormat } from './i18n';
import { latestOf } from './latest';
import { insightChart, multiplesChart, sharedDomain, overlayChart, lagChart, lineChart } from './chart';
import { notesFor } from './notes';
import { href, slug, type Lang } from './routes';
import type { Series } from './series';
import { effectiveN, lagFor, noiseBand, targetOf, type LinkResult } from '../link/link';
import { linkResult } from './links';
import { compareLines, MIN_OBS, tone, type InsightResult } from '../insight/insight';
import type { InsightEntry } from './manifest';

export const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const noteHtml = (ns: string[]) => ns.map((n) => `<p class="note">${esc(n)}</p>`).join('');

/** The caveat a provisional licence name carries; the status chip says it instead. */
const UNCONFIRMED = / \(public reuse not confirmed\)$/;

/** Short citation of one series: publisher, licence (our Sources and licences page) and data date, with a Provisional chip. */
function citation(s: Series, lang: Lang, own: boolean): string {
  const name = s.provisional ? s.licence.name.replace(UNCONFIRMED, '') : s.licence.name;
  const chip = s.provisional ? ` <span class="chip">${t(lang, 'source.chip.provisional')}</span>` : '';
  const line = t(lang, s.credit ? 'source.cite.credit' : 'source.cite', { original: esc(s.credit ?? ''), publisher: esc(s.publisher), licence: `<a href="${href('sources', lang)}">${esc(name)}</a>${chip}`, period: period(lang, s.lastPeriod) });
  return `<span class="cite">${line}${own || s.derived ? ` / ${t(lang, 'source.own')}` : ''}</span>`;
}

/** Where one series came from: publisher and service, the id (links the series), retrieval date, and the original title and unit. */
function lineage(s: Series, lang: Lang): string {
  const id = `<a href="${esc(s.seriesUrl)}">${esc(s.seriesId)}</a>`;
  const how = s.service
    ? t(lang, 'source.detail.direct', { publisher: esc(s.publisher), service: s.service, id, retrieved: day(lang, s.retrievedAt) })
    : t(lang, 'source.detail.dbnomics', { publisher: esc(s.publisher), id });
  const original = s.original ? `<br>${s.original.title ? t(lang, 'source.original', { title: esc(s.original.title), unit: esc(s.original.unit) }) : t(lang, 'source.original.unit', { unit: esc(s.original.unit) })}` : '';
  const origin = s.original?.source ? `<br>${t(lang, 'source.original.source', { source: esc(s.original.source) })}` : '';
  const terms = s.terms ? `<br>${t(lang, s.derived ? 'source.terms.derived' : 'source.terms.original', { terms: `<a href="${esc(s.terms.url)}">${esc(s.terms.name)}</a>` })}` : '';
  return `<span class="lineage-item"><strong>${esc(s.title[lang])}</strong><br>${how}${original}${origin}${terms}</span>`;
}

/**
 * A plate's source footer, in two tiers: one short citation per series, then one closed disclosure with every
 * series' lineage. A native <details>, so it works without JavaScript. `own` marks a series as our own calculation.
 */
export function sourceBlock(series: Series | Series[], lang: Lang, own = false): string {
  const all = Array.isArray(series) ? series : [series];
  return `${all.map((s) => citation(s, lang, own)).join('<br>')}<details class="lineage"><summary>${t(lang, 'source.details')}</summary>${all.map((s) => lineage(s, lang)).join('')}</details>`;
}

const GLYPH = { up: '▲', down: '▼', flat: '▬' };
/**
 * The latest value in large numerals with its unit and period, and its change since the previous period as text and a
 * glyph, so direction never rests on colour. It describes the move and does not judge it. A percent unit is the numeral's own suffix.
 */
export function latestBlock(s: Series, lang: Lang): string {
  const l = latestOf(s), pct = s.unit[lang] === '%';
  const num = pct ? fmt(lang, l.value / 100, { ...valueFormat(s), style: 'percent' }) : fmt(lang, l.value, valueFormat(s));
  const c = l.change;
  let delta = '';
  if (c) {
    const since = period(lang, c.since), sign = { signDisplay: 'exceptZero', maximumFractionDigits: 1 } as const;
    const text = c.direction === 'flat' ? t(lang, 'latest.unchanged', { period: since })
      : c.kind === 'pct' ? t(lang, 'latest.change.pct', { change: fmt(lang, c.amount, { ...sign, style: 'percent' }), period: since })
      : t(lang, 'latest.change.diff', { change: fmt(lang, c.amount, sign), period: since });
    delta = ` <span class="delta ${c.direction}"><span aria-hidden="true">${GLYPH[c.direction]}</span> ${text}</span>`;
  }
  return `<p class="latest"><span class="num">${num}</span>${pct ? '' : ` <span class="unit">${esc(s.unit[lang])}</span>`} <span class="when">${period(lang, l.period)}</span>${delta}</p>`;
}

/** Compact chart for Home cards and Segment pages: latest value, chart, stale and fetch-failed Notes, citation line (spec section 9). */
export const compactChart = (s: Series, lang: Lang) => latestBlock(s, lang) + lineChart(s, lang, 200)
  + noteHtml(notesFor(s, lang, { on: 'compact' })) + `<figcaption>${sourceBlock(s, lang)}</figcaption>`;

/** Link panel HTML for one KPI x indicator pair. Pure given the result, so it tests without the Link module. */
export function renderPanel(kpi: Series, ind: Series, r: LinkResult, lang: Lang, geography = t(lang, 'geo.germany'), id?: string, preset = false): string {
  const notes = notesFor(kpi, lang, { on: 'link', indicator: ind, pairs: r.shown ? r.headline.n : undefined });
  const head = `<p class="back"><a href="${href('links', lang)}">← ${t(lang, 'link.back')}</a></p>
<h3>${t(lang, 'link.title', { kpi: esc(kpi.title[lang]), indicator: esc(ind.title[lang]) })}</h3>
<p>${t(lang, 'link.scope', { geography: esc(geography) })}</p>`;
  let body: string;
  if (!r.shown) {
    body = `<p>${t(lang, r.reason === 'constant' ? 'link.not_shown.constant' : 'link.not_shown', { n: String(r.n0) })}</p>`;
  } else {
    const pts = (k: 'kpi' | 'indicator') => r.overlay.flatMap((o) => (o[k] === null ? [] : [{ period: o.period, value: o[k]! }]));
    const names = { kpi: kpi.title[lang], indicator: ind.title[lang] };
    const N = r.lags.filter((l) => l.rho !== null).length;
    body = overlayChart(pts('kpi'), pts('indicator'), { kpiUnit: kpi.unit[lang], indicatorUnit: ind.unit[lang], title: t(lang, 'link.overlay.chart', names) }, lang)
      + `<p class="note">${t(lang, 'link.overlay.legend', { kpi: esc(names.kpi), indicator: esc(names.indicator) })}</p>`
      + lagChart(r.lags, r.strongest.lag, { lag: t(lang, 'link.lag.label'), rho: t(lang, 'link.rho.label'), mark: t(lang, 'link.strongest.mark'), bands: r.lags.filter((l) => l.rho !== null).map((l) => ({ lag: l.lag, band: noiseBand(l.n, targetOf(kpi.freq)) })), preset: preset ? { lag: lagFor(kpi.freq, 1), label: t(lang, 'link.preset.mark') } : undefined, title: t(lang, 'link.lags.label', { kpi: kpi.title[lang], indicator: ind.title[lang] }) }, lang)
      + `<p class="note">${t(lang, 'link.band.legend', { n: String(r.headline.n), band: fmt(lang, noiseBand(r.headline.n, targetOf(kpi.freq)), { maximumFractionDigits: 2 }) })}${targetOf(kpi.freq) === 'Q' ? ' ' + t(lang, 'link.band.adjusted', { eff: String(effectiveN(r.headline.n, 'Q')) }) : ''}</p>`
      + `<p>${t(lang, 'link.headline', { rho: fmt(lang, r.headline.rho!, { maximumFractionDigits: 2 }), n: String(r.headline.n) })}</p>`
      + `<p>${t(lang, 'link.strongest', { n: String(N) })}</p>`
      + `<p>${t(lang, 'link.sentence', { period: t(lang, 'link.period', { from: period(lang, r.span[0]), to: period(lang, r.span[1]) }), n: String(r.headline.n) })}</p>`;
  }
  return `<figure class="link-panel"${id ? ` id="${esc(id)}"` : ''}>${head}${noteHtml(notes)}${body}<figcaption>${sourceBlock([kpi, ind], lang, true)}</figcaption></figure>`;
}

/** Compute (once per build) and render; the Link takes the KPI's frequency (spec section 6). */
export const linkPanel = (kpi: Series, ind: Series, lang: Lang, geography?: string, id?: string, preset?: boolean) =>
  renderPanel(kpi, ind, linkResult(kpi, ind), lang, geography, id, preset);

type Shown = Extract<InsightResult, { shown: true }>;

/** An Insight's number in the page locale: ratios to two decimals, everything else to one. */
const headlineNumber = (e: InsightEntry, lang: Lang) => {
  const digits = e.headline === 'ratio' ? 2 : 1;
  return (n: number) => fmt(lang, n, { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

/** How an Insight's tone shows: a class that tints its whole plate and a visually hidden word for screen readers; both empty where it reads in line or has no better side. */
const toneOf = (e: InsightEntry, r: Shown, lang: Lang) => {
  const v = tone(r.verdict, e.better);
  return v === 'neutral' ? { plate: '', word: '' } : { plate: `tone-${v}`, word: ` <span class="vh">(${t(lang, `insight.tone.${v}`)})</span>` };
};

/** An Insight's headline number with its unit and verdict tag, then the hidden tone word: the same spans lead its section, tile its index entry and open Home. */
const headlineSpans = (e: InsightEntry, r: Shown, lang: Lang) =>
  `<span class="num">${headlineNumber(e, lang)(r.latest.value)}</span> <span class="unit">${t(lang, `insight.unit.${e.headline}`)}</span> <span class="tag ${r.verdict}">${t(lang, `insight.tag.${r.verdict}`)}</span>${toneOf(e, r, lang).word}`;

/** The line above the Insights index that says what "better" and "worse" mean, linking to the Methodology section that lists each direction. */
export const renderToneLegend = (lang: Lang) =>
  `<p class="note">${t(lang, 'insights.tone.legend')} <a href="${href('methodology', lang)}#${slug('insights', lang)}">${t(lang, 'insights.tone.more')}</a></p>`;

/** The grid that opens the Insights page: per Insight its title, headline number with unit and verdict tag, or why it is not shown. */
export function renderInsightIndex(models: { entry: InsightEntry; result: InsightResult }[], lang: Lang): string {
  const items = models.map(({ entry: e, result: r }) => {
    const plate = r.shown ? toneOf(e, r, lang).plate : '';
    const body = r.shown
      ? `<span class="headline">${headlineSpans(e, r, lang)}</span>`
      : `<span class="na">${t(lang, 'insight.not_shown', { n: String(r.n), min: String(MIN_OBS) })}</span>`;
    return `<li><a href="#${esc(e.key)}"${plate ? ` class="${plate}"` : ''}><span class="title">${esc(e.title[lang])}</span>${body}</a></li>`;
  });
  return `<ul class="insight-grid">${items.join('')}</ul>`;
}

/** What leads an Insight, shared by its section and the Home hero: headline number with verdict tag, the reading, the chart, its Notes. */
function insightLead(e: InsightEntry, r: Shown, series: Series[], lang: Lang, now: Date) {
  const one = headlineNumber(e, lang);
  const unitKey = `insight.unit.${e.headline}`;
  const reading = t(lang, `insight.template.${e.template}`, {
    measure: esc(e.measure[lang]), latest: one(r.latest.value), verdict: t(lang, `insight.verdict.${r.verdict}`), from: r.from, to: r.to, mean: one(r.mean), emp: r.context ? one(r.context.at(-1)!.value) : '',
  });
  const notes = [...notesFor(series[0], lang, { on: 'insight', rest: series.slice(1), short: r.short ? { from: r.from, to: r.to, n: r.n } : undefined }, now),
    ...(e.notes ?? []).map((k) => `${t(lang, 'note.prefix')}: ${t(lang, k)}`)];
  const chart = insightChart(r, { unit: t(lang, unitKey), average: t(lang, 'insight.average', { value: one(r.mean) }), title: t(lang, 'insight.chart.label', { title: e.title[lang], measure: e.measure[lang] }) }, lang);
  const reference = series[e.series.findIndex((x) => x.role === 'reference')];
  return {
    reading, notes, chart, reference, plate: toneOf(e, r, lang).plate,
    headlineHtml: `<p class="headline">${headlineSpans(e, r, lang)}</p>`,
    legend: r.context ? `<p class="note">${t(lang, 'insight.context.legend', { measure: esc(e.measure[lang]), title: esc(reference.title[lang]) })}</p>` : '',
  };
}

/** The Home hero: the lead Insight's headline, reading, chart and citation, with a link to the full Insight. Empty when it is not shown. */
export function renderHero(e: InsightEntry, r: InsightResult, series: Series[], lang: Lang, now = new Date()): string {
  if (!r.shown) return '';
  const { headlineHtml, reading, chart, legend, notes, plate } = insightLead(e, r, series, lang, now);
  return `<section class="hero${plate && ` ${plate}`}"><h2>${esc(e.title[lang])}</h2>${headlineHtml}<p>${reading}</p>`
    + `<figure>${chart}${legend}${noteHtml(notes)}<figcaption>${sourceBlock(series, lang, true)}<br><a href="${href('insights', lang)}#${esc(e.key)}">${t(lang, 'home.hero.more')}</a></figcaption></figure></section>`;
}

/** One Insight section: headline number with verdict tag, the reading, the chart (spec insights section 5). Pure given the result. */
export function renderInsight(e: InsightEntry, r: InsightResult, series: Series[], lang: Lang, now = new Date()): string {
  const head = `<p class="back"><a href="${href('insights', lang)}#index">← ${t(lang, 'insight.back')}</a></p><h2>${esc(e.title[lang])}</h2>`;
  if (!r.shown) return `<section class="insight" id="${esc(e.key)}">${head}<p class="na">${t(lang, 'insight.not_shown', { n: String(r.n), min: String(MIN_OBS) })}</p></section>`;
  const { headlineHtml, reading, chart, legend, notes, reference, plate } = insightLead(e, r, series, lang, now);
  const kpis = series.filter((_, i) => e.series[i].role === 'kpi');
  const refTitle = e.shift ? t(lang, 'insight.shifted', { title: reference.title[lang], shift: t(lang, `insight.shift.${e.shift}`) }) : reference.title[lang];
  // The headline's lines are the first KPI series'; every other KPI series gets its own small chart over the same years.
  const years = r.points.map((p) => p.period);
  const all = kpis.map((k, i) => (i === 0 ? r.lines : compareLines(k, reference, years, e)));
  // A chart that mixes a rate (own unit) with an index needs two axes, as on the Links; the rest share one domain.
  const dual = all.map((l) => !!l.rebased && l.rebased.kpi !== l.rebased.reference);
  const domain = sharedDomain(all.filter((_, i) => !dual[i]));
  const multiples = kpis.map((kpi, i) => {
    const growth = !!all[i].growth;
    const rebased = all[i].base ? t(lang, 'insight.axis.rebased', { year: all[i].base! }) : '';
    const title = t(lang, growth ? 'insight.multiples.label_growth' : 'insight.multiples.label', { kpi: kpi.title[lang], reference: refTitle });
    const [kpiUnit, refUnit] = dual[i] ? [all[i].rebased!.kpi ? rebased : kpi.unit[lang], all[i].rebased!.reference ? rebased : reference.unit[lang]] : [growth ? t(lang, 'insight.axis.growth') : all[i].base ? rebased : kpi.unit[lang], ''];
    const chart = dual[i] ? overlayChart(all[i].kpi, all[i].reference, { kpiUnit, indicatorUnit: refUnit, title }, lang) : multiplesChart(all[i], { unit: kpiUnit, title }, domain, lang);
    return `<div class="multiples"><h3>${t(lang, 'insight.multiples.title', { kpi: esc(kpi.title[lang]), reference: esc(refTitle) })}</h3>`
      + chart
      + `<p class="note">${t(lang, dual[i] ? 'insight.multiples.legend_dual' : growth ? (e.series.some((x) => x.role === 'deflator') ? 'insight.multiples.legend_growth_real' : 'insight.multiples.legend_growth') : 'insight.multiples.legend', { kpi: esc(kpi.title[lang]), reference: esc(refTitle) })}</p>`
      + (!dual[i] && !growth && all[i].base ? `<p class="note">${t(lang, 'insight.multiples.base_note', { year: all[i].base! })}</p>` : '')
      + (growth && e.headline === 'growth' ? `<p class="note">${t(lang, 'insight.multiples.real_growth')}</p>` : '') + '</div>';
  }).join('');
  return `<section class="insight${plate && ` ${plate}`}" id="${esc(e.key)}">${head}`
    + headlineHtml
    + `<p>${reading}</p>`
    + `<figure>${chart}${legend}${multiples}${noteHtml(notes)}<figcaption>${sourceBlock(series, lang, true)}<br><a href="${href('methodology', lang)}#${slug('insights', lang)}">${t(lang, 'insight.method')}</a></figcaption></figure></section>`;
}
