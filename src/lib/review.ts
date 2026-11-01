// Bilingual review workflow (spec section 10): German ships only if a named human reviewed it against the current English.
import { createHash } from 'node:crypto';
import { parse, stringify } from 'yaml';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

/** Short SHA-256 of an English string or file: what the German was reviewed against. */
export const enHash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
/** Review record: the English hash at review time, who reviewed, when. */
export interface Review { en_hash: string; reviewed_by: string; reviewed_on: string }
/** Interface strings: one Review per key. */
export type Lock = Record<string, Review>;
/** A prose page: English file text and the German file's front matter (undefined = no German file). */
export interface Prose { en: string; de?: Partial<Review> }

const isReviewed = (r: Partial<Review> | undefined, en: string) => !!r?.reviewed_by && !!r.reviewed_on && r.en_hash === enHash(en);

/** Keys whose German is unreviewed: no record, or the English changed since review. */
export const unreviewedKeys = (en: Record<string, string>, lock: Lock) => Object.keys(en).filter((k) => !isReviewed(lock[k], en[k]));
/** Prose pages (by name) with no German file, no review record, or an en_hash that no longer matches. */
export const unreviewedProse = (pages: Record<string, Prose>) => Object.keys(pages).filter((n) => !isReviewed(pages[n].de, pages[n].en));
/** Prose pages with no German file at all: nothing to mark [DRAFT], and English never stands in, so every build fails. */
export const missingGerman = (pages: Record<string, Prose>) => Object.keys(pages).filter((n) => !pages[n].de);

/** Production build fails on unreviewed German. Preview builds pass and show the [DRAFT] marker. */
export function assertReviewed(unreviewed: string[], production: boolean): void {
  if (production && unreviewed.length) throw new Error(`review: unreviewed German (${unreviewed.length}): ${unreviewed.join(', ')}`);
}
export const DRAFT = '[DRAFT] ';
export const draft = (text: string, unreviewed: boolean) => (unreviewed ? DRAFT + text : text);
/** Preview builds (INCLUDE_PROVISIONAL=1) include provisional series and show unreviewed German as [DRAFT]; production is the default. */
export const isPreview = () => process.env.INCLUDE_PROVISIONAL === '1';

export const LOCK_PATH = 'src/i18n/de.reviewed.lock';
export const readLock = (path = LOCK_PATH): Lock => (existsSync(path) ? parse(readFileSync(path, 'utf8')) ?? {} : {});

const frontMatter = (raw: string): [Record<string, string>, string] => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? [parse(m[1]) ?? {}, m[2]] : [{}, raw];
};
/** content/{en,de}/<name>.md. The hash covers the whole English file as committed. */
export function readProse(dir = 'content'): Record<string, Prose> {
  const out: Record<string, Prose> = {};
  if (!existsSync(`${dir}/en`)) return out;
  for (const f of readdirSync(`${dir}/en`).filter((f) => f.endsWith('.md'))) {
    const de = existsSync(`${dir}/de/${f}`) ? frontMatter(readFileSync(`${dir}/de/${f}`, 'utf8'))[0] : undefined;
    out[f.slice(0, -3)] = { en: readFileSync(`${dir}/en/${f}`, 'utf8'), de };
  }
  return out;
}

/** Everything unreviewed right now: interface strings as `key`, prose pages as `page:<name>`. */
export const allUnreviewed = (en: Record<string, string>, pages = readProse()) =>
  [...unreviewedKeys(en, readLock()), ...unreviewedProse(pages).map((n) => `page:${n}`)];

/**
 * Record a review of the named items only (`key`, `page:<name>`, or a typed prefix such as `manifest:cpi.*`): update
 * their lock entry or the German page's front matter and nothing else. Naming nothing is an error, so German is
 * never stamped without the reviewer saying which.
 */
export function recordReview(en: Record<string, string>, who: string, on: string, items: string[], dir = 'content', lockPath = LOCK_PATH): void {
  if (!who || !items.length) throw new Error('review: name the reviewer and at least one key or page:<name>');
  const lock = readLock(lockPath);
  const pages = readProse(dir);
  const all = [...Object.keys(en), ...Object.keys(pages).map((n) => `page:${n}`)];
  const expand = (i: string) => {
    if (!i.endsWith('*')) return [i];
    const hits = all.filter((k) => k.startsWith(i.slice(0, -1)));
    if (!hits.length) throw new Error(`review: nothing matches ${i}`);
    return hits;
  };
  for (const item of items.flatMap(expand)) {
    if (item.startsWith('page:')) {
      const n = item.slice(5);
      if (!pages[n]) throw new Error(`review: no English page ${dir}/en/${n}.md`);
      const file = `${dir}/de/${n}.md`;
      if (!existsSync(file)) throw new Error(`review: no German page ${file} to review`);
      const [fm, body] = frontMatter(readFileSync(file, 'utf8'));
      writeFileSync(file, `---\n${stringify({ ...fm, en_hash: enHash(pages[n].en), reviewed_by: who, reviewed_on: on })}---\n${body}`);
    } else {
      if (!(item in en)) throw new Error(`review: no English key ${item}`);
      lock[item] = { en_hash: enHash(en[item]), reviewed_by: who, reviewed_on: on };
    }
  }
  writeFileSync(lockPath, stringify(lock));
}
