## Agent skills

### Issue tracker

Tickets and specs are markdown under `.scratch/<feature>/`; read `docs/agents/issue-tracker.md` before creating, fetching or resolving one.

A ticket ships in one commit with its code: that commit sets `**Status:** done` and ticks every criterion it meets.

### Triage labels

Read `docs/agents/triage-labels.md` when setting a ticket's `Status:` to a triage role.

### Domain docs

Read `docs/agents/domain.md` before exploring the codebase: it covers `GLOSSARY.md` and ADRs.

<!-- rtk-instructions v2 -->
# Command output

Command output here is condensed to save tokens, keeping every signal and
dropping costly noise. Treat it as the complete result: run commands
normally, and batch related commands into one call to avoid extra turns.
Truncated results state their recovery path in their own output. Re-run a
command as `rtk proxy <cmd>` only when its result is unusable: empty when
output was clearly expected, contradicting its exit code, or garbled.
<!-- /rtk-instructions -->
## Branches

All development happens on `work` or on a branch cut from `work` (worktrees included). A finished worktree branch merges back into `work`. Every time `work` gains commits, by a direct commit or a merge, run `scripts/merge-work-to-main.sh`. It always merges `work`, not the current branch, so run it after the merge into `work`. `main` changes only through that script, and never contains `.scratch/`. Add new `.scratch/` files with `git add -f`. Push only when asked.
