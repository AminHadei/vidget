import type { WidgetConfig, WidgetDisplay, WidgetMode, WidgetPosition } from "./types";

const DEFAULTS: WidgetConfig = {
  apiBase: import.meta.env.VITE_WIDGET_API_BASE || "/api",
  mode: "floating",
  display: "bubble",
  position: "right",
  title: "Widget",
  subtitle: "Replace this panel with your own content",
  container: null,
  triggerSelector: null,
  autoInit: true,
  launcherLabel: "Open widget",
};

function readScriptConfig(): Partial<WidgetConfig> {
  const el =
    (document.currentScript as HTMLScriptElement | null) ??
    document.querySelector<HTMLScriptElement>("script[data-vidget]");
  if (!el) return {};

  const d = el.dataset;
  const cfg: Partial<WidgetConfig> = {};
  if (d.apiBase) cfg.apiBase = d.apiBase;
  if (d.mode) cfg.mode = d.mode as WidgetMode;
  if (d.display) cfg.display = d.display as WidgetDisplay;
  if (d.position) cfg.position = d.position as WidgetPosition;
  if (d.title) cfg.title = d.title;
  if (d.subtitle) cfg.subtitle = d.subtitle;
  if (d.container) cfg.container = d.container;
  if (d.triggerSelector) cfg.triggerSelector = d.triggerSelector;
  if (d.launcherLabel) cfg.launcherLabel = d.launcherLabel;
  if (d.autoInit) cfg.autoInit = d.autoInit !== "false";
  return cfg;
}

const SCRIPT_CONFIG = readScriptConfig();

/** Merge order (low to high): defaults, script data-attrs, window global, call overrides. */
export function resolveConfig(overrides: Partial<WidgetConfig> = {}): WidgetConfig {
  const globalConfig = (window.VidgetConfig ?? {}) as Partial<WidgetConfig>;
  return { ...DEFAULTS, ...SCRIPT_CONFIG, ...globalConfig, ...overrides };
}

/** Config available at load time, used to decide whether to auto-mount. */
export function bootConfig(): Partial<WidgetConfig> {
  const globalConfig = (window.VidgetConfig ?? {}) as Partial<WidgetConfig>;
  return { ...SCRIPT_CONFIG, ...globalConfig };
}
