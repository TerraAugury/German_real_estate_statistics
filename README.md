# German_real_estate_statistics
Website embedding DBeconomics data relevant for German real estate

## Deploy

`.github/workflows/ci.yml` runs daily, on manual trigger and on every push to `main`: fetch, commit changed snapshots to `main`, tests, build, deploy to Cloudflare Pages by direct upload. Cron and manual runs skip the build and deploy when no snapshot changed. Pull requests get a preview build with `INCLUDE_PROVISIONAL=1`, uploaded as the `preview-site` artifact.

**Production deploy is off.** While it is off, the `main` job builds as a preview (`INCLUDE_PROVISIONAL=1`), because the production build fails on unreviewed German. It waits on launch gates 08, 14 and 15 (spec section 13). To switch it on once they resolve, set these in the GitHub repository settings (never commit them):

| Name | Kind | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | secret | API token with the *Cloudflare Pages: Edit* permission |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Cloudflare account id |
| `CLOUDFLARE_PAGES_PROJECT` | variable | Pages project name (a direct-upload project) |
| `PRODUCTION_DEPLOY` | variable | `true` switches the deploy on; anything else leaves it off |
