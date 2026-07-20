---
name: code-conventions
description: Use when writing or reviewing TypeScript, Vue, or widget code in vidget.
---

Follow [`docs/content/conventions.md`](../../../docs/content/conventions.md).

Key points:

- Implement widget UI in `src/components/WidgetPanel.vue`
- Read `config.apiBase` via `useWidgetConfig()`, never hardcode URLs
- Widget styles in `src/styles.css` with `vd-` prefix inside Shadow DOM
- All user-facing copy in English
- Run `pnpm check && pnpm test && pnpm build` before finishing
