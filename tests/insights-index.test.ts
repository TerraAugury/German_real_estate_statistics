import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { insightsPage, type InsightModel } from '../src/lib/insights';
import { renderInsightIndex, renderInsight } from '../src/lib/panel';

// Design refinement 08: the Insights page opens with a grid of title, headline number, unit and verdict per Insight.
beforeEach(() => { process.env.INCLUDE_PROVISIONAL = '1'; });
afterEach(() => { delete process.env.INCLUDE_PROVISIONAL; });

const parse = (html: string) => new JSDOM(html).window.document;

describe('Insights index', () => {
  it('lists every Insight in page order, each linking to its section', () => {
    const models = insightsPage();
    const items = [...parse(renderInsightIndex(models, 'en')).querySelectorAll('li')];
    expect(items.map((li) => li.querySelector('a')!.getAttribute('href'))).toEqual(models.map((m) => `#${m.entry.key}`));
    expect(items.map((li) => li.querySelector('.title')!.textContent)).toEqual(models.map((m) => m.entry.title.en));
  });
  it('a shown Insight carries its headline number with the page precision, unit and verdict tag in words', () => {
    const models = insightsPage();
    const items = [...parse(renderInsightIndex(models, 'en')).querySelectorAll('li')];
    models.forEach((m, i) => {
      if (!m.result.shown) return;
      const digits = m.entry.headline === 'ratio' ? 2 : 1;
      expect(items[i].querySelector('.num')!.textContent, m.entry.key).toMatch(new RegExp(`^-?\\d+\\.\\d{${digits}}$`));
      expect(items[i].querySelector('.unit')!.textContent).toBe(items[i].querySelector('.unit')!.textContent!.trim());
      expect(items[i].querySelector('.tag')!.textContent).toMatch(/^(higher than|lower than|in line with) the average$/);
    });
  });
  it('the number is the one the Insight section shows', () => {
    const m = insightsPage()[0];
    const section = parse(renderInsight(m.entry, m.result, m.series, 'en'));
    expect(parse(renderInsightIndex([m], 'en')).querySelector('.num')!.textContent).toBe(section.querySelector('.headline .num')!.textContent);
  });
  it('an Insight that is not shown gives its reason and no number', () => {
    const m = { ...insightsPage()[0], result: { shown: false, n: 8, reason: 'too_few' } } as InsightModel;
    const li = parse(renderInsightIndex([m], 'en')).querySelector('li')!;
    expect(li.querySelector('.num')).toBeNull();
    expect(li.querySelector('.na')!.textContent).toBe('Insight not shown: too few observations (n = 8); at least 10 are needed.');
  });
});

describe('Insight section', () => {
  it('separates the small charts from the headline chart', () => {
    const m = insightsPage().find((x) => x.entry.series.filter((s) => s.role === 'kpi').length > 1)!;
    const doc = parse(renderInsight(m.entry, m.result, m.series, 'en'));
    expect(doc.querySelectorAll('figure .multiples').length).toBeGreaterThan(0);
  });
});
