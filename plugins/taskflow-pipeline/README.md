# taskflow-pipeline plugin

The Claude Code pipeline from this repo, packaged as an installable plugin. It bundles
the agents, skills, hooks, and MCP servers that drive the Figma-to-code workflow so you
can drop them into your own codebase instead of copying files by hand.

## Install

```text
/plugin marketplace add aliafsahnoudeh/figma-to-code-claude-pipeline
/plugin install taskflow-pipeline@taskflow
```

Then run `/plugin` to confirm it is enabled. Plugin skills are namespaced, e.g.
`/taskflow-pipeline:commit`. Agents appear in `/agents` as `taskflow-pipeline:figma-impl`,
etc.

## What's inside

### Agents (`agents/`)

| Agent                     | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| `figma-impl`              | Implement UI from a Figma URL + verify with Playwright |
| `code-reviewer`           | Review changes against the project conventions         |
| `design-system-check`     | Flag direct MUI imports / hardcoded colors             |
| `design-system-component` | Scaffold a new wrapper component                       |
| `api-scaffold`            | Scaffold a FastAPI resource                            |
| `test-writer`             | Write pytest / Jest tests in the project style         |

### Skills (`skills/`)

`commit`, `pr`, `audit-fe`, `test-fe`, `local-setup` — invoked as
`/taskflow-pipeline:<name>`.

### Hooks (`hooks/hooks.json`)

- **`.env` read-guard** — blocks `Read`/`Grep` on `.env` files (`read_hook.js`).
- **Auto-format** — runs Prettier on each written file (`PostToolUse`).
- **Type-check** — runs `tsc` after edits to `.ts`/`.tsx` files (`tsc.js`).

### MCP servers (`.mcp.json`)

- **`playwright`** — drives a browser for visual verification.
- **`figma-local`** — reads Figma designs. Its token comes from the plugin's
  `figma_api_key` user config (prompted when you enable the plugin), so no token is
  ever written into a settings file.

## Portability note

These components encode **TaskFlow's** conventions. `commit`, `pr`, and the `.env`
read-guard are project-agnostic and work anywhere. The rest (`figma-impl`,
`design-system-*`, `api-scaffold`, `audit-fe`, `test-fe`, `local-setup`, and the
`tsc`/Prettier hooks) assume this repo's `web/`, `backend/`, and `design-system/`
layout. The `tsc` hook no-ops outside those directories; adapt the others to your own
stack. Treat this plugin as a working reference for shipping a Claude Code pipeline, not
a drop-in for arbitrary repositories.

## Maintainers

This directory is the single source of truth for the repo's own Claude Code setup:
`.claude/agents`, `.claude/skills`, and the `.claude/hooks/*.js` scripts are symlinks
into it. Edit the files here and both the repo's own sessions and installed users pick
up the change — there are no copies to keep in sync.

`version` is pinned in `.claude-plugin/plugin.json`, so bump it on each release for
installed users to receive the update. Remove the field instead to track every commit by
git SHA.
