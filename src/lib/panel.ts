import { fmt, period, t } from './i18n';
import { levelChart, lagChart, lineChart } from './chart';
import { notesFor } from './notes';
import { href, type Lang } from './routes';
import type { Series } from './series';
import type { LinkResult } from '../link/link';
import { linkResult } from './links';

export const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const noteHtml = (ns: string[]) => ns.map((n) => `<p class="note">${esc(n)}</p>`).join('');

/** Source line for one series, same wording as KPI charts. The id links the series on DBnomics, the licence our Sources & licences page. */
export function sourceLine(s: Series, lang: Lang, own = false): string {
  return t(lang, 'source.line', {
    publisher: esc(s.publisher), id: `<a href="${esc(s.dbnomicsUrl)}">${esc(s.dbnomicsId)}</a>`,
    licence: `<a href="${href('sources', lang)}">${esc(s.licence.name)}</a>`, period: period(lang, s.lastPeriod),
  }) + (own || s.derived ? ` / ${t(lang, 'source.own')}` : '');
}

/** Compact chart for Home cards and Segment pages: chart, stale and fetch-failed Notes, source line (spec section 9). */
export const compactChart = (s: Series, lang: Lang) => lineChart(s, lang, 200)
  + noteHtml(notesFor(s, lang, { on: 'compact' })) + `<figcaption>${sourceLine(s, lang)}</figcaption>`;

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
      `<h4>${esc(s.title[lang])}</h4>` + levelChart(r.overlay.flatMap((o) => (o[k] === null ? [] : [{ period: o.period, value: o[k]! }])), s.unit[lang], t(lang, 'link.overlay.label', { title: s.title[lang] }), lang);
    const N = r.lags.filter((l) => l.rho !== null).length;
    body = col('kpi', kpi) + col('indicator', ind)
      + lagChart(r.lags, r.strongest.lag, { lag: t(lang, 'link.lag.label'), rho: t(lang, 'link.rho.label'), mark: t(lang, 'link.strongest.mark'), title: t(lang, 'link.lags.label', { kpi: kpi.title[lang], indicator: ind.title[lang] }) }, lang)
      + `<p>${t(lang, 'link.headline', { rho: fmt(lang, r.headline.rho!, { maximumFractionDigits: 2 }), n: String(r.headline.n) })}</p>`
      + `<p>${t(lang, 'link.strongest', { n: String(N) })}</p>`
      + `<p>${t(lang, 'link.sentence', { period: t(lang, 'link.period', { from: period(lang, r.span[0]), to: period(lang, r.span[1]) }), n: String(r.headline.n) })}</p>`;
  }
  return `<figure class="link-panel"${id ? ` id="${esc(id)}"` : ''}>${head}${noteHtml(notes)}${body}<figcaption>${sourceLine(kpi, lang, true)}<br>${sourceLine(ind, lang, true)}</figcaption></figure>`;
}

/** Compute (once per build) and render; the Link takes the KPI's frequency (spec section 6). */
export const linkPanel = (kpi: Series, ind: Series, lang: Lang, geography?: string, id?: string) =>
  renderPanel(kpi, ind, linkResult(kpi, ind), lang, geography, id);
