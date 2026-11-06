import * as Plot from '@observablehq/plot';
import { JSDOM } from 'jsdom';
import { fmt, period, t, valueFormat } from './i18n';
import { PALETTE } from './palette';
import type { Lang } from './routes';
import type { Series } from './series';
import type { Points } from '../insight/insight';

// Colours are the page's custom properties (src/lib/palette.ts), so one build serves both colour schemes. Plot passes them
// through as presentation attributes and browsers resolve them there.
const cssVar = (name: keyof typeof PALETTE) => `var(--${name})`;
const INK = cssVar('ink'), DATA = cssVar('data'), MUTED = cssVar('muted'), STRONG = cssVar('strong'), STRONG_TEXT = cssVar('strong-text'), BAR = cssVar('field'), GRID = cssVar('hair'), ABOVE = cssVar('above'), BELOW = cssVar('below');

// Plot only needs a document to create detached elements, and building a JSDOM costs about as much as drawing the chart.
const document = new JSDOM('').window.document;

/**
 * Render a Plot twice, wide (720) and narrow (320) with its own tick layout; CSS shows the one that fits its box, so
 * axis text stays legible on a phone instead of shrinking with the SVG (ticket 16). Both carry the accessible label.
 */
function render(build: (narrow: boolean) => Plot.PlotOptions, label: string): string {
  return [false, true].map((narrow) => {
    const svg = Plot.plot({
      document, width: narrow ? 320 : 720, marginLeft: narrow ? 36 : 50, ...build(narrow),
      style: { fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif", fontSize: '13px', color: MUTED },
    });
    svg.classList.add(narrow ? 'narrow' : 'wide');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
    return svg.outerHTML;
  }).join('');
}

const x = (p: string) => (p.includes('Q') ? +p.slice(0, 4) + (+p[6] - 1) / 4 : +p); // "2020-Q3" -> 2020.5
const years = (d: number) => (Number.isInteger(d) ? String(d) : '');

/** Server-rendered SVG line chart of an annual or quarterly series, formatted with the page locale; compact charts pass a lower height. */
export function lineChart(s: Series, lang: Lang, height = 320): string {
  if (s.freq === 'M') throw new Error(`${s.key}: lineChart plots annual or quarterly series, got monthly`);
  const points = s.obs.map((o) => ({ ...o, x: x(o.period) }));
  const last = points.slice(-1);
  return render((narrow) => ({
    height: narrow ? Math.round(height * 0.8) : height, marginRight: 52, marginTop: 28,
    x: { tickFormat: years, label: null, ticks: narrow ? 4 : undefined },
    y: { grid: true, label: s.unit[lang], labelArrow: 'none', tickFormat: (d: number) => fmt(lang, d) },
    marks: [
      Plot.lineY(points, { x: 'x', y: 'value', stroke: DATA, strokeWidth: 2.25 }),
      // Invisible hover targets keep a tooltip on every point without drawing one.
      Plot.dot(points, { x: 'x', y: 'value', r: 6, fill: 'transparent', title: (d) => `${period(lang, d.period)}: ${fmt(lang, d.value, valueFormat(s))}` }),
      Plot.dot(last, { x: 'x', y: 'value', r: 4, fill: DATA }),
      Plot.text(last, { x: 'x', y: 'value', text: (d) => fmt(lang, d.value, valueFormat(s)), dx: 8, textAnchor: 'start', fill: DATA, fontWeight: 600, fontSize: narrow ? 14 : 15 }),
    ],
  }), s.title[lang]);
}

/** Round tick values, about five steps of 1, 2 or 5 times a power of ten, whose first and last cover [lo, hi]. */
function niceTicks(lo: number, hi: number): number[] {
  const raw = (hi - lo || Math.abs(hi) || 1) / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = mag * ([1, 2, 5].find((m) => raw <= m * mag) ?? 10);
  const first = Math.floor(lo / step), last = Math.ceil(hi / step);
  return Array.from({ length: last - first + 1 }, (_, i) => +((first + i) * step).toPrecision(12));
}

/**
 * Both series of a Link on one chart: the Real estate KPI against the left axis, the Economic indicator against the right
 * axis, over one x axis that spans both histories. Each series is scaled to its own round tick range, and each axis and its
 * unit take its line's colour (ochre text is the darker `strong-text`, which keeps 4.5:1). The scales are independent, so the
 * picture shows co-movement only.
 */
export function overlayChart(kpi: Points, indicator: Points, labels: { kpiUnit: string; indicatorUnit: string; title: string; kpiRight?: boolean }, lang: Lang): string {
  const scaled = (pts: Points, unit: string, anchor: 'left' | 'right', lineColour: string, axisColour: string) => {
    const values = pts.map((p) => p.value);
    const ticks = niceTicks(Math.min(...values), Math.max(...values));
    const [lo, hi] = [ticks[0], ticks[ticks.length - 1]];
    const at = ticks.map((v) => (v - lo) / (hi - lo));
    return [
      Plot.gridY(at),
      Plot.axisY(at, { anchor, color: axisColour, label: unit, labelArrow: 'none', tickFormat: (_: number, i: number) => fmt(lang, ticks[i]) }),
      Plot.lineY(pts, { x: (p) => x(p.period), y: (p) => (p.value - lo) / (hi - lo), stroke: lineColour, strokeWidth: 2.25 }),
    ];
  };
  return render((narrow) => ({
    height: 240, marginRight: narrow ? 36 : 50, marginTop: 28,
    x: { tickFormat: years, label: null, ticks: narrow ? 4 : undefined },
    y: { axis: null, domain: [0, 1] },
    marks: [...scaled(kpi, labels.kpiUnit, labels.kpiRight ? 'right' : 'left', DATA, DATA), ...scaled(indicator, labels.indicatorUnit, labels.kpiRight ? 'left' : 'right', STRONG, STRONG_TEXT)],
  }), labels.title);
}

/** Headline measure over time: latest point labelled, dashed average line, grey band of average plus or minus half a standard deviation. */
export function insightChart(r: { points: Points; context?: Points; from: string; to: string; mean: number; sd: number }, labels: { unit: string; average: string; title: string }, lang: Lang): string {
  const data = r.points.map((p) => ({ x: +p.period, value: p.value }));
  const last = data.slice(-1);
  const band = [{ x1: +r.from, x2: +r.to, y1: r.mean - r.sd / 2, y2: r.mean + r.sd / 2 }];
  return render((narrow) => ({
    height: narrow ? 256 : 320, marginRight: 52, marginTop: 28,
    x: { tickFormat: years, label: null, ticks: narrow ? 4 : undefined },
    y: { grid: true, label: labels.unit, labelArrow: 'none', tickFormat: (d: number) => fmt(lang, d) },
    marks: [
      Plot.rectY(band, { x1: 'x1', x2: 'x2', y1: 'y1', y2: 'y2', fill: GRID }),
      Plot.ruleY([r.mean], { stroke: MUTED, strokeDasharray: '5 4' }),
      Plot.text([{ x: +r.from, y: r.mean }], { x: 'x', y: 'y', text: () => labels.average, dy: -7, textAnchor: 'start', fill: MUTED }),
      ...(r.context ? [Plot.lineY(r.context.map((p) => ({ x: +p.period, value: p.value })), { x: 'x', y: 'value', stroke: STRONG, strokeWidth: 2 })] : []),
      Plot.lineY(data, { x: 'x', y: 'value', stroke: DATA, strokeWidth: 2.25 }),
      Plot.dot(data, { x: 'x', y: 'value', r: 6, fill: 'transparent', title: (d) => `${d.x}: ${fmt(lang, d.value, { maximumFractionDigits: 2 })}` }),
      Plot.dot(last, { x: 'x', y: 'value', r: 4, fill: DATA }),
      Plot.text(last, { x: 'x', y: 'value', text: (d) => fmt(lang, d.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), dx: 8, textAnchor: 'start', fill: DATA, fontWeight: 600, fontSize: narrow ? 14 : 15 }),
    ],
  }), labels.title);
}

type Lines = { kpi: { value: number }[]; reference: { value: number }[] };
/** One y-domain for every small chart of an Insight, so their differences compare by eye. */
export function sharedDomain(ls: Lines[]): [number, number] {
  const v = ls.flatMap((l) => [...l.kpi, ...l.reference].map((p) => p.value));
  return [Math.min(...v), Math.max(...v)];
}

/** The KPI line (blue) against the reference line (ochre), the area between them shaded blue where the KPI is above and red where below. */
export function multiplesChart(l: { kpi: Points; reference: Points }, labels: { unit: string; title: string }, domain: [number, number], lang: Lang): string {
  const rows = l.kpi.map((p, i) => ({ x: +p.period, kpi: p.value, reference: l.reference[i].value }));
  return render((narrow) => ({
    height: narrow ? 200 : 220, marginRight: 52, marginTop: 28,
    x: { tickFormat: years, label: null, ticks: narrow ? 4 : undefined },
    y: { grid: true, label: labels.unit, labelArrow: 'none', domain, tickFormat: (d: number) => fmt(lang, d) },
    marks: [
      Plot.differenceY(rows, { x: 'x', y1: 'kpi', y2: 'reference', positiveFill: BELOW, negativeFill: ABOVE, fillOpacity: 0.3, strokeWidth: 0 }),
      Plot.lineY(rows, { x: 'x', y: 'reference', stroke: STRONG, strokeWidth: 2 }),
      Plot.lineY(rows, { x: 'x', y: 'kpi', stroke: DATA, strokeWidth: 2.25 }),
      Plot.dot(rows, { x: 'x', y: 'kpi', r: 6, fill: 'transparent', title: (d) => `${d.x}: ${fmt(lang, d.kpi, { maximumFractionDigits: 1 })} / ${fmt(lang, d.reference, { maximumFractionDigits: 1 })}` }),
    ],
  }), labels.title);
}

const signed = (lag: number) => (lag > 0 ? `+${lag}` : String(lag));

/** Lag profile bars; blank lags stay on the axis, the strongest bar is ochre and labelled. */
export function lagChart(lags: { lag: number; rho: number | null }[], strongest: number, labels: { lag: string; rho: string; mark: string; preset?: { lag: number; label: string }; bands?: { lag: number; band: number }[]; title: string }, lang: Lang): string {
  const bars = lags.filter((l) => l.rho !== null);
  const top = bars.filter((l) => l.lag === strongest);
  // The label grows away from the nearer edge, so an edge lag's label stays inside the plot.
  const at = lags.findIndex((l) => l.lag === strongest) / Math.max(lags.length - 1, 1);
  const anchor = at < 1 / 3 ? 'start' : at > 2 / 3 ? 'end' : 'middle';
  return render((narrow) => ({
    height: narrow ? 220 : 260, marginBottom: 45, marginTop: 28,
    x: { type: 'band', domain: lags.map((l) => l.lag), label: labels.lag, labelArrow: 'none', labelAnchor: 'center', tickFormat: signed },
    y: { domain: [-1, 1], grid: true, label: labels.rho, labelArrow: 'none', tickFormat: (d: number) => fmt(lang, d) },
    marks: [
      // The noise band (ticket 11): a light strip around zero, ±2/√(n−1) with each lag's own n.
      Plot.barY(labels.bands ?? [], { x: 'lag', y1: (d) => -d.band, y2: (d) => d.band, fill: MUTED, fillOpacity: 0.18 }),
      Plot.barY(bars, { x: 'lag', y: 'rho', fill: (d) => (d.lag === strongest ? STRONG : BAR), inset: narrow ? 3 : 8, title: (d) => `${signed(d.lag)}: ${fmt(lang, d.rho, { maximumFractionDigits: 2 })}` }),
      Plot.text(top, { x: 'lag', y: 'rho', text: (d) => `${fmt(lang, d.rho, { maximumFractionDigits: 2 })} ${labels.mark}`, dy: (top[0]?.rho ?? 0) < 0 ? 14 : -10, textAnchor: anchor, dx: anchor === 'start' ? -6 : anchor === 'end' ? 6 : 0, fill: INK, fontWeight: 600 }),
      // The pre-set lag (ticket 10): a dashed outline and a label at the base of the bar, apart from the "strongest" label at its tip.
      ...(labels.preset ? [
        Plot.barY(bars.filter((l) => l.lag === labels.preset!.lag), { x: 'lag', y: 'rho', fill: 'none', stroke: INK, strokeDasharray: '4 3', strokeWidth: 1.5, inset: narrow ? 3 : 8 }),
        Plot.text(bars.filter((l) => l.lag === labels.preset!.lag), { x: 'lag', y: 0, text: () => labels.preset!.label, dy: (bars.find((l) => l.lag === labels.preset!.lag)?.rho ?? 0) < 0 ? -8 : 14, fill: INK, fontSize: 12 }),
      ] : []),
      Plot.ruleY([0], { stroke: MUTED }),
    ],
  }), labels.title);
}

/** A small trend line with a dot on the latest value, for the Home index: no axes, no text; the row beside it carries the numbers. */
export function sparkline(s: Series, lang: Lang): string {
  const points = s.obs.map((o) => ({ x: x(o.period), value: o.value }));
  const svg = Plot.plot({
    document, width: 120, height: 36, margin: 4, x: { axis: null }, y: { axis: null },
    marks: [Plot.lineY(points, { x: 'x', y: 'value', stroke: DATA, strokeWidth: 1.75 }), Plot.dot(points.slice(-1), { x: 'x', y: 'value', r: 3, fill: DATA })],
  });
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', t(lang, 'home.spark.label', { title: s.title[lang] }));
  return svg.outerHTML;
}
