# 02: Bundesbank SDMX-JSON fetcher

**What to build:** A series with `source: bundesbank` is fetched from the Bundesbank web service and stored with full metadata. Not yet used by any real manifest entry.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decisions 2, 3, 4.

- [x] Request `/data/{flow}/{key}?format=sdmx_json&lang=en` with the existing retry, backoff and User-Agent; string observations parsed to numbers
- [x] Snapshot fills the metadata fields from the response, including the original-source comment and response hash
- [x] 404 and 410 mark the series unavailable (Not available path, old snapshot kept with note); 413 and 503 retry; other errors keep the old snapshot with a failed-refresh note
- [x] Empty or malformed body is a failed refresh and never overwrites good data
- [x] Log lines include source URL and status
- [x] Tests with canned SDMX-JSON: normal, string parsing, 404/410, 413/503 then success, empty body, malformed body
