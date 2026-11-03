# 04: Insight C: completions vs permits two years earlier

**What to build:** The second public Insight. The reader sees office completions as a ratio of the permits issued two years before, with the headline, verdict, reading and small multiples.

**Blocked by:** 02, 03

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 2 (C) and Section 4 (ratio template).

- [ ] Shift transform: moves one series forward by whole years and records it; tests show the shift changing the shared period
- [ ] Ratio headline and its reading template ("Completions were {latest} times the permits issued two years earlier, {verdict} the {from}-{to} average of {mean}")
- [ ] The permits line is labelled "permits, two years earlier" in both languages
- [ ] Production shows exactly J and C; a test pins that no other Insight is public today
