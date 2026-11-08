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
    expect(li.querySelector('.na')!.textContent).toBe('Insight not shown: too few years of data (n = 8). We need at least 10.');
  });
});

describe('Insight section', () => {
  it('separates the small charts from the headline chart', () => {
    const m = insightsPage().find((x) => x.entry.series.filter((s) => s.role === 'kpi').length > 1)!;
    const doc = parse(renderInsight(m.entry, m.result, m.series, 'en'));
    expect(doc.querySelectorAll('figure .multiples').length).toBeGreaterThan(0);
  });
});

// Insight tone: a better or worse Insight tints its whole plate (index tile, section, Home lead); the verdict tag stays plain.
describe('Insight tone on the plate', () => {
  const withVerdict = (key: string, verdict: 'higher' | 'lower' | 'in_line') => {
    const m = insightsPage().find((x) => x.entry.key === key)!;
    return { ...m, result: { ...m.result, verdict } } as InsightModel;
  };
  /** The tone class on the plate and the visually hidden word, wherever the HTML puts them. */
  const marks = (html: string) => {
    const doc = parse(html);
    return { plate: doc.querySelector('[class*="tone-"]')?.className.match(/\btone-(?:better|worse)\b/)?.[0] ?? null, word: doc.querySelector('.vh')?.textContent ?? null };
  };
  it('a latest value on the better side of its average tints the tile better, the other side worse', () => {
    // e: lower is better (7 cities emptier than 127 towns is worse).
    expect(marks(renderInsightIndex([withVerdict('e', 'lower')], 'en'))).toMatchObject({ plate: 'tone-better', word: '(better)' });
    expect(marks(renderInsightIndex([withVerdict('e', 'higher')], 'en'))).toMatchObject({ plate: 'tone-worse', word: '(worse)' });
    // a: higher is better.
    expect(marks(renderInsightIndex([withVerdict('a', 'higher')], 'en'))).toMatchObject({ plate: 'tone-better' });
  });
  it('in line, and an Insight with no better side, keep the plain plate with no hidden word', () => {
    for (const [key, verdict] of [['e', 'in_line'], ['g', 'higher'], ['c', 'lower']] as const) {
      expect(marks(renderInsightIndex([withVerdict(key, verdict)], 'en')), key).toMatchObject({ plate: null, word: null });
    }
  });
  it('the coloured pill and its visible word are gone; the verdict pill stays and says the verdict', () => {
    const doc = parse(renderInsightIndex([withVerdict('e', 'lower')], 'en'));
    expect(doc.querySelector('.tone')).toBeNull();
    expect(doc.querySelector('.tag')!.textContent).toBe('lower than the average');
  });
  it('the index, the Insight section and the Home lead agree for every Insight, in both languages', () => {
    for (const lang of ['en', 'de'] as const) for (const m of insightsPage()) {
      if (!m.result.shown) continue;
      const want = tone(m.result.verdict, m.entry.better);
      const expected = want === 'neutral' ? null : `tone-${want}`;
      const index = marks(renderInsightIndex([m], lang));
      expect(index.plate, `${m.entry.key} ${lang} index`).toBe(expected);
      expect(index.word === null, `${m.entry.key} ${lang} hidden word`).toBe(expected === null);
      expect(marks(renderInsight(m.entry, m.result, m.series, lang)), `${m.entry.key} ${lang} section`).toEqual(index);
      expect(marks(renderHero(m.entry, m.result, m.series, lang)), `${m.entry.key} ${lang} hero`).toEqual(index);
    }
  });
  it('the Insights page legend explains the tone and the office-investor view', () => {
    expect(loadStrings('en')['insights.tone.legend']).toMatch(/investor in office property/);
    expect(loadStrings('de')['insights.tone.legend']).toMatch(/Anleger in Büroimmobilien/);
    // The tone is a tint of the plate, not a tag or a pill.
    expect(loadStrings('en')['insights.tone.legend']).not.toMatch(/\b(tag|pill)\b/i);
    expect(loadStrings('de')['insights.tone.legend']).not.toMatch(/Etikett/);
  });
});
