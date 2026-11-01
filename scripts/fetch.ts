// Fetch every manifest series from DBnomics into data/snapshots/. On fetch failure, reuse the last snapshot.
import { loadManifest } from '../src/lib/manifest';
import { makeGet, refresh, markFailed, BadResponse, type Snapshot } from '../src/lib/pipeline';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

mkdirSync('data/snapshots', { recursive: true });
const deps = { get: makeGet(), now: new Date() };
for (const m of loadManifest()) { // sequential: one series at a time
  const file = `data/snapshots/${m.key}.json`;
  const old: Snapshot | undefined = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined;
  try {
    const next = await refresh(m, old, deps);
    if (next) writeFileSync(file, JSON.stringify(next, null, 1));
    console.log(next ? 'fetched' : 'unchanged', m.key, next?.revised_at === deps.now.toISOString() ? '(values revised)' : '');
  } catch (e) {
    if (e instanceof BadResponse) throw e; // malformed response is a bug, not an outage
    writeFileSync(file, JSON.stringify(markFailed(m.key, old, deps.now, e), null, 1));
    console.warn('fetch failed, reusing snapshot', m.key, String(e));
  }
}
