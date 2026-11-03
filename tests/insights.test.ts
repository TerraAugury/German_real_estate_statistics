import { afterEach, describe, expect, it } from 'vitest';
import { checkInsights, loadAllManifest, loadManifest, type InsightEntry } from '../src/lib/manifest';
import { loadStrings } from '../src/lib/i18n';
import { multiplesChart, sharedDomain } from '../src/lib/chart';
import { insightsPage, loadInsights, visibleInsights } from '../src/lib/insights';
import { renderInsight } from '../src/lib/panel';
import { KPIS } from '../src/lib/kpis';
import { kpiPage } from '../src/lib/pages';
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
    ['shift with no label', [entry({ shift: 7 })], 'no i18n key insight.shift.7'],
    ['deflate that is neither flow nor stock', [entry({ deflate: 'yearly' as 'flow' })], 'deflate must be one of'],
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
  it('production shows exactly Insights C and J; the declarations pass every build check', () => {
    expect(() => loadInsights()).not.toThrow();
    expect(insightsPage().map((i) => i.entry.key).sort()).toEqual(['c', 'j']);
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

describe('Insight C on real data', () => {
  it('compares completions with the permits of two years earlier', () => {
    const c = insightsPage().find((i) => i.entry.key === 'c')!;
    expect(c.entry).toMatchObject({ headline: 'ratio', shift: 2 });
    expect(c.result.shown).toBe(true);
    if (c.result.shown) expect(+c.result.from).toBeGreaterThanOrEqual(2010);
  });
});

describe('"Insights using this KPI" on KPI pages', () => {
  // Which KPI page lists which Insight (insights spec section 6); Insights not declared yet are skipped.
  const PAGES: Record<string, string[]> = {
    a: ['kpi-initial-yield'], f: ['kpi-initial-yield'], g: ['kpi-price-index', 'kpi-rent-index'], b: ['kpi-rent-index'], d: ['kpi-rent-index'], i: ['kpi-rent-index'],
    c: ['construction'], j: ['construction'], e: ['kpi-office-vacancy'], m: ['kpi-office-vacancy'],
  };
  const listed = (page: string) => kpiPage(KPIS.find((k) => k.page === page)!).insights.map((e) => e.key);
  it('production: Construction lists C and J in page order, no other KPI page has a list', () => {
    expect(listed('construction')).toEqual(['c', 'j']);
    for (const k of KPIS.filter((k) => k.page !== 'construction')) expect(listed(k.page)).toEqual([]);
  });
  it('preview: every declared Insight is listed on the KPI pages of its Real estate KPI series, and only there', () => {
    process.env.INCLUDE_PROVISIONAL = '1';
    for (const e of loadInsights()) for (const k of KPIS) {
      expect(listed(k.page).includes(e.key), `${e.key} on ${k.page}`).toBe(PAGES[e.key].includes(k.page));
    }
  });
});

describe('Methodology', () => {
  it.each([['en', 'insights'], ['de', 'einblicke']])('%s: an Insights section whose heading id is the anchor the Insight source lines link to', async (lang, anchor) => {
    const { readFileSync } = await import('node:fs');
    const heading = readFileSync(`content/${lang}/methodology.md`, 'utf8').match(/^## (Insights|Einblicke)$/m)?.[1];
    expect(heading?.toLowerCase()).toBe(anchor); // Astro slugs the heading to its lower-case text
  });
});

describe('Insight A on real data (Provisional: preview only)', () => {
  it('is hidden in production', () => expect(insightsPage().map((i) => i.entry.key)).not.toContain('a'));
  it('preview: the 7-city yield against the annual Bund mean over 1995 to 2025, both City classes, never 120', () => {
    process.env.INCLUDE_PROVISIONAL = '1';
    const a = insightsPage().find((i) => i.entry.key === 'a')!;
    expect(a.result).toMatchObject({ shown: true, from: '1995', to: '2025', n: 31 });
    expect(a.entry.series.map((s) => s.key)).toEqual(['initial-yield-combined-7', 'initial-yield-combined-127', 'bund-yield-10y']);
    const h = renderInsight(a.entry, a.result, a.series, 'en');
    expect(h.match(/<svg/g)).toHaveLength(6); // main chart, then one small chart per City class
    expect(h).toContain('7 major cities');
    expect(h).toContain('127 towns');
    expect(h).not.toMatch(/120 towns|combined-120/);
    expect(h.match(/not an individual city/g)).toHaveLength(2); // a scope Note for each City class
  });
});

describe('Spread Insights F, E, D and I (Provisional: preview only)', () => {
  // Shared periods from the catalogue (insights spec section 2); growth Insights lose the first year of the levels.
  it.each([
    ['f', 'initial-yield-combined-7', 'loan-rate-nfc', '2011', '2025', 15],
    ['e', 'office-vacancy-7', 'office-vacancy-127', '1995', '2025', 31],
    ['d', 'rent-index-de-office-a', 'construction-price-office', '2005', '2025', 21],
    ['i', 'rent-index-de-office-a', 'gdp-real', '2005', '2025', 21],
  ])('%s: %s against %s over %s to %s', (key, kpi, reference, from, to, n) => {
    expect(insightsPage().map((i) => i.entry.key)).not.toContain(key);
    process.env.INCLUDE_PROVISIONAL = '1';
    const x = insightsPage().find((i) => i.entry.key === key)!;
    expect(x.entry.series).toEqual([{ key: kpi, role: 'kpi' }, { key: reference, role: 'reference' }]);
    expect(x.entry.headline).toBe('spread');
    expect(x.result).toMatchObject({ shown: true, from, to, n });
    const h = renderInsight(x.entry, x.result, x.series, 'en');
    expect(h).toContain(`id="${key}"`);
    expect(h).toMatch(/The latest spread of [^.]+ is -?[\d.]+ points, (higher than|lower than|in line with) the/);
  });
});

describe('Insights G and B (Provisional: preview only)', () => {
  it('G: the price index over the rent index, both rebased to 2015, 2013 to 2025', () => {
    expect(insightsPage().map((i) => i.entry.key)).not.toContain('g');
    process.env.INCLUDE_PROVISIONAL = '1';
    const g = insightsPage().find((i) => i.entry.key === 'g')!;
    expect(g.entry).toMatchObject({ headline: 'ratio', indexed: true, base: 2015 });
    expect(g.entry.series.map((s) => s.key)).toEqual(['price-index-de-office-a', 'rent-index-de-office-a']);
    expect(g.result).toMatchObject({ shown: true, from: '2013', to: '2025', n: 13 });
    if (g.result.shown) expect(g.result.points.find((p) => p.period === '2015')!.value).toBeCloseTo(1, 9);
    expect(renderInsight(g.entry, g.result, g.series, 'en')).toMatch(/The price index stands at [\d.]+ times the rent index, (higher than|lower than|in line with) the 2013-2025 average of [\d.]+\./);
  });
  it('B: real office rent growth, deflated as a flow by the annual-average CPI, 2005 to 2025', () => {
    expect(insightsPage().map((i) => i.entry.key)).not.toContain('b');
    process.env.INCLUDE_PROVISIONAL = '1';
    const b = insightsPage().find((i) => i.entry.key === 'b')!;
    expect(b.entry).toMatchObject({ headline: 'growth', deflate: 'flow', base: 2015 });
    expect(b.entry.series.map((s) => s.key)).toEqual(['rent-index-de-office-a', 'cpi']);
    expect(b.result).toMatchObject({ shown: true, from: '2005', to: '2025', n: 21 });
    const h = renderInsight(b.entry, b.result, b.series, 'en');
    expect(h).toMatch(/Real office rents grew -?[\d.]+% in 2025, (higher than|lower than|in line with) the 2005-2025 average of -?[\d.]+%\./);
    expect(h.match(/own calculation/g)).toHaveLength(2);
  });
  it('the DE sentences', () => {
    process.env.INCLUDE_PROVISIONAL = '1';
    const [g, b] = ['g', 'b'].map((k) => insightsPage().find((i) => i.entry.key === k)!);
    expect(renderInsight(g.entry, g.result, g.series, 'de')).toMatch(/Der Preisindex liegt beim [\d,]+-Fachen des Mietindex, (höher als der|niedriger als der|im Einklang mit dem) 2013-2025-Durchschnitt von [\d,]+\./);
    expect(renderInsight(b.entry, b.result, b.series, 'de')).toMatch(/Die realen Büromieten sind 2025 um -?[\d,]+ % gewachsen, (höher als der|niedriger als der|im Einklang mit dem) 2005-2025-Durchschnitt von -?[\d,]+ %\./);
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
    expect(renderInsight(j, shown, series, 'de')).toContain('<a href="/de/methodik#einblicke">');
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
  describe('a ratio with a shifted reference', () => {
    const c = entry({ key: 'c', headline: 'ratio', shift: 2, template: 'completions-permits', title: { en: 'Office completions vs permits two years earlier', de: 'Büro-Fertigstellungen und Baugenehmigungen zwei Jahre zuvor' } });
    const cs = [getSeries('construction-completions-office'), getSeries('construction-permits-office')];
    const ratio: InsightResult = { ...shown as Extract<InsightResult, { shown: true }>, mean: 0.8, latest: { period: '2022', value: 0.8346 }, verdict: 'lower' };
    it('EN: two decimals, "times", and the exact reading', () => {
      const h = renderInsight(c, ratio, cs, 'en');
      expect(h).toContain('0.83');
      expect(h).toContain('Completions were 0.83 times the permits issued two years earlier, lower than the 2020-2022 average of 0.80.');
    });
    it('DE: decimal comma and the German reading', () => {
      expect(renderInsight(c, ratio, cs, 'de')).toContain('Die Fertigstellungen entsprachen dem 0,83-Fachen der zwei Jahre zuvor erteilten Baugenehmigungen, niedriger als der 2020-2022-Durchschnitt von 0,80.');
    });
    it('the shifted series is named in the legend and the chart label', () => {
      const h = renderInsight(c, ratio, cs, 'en');
      expect(h).toContain(`Ochre line: ${cs[1].title.en}, two years earlier.`);
      expect(h).toContain(`${cs[0].title.en} and ${cs[1].title.en}, two years earlier, rebased`);
    });
  });
});
