---
name: pr
description: Check for a changeset, then open a pull request summarising all commits since diverging from main.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
---

Create a pull request for the current branch against `main`.

## Process

1. Run these in parallel:
   - `git status` (never use `-uall`)
   - `git diff` and `git diff --cached`
   - `git branch --show-current`
   - `git log origin/main..HEAD --oneline`
   - `git diff origin/main...HEAD --stat`

2. If there are uncommitted changes, ask whether to commit them first (using `/ds-pipeline:commit`) or proceed without them.

3. Check for a changeset: `git fetch origin main` then `pnpm changeset status --since=origin/main`. If packages changed and no changeset covers them, stop and tell the user which packages need one (`pnpm changeset`). For changes that genuinely need no release, suggest `pnpm changeset --empty`.

4. If any file under `packages/tokens/src/` changed, run `pnpm --filter "./packages/tokens" figma-sync:check`. If it fails, stop and tell the user to run the `token-sync` agent in push (or sync) mode and commit `figma-sync.json` first.

5. Analyse ALL commits in the branch to understand the full scope. Read changed files when needed.

6. Derive the PR title: Conventional Commits, `<type>(scope): short description`, scope from the package touched (`tokens`, `fonts`, `components`, `blocks`), under 70 characters.

7. Push the branch if needed: `git push -u origin HEAD`

8. Create the PR with `gh`:

   ```bash
   gh pr create --base main --title "the title" --body "$(cat <<'BODY'
   ## Summary
   - What was done and why (1-3 bullets covering ALL commits)

   ## Changes
   - Grouped by package (tokens, fonts, components, blocks)
   - Changesets included and their bump types

   ## Test plan
   - [ ] Storybook stories reviewed at each breakpoint
   - [ ] Tests and axe checks pass
   BODY
   )"
   ```

9. Return the PR URL.

## Rules

- Always analyse ALL commits in the branch, not just the latest
- Never open a PR that changes a package without a changeset
- Never force-push
- If targeting a branch other than `main`, the user must specify it explicitly
