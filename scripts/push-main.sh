#!/usr/bin/env bash
# Push `main`, the only branch that is pushed (AGENTS.md, Branches). CI commits data snapshots straight to
# origin/main, so first replay those commits onto `work` (then merged into `main` as usual) and merge origin/main
# into `main`; both sides then hold the same changes, so that merge is clean.
# Usage: scripts/push-main.sh   (fails without pushing if origin/main moved since the fetch: run it again)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

start=$(git branch --show-current)
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then echo "Commit or stash your changes first." >&2; exit 1; fi

git fetch -q origin main
git switch -q work
# Commits on origin/main that local main lacks are CI's snapshot commits (everything else reaches main from work).
# Leave out any already on work (named by `cherry-pick -x`), so a run after a resolved conflict picks only the rest.
picked=$(git log --format=%b main..work | sed -n 's/^(cherry picked from commit \([0-9a-f]*\))$/\1/p')
ci=$(git rev-list --reverse main..origin/main | grep -vxFf <(printf '%s\n' $picked) || true)
if [ -n "$ci" ]; then git cherry-pick -x $ci; fi # on a conflict: resolve, `git cherry-pick --continue`, run this again
if [ -n "$(git rev-list -1 main..work)" ]; then scripts/merge-work-to-main.sh; fi

git switch -q main
# Every CI change is now in main through work, with any conflict already resolved there: keep main's side.
git merge -q --no-edit -X ours origin/main
git push origin main
git switch -q "$start"
