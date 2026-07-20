# AGENTS.md — agent orientation

This file orients AI agents and automated code review on the **Vidget** (`vidget`) repo. Claude Code reads it via a one-line `@AGENTS.md` import in `CLAUDE.md`; Codex, Cursor, Copilot, Gemini CLI and other agents read it natively. Human developers read [`README.md`](./README.md) and the playground docs.

## Read the docs, not this file

Normative rules for humans and agents:

| Topic                                      | Doc                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------- |
| Quick start, embed examples, configuration | [README.md](./README.md)                                             |
| Live exploration of modes and API          | [playground/src/App.vue](./playground/src/App.vue)                   |
| Widget UI implementation entry point       | [src/components/WidgetPanel.vue](./src/components/WidgetPanel.vue)   |
| Git hooks and commit format                | [docs/content/git-conventions.md](./docs/content/git-conventions.md) |
| Post-change verification                   | [docs/content/conventions.md](./docs/content/conventions.md)         |
| Version bumps and CHANGELOG                | [docs/content/changesets.md](./docs/content/changesets.md)           |

**When answering a developer question or performing a task, consult the relevant doc(s) first. Do not invent rules that are not written down.**

## Skills (loaded on demand)

Topic-specific guidance lives as skills in [`.agents/skills/`](./.agents/skills/) — the single source of truth. Each agent discovers them through its native mechanism (Claude Code via shims in [`.claude/skills/`](./.claude/skills/), Cursor via shims in [`.cursor/rules/`](./.cursor/rules/)). Add new skills in `.agents/skills/<name>/SKILL.md` and create thin pointer shims in `.claude/skills/` and `.cursor/rules/`.

## Agent-only rules

### 1. Never bypass hooks or `--no-verify`

Husky (pre-commit lint-staged, commit-msg Conventional Commits) is load-bearing. Do not bypass. If a hook fails, fix the root cause.

### 2. Never commit without confirmation

Do not run `git commit` unsolicited. When the user asks for a commit, follow [docs/content/git-conventions.md](./docs/content/git-conventions.md).

### 3. Action scope

- Local, reversible actions (edits, tests, builds) — proceed.
- Destructive or remote actions (force-push, `reset --hard`, amending pushed commits, npm publishes) — confirm first.

### 4. Simplicity first

Minimum code that solves the problem. No speculative features or abstractions.

### 5. Surgical changes

Touch only what you must. Match existing style. Remove imports orphaned by your changes.

### 6. Goal-driven execution

Define success criteria up front; loop until verified (`pnpm check`, `pnpm test`, `pnpm build`).

## Code review

Severity calibration for automated review lives in [`REVIEW.md`](./REVIEW.md). The `code-review` skill loads it on demand.

## When in doubt

Mirror existing patterns:

- Shell and mount logic: `src/mount.ts`, `src/components/WidgetApp.vue`
- Panel content: `src/components/WidgetPanel.vue`
- Config: `src/config.ts`, `src/types.ts`
- External open/close store: `src/store.ts`

All user-facing copy must be in English.
