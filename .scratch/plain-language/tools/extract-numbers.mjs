// Number fingerprint of a built site, so a wording-only change can be proven not to move any number.
//   node .scratch/plain-language/tools/extract-numbers.mjs extract <dist-dir> <out.json>
//   node .scratch/plain-language/tools/extract-numbers.mjs compare <baseline.json> <new.json> [path-prefix ...]
// Per HTML page it records, in document order: every numeric token in visible text (and in aria-label/title/alt),
// and every attribute of every SVG element except class/style/aria-label (path data, coordinates, transforms).
// Prose may differ between builds; these lists must not.
import { JSDOM } from 'jsdom';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const NUM = /-?\d+(?:[.,   ]\d+)*(?:[.,]\d+)?/g;
const TEXT_ATTRS = new Set(['aria-label', 'title', 'alt']);
const SKIP_SVG_ATTRS = new Set(['class', 'style', 'aria-label']);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

function fingerprint(html) {
  const doc = new JSDOM(html).window.document;
  const text = [], svg = [];
  const visit = (el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    const inSvg = !!el.closest('svg');
    for (const a of el.attributes) {
      if (TEXT_ATTRS.has(a.name)) text.push(...(a.value.match(NUM) ?? []));
      else if (inSvg && !SKIP_SVG_ATTRS.has(a.name)) svg.push(`${tag}@${a.name}=${a.value}`);
      else if (a.name.startsWith('data-')) svg.push(`${tag}@${a.name}=${a.value}`);
    }
    for (const n of el.childNodes) {
      if (n.nodeType === 3) text.push(...(n.textContent.match(NUM) ?? []));
      else if (n.nodeType === 1) visit(n);
    }
  };
  visit(doc.documentElement);
  return { text, svg };
}

const [, , mode, a, b, ...prefixes] = process.argv;
if (mode === 'extract') {
  const out = {};
  for (const f of walk(a).sort()) out[relative(a, f)] = fingerprint(readFileSync(f, 'utf8'));
  writeFileSync(b, JSON.stringify(out));
  console.log(`extracted ${Object.keys(out).length} pages -> ${b}`);
} else if (mode === 'compare') {
  const base = JSON.parse(readFileSync(a, 'utf8')), next = JSON.parse(readFileSync(b, 'utf8'));
  const keys = [...new Set([...Object.keys(base), ...Object.keys(next)])].sort().filter((k) => !prefixes.length || prefixes.some((p) => k.startsWith(p)));
  let bad = 0;
  for (const k of keys) {
    if (!base[k] || !next[k]) { console.log(`PAGE ${base[k] ? 'REMOVED' : 'ADDED'}: ${k}`); bad++; continue; }
    for (const part of ['text', 'svg']) {
      const x = base[k][part], y = next[k][part];
      const i = x.findIndex((v, j) => v !== y[j]);
      if (i === -1 && x.length === y.length) continue;
      const at = i === -1 ? Math.min(x.length, y.length) : i;
      console.log(`DIFF ${k} [${part}] item ${at}: baseline ${JSON.stringify(x[at])} vs new ${JSON.stringify(y[at])} (counts ${x.length} vs ${y.length})`);
      bad++;
    }
  }
  console.log(bad ? `${bad} difference(s) in ${keys.length} page(s)` : `OK: numbers identical on ${keys.length} page(s)`);
  process.exit(bad ? 1 : 0);
} else {
  console.error('usage: extract <dist> <out.json> | compare <base.json> <new.json> [path-prefix ...]');
  process.exit(2);
}
