# Vidget

Vue 3 embeddable widget boilerplate with monochrome styling, Shadow DOM isolation, and production-ready tooling.

Vidget is inspired by embeddable widget architectures. It ships as a self-contained IIFE bundle that can be dropped onto any website without conflicting with host styles.

## Features

- **Three mount modes** — `floating` (built-in launcher), `trigger` (host button), `inline` (permanent embed)
- **Three display layouts** — `bubble` (corner panel), `sidebar` (edge drawer), `dialog` (centered modal)
- **Shadow DOM isolation** — Widget styles never leak in or out
- **Global API** — `window.Vidget.init()`, `open()`, `close()`, `toggle()`
- **Configurable** — Script `data-*` attributes, `window.VidgetConfig`, or programmatic `init()`
- **Monochrome UI** — Black-and-white palette with neutral grays
- **Placeholder panel** — Guidance text pointing to the file you should edit
- **Playground** — Interactive documentation and live preview
- **Tooling** — Husky, lint-staged, Commitlint, ESLint, Prettier, cspell, Vitest, Changesets, CI

## Quick start

```bash
pnpm install
pnpm dev
```

Open the playground to explore mount modes, display layouts, and the public API. The playground loads `dist/vidget.js` and `dist/vidget.css` directly (same as a host page). `pnpm dev` rebuilds the widget bundle first.

## Build

```bash
pnpm build
```

Outputs:

- `dist/vidget.js` — Self-mounting IIFE bundle (Vue included)
- `dist/vidget.css` — Standalone stylesheet (also injected into Shadow DOM)

## Embed on any website

### Script tag (auto-init)

```html
<script>
  window.VidgetConfig = {
    mode: "floating",
    display: "bubble",
    apiBase: "https://api.example.com",
  };
</script>
<script
  src="https://cdn.example.com/vidget.js"
  data-vidget
  data-mode="floating"
  data-display="bubble"
  data-api-base="https://api.example.com"
></script>
```

### Programmatic

```html
<button id="open-support">Contact us</button>
<div id="help-panel"></div>

<script src="https://cdn.example.com/vidget.js"></script>
<script>
  Vidget.init({
    mode: "trigger",
    display: "sidebar",
    apiBase: "https://api.example.com",
    triggerSelector: "#open-support",
  });

  Vidget.init({
    mode: "inline",
    container: "#help-panel",
    apiBase: "https://api.example.com",
  });
</script>
```

## Customization

Vidget ships as a shell only. Replace the placeholder panel with your own UI:

| Goal                           | File                                   |
| ------------------------------ | -------------------------------------- |
| Implement widget content       | `src/components/WidgetPanel.vue`       |
| Adjust styling                 | `src/styles.css`                       |
| Read backend URL in components | `useWidgetConfig()` → `config.apiBase` |
| Change defaults                | `src/config.ts`, `src/types.ts`        |

Inside `WidgetPanel.vue`, import `useWidgetConfig()` from `src/composables/useWidgetShell.ts` to access `config.apiBase` and other options.

## Mount modes

| Mode       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| `floating` | Built-in launcher button opens the widget shell.            |
| `trigger`  | Host elements matched by `triggerSelector` open the shell.  |
| `inline`   | Permanent embed inside `container`. No overlay or launcher. |

## Display layouts

Applies to `floating` and `trigger` modes only. Ignored by `inline`.

| Display   | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `bubble`  | Fixed panel near the bottom corner (380×520px). No backdrop. |
| `sidebar` | Full-height drawer sliding from the left or right edge.      |
| `dialog`  | Centered modal with backdrop.                                |

## Public API

```ts
interface WidgetHandle {
  mode: "floating" | "trigger" | "inline";
  display: "dialog" | "sidebar" | "bubble";
  open(): void;
  close(): void;
  toggle(): void;
  destroy(): void;
}

window.Vidget.init(partialConfig?) => WidgetHandle;
window.Vidget.open();
window.Vidget.close();
window.Vidget.toggle();
window.Vidget.version; // matches package.json "version"
```

## Configuration

Merge order (low → high):

1. Built-in defaults
2. `data-*` attributes on the script tag
3. `window.VidgetConfig`
4. `Vidget.init({ ... })` arguments

| Option            | Type                                | Default                                    |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| `mode`            | `floating` \| `trigger` \| `inline` | `floating`                                 |
| `display`         | `dialog` \| `sidebar` \| `bubble`   | `bubble`                                   |
| `position`        | `right` \| `left`                   | `right`                                    |
| `title`           | `string`                            | `Widget`                                   |
| `subtitle`        | `string`                            | `Replace this panel with your own content` |
| `apiBase`         | `string`                            | `/api`                                     |
| `container`       | `string` \| `HTMLElement` \| `null` | `null`                                     |
| `triggerSelector` | `string` \| `null`                  | `null`                                     |
| `autoInit`        | `boolean`                           | `true`                                     |
| `launcherLabel`   | `string`                            | `Open widget`                              |

### Script `data-*` attributes

| Attribute                | Maps to                            |
| ------------------------ | ---------------------------------- |
| `data-vidget`            | Marks the script tag for auto-init |
| `data-mode`              | `mode`                             |
| `data-display`           | `display`                          |
| `data-position`          | `position`                         |
| `data-title`             | `title`                            |
| `data-subtitle`          | `subtitle`                         |
| `data-api-base`          | `apiBase`                          |
| `data-container`         | `container`                        |
| `data-trigger-selector`  | `triggerSelector`                  |
| `data-launcher-label`    | `launcherLabel`                    |
| `data-auto-init="false"` | Disables auto-init                 |

## Project structure

```
vidget/
├── playground/              # Interactive docs and live demo
├── src/
│   ├── components/          # WidgetApp, WidgetPanel, icons
│   ├── composables/         # Shell helpers (useWidgetConfig, etc.)
│   ├── config.ts            # Defaults and config resolution
│   ├── embed.ts             # IIFE entry + global API
│   ├── mount.ts             # Shadow DOM mount logic
│   ├── store.ts             # External open/close store
│   ├── styles.css           # Monochrome widget styles
│   └── types.ts             # Public TypeScript types
├── .agents/skills/          # Agent skills (Cursor, Claude, etc.)
├── AGENTS.md                # Agent orientation
└── vite.config.ts
```

## Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Start playground dev server                  |
| `pnpm dev`          | Rebuild widget bundle, then start playground |
| `pnpm build:widget` | Build IIFE bundle only                       |
| `pnpm build`        | Typecheck and build IIFE bundle              |
| `pnpm check`        | Run all quality checks                       |
| `pnpm test`         | Run Vitest                                   |
| `pnpm changeset`    | Create a changeset for release               |

## Tooling

- **Husky** — pre-commit (lint-staged) and commit-msg (Commitlint)
- **cspell** — spell checking with project dictionary
- **Changesets** — version bumps and changelog
- **GitHub Actions** — CI on pull requests

See [AGENTS.md](./AGENTS.md) for agent-specific rules and skills.

## License

MIT
