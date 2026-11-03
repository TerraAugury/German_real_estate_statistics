import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { insightsPage, type InsightModel } from '../src/lib/insights';
import { loadStrings } from '../src/lib/i18n';
import { renderHero, renderInsightIndex, renderInsight } from '../src/lib/panel';
import { tone } from '../src/insight/insight';

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

// Insight tone: the verdict tag is coloured better or worse by the Insight's declared direction, wherever the tag shows.
describe('Insight tone on the tag', () => {
  const withVerdict = (key: string, verdict: 'higher' | 'lower' | 'in_line') => {
    const m = insightsPage().find((x) => x.entry.key === key)!;
    return { ...m, result: { ...m.result, verdict } } as InsightModel;
  };
  const markers = (html: string) => {
    const doc = parse(html);
    return { tag: doc.querySelector('.tag')!.className, word: doc.querySelector('.tone')?.textContent ?? null, toneClass: doc.querySelector('.tone')?.className ?? null };
  };
  it('a latest value on the better side of its average reads better, the other side worse', () => {
    // e: lower is better (7 cities emptier than 127 towns is worse).
    expect(markers(renderInsightIndex([withVerdict('e', 'lower')], 'en'))).toMatchObject({ word: 'better', toneClass: 'tone better' });
    expect(markers(renderInsightIndex([withVerdict('e', 'higher')], 'en'))).toMatchObject({ word: 'worse', toneClass: 'tone worse' });
    // a: higher is better.
    expect(markers(renderInsightIndex([withVerdict('a', 'higher')], 'en'))).toMatchObject({ word: 'better' });
  });
  it('in line, and an Insight with no better side, show the plain verdict tag with no tone word', () => {
    expect(markers(renderInsightIndex([withVerdict('e', 'in_line')], 'en')).word).toBeNull();
    expect(markers(renderInsightIndex([withVerdict('g', 'higher')], 'en')).word).toBeNull();
    expect(markers(renderInsightIndex([withVerdict('c', 'lower')], 'en')).word).toBeNull();
  });
  it('the verdict text stays on the tag, so the tone word adds to it', () => {
    expect(parse(renderInsightIndex([withVerdict('e', 'lower')], 'en')).querySelector('.tag')!.textContent).toBe('lower than the average');
  });
  it('the index, the Insight section and the Home lead agree for every Insight, in both languages', () => {
    for (const lang of ['en', 'de'] as const) for (const m of insightsPage()) {
      if (!m.result.shown) continue;
      const want = tone(m.result.verdict, m.entry.better);
      const word = (html: string) => parse(html).querySelector('.tone')?.className ?? null;
      const expected = want === 'neutral' ? null : `tone ${want}`;
      expect(word(renderInsightIndex([m], lang)), `${m.entry.key} index`).toBe(expected);
      expect(word(renderInsight(m.entry, m.result, m.series, lang)), `${m.entry.key} section`).toBe(expected);
      expect(word(renderHero(m.entry, m.result, m.series, lang)), `${m.entry.key} hero`).toBe(expected);
    }
  });
  it('the Insights page legend explains the tone and the office-investor view', () => {
    expect(loadStrings('en')['insights.tone.legend']).toMatch(/investor in office property/);
    expect(loadStrings('de')['insights.tone.legend']).toMatch(/Anleger in Büroimmobilien/);
  });
});
