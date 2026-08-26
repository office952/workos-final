import { afterEach, describe, expect, it } from "vitest";
import {
  consumeCloudSessionExpiredMark,
  identifyErrorLabel,
  intendedReturnPath,
  loginErrorLabel,
  rememberCloudAuthenticated,
  safeAppPath,
} from "./cloudAuth";

describe("cloudAuth", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("accepts only in-app relative paths", () => {
    expect(safeAppPath("/atelier")).toBe("/atelier");
    expect(safeAppPath("/execution/exp:1?task=a")).toBe("/execution/exp:1?task=a");
    expect(safeAppPath("https://evil.example/atelier")).toBeNull();
    expect(safeAppPath("//evil.example/atelier")).toBeNull();
    expect(safeAppPath("/\\evil")).toBeNull();
    expect(safeAppPath("atelier")).toBeNull();
    expect(intendedReturnPath("/atelier", "?task=1")).toBe("/atelier?task=1");
  });

  it("does not confuse missing config with invalid login", () => {
    expect(loginErrorLabel("invalid_credentials")).toBe("Email sau parolă greșită.");
    expect(loginErrorLabel("cloud_disabled")).toBe(
      "Autentificarea Cloud nu este configurată.",
    );
    expect(loginErrorLabel("auth_config_missing")).toBe(
      "Autentificarea Cloud nu este configurată.",
    );
  });

  it("keeps the operator PIN error generic", () => {
    expect(identifyErrorLabel("invalid_pin")).toBe("PIN greșit.");
  });

  it("remembers a previous Cloud session only for expiry copy", () => {
    rememberCloudAuthenticated();
    expect(consumeCloudSessionExpiredMark()).toBe(true);
    expect(consumeCloudSessionExpiredMark()).toBe(false);
  });
});
