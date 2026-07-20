import { computed, inject, onMounted, onUnmounted, ref, type Ref } from "vue";
import type { OpenStore } from "../store";
import type { WidgetConfig } from "../types";

export const WIDGET_CONFIG_KEY = Symbol("vidget-config");
export const WIDGET_STORE_KEY = Symbol("vidget-store");

export function useWidgetConfig(): WidgetConfig {
  const config = inject<WidgetConfig>(WIDGET_CONFIG_KEY);
  if (!config) {
    throw new Error("[Vidget] Widget config was not provided.");
  }
  return config;
}

function useWidgetStore(): OpenStore {
  const store = inject<OpenStore>(WIDGET_STORE_KEY);
  if (!store) {
    throw new Error("[Vidget] Widget store was not provided.");
  }
  return store;
}

function useWidgetOpen(): Ref<boolean> {
  const store = useWidgetStore();
  const open = ref(store.getSnapshot());

  const sync = () => {
    open.value = store.getSnapshot();
  };

  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    sync();
    unsubscribe = store.subscribe(sync);
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return open;
}

export function useWidgetShell() {
  const config = useWidgetConfig();
  const store = useWidgetStore();
  const open = useWidgetOpen();

  const shellClass = computed(() => {
    const classes = ["vd-shell", `vd-shell--${config.display}`];
    if (open.value) classes.push("vd-shell--open");
    return classes.join(" ");
  });

  const backdropClass = computed(() =>
    ["vd-backdrop", open.value ? "vd-backdrop--open" : ""].filter(Boolean).join(" "),
  );

  const launcherClass = computed(() =>
    ["vd-launcher", open.value ? "vd-launcher--hidden" : ""].filter(Boolean).join(" "),
  );

  return {
    config,
    open,
    shellClass,
    backdropClass,
    launcherClass,
    close: () => store.set(false),
    openWidget: () => store.set(true),
  };
}
