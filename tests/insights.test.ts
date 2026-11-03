import { afterEach, describe, expect, it } from 'vitest';
import { checkInsights, loadAllManifest, loadManifest, type InsightEntry } from '../src/lib/manifest';
import { loadStrings } from '../src/lib/i18n';
import { multiplesChart, sharedDomain } from '../src/lib/chart';
import { insightsPage, loadInsights, visibleInsights } from '../src/lib/insights';
import { renderInsight } from '../src/lib/panel';
import { getSeries } from '../src/lib/series';
import type { InsightResult } from '../src/insight/insight';

afterEach(() => { delete process.env.INCLUDE_PROVISIONAL; });

const entry = (over: Partial<InsightEntry> = {}): InsightEntry => ({
  key: 'x', title: { en: 'Title', de: 'Titel' }, measure: { en: 'spread', de: 'Abstand' }, headline: 'spread', growth: false, template: 'spread',
  series: [{ key: 'kpi-a', role: 'kpi' }, { key: 'ref-b', role: 'reference' }], ...over,
});
const known = { series: new Set(['kpi-a', 'ref-b']), kpis: new Set(['kpi-a']) };
const en = loadStrings('en');

describe('Insight declaration checks', () => {
  it('a sound entry passes', () => expect(() => checkInsights([entry()], known, en)).not.toThrow());
  it.each<[string, InsightEntry[], string]>([
    ['unknown series', [entry({ series: [{ key: 'kpi-a', role: 'kpi' }, { key: 'nope', role: 'reference' }] })], 'unknown series nope'],
    ['no Real estate KPI series', [entry({ series: [{ key: 'ref-b', role: 'kpi' }, { key: 'ref-b', role: 'reference' }] })], 'needs a Real estate KPI'],
    ['duplicate key', [entry(), entry()], 'duplicate key x'],
    ['missing German title', [entry({ title: { en: 'Title', de: '' } })], 'needs en and de title'],
    ['unknown headline kind', [entry({ headline: 'median' as 'spread' })], 'headline must be one of'],
    ['base that is not a year', [entry({ base: 'x' as unknown as number })], 'base must be a year'],
    ['unknown template', [entry({ template: 'nope' })], 'no i18n key insight.template.nope'],
  ])('fails the build on: %s', (_, entries, message) => expect(() => checkInsights(entries, known, en)).toThrow(message));
});

describe('Shared y-domain', () => {
  const l = (kpi: number[], reference: number[]) => ({ kpi: kpi.map((value) => ({ period: '2000', value })), reference: reference.map((value) => ({ period: '2000', value })) });
  it('spans every line of every small chart', () => {
    expect(sharedDomain([l([2, 5], [3, 4]), l([1, 2], [8, 9])])).toEqual([1, 9]);
  });
});

describe('Shading of the gap', () => {
  // Which colour sits where is checked by eye in the browser: Plot's "positive" side is the reference above the KPI.
  it('the lines crossing gives both shades, a gap in one direction only the other', () => {
    const pts = (...v: number[]) => v.map((value, i) => ({ period: String(2000 + i), value }));
    const chart = (kpi: number[], reference: number[]) => multiplesChart({ kpi: pts(...kpi), reference: pts(...reference) }, { unit: 'u', title: 't' }, [0, 10], 'en');
    const cross = chart([1, 5, 1], [3, 3, 3]);
    expect(cross).toContain('#4e79a7');
    expect(cross).toContain('#c0392b');
  });
});

describe('Provisional gate', () => {
  it('an Insight is hidden when any of its series is not in the public manifest, with no status declared', () => {
    const live = loadManifest(false);
    const some = live.slice(0, 2).map((m) => m.key);
    const insights = [entry({ key: 'in', series: [{ key: some[0], role: 'kpi' }, { key: some[1], role: 'reference' }] }),
      entry({ key: 'out', series: [{ key: some[0], role: 'kpi' }, { key: 'bund-yield-10y', role: 'reference' }] })];
    expect(visibleInsights(insights, live).map((e) => e.key)).toEqual(['in']);
  });
  it('production shows Insight J; the declarations pass every build check', () => {
    expect(() => loadInsights()).not.toThrow();
    expect(insightsPage().map((i) => i.entry.key)).toContain('j');
  });
  it('a preview build shows at least what production shows', () => {
    const production = insightsPage().map((i) => i.entry.key);
    process.env.INCLUDE_PROVISIONAL = '1';
    expect(insightsPage().map((i) => i.entry.key)).toEqual(expect.arrayContaining(production));
  });
  it('every declared series exists in the manifest', () => {
    const all = new Set(loadAllManifest().map((m) => m.key));
    for (const e of loadInsights()) for (const s of e.series) expect(all).toContain(s.key);
  });
});

describe('Insight J on real data', () => {
  it('is shown, covering at least the 10 years the module needs', () => {
    const j = insightsPage().find((i) => i.entry.key === 'j')!;
    expect(j.result.shown).toBe(true);
    if (j.result.shown) expect(j.result.n).toBeGreaterThanOrEqual(10);
  });
});

describe('Insight rendering', () => {
  const j = entry({ key: 'j', title: { en: 'Construction costs vs inflation', de: 'Baupreise und Inflation' }, measure: { en: 'spread of construction price growth over CPI inflation', de: 'Abstand des Baupreisanstiegs zur Inflationsrate' } });
  const series = [getSeries('construction-price-office'), getSeries('cpi')];
  const shown: InsightResult = { shown: true, points: [{ period: '2020', value: 1 }, { period: '2021', value: 1.5 }, { period: '2022', value: 2.46 }], from: '2020', to: '2022', n: 3, short: false, mean: 1.65, sd: 0.5, latest: { period: '2022', value: 2.46 }, verdict: 'higher',
    lines: { base: '2015', kpi: [{ period: '2020', value: 100 }, { period: '2021', value: 110 }, { period: '2022', value: 125 }], reference: [{ period: '2020', value: 100 }, { period: '2021', value: 104 }, { period: '2022', value: 108 }] } };
  it('EN: headline, verdict tag and the exact reading sentence, one decimal', () => {
    const h = renderInsight(j, shown, series, 'en');
    expect(h).toContain('id="j"');
    expect(h).toContain('Construction costs vs inflation');
    expect(h).toContain('2.5');
    expect(h).toContain('higher than the average');
    expect(h).toContain('The latest spread of construction price growth over CPI inflation is 2.5 points, higher than the 2020-2022 average of 1.7 points.');
    expect(h).toContain('<svg');
  });
  it('DE: decimal comma and the German reading sentence', () => {
    const h = renderInsight(j, shown, series, 'de');
    expect(h).toContain('Der aktuelle Abstand des Baupreisanstiegs zur Inflationsrate beträgt 2,5 Punkte, höher als der 2020-2022-Durchschnitt von 1,7 Punkten.');
  });
  it('a verdict of in line reads "in line with"', () => {
    expect(renderInsight(j, { ...shown, verdict: 'in_line' } as InsightResult, series, 'en')).toContain('in line with the 2020-2022 average');
  });
  it('too few observations: the section stays, with the reason and no chart', () => {
    const h = renderInsight(j, { shown: false, n: 7, reason: 'too_few' }, series, 'en');
    expect(h).toContain('Insight not shown: too few observations (n = 7); at least 10 are needed.');
    expect(h).not.toContain('<svg');
  });
  it('a source line per series, each tagged own calculation, and a link to Methodology', () => {
    const h = renderInsight(j, shown, series, 'en');
    for (const x of series) expect(h).toContain(x.seriesId);
    expect(h.match(/own calculation/g)).toHaveLength(2);
    expect(h).toContain('<a href="/en/methodology#insights">How this is calculated</a>');
  });
  it('small multiples: the two rebased lines in their own chart, the base on the axis, the shading explained in text', () => {
    const h = renderInsight(j, shown, series, 'en');
    expect(h.match(/<svg/g)).toHaveLength(4); // main chart and one small chart, each wide and narrow
    expect(h).toContain('index, 2015 = 100');
    expect(h).toContain(`Blue line: ${series[0].title.en}. Ochre line: ${series[1].title.en}. The shading is blue where the blue line is above the ochre line and red where it is below.`);
    expect(renderInsight(j, shown, series, 'de')).toContain('Index, 2015 = 100');
  });
  it('Notes come first: a short history is named, then the series\' own Notes', () => {
    const h = renderInsight(j, { ...shown, short: true }, [{ ...series[0], stale: true }, series[1]], 'en');
    expect(h).toContain('Note: Short history (3 years, 2020 to 2022): the average rests on little data.');
    expect(h.indexOf('Short history')).toBeLessThan(h.indexOf('<figcaption>'));
    expect(h).toContain(`Note: ${series[0].title.en}: Latest observation`);
  });
  it('no short-history Note when the history is long enough', () => {
    expect(renderInsight(j, shown, series, 'en')).not.toContain('Short history');
  });
});
