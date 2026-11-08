import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { figureNames, withFigures } from '../src/lib/method-figures';

const marks = (lang: string) => [...readFileSync(`content/${lang}/methodology.md`, 'utf8').matchAll(/\{\{figure:([\w-]+)\|/g)].map((m) => m[1]);

describe('Methodology visual examples', () => {
  it('English and German place the same figures, each one known', () => {
    expect(marks('de')).toEqual(marks('en'));
    for (const name of marks('en')) expect(figureNames, name).toContain(name);
  });
  it.each(['en', 'de'] as const)('%s: every figure draws from the real data and no mark is left behind', (lang) => {
    const html = marks(lang).map((n) => `<p>{{figure:${n}|caption}}</p>`).join('');
    const out = withFigures(html, lang);
    expect(out).not.toContain('{{figure');
    expect(out.match(/<figure class="method-fig">/g)).toHaveLength(marks(lang).length);
  });
  it('a figure that cannot be drawn leaves nothing behind', () => {
    expect(withFigures('<p>{{figure:nope|x}}</p>', 'en')).toBe('');
  });
});
