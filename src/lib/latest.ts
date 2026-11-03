import type { Series } from './series';

export interface Latest {
  value: number; period: string;
  /** Since the previous observation: a relative change (fraction) or a difference in points, following the series' `change` kind. */
  change?: { kind: 'pct' | 'diff'; amount: number; direction: 'up' | 'down' | 'flat'; since: string };
}

/** The shown precision of a change: one decimal of a percent or of a point. A change that rounds to zero there is flat. */
const shown = (kind: 'pct' | 'diff', amount: number) => Math.round(amount * (kind === 'pct' ? 100 : 1) * 10) / 10;

/** The latest observation of a series and its change since the one before; the description is neutral, up is not good or bad. */
export function latestOf(s: Pick<Series, 'obs' | 'change'>): Latest {
  const last = s.obs.at(-1)!, prev = s.obs.at(-2);
  const out: Latest = { value: last.value, period: last.period };
  if (!prev || (s.change === 'pct' && prev.value === 0)) return out;
  const amount = s.change === 'pct' ? last.value / prev.value - 1 : last.value - prev.value;
  const d = shown(s.change, amount);
  return { ...out, change: { kind: s.change, amount, direction: d > 0 ? 'up' : d < 0 ? 'down' : 'flat', since: prev.period } };
}
