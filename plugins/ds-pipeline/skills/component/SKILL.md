---
name: component
description: Stage 2 of the design system build. Builds or updates one component from its Figma component set. Use with a component name and optionally a Figma URL, for example /ds-pipeline:component Button.
---

# Components stage

## Common rules

1. Work on a new branch named `<stage>/<name>` (for example `component/button`). Never commit to `main`.
2. Read the root `CLAUDE.md`, the package `CLAUDE.md`, and `docs/figma-conventions.md` before starting.
3. Follow the skip rules in `docs/figma-conventions.md`. Report what you skipped.
4. Start with an **inventory**: what exists in Figma for this stage versus what exists in code. Show it as a short table with status (built, missing, changed in Figma, skipped as in progress).
5. Stop and route instead of working around a gap: a missing token goes to `/ds-pipeline:tokens`, a missing component to `/ds-pipeline:component`, a missing pattern to `/ds-pipeline:pattern`.
6. End with a visual review checkpoint in local Storybook (`pnpm storybook`), then a changeset, then `/ds-pipeline:commit` and `/ds-pipeline:pr` (the user runs those).
7. No em dashes in anything you write.

Goal: one component, matching Figma, accessible, tested, with stories, approved by the user.

1. If no name was given, show the components inventory (Figma component sets in the Components section versus `packages/components/src`) and ask which to build. Suggest the next one in dependency order: simple display (Avatar, Badge), then controls (Checkbox, Radio, Switch), then Button family, then Tooltip, Tabs, Dropdown, Text Field.
2. If no reference component exists yet (see `packages/components/CLAUDE.md`), this component becomes the reference. Say so before starting.
3. Find the component set in Figma. If its page is marked ⚒️, stop and tell the user it is still in progress.
4. List its Figma properties and map them to React props with the naming map in `docs/figma-conventions.md`. Show the proposed props API and get a yes before writing code. Ask about any property the map does not cover.
5. Check every value it uses has a token. If any is missing, stop and route to `/ds-pipeline:tokens`.
6. Run the component-builder agent.
7. Stories: title `Components/<Name>`, one story per variant and size, a states story using the pseudo-states addon (hover, active, focus-visible), and an "All variants" story. The Docs page intro comes from the Figma component set description.
8. Checkpoint: the user reviews it in `pnpm storybook` at each breakpoint and approves or lists changes. Repeat until approved. If it is the reference component, record it in `packages/components/CLAUDE.md`.
9. Changeset (minor for a new component), then commit and PR.
