# Git conventions

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`.

Examples:

- `feat(widget): add dialog close animation`
- `fix(mount): handle missing inline container`
- `docs: update apiBase configuration table`

Commitlint enforces this via the Husky `commit-msg` hook.

## Branches

- `feat/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`

## Hooks

| Hook       | Action                                          |
| ---------- | ----------------------------------------------- |
| pre-commit | lint-staged (Prettier + ESLint on staged files) |
| commit-msg | Commitlint                                      |

Never bypass hooks with `--no-verify`.

## Changesets

User-visible changes require a changeset:

```bash
pnpm changeset
```

Internal refactors, test-only, and docs-only changes are exempt.

**When to bump the version:** on `main`, after a stable batch of merges — not after every commit. Run `pnpm changeset:version`, rebuild, then commit and tag. Full workflow: [docs/content/changesets.md](./content/changesets.md).
