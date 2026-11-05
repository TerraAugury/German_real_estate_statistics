import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { href, langs, slug } from '../src/lib/routes';
import { t } from '../src/lib/i18n';
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
  it('the line reads as specified in English', () => {
    expect(t('en', 'links.chance.note')).toBe('With this many comparisons, a few boxes will look strong by chance alone. Treat a single strong box with caution, especially when n is small.');
  });
});
