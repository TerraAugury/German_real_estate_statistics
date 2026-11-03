import { describe, expect, it, vi } from 'vitest';
import { sourceLine } from '../src/lib/panel';
import { getSeries } from '../src/lib/series';
import type { Series } from '../src/lib/series';

describe('source line', () => {
  const direct = { publisher: 'Deutsche Bundesbank', service: 'SDMX Web Service', seriesId: 'BBDZ1.Q.B10', seriesUrl: 'https://x/y?lang=en', licence: { name: 'L', url: 'u' },
    lastPeriod: '2026-Q2', retrievedAt: '2026-11-03T08:00:00Z', derived: false, original: { title: 'Commercial property price index', unit: '2013=100' } } as unknown as Series;
  it('a direct source gives the service, the retrieval date, and the original title and unit', () => {
    expect(sourceLine(direct, 'en')).toMatch(/^Source: Deutsche Bundesbank, SDMX Web Service, series .*New data last retrieved 3 November 2026/);
    expect(sourceLine(direct, 'en')).toMatch(/Original series as published: Commercial property price index; unit: 2013=100$/);
    expect(sourceLine(direct, 'de')).toMatch(/Letzte neue Daten abgerufen am 3\. November 2026.*Originalreihe wie veröffentlicht/);
  });
  it('a series without an original title (Destatis) shows only the unit', () => {
    const line = sourceLine({ ...direct, original: { unit: '1000 qm' } } as Series, 'en');
    expect(line).toMatch(/Original unit as published: 1000 qm$/);
    expect(line).not.toMatch(/Original series/);
  });
  it('a DBnomics series keeps the DBnomics wording and has no original line', () => {
    const line = sourceLine({ ...direct, service: undefined, original: undefined } as Series, 'en');
    expect(line).toMatch(/^Source: Deutsche Bundesbank, DBnomics series /);
    expect(line).not.toMatch(/Original series/);
  });
  it('real Bundesbank series carry their original metadata from the snapshot', () => {
    vi.stubEnv('INCLUDE_PROVISIONAL', '1'); // every Bundesbank series is still provisional
    const s = getSeries('price-index-de-total-q');
    expect(s.service).toBe('SDMX Web Service');
    expect(s.original).toMatchObject({ unit: '2013=100', title: expect.stringMatching(/Commercial property/) });
    expect(s.fetchedFrom).toBe('Deutsche Bundesbank');
  });
});
