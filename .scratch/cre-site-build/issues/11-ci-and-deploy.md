# 11: CI and deploy with the launch gates

**What to build:** A push to `main` or the daily cron runs fetch, tests, build and deploy to Cloudflare Pages by direct upload, but the production deploy stays disabled until the launch gates resolve.

**Blocked by:** 03, 04, 09

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 7, 11 and 13.

- [x] Daily cron plus manual trigger; fetch and diff, commit changed snapshots to `main`, then tests, build, deploy; if no snapshot changed the build and deploy are skipped
- [x] Pull requests get a preview build with `INCLUDE_PROVISIONAL=1`
- [x] Tests run before every deploy and failing tests block it
- [x] Production deploy is switched off by default and documented as waiting on tickets 08, 14 and 15
- [x] Repository secrets for Cloudflare documented, none committed

## Notes

- One workflow, `.github/workflows/ci.yml`: job `preview` (pull requests; build uploaded as the `preview-site` artifact) and job `main` (push to `main`, daily cron, manual). A person's push always builds; cron and manual runs skip the build and deploy when no snapshot changed. Setup and the secrets table are in `README.md` under "Deploy".
- Production deploy runs only when the repository variable `PRODUCTION_DEPLOY` is `true`. While it is off, the `main` job builds with `INCLUDE_PROVISIONAL=1`, because the production build fails on the unreviewed German (ticket 09).
- The bot commits snapshots straight to `main`, so `main` gains commits that `work` lacks. `scripts/merge-work-to-main.sh` may then have to merge or resolve them.
- Not verified locally: a real Actions run, the bot push and the Cloudflare upload. actionlint was not installed; the workflow was checked with a strict YAML parse.
