# 03: Small multiples with rebasing

**What to build:** Under Insight J's main chart the reader sees small charts that show the two series rebased to a common base, with the gap between the lines shaded, so the headline number can be checked against the lines behind it.

**Blocked by:** 01

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 4 (Rebasing), Section 5 (part 4) and Section 10 (first bullet).

- [ ] Rebasing to 2015 = 100; a series without a 2015 value falls back to its first shared year; the axis label names the base ("index, 2015 = 100"); tests cover the fallback
- [ ] One small chart per compared series against the reference series, gap shaded blue where the KPI is above and red where below, shared y-domain
- [ ] For ratio and growth Insights the two rebased lines with the same shading, the spec's stated default
- [ ] The shading is explained in text or an accessible label, so colour is not the only cue
- [ ] Renders at 320 px with no horizontal page scroll (the spec's unchecked open question); page weight stays within its test
