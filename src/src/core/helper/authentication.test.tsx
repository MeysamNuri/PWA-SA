// src/core/helper/authentication.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { isAuthenticated } from "./authentication";

describe("isAuthenticated", () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();

  beforeEach(() => {
    // Override the global localStorage with the mock
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    localStorage.clear();
  });

  it("returns false when no authToken is set", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("returns true when authToken is set", () => {
    localStorage.setItem("authToken", "dummy-token");
    expect(isAuthenticated()).toBe(true);
  });

  it("returns false when authToken is an empty string", () => {
    localStorage.setItem("authToken", "");
    expect(isAuthenticated()).toBe(false);
  });
});
