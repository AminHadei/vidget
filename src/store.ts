export interface OpenStore {
  getSnapshot: () => boolean;
  subscribe: (listener: () => void) => () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

export function createOpenStore(initial: boolean): OpenStore {
  let open = initial;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  return {
    getSnapshot: () => open,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (value) => {
      if (open === value) return;
      open = value;
      emit();
    },
    toggle: () => {
      open = !open;
      emit();
    },
  };
}
