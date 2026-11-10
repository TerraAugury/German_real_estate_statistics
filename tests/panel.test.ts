import { describe, expect, it } from 'vitest';
import { loadSeries } from '../src/lib/series';
import { computeLink, type LinkResult } from '../src/link/link';
import { renderPanel } from '../src/lib/panel';
import { lineChart } from '../src/lib/chart';
import { JSDOM } from 'jsdom';

const kpi = loadSeries('construction-permits-office');
const ind = loadSeries('euribor-3m');
const lag = (l: number, rho: number | null) => ({ lag: l, n: rho === null ? 5 : 14, rho });
const shown = (n0: number, rho = 0.5): LinkResult => ({
  shown: true, span: ['2009', '2025'],
  overlay: [{ period: '2008', kpi: 1, indicator: 2 }, { period: '2009', kpi: 2, indicator: 1 }],
  lags: [lag(-1, 0.1), lag(0, 0.5), lag(1, -0.7), lag(2, null)],
  headline: { lag: 0, n: n0, rho }, strongest: lag(1, -0.7),
});

// Ticket 16: every chart is a wide and a narrow SVG with the same accessible label; CSS shows one.
it('lineChart renders one wide and one narrow SVG with the same label', () => {
  const doc = new JSDOM(lineChart(kpi, 'en')).window.document;
  const [wide, narrow] = ['svg.wide', 'svg.narrow'].map((s) => doc.querySelectorAll(s));
  expect([wide.length, narrow.length]).toEqual([1, 1]);
  expect(wide[0].getAttribute('aria-label')).toBe(kpi.title.en);
  expect(narrow[0].getAttribute('aria-label')).toBe(kpi.title.en);
});

// Ticket 10: the +1 bar of an appraisal-based pair carries a "pre-set lag" label, apart from the "strongest" one.
it('the pre-set shift label appears on a Link panel only for a pair in scope', () => {
  const labels = (preset: boolean) => new JSDOM(renderPanel(kpi, ind, shown(14), 'en', undefined, undefined, preset)).window.document.body.textContent!;
  expect(labels(true)).toContain('pre-set shift');
  expect(labels(false)).not.toContain('pre-set shift');
  expect(new JSDOM(renderPanel(kpi, ind, shown(14), 'de', undefined, undefined, true)).window.document.body.textContent!).toContain('vorab gewählte Verschiebung');
});

// Ticket 11: the noise band on the bars, and n with the adjusted n for quarterly Links.
it('the Link panel states the band; a quarterly Link shows n and the independent count', () => {
  const text = (h: string) => new JSDOM(h).window.document.body.textContent!.replace(/\s+/g, ' ');
  expect(text(renderPanel(kpi, ind, shown(14), 'en'))).toContain('between -0.55 and +0.55 (the grey band on the chart)');
  const q = loadSeries('price-index-de-total-q');
  const r = { ...shown(44), lags: [lag(-1, 0.1), { lag: 0, n: 44, rho: 0.5 }, { lag: 1, n: 43, rho: 0.2 }] } as LinkResult;
  expect(text(renderPanel(q, ind, r, 'en'))).toContain('That gives 44 quarterly comparisons.');
  expect(text(renderPanel(q, ind, r, 'en'))).toContain('only 11 independent comparisons (44 ÷ 4, rounded down)');
  expect(text(renderPanel(kpi, ind, shown(14), 'en'))).not.toContain('independent comparisons');
  expect(text(renderPanel(q, ind, r, 'de'))).toContain('nur wie 11 unabhängige Vergleiche (44 ÷ 4, abgerundet)');
});

// Ticket 13 (option A): nominal KPIs get a Note against the indicators that share inflation or are real.
it('the Link panel of a nominal KPI notes shared inflation (CPI, construction prices) or nominal against real (GDP); nothing else', () => {
  const rent = loadSeries('rent-index-de-office-a');
  const text = (k: typeof rent, i: typeof ind) => new JSDOM(renderPanel(k, i, shown(14), 'en')).window.document.body.textContent!;
  expect(text(rent, loadSeries('cpi'))).toContain('partly reflects shared inflation');
  expect(text(rent, loadSeries('construction-price-office'))).toContain('partly reflects shared inflation');
  expect(text(rent, loadSeries('gdp-real'))).toContain('compares nominal with real');
  expect(text(rent, ind)).not.toContain('inflation');
  expect(text(kpi, loadSeries('cpi'))).not.toContain('shared inflation');
  expect(new JSDOM(renderPanel(rent, loadSeries('gdp-real'), shown(14), 'de')).window.document.body.textContent!).toContain('Nominal gegen real');
});

// The overlay: the KPI against the left axis, the indicator against the right axis, on one x axis spanning both histories.
describe('Link panel chart', () => {
  const periods = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
  const early = (): LinkResult => ({
    ...(shown(14) as Extract<LinkResult, { shown: true }>),
    // The indicator reaches back to 1980 and the KPI starts in 2000; the scales differ by two orders of magnitude.
    overlay: periods(1980, 2025).map((p) => ({ period: p, kpi: +p < 2000 ? null : (+p - 1990) * 1000, indicator: Math.sin(+p / 5) * 3 + 5 })),
  });
  const dom = (h: string) => new JSDOM(h).window.document;

  it('draws one chart (a wide and a narrow SVG), not one per series', () => {
    const d = dom(renderPanel(kpi, ind, early(), 'en'));
    expect(d.querySelectorAll('figure.link-panel svg.wide[aria-label^="Values of"]').length).toBe(1);
    expect(d.querySelectorAll('figure.link-panel svg.narrow[aria-label^="Values of"]').length).toBe(1);
    expect(d.querySelector('.pair')).toBeNull();
  });
  it('puts the KPI unit on the left axis and the indicator unit on the right, each axis in its line’s colour', () => {
    const d = dom(renderPanel(kpi, ind, early(), 'en'));
    const ticks = (anchor: string) => d.querySelector(`svg.wide g[aria-label="y-axis tick label"][text-anchor="${anchor}"]`);
    expect(ticks('end')?.getAttribute('fill')).toBe('var(--data)');
    expect(ticks('start')?.getAttribute('fill')).toBe('var(--strong-text)');
    // The unit labels: the KPI's at the top left in the data colour, the indicator's at the top right in ochre.
    const unit = (anchor: string) => d.querySelector(`svg.wide g[aria-label="y-axis label"][text-anchor="${anchor}"]`);
    expect([unit('start')?.textContent, unit('start')?.getAttribute('fill')]).toEqual([kpi.unit.en, 'var(--data)']);
    expect([unit('end')?.textContent, unit('end')?.getAttribute('fill')]).toEqual([ind.unit.en, 'var(--strong-text)']);
    const line = (colour: string) => d.querySelectorAll(`svg.wide g[aria-label="line"][stroke="${colour}"]`).length;
    expect([line('var(--data)'), line('var(--strong)')]).toEqual([1, 1]);
  });
  it('spans the union of both histories: the x axis starts with the longer one', () => {
    const d = dom(renderPanel(kpi, ind, early(), 'en'));
    const labels = [...d.querySelectorAll('svg.wide g[aria-label="x-axis tick label"] text')].map((n) => n.textContent);
    expect(labels).toContain('1980');
    expect(labels).toContain('2020');
  });
  it('names both series in the accessible label and the legend, in both languages', () => {
    const en = renderPanel(kpi, ind, early(), 'en');
    expect(dom(en).querySelector('svg.wide')!.getAttribute('aria-label')).toBe(`Values of ${kpi.title.en} and ${ind.title.en}`);
    expect(en).toContain(`Blue line, left axis: ${kpi.title.en}. Ochre line, right axis: ${ind.title.en}.`);
    const de = renderPanel(kpi, ind, early(), 'de');
    // German is a draft until reviewed, so the label may carry the [DRAFT] marker.
    expect(dom(de).querySelector('svg.wide')!.getAttribute('aria-label')).toContain(`Werte: ${kpi.title.de} und ${ind.title.de}`);
    expect(de).toContain(`Blaue Linie, linke Achse: ${kpi.title.de}. Ockerfarbene Linie, rechte Achse: ${ind.title.de}.`);
  });
  it('a series that starts later has no line before it starts', () => {
    const d = dom(renderPanel(kpi, ind, early(), 'en'));
    const startX = (colour: string) => +/^M([\d.]+)/.exec(d.querySelector(`svg.wide g[aria-label="line"][stroke="${colour}"] path`)!.getAttribute('d')!)![1];
    expect(startX('var(--data)')).toBeGreaterThan(startX('var(--strong)') + 100);
  });
});

describe('Link panel', () => {
  const dom = (h: string) => new JSDOM(h).window.document;
  it('EN: plain-language reading with period, n, result, band verdict, best-of-N and the limit', () => {
    const h = renderPanel(kpi, ind, shown(14), 'en');
    const text = dom(h).body.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('How closely did these two series move together?');
    expect(text).toContain('between 2009 and 2025. That gives 14 yearly comparisons.');
    expect(text).toContain('Result:');
    expect(text).toContain('The scale runs from -1 to +1.');
    expect(text).toContain('Is this result meaningful?');
    expect(text).toContain('A warning about the “best” result. We tested 3 different time shifts');
    expect(text).toContain('What this does not tell you. Moving together does not mean one causes the other. This is not a forecast either.');
    expect(h).toContain(kpi.title.en);
    expect(h).toContain(ind.title.en);
    expect(h).toContain('<svg');
  });
  it('DE: the same reading in German', () => {
    const text = dom(renderPanel(kpi, ind, shown(14), 'de')).body.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('Wie stark haben sich diese beiden Reihen gemeinsam entwickelt?');
    expect(text).toContain('zwischen 2009 und 2025 von Jahr zu Jahr verändert haben. Das ergibt 14 jährliche Vergleiche.');
    expect(text).toContain('Was das nicht aussagt.');
  });
  it('a result inside the band reads "Probably not", one outside reads "Possibly"; strength follows the size and sign', () => {
    const at = (rho: number) => dom(renderPanel(kpi, ind, shown(14, rho), 'en')).body.textContent!.replace(/\s+/g, ' ');
    expect(at(0.05)).toContain('no clear tendency to move in either direction');
    expect(at(-0.18)).toContain('very weak tendency to move in opposite directions');
    expect(at(-0.18)).toContain('Probably not.');
    expect(at(-0.18)).toContain('well inside that band');
    expect(at(0.8)).toContain('strong tendency to move in the same direction');
    expect(at(0.8)).toContain('Possibly.');
  });
  it('small sample Note only for annual n < 20 at lag 0', () => {
    expect(renderPanel(kpi, ind, shown(14), 'en')).toContain('Based on only 14 yearly values.');
    expect(renderPanel(kpi, ind, shown(20), 'en')).not.toContain('Based on only');
  });
  it('Notes in the fixed order: the KPI’s short history, then small sample (spec section 9)', () => {
    const h = renderPanel({ ...kpi, shortWindow: true }, ind, shown(14), 'en');
    expect(h.indexOf('Short history')).toBeGreaterThan(-1);
    expect(h.indexOf('Short history')).toBeLessThan(h.indexOf('Based on only'));
  });
  it('not-shown state is visible, with n, in both languages, and no charts', () => {
    const r: LinkResult = { shown: false, n0: 7, reason: 'too_few' };
    expect(renderPanel(kpi, ind, r, 'en')).toContain('Link not shown: too few periods to compare (n = 7)');
    expect(renderPanel(kpi, ind, r, 'de')).toContain('nicht angezeigt: zu wenige Zeiträume zum Vergleich (n = 7)');
    expect(renderPanel(kpi, ind, r, 'en')).not.toContain('<svg');
  });
  it('inherits series Notes prefixed with the series title', () => {
    // no hand-injected flags: a 2035 'now' makes the committed snapshot stale when loadSeries reads it
    const stale = loadSeries('construction-permits-office', new Date('2035-01-01'));
    expect(stale.stale).toBe(true);
    expect(renderPanel(stale, ind, shown(14), 'en')).toContain(`Note: ${kpi.title.en}: Latest value: `);
    expect(renderPanel(kpi, ind, shown(14), 'en')).not.toContain('Latest value');
  });
  it('real data: office permits vs Euribor and CPI give a shown Link', () => {
    const r = computeLink(
      { freq: 'A', change: kpi.change, obs: kpi.obs },
      { freq: 'M', change: ind.change, obs: ind.obs });
    expect(r.shown).toBe(true);
    const c = loadSeries('cpi');
    expect(computeLink({ freq: 'A', change: kpi.change, obs: kpi.obs }, { freq: 'M', change: c.change, obs: c.obs }).shown).toBe(true);
  });
});
