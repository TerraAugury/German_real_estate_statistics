import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { href, langs, slug } from '../src/lib/routes';
import { t } from '../src/lib/i18n';
import { KPIS } from '../src/lib/kpis';
import { viewLinks } from '../src/lib/links';
import { loadManifest } from '../src/lib/manifest';
import { DRAFT } from '../src/lib/review'; // a preview build marks unreviewed German

// The Links page as built (tickets 12 to 18): runs on a built site, skipped when there is no dist/.
const file = (l: string) => `dist/${l}/${slug('links', l as 'en')}/index.html`;
const built = langs.filter((l) => existsSync(file(l)));
const page = (l: string) => new JSDOM(readFileSync(file(l))).window.document;

describe.skipIf(built.length === 0)('Links page', () => {
  it.each(built)('%s: the many-comparisons line sits under the matrix', (l) => {
    const doc = page(l as 'en');
    const note = [...doc.querySelectorAll('p.note')].find((p) => p.textContent === t(l as 'en', 'links.chance.note'))!;
    expect(note).toBeTruthy();
    expect(doc.querySelector('table.matrix')!.compareDocumentPosition(note) & 4).toBeTruthy(); // after the table
  });
  it.each(built)('%s: the rent and transaction-volume rows carry the nominal tag and the matrix has its note', (l) => {
    const doc = page(l as 'en');
    const tagged = [...doc.querySelectorAll('table.matrix tbody tr')].filter((r) => r.querySelector('th small.nominal')).map((r) => r.querySelector('th a')!.getAttribute('href'));
    expect(tagged).toEqual(['kpi-rent-index', 'kpi-transaction-volume'].map((k) => href(k as 'home', l as 'en')));
    expect([...doc.querySelectorAll('p.note')].some((p) => p.textContent === t(l as 'en', 'links.nominal.note'))).toBe(true);
  });
  const TAGS = {
    en: { 'kpi-price-index': 'Commercial overall · Germany', 'kpi-rent-index': 'Office · Germany', 'kpi-initial-yield': 'Office + retail · 7 cities',
      'kpi-office-vacancy': 'Office · 7 cities', 'kpi-transaction-volume': 'Commercial overall · Germany', construction: 'Office · Germany' },
    de: { 'kpi-price-index': 'Gewerbe gesamt · Deutschland', 'kpi-rent-index': 'Büro · Deutschland', 'kpi-initial-yield': 'Büro + Einzelhandel · 7 Großstädte',
      'kpi-office-vacancy': 'Büro · 7 Großstädte', 'kpi-transaction-volume': 'Gewerbe gesamt · Deutschland', construction: 'Büro · Deutschland' },
  } as const;
  it.each(built)('%s: every row starts with its segment and area tag, and the note says the indicators are national', (l) => {
    const doc = page(l as 'en');
    const rows = [...doc.querySelectorAll('table.matrix tbody tr')];
    expect(rows).toHaveLength(6);
    for (const r of rows) {
      const key = Object.keys(TAGS.en).find((k) => r.querySelector('th a')!.getAttribute('href') === href(k as 'home', l as 'en'))!;
      expect(r.querySelector('th small.tag')?.textContent?.replace(DRAFT, ''), key).toBe(TAGS[l as 'en' | 'de'][key as keyof typeof TAGS.en]);
    }
    expect([...doc.querySelectorAll('p.note')].some((p) => p.textContent === t(l as 'en', 'links.rows.note'))).toBe(true);
  });
  it.each(built)('%s: no cell is blank', (l) => {
    const cells = [...page(l as 'en').querySelectorAll('table.matrix tbody td')];
    expect(cells).toHaveLength(48);
    expect(cells.filter((td) => !td.textContent!.trim())).toEqual([]);
  });
  it.each(built)('%s: the loan-rate column, its Link panels and the Methodology name the 5-year-fixation series (ticket 16)', (l) => {
    const fix = l === 'en' ? 'rate fixed for over 5 years' : 'Zinsbindung über 5 Jahre';
    expect([...page(l as 'en').querySelectorAll('table.matrix thead th')].some((th) => th.textContent!.includes(fix))).toBe(true);
    const meth = readFileSync(`content/${l}/methodology.md`, 'utf8');
    expect(meth).toContain(l === 'en' ? 'initial rate fixation of over 5 years' : 'Zinsbindung von über 5 Jahren');
    const panel = readFileSync(`dist/${l}/${slug('kpi-initial-yield', l as 'en')}/index.html`, 'utf8');
    expect(panel).toContain(l === 'en' ? 'rate fixed for over 5 years' : 'Zinsbindung über 5 Jahre');
  });
  it.each(built)('%s: the legend names the matrix colours, not the Insights colours (ticket 17)', (l) => {
    const text = [...page(l as 'en').querySelectorAll('p.note')].map((p) => p.textContent).join(' ');
    expect(text).toMatch(l === 'en' ? /violet/i : /violett/i);
    expect(text).toMatch(l === 'en' ? /olive/ : /olivgrün/);
    expect(text).not.toMatch(/ochre|ocker|blue|blau/i);
  });
  // Ticket 18: each cell's link opens a view whose first series is the cell's KPI series, with the cell's own Link panel on it.
  it.each(built)('%s: every cell link opens the view and panel of its own series', (l) => {
    const rows = [...page(l as 'en').querySelectorAll('table.matrix tbody tr')];
    let checked = 0;
    for (const r of rows) {
      const kpi = KPIS.find((k) => r.querySelector('th a')!.getAttribute('href') === href(k.page, l as 'en'))!;
      for (const a of r.querySelectorAll<HTMLAnchorElement>('td a')) {
        const u = new URL(a.getAttribute('href')!, 'http://x');
        const view = kpi.views.find((v) => v.segment === u.searchParams.get('segment') && v.geo === u.searchParams.get('geo') && v.freq === u.searchParams.get('freq'))!;
        expect(view, a.getAttribute('href')!).toBeTruthy();
        const id = u.hash.slice(1);
        expect(id.startsWith(`link-${view.series[0].key}-`), `${kpi.page} ${id}`).toBe(true);
        expect(viewLinks(view, loadManifest(true)).map((p) => p.id), `${kpi.page} ${id}`).toContain(id);
        if (kpi.page === 'construction') expect(u.searchParams.get('segment')).toBe('office');
        checked++;
      }
    }
    expect(checked).toBe(48 * 3); // one link per lag in each cell
  });
  it.each(built)('%s: a within-chance cell also says so in text, not only in grey', (l) => {
    const doc = page(l as 'en');
    for (const a of doc.querySelectorAll('td.lagcell a.noise')) expect(a.querySelector('.vh')?.textContent?.replace(DRAFT, '')).toBe(l === 'en' ? 'within chance range' : 'im Zufallsbereich');
    expect(doc.querySelectorAll('td.lagcell a.noise').length).toBeGreaterThan(0);
  });
  it('the line reads as specified in English', () => {
    expect(t('en', 'links.chance.note')).toBe('With this many comparisons, a few boxes will look strong by chance alone. Treat a single strong box with caution, especially when n is small.');
  });
});
