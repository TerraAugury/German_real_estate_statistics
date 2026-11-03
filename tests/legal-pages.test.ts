import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const read = (p: string) => readFileSync(p, 'utf8');
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const DISCLAIMER = {
  en: 'For information only. This site presents public statistics and is not investment, tax or legal advice, and not an offer or recommendation to buy or sell any asset. Figures come from third-party sources and may be incomplete, delayed or revised.',
  de: 'Nur zur Information. Diese Seite stellt öffentliche Statistiken dar und ist keine Anlage-, Steuer- oder Rechtsberatung und kein Angebot und keine Empfehlung zum Kauf oder Verkauf von Vermögenswerten. Die Zahlen stammen von Dritten und können unvollständig, verspätet oder revidiert sein.',
};
const legal = ['about', 'terms', 'privacy', 'legal-notice'];

describe('legal pages (ticket 10)', () => {
  it.each(legal)('%s exists in English and German', (p) => {
    expect(read(`content/en/${p}.md`).length).toBeGreaterThan(0);
    expect(read(`content/de/${p}.md`).length).toBeGreaterThan(0);
  });
  it.each(['en', 'de'] as const)('%s: the fixed short-form disclaimer is in the Terms and on no other page', (l) => {
    expect(read(`content/${l}/terms.md`)).toContain(DISCLAIMER[l]);
    for (const p of legal.filter((x) => x !== 'terms')) expect(read(`content/${l}/${p}.md`)).not.toContain(DISCLAIMER[l].slice(0, 40));
  });
  it('Privacy does not mention GitHub, and the legal pages carry no mailto link', () => {
    for (const l of ['en', 'de']) expect(read(`content/${l}/privacy.md`)).not.toMatch(/github/i);
    for (const l of ['en', 'de']) for (const p of legal) expect(read(`content/${l}/${p}.md`)).not.toMatch(/mailto:/i);
  });
  it('nothing the site ships requests a third-party host (scripts, styles, images, frames, fonts)', () => {
    const files = [...walk('src'), ...walk('content'), ...walk('public')].filter((f) => /\.(astro|md|css|html|ts)$/.test(f));
    const bad = /<(script|img|iframe|link|source|video|audio)\b[^>]*\b(src|href)=["']?(https?:)?\/\/|url\(\s*["']?(https?:)?\/\/|@import\s+(url\()?["']?(https?:)?\/\//i;
    for (const f of files) expect(read(f), f).not.toMatch(bad);
  });
});
