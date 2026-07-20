export type WidgetMode = "floating" | "inline" | "trigger";

export type WidgetDisplay = "dialog" | "sidebar" | "bubble";

export type WidgetPosition = "right" | "left";

export interface WidgetConfig {
  /** Base URL for backend integration. Available in WidgetPanel via useWidgetConfig(). */
  apiBase: string;
  /** How the widget is presented on the host page. */
  mode: WidgetMode;
  /** Shell layout for overlay modes (`floating` and `trigger`). Ignored in `inline`. */
  display: WidgetDisplay;
  /** Side of the screen for launcher, sidebar, and bubble placement. */
  position: WidgetPosition;
  /** Header title text. */
  title: string;
  /** Header subtitle text. */
  subtitle: string;
  /** Target container for `inline` mode (CSS selector or element). */
  container: string | HTMLElement | null;
  /** CSS selector of host element(s) that should open the widget on click. */
  triggerSelector: string | null;
  /** Whether to auto-mount when `mode` is provided via global/script config. */
  autoInit: boolean;
  /** Accessible label for the floating launcher button. */
  launcherLabel: string;
}

export interface WidgetHandle {
  mode: WidgetMode;
  display: WidgetDisplay;
  open: () => void;
  close: () => void;
  toggle: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    Vidget: {
      init: (config?: Partial<WidgetConfig>) => WidgetHandle;
      open: () => void;
      close: () => void;
      toggle: () => void;
      version: string;
    };
    VidgetConfig?: Partial<WidgetConfig>;
  }
}

export {};
