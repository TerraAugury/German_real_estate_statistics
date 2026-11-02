#!/usr/bin/env bash
# Push `main`, the only branch that is pushed (AGENTS.md, Branches). CI commits data snapshots straight to
# origin/main, so first replay those commits onto `work` (then merged into `main` as usual), then merge origin/main
# into `main` keeping main's side, which by then holds every CI change, with any conflict resolved on `work`.
# Assumes this is the one clone that pushes `main`, so every commit on origin/main that local main lacks is CI's.
# Run it from the checkout that has `work`. On a failure it stops on `work` or `main`, not the branch you started on.
# Usage: scripts/push-main.sh   (if origin/main moved since the fetch, the push is rejected: run it again)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

start=$(git branch --show-current)
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then echo "Commit or stash your changes first." >&2; exit 1; fi

git fetch -q origin main
git switch -q work
# CI commits already replayed onto work are named by `cherry-pick -x` in commits origin/main lacks, merged or not.
picked=$(git log --format=%b origin/main..work | sed -n 's/^(cherry picked from commit \([0-9a-f]*\))$/\1/p')
for c in $(git rev-list --reverse main..origin/main | grep -vxFf <(printf '%s\n' $picked) || true); do
  git cherry-pick -x "$c" >/dev/null || {
    echo "Resolve the conflict, then 'git cherry-pick --continue'. If nothing is left to commit (you kept work's" >&2
    echo "snapshot), run 'git commit --allow-empty --no-edit' instead; never '--skip'. Then run this script again." >&2
    exit 1
  }
done
if [ -n "$(git rev-list -1 main..work)" ]; then scripts/merge-work-to-main.sh; fi

git switch -q main
git merge -q --no-edit -X ours origin/main
git push origin main
if [ -n "$start" ]; then git switch -q "$start"; fi # empty when HEAD was detached
