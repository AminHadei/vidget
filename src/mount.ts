import { createApp, type App } from "vue";
import WidgetApp from "./components/WidgetApp.vue";
import { resolveConfig } from "./config";
import { createOpenStore } from "./store";
import type { WidgetConfig, WidgetHandle } from "./types";
import { WIDGET_CONFIG_KEY, WIDGET_STORE_KEY } from "./composables/useWidgetShell";
import "./styles.css";
import styles from "./styles.css?inline";

function resolveContainer(container: WidgetConfig["container"]): HTMLElement | null {
  if (!container) return null;
  if (typeof container === "string") {
    return document.querySelector<HTMLElement>(container);
  }
  return container;
}

export function mountWidget(overrides: Partial<WidgetConfig> = {}): WidgetHandle {
  const config = resolveConfig(overrides);
  const store = createOpenStore(config.mode === "inline");

  const host = document.createElement("div");
  host.className = "vidget-host";

  const target =
    config.mode === "inline" ? resolveContainer(config.container) : document.body;

  if (!target) {
    console.warn(
      `[Vidget] container "${String(config.container)}" not found; skipping mount.`,
    );
  }
  (target ?? document.body).appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  const root = document.createElement("div");
  root.className = "vd-root";
  root.dataset.position = config.position;
  root.dataset.mode = config.mode;
  root.dataset.display = config.display;
  shadow.appendChild(root);

  const app: App = createApp(WidgetApp);
  app.provide(WIDGET_CONFIG_KEY, config);
  app.provide(WIDGET_STORE_KEY, store);
  app.mount(root);

  const triggerCleanups: Array<() => void> = [];
  if (config.triggerSelector && config.mode !== "inline") {
    document.querySelectorAll<HTMLElement>(config.triggerSelector).forEach((el) => {
      const handler = (event: Event) => {
        event.preventDefault();
        store.toggle();
      };
      el.addEventListener("click", handler);
      triggerCleanups.push(() => el.removeEventListener("click", handler));
    });
  }

  return {
    mode: config.mode,
    display: config.display,
    open: () => store.set(true),
    close: () => store.set(false),
    toggle: () => store.toggle(),
    destroy: () => {
      triggerCleanups.forEach((cleanup) => cleanup());
      app.unmount();
      host.remove();
    },
  };
}
