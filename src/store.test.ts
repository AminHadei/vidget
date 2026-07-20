import { describe, expect, it } from "vitest";
import { createOpenStore } from "./store";

describe("createOpenStore", () => {
  it("starts with the provided initial state", () => {
    const store = createOpenStore(false);
    expect(store.getSnapshot()).toBe(false);
  });

  it("notifies subscribers when toggled", () => {
    const store = createOpenStore(false);
    let count = 0;
    store.subscribe(() => {
      count += 1;
    });
    store.toggle();
    expect(store.getSnapshot()).toBe(true);
    expect(count).toBe(1);
  });

  it("does not notify when setting the same value", () => {
    const store = createOpenStore(true);
    let count = 0;
    store.subscribe(() => {
      count += 1;
    });
    store.set(true);
    expect(count).toBe(0);
  });
});
