---
name: tokens
description: Stage 1 of the design system build. Audits Figma variables against the token code, syncs both ways, and moves tokens toward a stable 1.0. Use when tokens need to be pulled, pushed, audited or finalized.
---

# Tokens stage

## Common rules

1. Work on a new branch named `<stage>/<name>` (for example `component/button`). Never commit to `main`.
2. Read the root `CLAUDE.md`, the package `CLAUDE.md`, and `docs/figma-conventions.md` before starting.
3. Follow the skip rules in `docs/figma-conventions.md`. Report what you skipped.
4. Start with an **inventory**: what exists in Figma for this stage versus what exists in code. Show it as a short table with status (built, missing, changed in Figma, skipped as in progress).
5. Stop and route instead of working around a gap: a missing token goes to `/ds-pipeline:tokens`, a missing component to `/ds-pipeline:component`, a missing pattern to `/ds-pipeline:pattern`.
6. End with a visual review checkpoint in local Storybook (`pnpm storybook`), then a changeset, then `/ds-pipeline:commit` and `/ds-pipeline:pr` (the user runs those).
7. No em dashes in anything you write.

Goal: Figma variables and `packages/tokens/src` match, every tier rule passes, and the user has approved the token set.

1. Run token-sync in `status` mode. Show drift in both directions.
2. Audit against `docs/figma-conventions.md` and `packages/tokens/CLAUDE.md`. Report, grouped by severity:
   - blockers: missing collections, cross-tier aliases, duplicate CSS names, values that cannot convert;
   - warnings: inconsistent casing, missing descriptions, unbound elevation style properties, breakpoints not matched to typography modes, raw values in semantic collections.
3. Ask the user which direction to sync (pull, push or both) and resolve conflicts and deletions one by one.
4. Run the sync, then build and test the tokens package.
5. Refresh the Foundations pages: re-pull written content from the Figma foundation pages into `packages/tokens/src/docs/content/` and check every Foundations page renders.
6. Checkpoint: ask the user to review the Foundations section in `pnpm storybook`.
7. Changeset: removals and renames are major, additions minor, value changes patch.
8. When the user says the token set is final, record "Token 1.0 approved on <date>" in `packages/tokens/CLAUDE.md` and use a major changeset to release 1.0.0. After 1.0, any rename or removal needs the user's explicit approval.
