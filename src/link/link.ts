// Link module (spec section 6): two series in, a Link result or "Link not shown" out.

/** Minimum paired observations per lag. The one constant tests and build invariants use. */
export const MIN = { Q: 40, A: 10 } as const;
/** The Link target frequency of a KPI series: annual KPIs compare years, all others quarters. */
export const targetOf = (kpiFreq: 'D' | 'M' | 'Q' | 'A'): 'Q' | 'A' => (kpiFreq === 'A' ? 'A' : 'Q');
/** Observations that count for the noise band: quarterly changes are each taken against a year earlier, so neighbours overlap and n counts ÷ 4, rounded down. */
export const effectiveN = (n: number, t: 'Q' | 'A') => (t === 'A' ? n : Math.floor(n / 4));
/** Rough guide, not a significance test: the range of rank correlation chance alone often produces, ±2/√(n−1). */
/** How strong a rank correlation reads in plain words: the cut-offs are |ρ| 0.1, 0.3, 0.5 and 0.7. */
export const tierOf = (rho: number) => { const a = Math.abs(rho); return a < 0.1 ? 'none' : a < 0.3 ? 'very_weak' : a < 0.5 ? 'weak' : a < 0.7 ? 'moderate' : 'strong'; };
export const noiseBand = (n: number, t: 'Q' | 'A') => (effectiveN(n, t) > 1 ? 2 / Math.sqrt(effectiveN(n, t) - 1) : Infinity);

/** Lag, in periods, of an indicator taken `years` years earlier: +1 / +2 for annual KPIs, +4 / +8 quarters otherwise. */
export const lagFor = (kpiFreq: 'D' | 'M' | 'Q' | 'A', years: 0 | 1 | 2) => years * (kpiFreq === 'A' ? 1 : 4);
const MAX_LAG = { Q: 8, A: 3 } as const;
const MIN_LAGS = 3; // lags (lag 0 included) that must pass for a Link to show

export type LinkSeries = {
  /** D = event-dated (forward-filled to daily before averaging) */
  freq: 'D' | 'M' | 'Q' | 'A';
  /** pct = year-on-year percent (indices, money); diff = year-on-year points (rates, balances) */
  change: 'pct' | 'diff';
  /** period: "2020" | "2020-Q1" | "2020-03" | "2020-03-15" */
  obs: { period: string; value: number | null }[];
};
type Target = 'Q' | 'A';
export type Lag = { lag: number; n: number; rho: number | null };
export type LinkResult =
  | { shown: false; n0: number; reason: 'too_few' | 'constant' }
  | {
      shown: true;
      overlay: { period: string; kpi: number | null; indicator: number | null }[];
      lags: Lag[];
      headline: Lag;
      strongest: Lag;
      /** first and last period paired at lag 0 (indicator side shifted by 0) */
      span: [string, string];
    };

const DAY = 864e5;

function idx(p: string, t: Target): number {
  const y = +p.slice(0, 4);
  if (t === 'A') return y;
  const q = p[5] === 'Q' ? +p[6] : Math.floor((+p.slice(5, 7) - 1) / 3) + 1;
  return y * 4 + q - 1;
}
const label = (i: number, t: Target) => (t === 'A' ? String(i) : `${Math.floor(i / 4)}-Q${(i % 4) + 1}`);
const daysIn = (i: number, t: Target) =>
  t === 'A'
    ? (Date.UTC(i + 1, 0, 1) - Date.UTC(i, 0, 1)) / DAY
    : (Date.UTC(Math.floor(i / 4), (i % 4) * 3 + 3, 1) - Date.UTC(Math.floor(i / 4), (i % 4) * 3, 1)) / DAY;

/** Period means at the target frequency; incomplete periods dropped, gaps stay gaps. */
export function levels(s: Pick<LinkSeries, 'freq' | 'obs'>, t: Target): Map<number, number> {
  const pts = s.obs
    .filter((o): o is { period: string; value: number } => o.value !== null)
    .sort((a, b) => (a.period < b.period ? -1 : 1));
  const acc = new Map<number, { sum: number; n: number }>();
  const add = (i: number, v: number) => {
    const a = acc.get(i) ?? { sum: 0, n: 0 };
    a.sum += v;
    a.n++;
    acc.set(i, a);
  };
  let need: (i: number) => number;
  if (s.freq === 'D') {
    // ponytail: coverage ends at the last event, so the final period is dropped unless fully covered
    let k = 0;
    const end = Date.parse(pts[pts.length - 1].period);
    for (let d = Date.parse(pts[0].period); d <= end; d += DAY) {
      while (k + 1 < pts.length && Date.parse(pts[k + 1].period) <= d) k++;
      add(idx(new Date(d).toISOString(), t), pts[k].value);
    }
    need = (i) => daysIn(i, t);
  } else {
    if (s.freq === 'A' && t === 'Q') throw new Error('annual series cannot be upsampled to quarterly');
    for (const o of pts) add(idx(o.period, t), o.value);
    const per = s.freq === 'M' ? (t === 'Q' ? 3 : 12) : s.freq === 'Q' && t === 'A' ? 4 : 1;
    need = () => per;
  }
  const out = new Map<number, number>();
  for (const [i, a] of acc) if (a.n === need(i)) out.set(i, a.sum / a.n);
  return out;
}

export function changes(lv: Map<number, number>, t: Target, rule: LinkSeries['change']) {
  const step = t === 'A' ? 1 : 4;
  const out = new Map<number, number>();
  for (const [i, v] of lv) {
    const p = lv.get(i - step);
    if (p === undefined || (rule === 'pct' && p === 0)) continue;
    out.set(i, rule === 'pct' ? (v / p - 1) * 100 : v - p);
  }
  return out;
}

function ranks(a: number[]): number[] {
  const o = a.map((_, i) => i).sort((i, j) => a[i] - a[j]);
  const r: number[] = [];
  for (let s = 0, e; s < o.length; s = e + 1) {
    e = s;
    while (e + 1 < o.length && a[o[e + 1]] === a[o[s]]) e++;
    for (let k = s; k <= e; k++) r[o[k]] = (s + e) / 2 + 1; // average rank for ties
  }
  return r;
}

/** Spearman with ties; null when a side is constant. */
function spearman(x: number[], y: number[]): number | null {
  const [a, b] = [ranks(x), ranks(y)];
  const m = (v: number[]) => v.reduce((s, z) => s + z, 0) / v.length;
  const [ma, mb] = [m(a), m(b)];
  let sab = 0, saa = 0, sbb = 0;
  a.forEach((v, i) => {
    sab += (v - ma) * (b[i] - mb);
    saa += (v - ma) ** 2;
    sbb += (b[i] - mb) ** 2;
  });
  return saa && sbb ? sab / Math.sqrt(saa * sbb) : null;
}

/** Positive lag = the indicator moved earlier than the KPI. */
export function computeLink(kpi: LinkSeries, indicator: LinkSeries): LinkResult {
  const t: Target = targetOf(kpi.freq);
  const [lk, li] = [levels(kpi, t), levels(indicator, t)];
  const [ck, ci] = [changes(lk, t, kpi.change), changes(li, t, indicator.change)];
  const lags: Lag[] = [];
  for (let lag = -MAX_LAG[t]; lag <= MAX_LAG[t]; lag++) {
    const ts = [...ck.keys()].filter((i) => ci.has(i - lag));
    const rho = ts.length >= MIN[t] ? spearman(ts.map((i) => ck.get(i)!), ts.map((i) => ci.get(i - lag)!)) : null;
    lags.push({ lag, n: ts.length, rho });
  }
  const passing = lags.filter((l) => l.rho !== null);
  const headline = lags.find((l) => l.lag === 0)!;
  if (headline.n < MIN[t]) return { shown: false, n0: headline.n, reason: 'too_few' };
  // enough pairs at lag 0 but one side never changes: no correlation to show
  if (headline.rho === null) return { shown: false, n0: headline.n, reason: 'constant' };
  if (passing.length < MIN_LAGS) return { shown: false, n0: headline.n, reason: 'too_few' };
  const strongest = passing.reduce((b, l) => (Math.abs(l.rho!) > Math.abs(b.rho!) ? l : b));
  const keys = [...new Set([...lk.keys(), ...li.keys()])].sort((a, b) => a - b);
  const overlay = keys.map((i) => ({ period: label(i, t), kpi: lk.get(i) ?? null, indicator: li.get(i) ?? null }));
  const ts0 = [...ck.keys()].filter((i) => ci.has(i)).sort((a, b) => a - b);
  const span: [string, string] = [label(ts0[0], t), label(ts0[ts0.length - 1], t)];
  const result: LinkResult = { shown: true, overlay, lags, headline, strongest, span };
  assertLinkInvariants(result, t);
  return result;
}

/** Build-time invariants (spec section 11); the build calls this on every result it keeps. */
export function assertLinkInvariants(r: LinkResult, t: Target): void {
  if (!r.shown) return;
  const shown = r.lags.filter((l) => l.rho !== null);
  if (r.headline.rho === null || r.headline.lag !== 0) throw new Error('Link shown without a passing lag 0');
  if (shown.length < MIN_LAGS) throw new Error(`Link shown with ${shown.length} lags, need ${MIN_LAGS}`);
  for (const l of shown) {
    if (Math.abs(l.rho!) > 1 + 1e-9) throw new Error(`|rho| > 1 at lag ${l.lag}`);
    if (l.n < MIN[t]) throw new Error(`n below minimum at lag ${l.lag}`);
  }
}
