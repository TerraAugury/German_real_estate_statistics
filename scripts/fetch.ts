// Fetch every manifest series from DBnomics into data/snapshots/. On fetch failure, reuse the last snapshot.
import { parse } from 'yaml';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const API = 'https://api.db.nomics.world/v22/series';
const UA = 'german-cre-statistics (build; contact oelamine@terraaugury.com)';
const manifest = parse(readFileSync('manifest/series.yaml', 'utf8')) as any[];
mkdirSync('data/snapshots', { recursive: true });

async function get(url: string) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) return (await r.json()) as any;
      throw new Error(String(r.status));
    } catch (e) {
      if (i === 2) throw e;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
}

for (const s of manifest) {
  const file = `data/snapshots/${s.key}.json`;
  try {
    const parts: Record<string, any> = {};
    for (const land of s.lands) {
      const id = s.ids[0].replace('{land}', land);
      const d = await get(`${API}/${s.provider}/${s.dataset}/${id}?observations=1`);
      const doc = d.series.docs[0];
      if (doc['@frequency'] !== s.frequency) throw new Error(`${id}: frequency changed to ${doc['@frequency']}`);
      parts[id] = { name: doc.series_name, indexed_at: doc.indexed_at, period: doc.period, value: doc.value };
    }
    writeFileSync(file, JSON.stringify({ retrieved_at: new Date().toISOString(), fetch_failed: null, parts }, null, 1));
    console.log('fetched', s.key);
  } catch (e) {
    if (!existsSync(file)) throw new Error(`${s.key}: fetch failed and no snapshot: ${e}`);
    const snap = JSON.parse(readFileSync(file, 'utf8'));
    snap.fetch_failed = new Date().toISOString();
    writeFileSync(file, JSON.stringify(snap, null, 1));
    console.warn('fetch failed, reusing snapshot', s.key, String(e));
  }
}
