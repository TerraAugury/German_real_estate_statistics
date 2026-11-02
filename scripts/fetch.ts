// Fetch every manifest series from its source into data/snapshots/. On fetch failure, reuse the last snapshot.
import { loadAllManifest } from '../src/lib/manifest';
import { Unavailable } from '../src/lib/snapshot';
import { makeGet, makePost, refresh, markFailed, BadResponse, type Snapshot } from '../src/lib/pipeline';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

import { loadEnv } from '../src/lib/env';

loadEnv(); // local runs: Destatis login from .env; CI sets it from secrets
mkdirSync('data/snapshots', { recursive: true });
const deps = { get: makeGet(), post: makePost(), now: new Date() };
for (const m of loadAllManifest()) { // sequential: one series at a time
  const file = `data/snapshots/${m.key}.json`;
  const old: Snapshot | undefined = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined;
  try {
    const next = await refresh(m, old, deps);
    if (next) writeFileSync(file, JSON.stringify(next, null, 1));
    console.log(next ? 'fetched' : 'unchanged', m.key, next?.revised_at === deps.now.toISOString() ? '(values revised)' : '');
  } catch (e) {
    if (e instanceof BadResponse) throw e; // malformed response is a bug, not an outage
    writeFileSync(file, JSON.stringify(markFailed(m.key, old, deps.now, e), null, 1));
    console.warn(e instanceof Unavailable ? 'series unavailable at source, reusing snapshot' : 'fetch failed, reusing snapshot', m.key, String(e));
  }
}
