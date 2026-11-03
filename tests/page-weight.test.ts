import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { langs, slug } from '../src/lib/routes';
import { KPIS } from '../src/lib/kpis';

// Tickets 12 and 18: runs on a built site (CI runs it after the preview build); skipped when there is no dist/.
// PAGE_WEIGHT_STRICT=1 (the CI step) fails on a missing page instead of skipping it.
const all = langs.flatMap((l) => KPIS.map((k) => `dist/${l}/${slug(k.page, l)}/index.html`));
const pages = process.env.PAGE_WEIGHT_STRICT === '1' ? all : all.filter((f) => existsSync(f));

describe.skipIf(pages.length === 0)('KPI page weight', () => {
  it.each(pages)('%s has at most 300 KB of HTML and one live view on first load', (f) => {
    // The other views are fetched fragments (ticket 18), so they are not in the page at all.
    expect(statSync(f).size).toBeLessThanOrEqual(300 * 1024);
    const doc = new JSDOM(readFileSync(f)).window.document;
    expect(doc.getElementsByTagName('*').length).toBeLessThanOrEqual(5000);
    // A KPI with no live view (licence not confirmed, production build) has none.
    expect(doc.querySelectorAll('section.view').length).toBeLessThanOrEqual(1);
  });
});
