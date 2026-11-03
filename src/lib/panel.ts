import { day, fmt, period, t } from './i18n';
import { latestOf } from './latest';
import { insightChart, multiplesChart, sharedDomain, levelChart, lagChart, lineChart } from './chart';
import { notesFor } from './notes';
import { href, slug, type Lang } from './routes';
import type { Series } from './series';
import type { LinkResult } from '../link/link';
import { linkResult } from './links';
import { compareLines, MIN_OBS, type InsightResult } from '../insight/insight';
import type { InsightEntry } from './manifest';

export const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const noteHtml = (ns: string[]) => ns.map((n) => `<p class="note">${esc(n)}</p>`).join('');

/** The caveat a provisional licence name carries; the status chip says it instead. */
const UNCONFIRMED = / \(public reuse not confirmed\)$/;

/** Short citation of one series: publisher, licence (our Sources and licences page) and data date, with a Provisional chip. */
function citation(s: Series, lang: Lang, own: boolean): string {
  const name = s.provisional ? s.licence.name.replace(UNCONFIRMED, '') : s.licence.name;
  const chip = s.provisional ? ` <span class="chip">${t(lang, 'source.chip.provisional')}</span>` : '';
  const line = t(lang, 'source.cite', { publisher: esc(s.publisher), licence: `<a href="${href('sources', lang)}">${esc(name)}</a>${chip}`, period: period(lang, s.lastPeriod) });
  return `<span class="cite">${line}${own || s.derived ? ` / ${t(lang, 'source.own')}` : ''}</span>`;
}

/** Where one series came from: publisher and service, the id (links the series), retrieval date, and the original title and unit. */
function lineage(s: Series, lang: Lang): string {
  const id = `<a href="${esc(s.seriesUrl)}">${esc(s.seriesId)}</a>`;
  const how = s.service
    ? t(lang, 'source.detail.direct', { publisher: esc(s.publisher), service: s.service, id, retrieved: day(lang, s.retrievedAt) })
    : t(lang, 'source.detail.dbnomics', { publisher: esc(s.publisher), id });
  const original = s.original ? `<br>${s.original.title ? t(lang, 'source.original', { title: esc(s.original.title), unit: esc(s.original.unit) }) : t(lang, 'source.original.unit', { unit: esc(s.original.unit) })}` : '';
  return `<span class="lineage-item"><strong>${esc(s.title[lang])}</strong><br>${how}${original}</span>`;
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
  const num = pct ? fmt(lang, l.value / 100, { style: 'percent', maximumFractionDigits: 2 }) : fmt(lang, l.value, { maximumFractionDigits: 2 });
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

/** Compact chart for Home cards and Segment pages: latest value, chart, stale and fetch-failed Notes, source line (spec section 9). */
export const compactChart = (s: Series, lang: Lang) => latestBlock(s, lang) + lineChart(s, lang, 200)
  + noteHtml(notesFor(s, lang, { on: 'compact' })) + `<figcaption>${sourceBlock(s, lang)}</figcaption>`;

/** Link panel HTML for one KPI x indicator pair. Pure given the result, so it tests without the Link module. */
export function renderPanel(kpi: Series, ind: Series, r: LinkResult, lang: Lang, geography = t(lang, 'geo.germany'), id?: string): string {
  const notes = notesFor(kpi, lang, { on: 'link', indicator: ind, pairs: r.shown ? r.headline.n : undefined });
  const head = `<h3>${t(lang, 'link.title', { kpi: esc(kpi.title[lang]), indicator: esc(ind.title[lang]) })}</h3>
<p>${t(lang, 'link.scope', { geography: esc(geography) })}</p>`;
  let body: string;
  if (!r.shown) {
    body = `<p>${t(lang, r.reason === 'constant' ? 'link.not_shown.constant' : 'link.not_shown', { n: String(r.n0) })}</p>`;
  } else {
    const col = (k: 'kpi' | 'indicator', s: Series) =>
      `<div><h4>${esc(s.title[lang])}</h4>` + levelChart(r.overlay.flatMap((o) => (o[k] === null ? [] : [{ period: o.period, value: o[k]! }])), s.unit[lang], t(lang, 'link.overlay.label', { title: s.title[lang] }), lang, k === 'indicator') + '</div>';
    const N = r.lags.filter((l) => l.rho !== null).length;
    body = `<div class="pair">${col('kpi', kpi)}${col('indicator', ind)}</div>`
      + lagChart(r.lags, r.strongest.lag, { lag: t(lang, 'link.lag.label'), rho: t(lang, 'link.rho.label'), mark: t(lang, 'link.strongest.mark'), title: t(lang, 'link.lags.label', { kpi: kpi.title[lang], indicator: ind.title[lang] }) }, lang)
      + `<p>${t(lang, 'link.headline', { rho: fmt(lang, r.headline.rho!, { maximumFractionDigits: 2 }), n: String(r.headline.n) })}</p>`
      + `<p>${t(lang, 'link.strongest', { n: String(N) })}</p>`
      + `<p>${t(lang, 'link.sentence', { period: t(lang, 'link.period', { from: period(lang, r.span[0]), to: period(lang, r.span[1]) }), n: String(r.headline.n) })}</p>`;
  }
  return `<figure class="link-panel"${id ? ` id="${esc(id)}"` : ''}>${head}${noteHtml(notes)}${body}<figcaption>${sourceBlock([kpi, ind], lang, true)}</figcaption></figure>`;
}

/** Compute (once per build) and render; the Link takes the KPI's frequency (spec section 6). */
export const linkPanel = (kpi: Series, ind: Series, lang: Lang, geography?: string, id?: string) =>
  renderPanel(kpi, ind, linkResult(kpi, ind), lang, geography, id);

/** One Insight section: headline number with verdict tag, the reading, the chart (spec insights section 5). Pure given the result. */
export function renderInsight(e: InsightEntry, r: InsightResult, series: Series[], lang: Lang, now = new Date()): string {
  const head = `<h2>${esc(e.title[lang])}</h2>`;
  if (!r.shown) return `<section class="insight" id="${esc(e.key)}">${head}<p class="na">${t(lang, 'insight.not_shown', { n: String(r.n), min: String(MIN_OBS) })}</p></section>`;
  const digits = e.headline === 'ratio' ? 2 : 1; // ratios two decimals, everything else one
  const one = (n: number) => fmt(lang, n, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const unitKey = `insight.unit.${e.headline}`;
  const reading = t(lang, `insight.template.${e.template}`, {
    measure: esc(e.measure[lang]), latest: one(r.latest.value), verdict: t(lang, `insight.verdict.${r.verdict}`), from: r.from, to: r.to, mean: one(r.mean), emp: r.context ? one(r.context.at(-1)!.value) : '',
  });
  const notes = notesFor(series[0], lang, { on: 'insight', rest: series.slice(1), short: r.short ? { from: r.from, to: r.to, n: r.n } : undefined }, now);
  const chart = insightChart(r, { unit: t(lang, unitKey), average: t(lang, 'insight.average', { value: one(r.mean) }), title: t(lang, 'insight.chart.label', { title: e.title[lang], measure: e.measure[lang] }) }, lang);
  const reference = series[e.series.findIndex((x) => x.role === 'reference')];
  const kpis = series.filter((_, i) => e.series[i].role === 'kpi');
  const refTitle = e.shift ? t(lang, 'insight.shifted', { title: reference.title[lang], shift: t(lang, `insight.shift.${e.shift}`) }) : reference.title[lang];
  // The headline's lines are the first KPI series'; every other KPI series gets its own small chart over the same years.
  const years = r.points.map((p) => p.period);
  const all = kpis.map((k, i) => (i === 0 ? r.lines : compareLines(k, reference, years, e)));
  const domain = sharedDomain(all);
  const multiples = kpis.map((kpi, i) => {
    const unit = all[i].base ? t(lang, 'insight.axis.rebased', { year: all[i].base! }) : kpi.unit[lang];
    return `<div class="multiples"><h3>${t(lang, 'insight.multiples.title', { kpi: esc(kpi.title[lang]), reference: esc(refTitle) })}</h3>`
      + multiplesChart(all[i], { unit, title: t(lang, 'insight.multiples.label', { kpi: kpi.title[lang], reference: refTitle }) }, domain, lang)
      + `<p class="note">${t(lang, 'insight.multiples.legend', { kpi: esc(kpi.title[lang]), reference: esc(refTitle) })}</p></div>`;
  }).join('');
  return `<section class="insight" id="${esc(e.key)}">${head}`
    + `<p class="headline"><span class="num">${one(r.latest.value)}</span> <span class="unit">${t(lang, unitKey)}</span> <span class="tag ${r.verdict}">${t(lang, `insight.tag.${r.verdict}`)}</span></p>`
    + `<p>${reading}</p>`
    + `<figure>${chart}${r.context ? `<p class="note">${t(lang, 'insight.context.legend', { measure: esc(e.measure[lang]), title: esc(reference.title[lang]) })}</p>` : ''}${multiples}${noteHtml(notes)}<figcaption>${sourceBlock(series, lang, true)}<br><a href="${href('methodology', lang)}#${slug('insights', lang)}">${t(lang, 'insight.method')}</a></figcaption></figure></section>`;
}
