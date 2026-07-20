# Conventions

## Post-change verification

Run before declaring work complete:

```bash
pnpm check    # typecheck + lint + format + spellcheck
pnpm test     # unit tests
pnpm build    # production bundle
```

Or use the `pre-commit` skill for a guided run.

## TypeScript

- Strict mode enabled.
- No `any`. Use `unknown` at boundaries and narrow.
- `import type` for type-only imports.

## Vue components

- Widget UI lives in `src/components/`.
- Read config via `useWidgetConfig()` from `src/composables/useWidgetShell.ts`.
- Do not hardcode `apiBase` — read it from config.

## Styling

- All widget styles live in `src/styles.css` and are injected into Shadow DOM.
- Use the `vd-` class prefix for widget classes.
- Monochrome palette: black, white, neutral grays.

## User-facing copy

- All copy must be in English.
- Widget defaults are in `src/config.ts`.

## Hard boundaries

**NEVER:**

- Add global CSS that affects the host page.
- Bypass Husky hooks.
- Commit secrets or `.env` files.

**ALWAYS:**

- Keep the IIFE bundle self-contained (Vue bundled in).
- Update README and playground when changing public API or config options.
