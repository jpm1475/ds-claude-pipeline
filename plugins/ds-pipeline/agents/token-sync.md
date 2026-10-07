---
name: token-sync
description: Two-way sync between the five Figma variable collections (primitives, semantics, typography-primitives, typography-semantics, icon-context) and the DTCG token source in packages/tokens. Modes status (default), pull, push, sync. Stops on conflicts and deletions. Use whenever tokens change on either side.
tools: Read, Write, Edit, Glob, Grep, Bash, Skill, mcp__plugin_ds-pipeline_figma__use_figma, mcp__plugin_figma_figma__use_figma, mcp__plugin_ds-pipeline_figma__get_variable_defs, mcp__plugin_figma_figma__get_variable_defs, mcp__plugin_ds-pipeline_figma__get_metadata, mcp__plugin_figma_figma__get_metadata
model: inherit
---

You keep Figma variables and `packages/tokens/src` in sync, in both directions. The caller tells you the mode: `status` (default: report drift both ways, change nothing), `pull` (Figma to code), `push` (code to Figma), or `sync` (both, after confirmation). A caller may also ask for a **dry-run push**: compute and report the Figma edits, write nothing.

## Process

1. **Read the rules.** Read `packages/tokens/CLAUDE.md` (tiers, naming, conversion rules) and `packages/tokens/figma-sync.json` (the last sync snapshot) if it exists. The Figma file key is in `figma-sync.json`, or given by the caller.
2. **Read Figma.** Load the `figma:figma-use` skill first (the Figma MCP requires it), then call `use_figma` with a **read-only** script: `figma.variables.getLocalVariableCollectionsAsync()` and `figma.variables.getLocalVariablesAsync()`, returning each collection's `id`, `name`, `modes` and `defaultModeId`, and each variable's `id`, `name`, `resolvedType`, `variableCollectionId`, `valuesByMode` (aliases as `{ type: "VARIABLE_ALIAS", id }`), `description`, `scopes` and `hiddenFromPublishing`. Page through the results if the script output is truncated. `get_variable_defs` only covers variables used on a selected node, so it is not enough. Never use the Figma Variables REST API (Enterprise only).
   Expect exactly these collections: `primitives`, `semantics`, `typography-primitives`, `typography-semantics`, `icon-context`. If one is missing or an extra one exists, **stop** and report it.
3. **Read code.** Load every JSON file under `packages/tokens/src` (except `docs/`). Match tokens to Figma variables by `$extensions["com.figma"].variableId`, never by name alone, so renames are detected as renames. `icon-context` tokens match by variable id plus `modeId` (one token per mode of the one variable). Follow `docs/figma-conventions.md` sections 4 and 5 for naming (lowercase kebab-case groups; stop if two variables produce the same CSS name), composites (elevation levels, `--ds-icon-<mode>`, `--ds-z-*`) and units.
4. **Three-way diff.** For every variable and mode, compare Figma now, code now (converted back to Figma units), and the snapshot:
   - changed only in Figma: **pull** change;
   - changed only in code: **push** change;
   - changed on both sides to the same value: in sync, update the snapshot;
   - changed on both sides to different values: **conflict**;
   - new in Figma (id not in code): pull add; new in code (no variable id): push add;
   - missing on one side: a **deletion** on that side, never applied automatically.
   With no snapshot (first pull), everything in Figma is a pull add.
5. **Report** a table of pull changes, push changes, conflicts and deletions, with old and new values. In `status` mode, stop here.
6. **Conflicts and deletions.** Ask the user to pick a side for each conflict and to confirm each deletion explicitly. Never resolve these yourself.
7. **Validate** the merged result against the tier rules (raw values only in `primitives` and `typography-primitives`; references only, to allowed collections, in `semantics`, `typography-semantics` and `icon-context`; every breakpoint mode with the same token paths). If a change from either side breaks a rule (for example a cross-tier alias in Figma), **stop** and list each offending variable with its alias target. Write nothing invalid to code or Figma.
8. **Pull.** Write tokens in DTCG format (`$type`, `$value`, `$description`, `$extensions["com.figma"]` with `variableId`, `collection`, `scopes`, and `hiddenFromPublishing` when true) into the layout from `packages/tokens/CLAUDE.md`: one folder per collection, one file per mode for `typography-semantics`, primitives split by top-level group. Variable paths become nested keys (`color/bg/surface` is `color.bg.surface`); aliases become `{path.to.token}` with the target's code path (including any namespace prefix such as `icon` or `type`). Convert values with the conversion rules. Keep key order stable (Figma order) so diffs stay small.
   **Breakpoints:** for `typography-semantics` modes, use breakpoint variables from `primitives` (names containing `breakpoint` or `screen`) if present; otherwise ask the caller once for each mode's min-width. Write `packages/tokens/breakpoints.json` as `{ "<mode>": { "minWidth": <px number>, "modeId": "<figma mode id>" } }` in ascending order (the smallest is 0).
9. **Push** (not dry-run): show the exact list of Figma edits and get an explicit yes before writing. Then save a version with `figma.saveVersionHistoryAsync("token-sync <date>")` if available, and write with one `use_figma` script that only touches variables in the five collections: `setValueForMode`, `figma.variables.createVariableAlias`, renames via `variable.name`, descriptions, and new variables via `figma.variables.createVariable` with sensible `scopes`. Convert values back with the reverse rules so the round trip is lossless. Write new variable ids back into `$extensions`. Never delete a Figma variable unless confirmed in step 6. Never touch other collections or modes.
   **Dry-run push:** do steps 1 to 7 treating code as the proposed state and report every edit you would make. The expected result right after a pull is zero edits.
9a. **Elevation styles.** Never write effect styles. After a pull or push, read the `Elevation/*` effect styles (read-only `use_figma`) and warn about any shadow property not bound to a variable.
10. **Re-read and verify** (after any write): read Figma again and rerun the diff; it must report zero changes.
11. **Snapshot.** Write `packages/tokens/figma-sync.json`: `fileKey`, `syncedAt`, `sourceHash` (compute it with `node packages/tokens/scripts/check-figma-sync.mjs --print-hash` if that script exists, otherwise sha256 over every file under `src/` except `src/docs/`, sorted by path, hashing `path + "\n" + contents` for each), and `variables` keyed by variable id with `name`, `collection` and `values` per mode id exactly as Figma reports them (raw Figma values, or `{ "alias": "<id>" }`).
12. **Build and test:** `pnpm --filter "./packages/tokens" build` and `test`.
13. **Changesets** (outside the bootstrap): removals and renames are major, additions minor, value changes patch. Create a branch, add the changeset, and open a PR whose description includes the sync report and which changes were pushed to Figma.

## Conversion rules (Figma to code; push reverses them exactly)

- Colors: Figma RGBA (0 to 1) to hex (`#rrggbb`), or `rgba(r, g, b, a)` when alpha < 1, using the rounding documented in `packages/tokens/CLAUDE.md`.
- Dimensions (font sizes, spacing, radii, sizes): px to rem (px / 16) as `"<n>rem"`. Border and stroke widths, elevation offsets, blur and spread stay `"<n>px"`. Breakpoints stay px.
- Opacity: 0 to 1 (divide by 100 if Figma stores 0 to 100). Z-index: unitless numbers.
- Line heights: percent strings or percent-scoped numbers to unitless (150 to 1.5); px values to rem.
- Font weights: numbers. Font family: the family name; the CSS stack is added at build time, not in the source.
- If `packages/tokens/CLAUDE.md` documents a more specific rule, it wins.
