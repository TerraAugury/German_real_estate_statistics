// Bilingual review workflow (spec section 10): German ships only if a named human reviewed it against the current English.
import { createHash } from 'node:crypto';
import { parse, stringify } from 'yaml';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

export const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
/** Review record per file: who, when, and the hash of each English string at review time. */
export interface Lock { reviewed_by: string; reviewed_on: string; hashes: Record<string, string> }
export interface Prose { en: string; de?: { en_hash?: string; reviewed_by?: string; reviewed_on?: string } }

/** Keys whose German is unreviewed: no record, or the English changed since review. */
export function unreviewedKeys(en: Record<string, string>, lock: Lock): string[] {
  const named = !!lock.reviewed_by && !!lock.reviewed_on;
  return Object.keys(en).filter((k) => !named || lock.hashes?.[k] !== hash(en[k]));
}

/** Prose pages (by name) whose German front matter lacks a review record or whose en_hash differs from the English body. */
export function unreviewedProse(pages: Record<string, Prose>): string[] {
  return Object.keys(pages).filter((n) => {
    const { en, de } = pages[n];
    return !de || !de.reviewed_by || !de.reviewed_on || de.en_hash !== hash(en);
  });
}

/** Production build fails on unreviewed German. Preview builds pass and show the [DRAFT] marker. */
export function assertReviewed(unreviewed: string[], production: boolean): void {
  if (production && unreviewed.length) throw new Error(`review: unreviewed German (${unreviewed.length}): ${unreviewed.join(', ')}`);
}
export const draft = (text: string, unreviewed: boolean) => (unreviewed ? `[DRAFT] ${text}` : text);
/** Production is the default; INCLUDE_PROVISIONAL=1 marks a preview build. */
export const isProduction = () => process.env.INCLUDE_PROVISIONAL !== '1';

export const LOCK = 'src/i18n/de.reviewed.lock';
export const readLock = (): Lock => (existsSync(LOCK) ? parse(readFileSync(LOCK, 'utf8')) : { reviewed_by: '', reviewed_on: '', hashes: {} });
export const writeLock = (l: Lock) => writeFileSync(LOCK, stringify(l));

const split = (raw: string): [Record<string, string>, string] => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? [parse(m[1]) ?? {}, m[2]] : [{}, raw];
};
/** content/{en,de}/<name>.md. The hash covers the whole English file as committed. */
export function readProse(dir = 'content'): Record<string, Prose> {
  const out: Record<string, Prose> = {};
  if (!existsSync(`${dir}/en`)) return out;
  for (const f of readdirSync(`${dir}/en`).filter((f) => f.endsWith('.md'))) {
    const de = existsSync(`${dir}/de/${f}`) ? (split(readFileSync(`${dir}/de/${f}`, 'utf8'))[0] as Prose['de']) : undefined;
    out[f.slice(0, -3)] = { en: readFileSync(`${dir}/en/${f}`, 'utf8'), de };
  }
  return out;
}

/** Everything unreviewed right now: interface strings as `key`, prose pages as `page:<name>`. */
export function allUnreviewed(en: Record<string, string>): string[] {
  return [...unreviewedKeys(en, readLock()), ...unreviewedProse(readProse()).map((n) => `page:${n}`)];
}

/** Record a review: update the lock (or the German page's front matter) and nothing else. */
export function recordReview(en: Record<string, string>, who: string, on: string, only?: string[], dir = 'content'): void {
  const lock = readLock();
  lock.reviewed_by = who; lock.reviewed_on = on;
  for (const k of Object.keys(en)) if (!only || only.includes(k)) lock.hashes[k] = hash(en[k]);
  writeLock(lock);
  for (const [n, p] of Object.entries(readProse(dir))) {
    if (only && !only.includes(`page:${n}`)) continue;
    const file = `${dir}/de/${n}.md`;
    const [fm, body] = split(readFileSync(file, 'utf8'));
    writeFileSync(file, `---\n${stringify({ ...fm, en_hash: hash(p.en), reviewed_by: who, reviewed_on: on })}---\n${body}`);
  }
}
