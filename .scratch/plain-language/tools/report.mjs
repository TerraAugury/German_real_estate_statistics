// Before/after report for one ticket.
//   node .scratch/plain-language/tools/report.mjs <ticket> <base-ref> <out.md> [reasons.json] [--md file ...] [--insights] [--series]
// Interface strings: keys assigned to <ticket> in report/01-key-assignment.tsv, compared with <base-ref>.
// --md: prose pages (content/<lang>/<name>.md), compared line by line. --insights / --series: manifest text fields.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';

const [, , ticket, base, out, ...rest] = process.argv;
const reasonsFile = rest.find((a) => a.endsWith('.json'));
const reasons = reasonsFile ? JSON.parse(readFileSync(reasonsFile, 'utf8')) : {};
const old = (path) => execFileSync('git', ['show', `${base}:${path}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const row = (k, a, b) => `| ${esc(k)} | ${esc(a)} | ${esc(b)} | ${esc(reasons[k] ?? '')} |`;
const table = (rows) => rows.length ? ['| Key | Original | New | Reason |', '|---|---|---|---|', ...rows].join('\n') : '_No changes._';
const sections = [];
const kept = [];

const keys = readFileSync('.scratch/plain-language/report/01-key-assignment.tsv', 'utf8').split('\n').slice(1).filter(Boolean).map((l) => l.split('\t')).filter((c) => c[1] === ticket).map((c) => c[0]);
const lang = {};
for (const l of ['en', 'de']) {
  const was = parse(old(`src/i18n/${l}.yaml`)), now = parse(readFileSync(`src/i18n/${l}.yaml`, 'utf8'));
  lang[l] = keys.filter((k) => was[k] !== now[k]).map((k) => row(k, was[k], now[k]));
  if (l === 'en') for (const k of keys) if (was[k] === now[k]) kept.push(`- \`${k}\`: already plain, kept (EN and DE${parse(old('src/i18n/de.yaml'))[k] !== parse(readFileSync('src/i18n/de.yaml', 'utf8'))[k] ? '; German changed only' : ''})`);
}
// keys whose German alone changed are not "kept"
const deOnly = keys.filter((k) => parse(old('src/i18n/en.yaml'))[k] === parse(readFileSync('src/i18n/en.yaml', 'utf8'))[k] && parse(old('src/i18n/de.yaml'))[k] !== parse(readFileSync('src/i18n/de.yaml', 'utf8'))[k]);
sections.push(`## Interface strings, English (ticket ${ticket} keys)\n\n${table(lang.en)}`, `## Interface strings, German (ticket ${ticket} keys)\n\n${table(lang.de)}`);

const manifest = (path, label, fields, keyField = 'key') => {
  const was = parse(old(path)), now = parse(readFileSync(path, 'utf8'));
  for (const l of ['en', 'de']) {
    const rows = [];
    now.forEach((e, i) => { const o = was.find((x) => x[keyField] === e[keyField]) ?? was[i]; for (const f of fields) if (e[f] && o[f]?.[l] !== e[f][l]) rows.push(row(`${e[keyField]}.${f}`, o[f]?.[l], e[f][l])); });
    sections.push(`## ${label}, ${l === 'en' ? 'English' : 'German'}\n\n${table(rows)}`);
  }
  for (const e of now) for (const f of fields) if (e[f]) { const o = was.find((x) => x[keyField] === e[keyField]); if (o?.[f]?.en === e[f].en && o?.[f]?.de === e[f].de) kept.push(`- \`${label}:${e[keyField]}.${f}\`: kept`); }
};
if (rest.includes('--insights')) manifest('manifest/insights.yaml', 'Insights manifest', ['title', 'measure', 'definition']);
if (rest.includes('--series')) manifest('manifest/series.yaml', 'Series manifest', ['title', 'unit']);

const mdIdx = rest.indexOf('--md');
if (mdIdx >= 0) for (const name of rest.slice(mdIdx + 1).filter((a) => !a.startsWith('--') && !a.endsWith('.json'))) for (const l of ['en', 'de']) {
  const p = `content/${l}/${name}.md`, was = old(p).split('\n'), now = readFileSync(p, 'utf8').split('\n');
  const rows = [];
  const wasSet = new Set(was), nowSet = new Set(now);
  const del = was.filter((x) => x.trim() && !nowSet.has(x)), add = now.filter((x) => x.trim() && !wasSet.has(x));
  const n = Math.max(del.length, add.length);
  for (let i = 0; i < n; i++) rows.push(row(`${name} (${l}) #${i + 1}`, del[i] ?? '(none)', add[i] ?? '(removed)'));
  sections.push(`## ${name}.md, ${l === 'en' ? 'English' : 'German'}\n\n${table(rows)}`);
}

writeFileSync(out, `# Ticket ${ticket}: before and after\n\nOriginal = \`${base}\`. Numbers, keys and identifiers unchanged.\n\n${sections.join('\n\n')}\n\n## Coverage: strings left alone\n\n${kept.join('\n') || '_None._'}\n${deOnly.length ? `\nGerman changed, English kept: ${deOnly.map((k) => '`' + k + '`').join(', ')}\n` : ''}`);
console.log('wrote', out);
