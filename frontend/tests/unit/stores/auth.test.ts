import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

// mock useRouter
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("should set token and save to localStorage", () => {
    const auth = useAuthStore();
    auth.setAuth(
      "0425169e021b54c5320a3b5d50592386fe472cd2",
      "user@example.com"
    );

    expect(auth.token).toBe("Token 0425169e021b54c5320a3b5d50592386fe472cd2");
    expect(auth.userEmail).toBe("user@example.com");
    expect(localStorage.getItem("auth_token")).toBe(
      "Token 0425169e021b54c5320a3b5d50592386fe472cd2"
    );
    expect(localStorage.getItem("user_email")).toBe("user@example.com");
  });

  it("should load token and email from localStorage", () => {
    localStorage.setItem("auth_token", "xyz456");
    localStorage.setItem("user_email", "loaded@example.com");

    const auth = useAuthStore();
    auth.loadAuth();

    expect(auth.token).toBe("xyz456");
    expect(auth.userEmail).toBe("loaded@example.com");
  });

  it("should clear token and email from localStorage on logout and navigate", () => {
    const auth = useAuthStore();
    auth.setAuth("mock-token", "mock@example.com");

    auth.logout();

    expect(auth.token).toBeNull();
    expect(auth.userEmail).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("user_email")).toBeNull();
  });

  it("isAuthenticated should return true if token exists", () => {
    const auth = useAuthStore();
    auth.setAuth("secret", "someone@example.com");
    expect(auth.isAuthenticated).toBe(true);
  });

  it("isAuthenticated should return false if token is null", () => {
    const auth = useAuthStore();
    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
  });
});
