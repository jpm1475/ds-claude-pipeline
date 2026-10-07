---
name: pattern
description: Stage 3 of the design system build. Builds or updates one pattern, such as Navigation, Breadcrumbs or Form, from existing components. Use with a pattern name, for example /ds-pipeline:pattern Navigation.
---

# Patterns stage

## Common rules

1. Work on a new branch named `<stage>/<name>` (for example `component/button`). Never commit to `main`.
2. Read the root `CLAUDE.md`, the package `CLAUDE.md`, and `docs/figma-conventions.md` before starting.
3. Follow the skip rules in `docs/figma-conventions.md`. Report what you skipped.
4. Start with an **inventory**: what exists in Figma for this stage versus what exists in code. Show it as a short table with status (built, missing, changed in Figma, skipped as in progress).
5. Stop and route instead of working around a gap: a missing token goes to `/ds-pipeline:tokens`, a missing component to `/ds-pipeline:component`, a missing pattern to `/ds-pipeline:pattern`.
6. End with a visual review checkpoint in local Storybook (`pnpm storybook`), then a changeset, then `/ds-pipeline:commit` and `/ds-pipeline:pr` (the user runs those).
7. No em dashes in anything you write.

Goal: one pattern built only from existing components, with its full behavior spec met.

1. If no name was given, show the patterns inventory (Figma Patterns section, plus Breadcrumbs and Form until they move there) versus `packages/components/src/patterns`, and ask which to build.
2. If the pattern's page is marked ⚒️, stop and tell the user.
3. List the components it needs. If any is missing or unapproved, stop and route to `/ds-pipeline:component`.
4. Write a short behavior spec and get a yes before building. Cover: landmarks and headings, keyboard behavior, focus management, open and closed states, current item, responsive behavior at each breakpoint, and reduced motion. For Navigation also cover the mobile menu, skip link and `aria-current`.
5. Run the pattern-builder agent. Code goes in `packages/components/src/patterns/<Name>/`.
6. Stories: title `Patterns/<Name>`, one story per state and breakpoint, plus keyboard interaction tests.
7. Checkpoint: the user reviews it in `pnpm storybook` at each breakpoint, including keyboard-only use. Repeat until approved.
8. Changeset (minor), then commit and PR.
