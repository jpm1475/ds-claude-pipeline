# ds-claude-pipeline

A Claude Code plugin marketplace with one plugin, **ds-pipeline**: a Figma-to-code pipeline for a pnpm design-system monorepo (`packages/tokens`, `packages/fonts`, `packages/components`, `packages/blocks`).

## What's in the plugin

| Kind | Name | Purpose |
| --- | --- | --- |
| Agent | `component-builder` | Builds one React component from a Figma frame or a spec, verifies it in Playwright and with axe |
| Agent | `block-builder` | Builds one page section from existing components only |
| Agent | `token-sync` | Two-way sync between the Figma variable collections and the DTCG token source |
| Agent | `design-system-check` | Fast lint pass over changed files against the design system rules |
| Agent | `code-reviewer` | Reviews changes against the repo's CLAUDE.md files |
| Agent | `test-writer` | Vitest, Testing Library and vitest-axe tests |
| Skill | `/ds-pipeline:commit` | Atomic Conventional Commits |
| Skill | `/ds-pipeline:pr` | Checks changesets, then opens a PR with `gh` |
| Hooks | | `.env` read guard, Prettier and typecheck on edit, token-change reminder |
| MCP | `figma`, `playwright` | Official Figma MCP (OAuth) and headless Playwright |

## Install

```bash
claude plugin marketplace add jpm1475/ds-claude-pipeline
claude plugin install ds-pipeline@jpm1475-tools
```

Or add the marketplace to a repo's `.claude/settings.json` (`extraKnownMarketplaces` and `enabledPlugins`) so everyone working in it is prompted to install.

## Credit

Adapted from [aliafsahnoudeh/figma-to-code-claude-pipeline](https://github.com/aliafsahnoudeh/figma-to-code-claude-pipeline) by Ali Afsahnoudeh. The original's commit and PR skills, `.env` guard, edit hooks and agent structure are the starting point for this plugin.

## License

MIT, as in the original. See `LICENSE`.
