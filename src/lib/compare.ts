// Compare a freshly fetched part with the committed snapshot's, to review a source switch before it is made.
import type { Part } from './snapshot';

export interface Comparison { added: string[]; missing: string[]; changed: { period: string; was: number | null; now: number | null }[]; same: number }

const num = (v: number | string | null | undefined) => (v == null || v === 'NA' || Number.isNaN(Number(v)) ? null : Number(v));

export function compareParts(old: Pick<Part, 'period' | 'value'>, next: Pick<Part, 'period' | 'value'>): Comparison {
  const was = new Map(old.period.map((p, i) => [p, num(old.value[i])]));
  const now = new Map(next.period.map((p, i) => [p, num(next.value[i])]));
  const changed: Comparison['changed'] = [];
  let same = 0;
  const equal = (a: number | null, b: number | null) => a === b || (a !== null && b !== null && Math.abs(a - b) <= 1e-9);
  for (const [p, v] of now) if (was.has(p)) { const w = was.get(p)!; if (equal(w, v)) same++; else changed.push({ period: p, was: w, now: v }); }
  return { added: [...now.keys()].filter((p) => !was.has(p)), missing: [...was.keys()].filter((p) => !now.has(p)), changed, same };
}

/** One line per series for the report. */
export function describe(key: string, c: Comparison): string {
  const bits = [`${c.same} same`, c.changed.length && `${c.changed.length} changed (${c.changed.slice(0, 3).map((x) => `${x.period}: ${x.was} -> ${x.now}`).join(', ')}${c.changed.length > 3 ? ', ...' : ''})`,
    c.added.length && `${c.added.length} new (${c.added[0]}..${c.added.at(-1)})`, c.missing.length && `${c.missing.length} MISSING at source (${c.missing.slice(0, 3).join(', ')})`].filter(Boolean);
  return `- ${key}: ${bits.join('; ')}`;
}
