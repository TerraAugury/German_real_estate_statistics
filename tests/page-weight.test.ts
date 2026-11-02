import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { langs, slug } from '../src/lib/routes';
import { KPIS } from '../src/lib/kpis';

// Ticket 12: runs on a built site (CI runs it after the preview build); skipped when there is no dist/.
const pages = langs.flatMap((l) => KPIS.map((k) => `dist/${l}/${slug(k.page, l)}/index.html`)).filter((f) => existsSync(f));

describe.skipIf(pages.length === 0)('KPI page weight', () => {
  it.each(pages)('%s has at most 5,000 live elements on first load', (f) => {
    const doc = new JSDOM(readFileSync(f)).window.document;
    // Template content is not part of the live DOM, so getElementsByTagName does not count it.
    expect(doc.getElementsByTagName('*').length).toBeLessThanOrEqual(5000);
    expect(doc.querySelectorAll('section.view')).toHaveLength(1);
  });
});
