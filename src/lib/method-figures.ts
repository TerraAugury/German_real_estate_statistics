// Visual examples on the Methodology page: the site's own charts and tiles, drawn from the real data at build time, so they never go stale.
// A prose page marks one with `{{figure:<name>|<caption>}}` on a line of its own; `withFigures` swaps each mark for its figure.
import { fmt, t } from './i18n';
import { indexChart, insightChart, lagChart, multiplesChart, overlayChart, sharedDomain } from './chart';
import { getSeries } from './series';
import { linkResult } from './links';
import { linksOverview } from './pages';
import { insightsPage, type InsightModel } from './insights';
import { esc, renderInsightIndex } from './panel';
import { lagFor, noiseBand, type LinkResult } from '../link/link';
import type { Lang } from './routes';

/** The Link every Links figure draws: initial yield in the 7 major cities against the 10-year Bund yield (yearly, so shifts run -3 to +3). */
const KPI = 'initial-yield-combined-7';
const PRESET_ROW = ['bund-yield-10y', 'euribor-3m', 'loan-rate-nfc'] as const;

type Shown = Extract<LinkResult, { shown: true }>;

function link(): { kpi: ReturnType<typeof getSeries>; ind: ReturnType<typeof getSeries>; r: Shown } | undefined {
  try {
    const kpi = getSeries(KPI), ind = getSeries('bund-yield-10y');
    const r = linkResult(kpi, ind);
    return r.shown ? { kpi, ind, r } : undefined;
  } catch { return undefined; }
}

const barChart = (l: NonNullable<ReturnType<typeof link>>, lang: Lang, opts: { strongest?: boolean; band?: boolean; preset?: boolean }) => {
  const { r, kpi, ind } = l;
  return lagChart(r.lags, opts.strongest ? r.strongest.lag : NaN, {
    lag: t(lang, 'link.lag.label'), rho: t(lang, 'link.rho.label'), mark: t(lang, 'link.strongest.mark'),
    bands: opts.band ? r.lags.filter((x) => x.rho !== null).map((x) => ({ lag: x.lag, band: noiseBand(x.n, 'A') })) : undefined,
    preset: opts.preset ? { lag: lagFor('A', 1), label: t(lang, 'link.preset.mark') } : undefined,
    title: t(lang, 'link.lags.label', { kpi: kpi.title[lang], indicator: ind.title[lang] }),
  }, lang);
};

/** Three rows of the Links table (initial yield against the three interest rates), the three shifts side by side, as on the Links page. */
function matrix(lang: Lang): string {
  const row = linksOverview().rows.find((x) => x.view && getSeries(x.view.series[0].key, x.view.series[0].land).key === KPI);
  if (!row) return '';
  const rows = PRESET_ROW.flatMap((name) => {
    const c = row.cells.get(name);
    return c ? [{ name, c }] : [];
  });
  if (!rows.length) return '';
  const cell = (c: NonNullable<typeof rows[number]['c']>, y: 0 | 1 | 2) => {
    const l = c.lags[y];
    const mark = c.pair.preset ? `<span class="preset">${t(lang, y === 1 ? 'links.cell.preset' : 'links.cell.preset_other')}</span>` : '';
    return l.heat && l.rho !== null
      ? `<td class="lagcell"><a class="${l.heat.side}${l.noise ? ' noise' : ''}" style="--share: ${l.heat.share}%"><span class="rho">${fmt(lang, l.rho, { maximumFractionDigits: 2 })}</span><span class="n">${t(lang, 'links.cell.n', { n: String(l.n) })}</span>${l.noise ? `<span class="vh">${t(lang, 'links.cell.noise')}</span>` : ''}${mark}</a></td>`
      : `<td class="lagcell"><a class="na">${t(lang, 'links.cell.not_shown', { n: String(l.n) })}${mark}</a></td>`;
  };
  const body = rows.map(({ name, c }) => `<tr><th scope="row">${t(lang, `indicator.${name}`)}</th>${([0, 1, 2] as const).map((y) => cell(c, y)).join('')}</tr>`).join('');
  return `<div class="scroll"><table class="matrix mini"><thead><tr><th scope="col">${esc(getSeries(KPI).title[lang])}</th>${([0, 1, 2] as const).map((y) => `<th scope="col">${t(lang, `links.lag.${y}`)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
}

const model = (key: string): InsightModel | undefined => insightsPage().find((m) => m.entry.key === key && m.result.shown);
const tiles = (keys: string[], lang: Lang) => {
  const ms = keys.map(model).filter((m): m is InsightModel => !!m);
  return ms.length ? renderInsightIndex(ms, lang) : '';
};
const one = (lang: Lang, n: number, digits = 1) => fmt(lang, n, { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** The Insight's headline chart: the line, its average and the grey band of half a usual spread. */
function verdictChart(lang: Lang): string {
  const m = model('a');
  if (!m || !m.result.shown) return '';
  const { entry: e, result: r } = m;
  return insightChart(r, { unit: t(lang, `insight.unit.${e.headline}`), average: t(lang, 'insight.average', { value: one(lang, r.mean) }), title: t(lang, 'insight.chart.label', { title: e.title[lang], measure: e.measure[lang] }) }, lang);
}

/** The small chart of an Insight: two lines on one axis, the area between them shaded. */
function linesChart(key: string, lang: Lang, kind: 'growth' | 'base'): string {
  const m = model(key);
  if (!m || !m.result.shown) return '';
  const { entry: e, series, result: r } = m;
  const kpi = series[e.series.findIndex((s) => s.role === 'kpi')], ref = series[e.series.findIndex((s) => s.role === 'reference')];
  const names = { kpi: esc(kpi.title[lang]), reference: esc(ref.title[lang]) };
  const l = r.lines;
  const unit = kind === 'growth' ? t(lang, 'insight.axis.growth') : t(lang, 'insight.axis.rebased', { year: l.base ?? '' });
  const title = t(lang, kind === 'growth' ? 'insight.multiples.label_growth' : 'insight.multiples.label', names);
  const legend = kind === 'growth' ? 'insight.multiples.legend_growth' : 'insight.multiples.legend';
  return multiplesChart(l, { unit, title }, sharedDomain([l]), lang) + `<p class="note">${t(lang, legend, names)}</p>`;
}

function realIndex(lang: Lang): string {
  const m = model('j');
  if (!m || !m.result.shown || !m.result.index) return '';
  const { points, from } = m.result.index;
  return indexChart(points, { unit: t(lang, 'insight.axis.rebased', { year: from }), title: t(lang, 'insight.index.label', { year: from }) }, lang);
}

const BUILD: Record<string, (lang: Lang) => string> = {
  'link-overlay': (lang) => {
    const l = link();
    if (!l) return '';
    const pts = (k: 'kpi' | 'indicator') => l.r.overlay.flatMap((o) => (o[k] === null ? [] : [{ period: o.period, value: o[k]! }]));
    return overlayChart(pts('kpi'), pts('indicator'), { kpiUnit: l.kpi.unit[lang], indicatorUnit: l.ind.unit[lang], title: t(lang, 'link.overlay.chart', { kpi: l.kpi.title[lang], indicator: l.ind.title[lang] }) }, lang);
  },
  'link-shift': (lang) => { const l = link(); return l ? barChart(l, lang, {}) : ''; },
  'link-strongest': (lang) => { const l = link(); return l ? barChart(l, lang, { strongest: true }) : ''; },
  'link-preset': (lang) => { const l = link(); return l ? barChart(l, lang, { preset: true }) : ''; },
  'link-band': (lang) => { const l = link(); return l ? barChart(l, lang, { band: true }) : ''; },
  'link-matrix': matrix,
  'insight-tile': (lang) => tiles(['a', 'g', 'b', 'd'], lang),
  'insight-tone': (lang) => tiles(['a', 'b', 'e'], lang),
  'insight-verdict': verdictChart,
  'insight-growth': (lang) => linesChart('d', lang, 'growth'),
  'insight-base': (lang) => linesChart('g', lang, 'base'),
  'insight-real-index': realIndex,
};

export const figureNames = Object.keys(BUILD);

/** Swap each `{{figure:name|caption}}` paragraph of rendered prose for its figure; a figure that cannot be drawn leaves nothing behind. */
export function withFigures(html: string, lang: Lang): string {
  return html.replace(/<p>\{\{figure:([\w-]+)\|([^}]*)\}\}<\/p>/g, (_, name: string, caption: string) => {
    const body = BUILD[name]?.(lang);
    return body ? `<figure class="method-fig">${body}<figcaption>${caption}</figcaption></figure>` : '';
  });
}
