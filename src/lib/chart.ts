import * as Plot from '@observablehq/plot';
import { JSDOM } from 'jsdom';
import { fmt } from './i18n';
import type { Lang } from './routes';
import type { Series } from './series';

/** Server-rendered SVG line chart, formatted with the page locale. */
export function lineChart(s: Series, lang: Lang): string {
  const { document } = new JSDOM('').window;
  const svg = Plot.plot({
    document, width: 720, height: 320, marginLeft: 50,
    x: { tickFormat: (d: number) => String(d), label: null },
    y: { grid: true, label: s.unit[lang], tickFormat: (d: number) => fmt(lang, d) },
    marks: [Plot.lineY(s.points, { x: 'year', y: 'value' }), Plot.dot(s.points, { x: 'year', y: 'value', title: (d) => `${d.year}: ${fmt(lang, d.value, { maximumFractionDigits: 2 })}` })],
  });
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', s.title[lang]);
  return svg.outerHTML;
}
