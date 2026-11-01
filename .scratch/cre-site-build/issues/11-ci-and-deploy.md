# 11: CI and deploy with the launch gates

**What to build:** A push to `main` or the daily cron runs fetch, tests, build and deploy to Cloudflare Pages by direct upload, but the production deploy stays disabled until the launch gates resolve.

**Blocked by:** 03, 04, 09

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Sections 7, 11 and 13.

- [ ] Daily cron plus manual trigger; fetch and diff, commit changed snapshots to `main`, then tests, build, deploy; if no snapshot changed the build and deploy are skipped
- [ ] Pull requests get a preview build with `INCLUDE_PROVISIONAL=1`
- [ ] Tests run before every deploy and failing tests block it
- [ ] Production deploy is switched off by default and documented as waiting on tickets 08, 14 and 15
- [ ] Repository secrets for Cloudflare documented, none committed
