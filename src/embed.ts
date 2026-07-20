import { mountWidget } from "./mount";
import { bootConfig } from "./config";
import type { WidgetConfig, WidgetHandle } from "./types";
import { VIDGET_VERSION } from "./version";

let lastOverlay: WidgetHandle | null = null;

function init(overrides: Partial<WidgetConfig> = {}): WidgetHandle {
  const handle = mountWidget(overrides);
  if (handle.mode !== "inline") lastOverlay = handle;
  return handle;
}

const api = {
  init,
  open: () => lastOverlay?.open(),
  close: () => lastOverlay?.close(),
  toggle: () => lastOverlay?.toggle(),
  version: VIDGET_VERSION,
};

window.Vidget = api;

const boot = bootConfig();
if (boot.autoInit !== false && boot.mode) {
  const start = () => init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}

export default api;
