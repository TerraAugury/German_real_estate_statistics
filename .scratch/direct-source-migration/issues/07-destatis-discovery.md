# 07: Destatis GENESIS: login check and table mapping

**What to build:** A written finding and manifest mapping from each DBnomics Destatis dataset to its GENESIS table and dimensions, and a clear answer on whether a login is needed. Owner supplies test credentials.

**Blocked by:** none

**Status:** done

Spec: `.scratch/direct-source-migration/spec.md`, decision 6, 7, story 19.

- [x] Confirm whether data calls need a login; record the answer in `docs/bundesbank-data-licensing.md` section 7a
- [x] Map 31111LJ001, 31121LJ001, 61111BM001, 61261BV001 to GENESIS table ids using the catalogue and metadata calls
- [x] State whether the Länder tables are in GENESIS-Online or the regional database, with the host to call
- [x] Fetch one table with `data/tablefile`, compare with the committed snapshot, note unit, source and status-flag attributes and what a discontinued table returns
- [x] Credentials never committed; read from environment only
