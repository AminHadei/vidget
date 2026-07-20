---
name: pre-commit
description: Use when about to commit, finishing a task, or before declaring work complete on vidget. Runs the full verification pipeline and reports pass/fail per step.
disable-model-invocation: true
allowed-tools: Bash(pnpm *), Read
---

Run the full post-change verification pipeline for `vidget` and report results.

Documented in [`docs/content/conventions.md`](../../../docs/content/conventions.md).

## Steps

### 1. Quality checks

```!
pnpm check
```

### 2. Tests

```!
pnpm test
```

### 3. Build

```!
pnpm build
```

### 4. Report

For each step: **Passed** or **Failed** with exact error output.

If `$ARGUMENTS` contains `--fix`:

```!
pnpm format:fix && pnpm lint:fix
```
