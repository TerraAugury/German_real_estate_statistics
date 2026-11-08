import { afterEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { insightsPage, leadInsight, type InsightModel } from '../src/lib/insights';
import { renderHero } from '../src/lib/panel';

// Design refinement 06: Home opens with one Insight, above the KPI index.
afterEach(() => { delete process.env.INCLUDE_PROVISIONAL; });

const model = (key: string, shown = true) => ({ entry: { key }, series: [], result: { shown } }) as unknown as InsightModel;

describe('lead Insight', () => {
  it('is the yield spread (a) when it is public and shown', () => {
    expect(leadInsight([model('c'), model('a'), model('j')])!.entry.key).toBe('a');
  });
  it('is the first shown Insight when the yield spread is not public', () => {
    expect(leadInsight([model('c', false), model('j'), model('e')])!.entry.key).toBe('j');
  });
  it('a yield spread that is not shown does not lead', () => {
    expect(leadInsight([model('a', false), model('c')])!.entry.key).toBe('c');
  });
  it('is nothing when no Insight is shown', () => {
    expect(leadInsight([])).toBeUndefined();
    expect(leadInsight([model('c', false)])).toBeUndefined();
  });
  it('preview build: the yield spread; production build: one of the Insights it publishes', () => {
    process.env.INCLUDE_PROVISIONAL = '1';
    expect(leadInsight()!.entry.key).toBe('a');
    delete process.env.INCLUDE_PROVISIONAL;
    const published = insightsPage().map((m) => m.entry.key);
    expect(published).toContain(leadInsight()!.entry.key);
  });
});

describe('hero', () => {
  const hero = (lang: 'en' | 'de' = 'en') => {
    process.env.INCLUDE_PROVISIONAL = '1';
    const m = leadInsight()!;
    return new JSDOM(renderHero(m.entry, m.result, m.series, lang)).window.document;
  };
  it('shows the headline number with its verdict tag, the reading, one chart and the citation', () => {
    const doc = hero();
    expect(doc.querySelector('section.hero h2')!.textContent).toBe('Spread of initial yield over the 10-year Bund yield, by City class');
    expect(doc.querySelector('.headline .num')!.textContent).toMatch(/^-?\d+\.\d$/);
    expect(doc.querySelector('.headline .tag')!.textContent).toMatch(/average$/);
    expect(doc.querySelector('section.hero > p:not(.headline)')!.textContent).toMatch(/^The latest spread of the 7-city initial yield over the 10-year Bund yield is /);
    expect(doc.querySelectorAll('svg.wide')).toHaveLength(1);
    expect(doc.querySelectorAll('.multiples')).toHaveLength(0);
    expect(doc.querySelectorAll('.cite').length).toBeGreaterThan(0);
  });
  it('links to the Insight on the Insights page', () => {
    expect(hero().querySelector('a[href="/en/insights#a"]')).not.toBeNull();
    expect(hero('de').querySelector('a[href="/de/einblicke#a"]')).not.toBeNull();
  });
  it('describes the lines and claims no cause or forecast', () => {
    const text = hero().body.textContent!;
    expect(text).not.toMatch(/\b(because|caused|will |forecast to|predict)/i);
  });
});
