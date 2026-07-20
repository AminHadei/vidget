# Review instructions

Injected verbatim into every Code Review agent. Project conventions live in `AGENTS.md` — violations default to Nit. This file only recalibrates severity and scope for our repo.

## What Important means here

Vidget is an embeddable widget boilerplate shipped as a self-contained IIFE bundle with Shadow DOM isolation. Reserve Important for findings that would break a host-page embed, leak styles across the Shadow DOM boundary, or violate the public API contract.

**Always Important:**

- **Styles that escape Shadow DOM.** No unscoped global selectors in widget CSS that target host-page elements.
- **Hand-edit of `package.json` version or `CHANGELOG.md`.** Both are owned by Changesets when releasing.
- **Breaking changes to `window.Vidget` API** without a changeset and README update.
- **`any` or unchecked `as SomeType`.** TypeScript is strict. Use `unknown` at boundaries and narrow.
- **Non-English user-facing copy** in widget UI, playground, or README.

## Always check

- Changes to mount modes or display layouts update README and playground docs.
- Changes to config options update `src/types.ts`, `src/config.ts`, README, and playground.
- New logic in `WidgetPanel.vue` uses `useWidgetConfig()` for configuration rather than hardcoding URLs.
- Conventional Commits + feature branch naming — flag deviations.

## Cap the nits

Report at most **6 Nits** per review. If everything found is Nit, lead with "No blocking issues."

## Do not report

- Anything CI already enforces: `pnpm check`, Husky hooks.
- Generated files: `dist/`, `coverage/`, `node_modules/`, `pnpm-lock.yaml`.
- ESLint vue/max-attributes-per-line warnings in playground markup unless they cause runtime issues.

## Verification bar

- Behavior claims need a `file:line` citation or a reproduction path.
- Before flagging a missing utility, grep `src/` — the codebase is small.

## Summary shape

Open with a one-line tally: `N important, M nits` (or `No blocking issues`). Then a 1–3 sentence summary, followed by findings.
