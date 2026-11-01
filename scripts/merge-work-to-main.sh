#!/usr/bin/env bash
# Merge `work` into `main` without .scratch/ (which only `work` tracks).
# Usage: scripts/merge-work-to-main.sh [commit message]
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

msg="${1:-Merge work into main (without .scratch)}"
start=$(git branch --show-current)

git switch -q main
if ! git merge --no-ff --no-commit work >/dev/null; then
  : # conflicts on .scratch files are expected after the first merge; checked below
fi
git rm -r -q -f --cached --ignore-unmatch .scratch

if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  echo "Unresolved conflicts outside .scratch; resolve, 'git add', then 'git commit'." >&2
  git diff --name-only --diff-filter=U >&2
  exit 1
fi

git commit -q -m "$msg"
git switch -q "$start"
echo "main now at $(git rev-parse --short main); back on $start"
