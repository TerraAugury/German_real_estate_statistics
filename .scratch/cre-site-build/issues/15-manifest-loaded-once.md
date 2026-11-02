# 15: Manifest loaded once; review lock passed in

**What to build:** `loadAllManifest()` builds the committed manifest once and shares it, rebuilding only when `manifest/series.yaml`, the review lock or `src/i18n/en.yaml` changes on disk. `loadAllManifest(lock)` builds a fresh copy marked against the given lock, so tests choose the lock without mocking a module. Output is unchanged.

**Blocked by:** 14

**Status:** done

From the 2026-11-02 architecture review (candidate 3).

- [x] A preview build no longer parses and checks the manifest on every call (it did so 502 times, about 15 ms each)
- [x] The committed result is rebuilt when any of its three files changes, so `astro dev` still picks up edits
- [x] `loadAllManifest(lock)` marks [DRAFT] against the given lock and never changes the shared copy
- [x] The manifest [DRAFT] test passes an empty lock instead of using `vi.doMock` on the review module
- [x] A preview build (`INCLUDE_PROVISIONAL=1`) is byte-for-byte identical before and after

## Notes

- Preview build wall time on this machine: 19.7 s before, 11.8 s after.
- The shared entries must not be changed by callers. Nothing in `src/`, `scripts/` or `tests/` does today. If that becomes a risk, freeze them.
- `src/lib/i18n.ts` still reads the strings and the lock when it is imported. No test needs another lock there, so it stays as it is.
