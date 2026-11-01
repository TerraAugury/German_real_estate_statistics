import * as Plot from '@observablehq/plot';
import { JSDOM } from 'jsdom';
import { fmt, period } from './i18n';
import type { Lang } from './routes';
import type { Series } from './series';

/** Render a Plot to an SVG string with an accessible label (shared by all charts). */
function render(options: Plot.PlotOptions, label: string): string {
  const svg = Plot.plot({ document: new JSDOM('').window.document, ...options });
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  return svg.outerHTML;
}

const x = (p: string) => (p.includes('Q') ? +p.slice(0, 4) + (+p[6] - 1) / 4 : +p); // "2020-Q3" -> 2020.5

/** Server-rendered SVG line chart of an annual or quarterly series, formatted with the page locale. */
export function lineChart(s: Series, lang: Lang): string {
  if (s.freq === 'M') throw new Error(`${s.key}: lineChart plots annual or quarterly series, got monthly`);
  const points = s.obs.map((o) => ({ ...o, x: x(o.period) }));
  return render({
    width: 720, height: 320, marginLeft: 50,
    x: { tickFormat: (d: number) => (Number.isInteger(d) ? String(d) : ''), label: null },
    y: { grid: true, label: s.unit[lang], tickFormat: (d: number) => fmt(lang, d) },
    marks: [Plot.lineY(points, { x: 'x', y: 'value' }), Plot.dot(points, { x: 'x', y: 'value', title: (d) => `${period(lang, d.period)}: ${fmt(lang, d.value, { maximumFractionDigits: 2 })}` })],
  }, s.title[lang]);
}

/** Levels of one series from a Link overlay; `unit` labels the y axis. */
export function levelChart(pts: { period: string; value: number }[], unit: string, title: string, lang: Lang): string {
  const data = pts.map((p) => ({ x: x(p.period), value: p.value }));
  return render({
    width: 720, height: 200, marginLeft: 50,
    x: { tickFormat: (d: number) => String(d), label: null },
    y: { grid: true, label: unit, tickFormat: (d: number) => fmt(lang, d) },
    marks: [Plot.lineY(data, { x: 'x', y: 'value' })],
  }, title);
}

/** Lag profile bars; blank lags stay on the axis, the strongest bar is coloured and labelled. */
export function lagChart(lags: { lag: number; rho: number | null }[], strongest: number, labels: { lag: string; rho: string; mark: string; title: string }, lang: Lang): string {
  const bars = lags.filter((l) => l.rho !== null);
  const top = bars.filter((l) => l.lag === strongest);
  return render({
    width: 720, height: 260, marginLeft: 50, marginBottom: 45,
    x: { type: 'band', domain: lags.map((l) => l.lag), label: labels.lag },
    y: { domain: [-1, 1], grid: true, label: labels.rho, tickFormat: (d: number) => fmt(lang, d) },
    marks: [
      Plot.barY(bars, { x: 'lag', y: 'rho', fill: (d) => (d.lag === strongest ? '#b3261e' : '#6b7280'), title: (d) => `${d.lag}: ${fmt(lang, d.rho, { maximumFractionDigits: 2 })}` }),
      Plot.text(top, { x: 'lag', y: 'rho', text: () => labels.mark, dy: -8, fontWeight: 'bold' }),
      Plot.ruleY([0]),
    ],
  }, labels.title);
}
