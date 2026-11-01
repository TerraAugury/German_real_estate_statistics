import { fmt, t } from './i18n';
import { levelChart, lagChart } from './chart';
import { href, type Lang } from './routes';
import type { Series } from './series';
import { computeLink, type LinkResult } from '../link/link';

export const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SMALL = 20; // annual Links with fewer lag-0 pairs get the Small sample Note (spec section 9)

/** Source line for one series, same wording as KPI charts. The id links the series on DBnomics, the licence our Sources & licences page. */
export function sourceLine(s: Series, lang: Lang, own = false): string {
  return t(lang, 'source.line', {
    publisher: esc(s.publisher), id: `<a href="${esc(s.dbnomicsUrl)}">${esc(s.dbnomicsId)}</a>`,
    licence: `<a href="${href('sources', lang)}">${esc(s.licence.name)}</a>`, period: s.lastPeriod,
  }) + (own || s.derived ? ` / ${t(lang, 'source.own')}` : '');
}

/** Link panel HTML for one KPI x indicator pair. Pure given the result, so it tests without the Link module. */
export function renderPanel(kpi: Series, ind: Series, r: LinkResult, lang: Lang, geography = t(lang, 'geo.germany')): string {
  const note = (s: Series) => s.notes[lang].map((n) => `${t(lang, 'note.prefix')}: ${esc(s.title[lang])}: ${esc(n)}`);
  const notes = [...note(kpi), ...note(ind)];
  const head = `<h3>${t(lang, 'link.title', { kpi: esc(kpi.title[lang]), indicator: esc(ind.title[lang]) })}</h3>
<p>${t(lang, 'link.scope', { geography: esc(geography) })}</p>`;
  let body: string;
  if (!r.shown) {
    body = `<p>${t(lang, r.reason === 'constant' ? 'link.not_shown.constant' : 'link.not_shown', { n: String(r.n0) })}</p>`;
  } else {
    if (kpi.freq === 'A' && r.headline.n < SMALL) notes.unshift(`${t(lang, 'note.prefix')}: ${t(lang, 'link.small_sample', { n: String(r.headline.n) })}`);
    const col = (k: 'kpi' | 'indicator', s: Series) =>
      `<h4>${esc(s.title[lang])}</h4>` + levelChart(r.overlay.flatMap((o) => (o[k] === null ? [] : [{ period: o.period, value: o[k]! }])), s.unit[lang], t(lang, 'link.overlay.label', { title: s.title[lang] }), lang);
    const N = r.lags.filter((l) => l.rho !== null).length;
    body = col('kpi', kpi) + col('indicator', ind)
      + lagChart(r.lags, r.strongest.lag, { lag: t(lang, 'link.lag.label'), rho: t(lang, 'link.rho.label'), mark: t(lang, 'link.strongest.mark'), title: t(lang, 'link.lags.label', { kpi: kpi.title[lang], indicator: ind.title[lang] }) }, lang)
      + `<p>${t(lang, 'link.headline', { rho: fmt(lang, r.headline.rho!, { maximumFractionDigits: 2 }), n: String(r.headline.n) })}</p>`
      + `<p>${t(lang, 'link.strongest', { n: String(N) })}</p>`
      + `<p>${t(lang, 'link.sentence', { period: t(lang, 'link.period', { from: r.span[0], to: r.span[1] }), n: String(r.headline.n) })}</p>`;
  }
  const noteHtml = notes.map((n) => `<p class="note">${n}</p>`).join('');
  return `<figure class="link-panel">${head}${noteHtml}${body}<figcaption>${sourceLine(kpi, lang, true)}<br>${sourceLine(ind, lang, true)}</figcaption></figure>`;
}

/** Compute and render. The KPI is annual, so the Link is annual (spec section 6). */
export function linkPanel(kpi: Series, ind: Series, lang: Lang): string {
  const r = computeLink({ freq: kpi.freq, change: kpi.change, obs: kpi.obs }, { freq: ind.freq, change: ind.change, obs: ind.obs });
  return renderPanel(kpi, ind, r, lang);
}
