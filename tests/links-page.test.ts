import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { href, langs, slug } from '../src/lib/routes';
import { t } from '../src/lib/i18n';

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
  it('the line reads as specified in English', () => {
    expect(t('en', 'links.chance.note')).toBe('With this many comparisons, a few boxes will look strong by chance alone. Treat a single strong box with caution, especially when n is small.');
  });
});
