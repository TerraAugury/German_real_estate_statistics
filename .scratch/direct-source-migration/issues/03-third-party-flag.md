# 03: Automatic third-party source flag

**What to build:** A Bundesbank series whose original source is a third party is flagged for licence review and cannot be made public by accident.

**Blocked by:** 02

**Status:** ready-for-agent

Spec: `.scratch/direct-source-migration/spec.md`, decision 5, story 12-13.

- [ ] Allow-list of original-source names (Bundesbank, ESCB, Eurosystem) in one config place
- [ ] Any other original-source comment sets a review flag on the snapshot
- [ ] Manifest test fails when a flagged series has `provisional: false`
- [ ] "Original source" added to `GLOSSARY.md`
- [ ] Tests: allow-listed source not flagged, vdpResearch/bulwiengesa/Federal Employment Agency/Destatis flagged, unflagged-and-public combination fails
