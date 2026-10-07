---
name: block
description: Stage 4 of the design system build. Builds or updates one page section block from components and patterns. Use with a block name, for example /ds-pipeline:block Hero.
---

# Blocks stage

## Common rules

1. Work on a new branch named `<stage>/<name>` (for example `component/button`). Never commit to `main`.
2. Read the root `CLAUDE.md`, the package `CLAUDE.md`, and `docs/figma-conventions.md` before starting.
3. Follow the skip rules in `docs/figma-conventions.md`. Report what you skipped.
4. Start with an **inventory**: what exists in Figma for this stage versus what exists in code. Show it as a short table with status (built, missing, changed in Figma, skipped as in progress).
5. Stop and route instead of working around a gap: a missing token goes to `/ds-pipeline:tokens`, a missing component to `/ds-pipeline:component`, a missing pattern to `/ds-pipeline:pattern`.
6. End with a visual review checkpoint in local Storybook (`pnpm storybook`), then a changeset, then `/ds-pipeline:commit` and `/ds-pipeline:pr` (the user runs those).
7. No em dashes in anything you write.

Goal: one responsive page section built only from components and patterns, with all content passed in as props.

1. If no name was given, show the blocks inventory (Figma Blocks section versus `packages/blocks/src`) and ask which to build.
2. If the block's frame or page is marked ⚒️, stop and tell the user.
3. List the components and patterns it needs. If any is missing, stop and route to the right skill.
4. Propose the props API (content, images, links, items, optional heading level) and get a yes.
5. Run the block-builder agent.
6. Stories: title `Blocks/<Name>`, `layout: 'fullscreen'`, realistic placeholder content, and mobile, tablet and desktop viewports.
7. Checkpoint: the user reviews it in `pnpm storybook` at each breakpoint and approves or lists changes.
8. Changeset (minor), then commit and PR.
