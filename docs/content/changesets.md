# Changesets

[Changesets](https://github.com/changesets/changesets) records user-visible changes as small markdown files under `.changeset/`. At release time they drive version bumps and `CHANGELOG.md`.

## TL;DR

| You did…                                        | You do…                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| Made a user-visible change                      | `pnpm changeset` → pick bump → write summary → **commit the file** |
| Touched only tests, docs, CI, internal refactor | **No changeset.**                                                  |

Never edit `package.json` `version` or `CHANGELOG.md` by hand. Never run `changeset version` or `changeset publish` unless you are cutting a release (see below).

## Bump types

| Bump      | When to use                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| **patch** | Bug fix (e.g. sidebar animation), copy tweak, non-breaking config fix            |
| **minor** | New mount/display mode, new config option, new public API — backwards compatible |
| **major** | Breaking change — removed export, renamed config key, migration required         |

## Anatomy

```md
---
"vidget": minor
---

Add `display: drawer` alias for sidebar layout.
```

Package name in the frontmatter must match `package.json` `"name"` (`vidget`).

## When to cut a release (version bump)

Do this on **`main`** when a batch of work is **stable** — not after every commit.

Typical moments:

1. **First public release** — bootstrap commits are on `main`, playground works, `pnpm check` passes. Add a changeset summarizing the initial release, merge, then run version + publish steps below.
2. **After a feature/fix series** — several PRs merged, each with its own changeset file; CI green; you are ready to tag.
3. **Before sharing a build** — host teams need a semver tag on `dist/vidget.js` (check `window.Vidget.version` matches `package.json`).

### Release steps (local)

```bash
# 1. Ensure main is clean and checks pass
pnpm check && pnpm test && pnpm build

# 2. Consume pending .changeset/*.md files → bumps version + updates CHANGELOG.md
pnpm changeset:version

# 3. Rebuild so dist matches the new version
pnpm build

# 4. Commit the version bump (Commitlint: chore(release): version packages)
git add package.json CHANGELOG.md .changeset pnpm-lock.yaml dist
git commit -m "chore(release): version packages"

# 5. Tag and push (example for v1.1.0)
git tag v1.1.0
git push origin main --tags
```

Adjust step 4 if you do not commit `dist` (many teams publish `dist` from CI only — then omit `dist` from the commit).

Inspect pending changesets anytime:

```bash
pnpm changeset:status
```

## Day-to-day on a feature branch

```bash
pnpm changeset          # interactive — pick patch/minor/major, write summary
git add .changeset/*.md
git commit -m "chore(changeset): describe your change"
```

Merge the PR to `main` with the changeset file included. The version bump happens later in one `changeset:version` step on `main`.

## Cheat sheet

```bash
pnpm changeset          # add a changeset (interactive)
pnpm changeset:status   # inspect pending changesets
pnpm changeset:version  # apply bumps + rewrite CHANGELOG.md (release time)
```

Config: [`.changeset/config.json`](../../.changeset/config.json).

## See also

- [Git conventions](./git-conventions.md)
- [CI](../.github/workflows/ci.yml) — add a release workflow when you publish to npm
