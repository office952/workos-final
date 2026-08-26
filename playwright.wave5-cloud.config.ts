import { defineConfig } from "@playwright/test";

const webOrigin = "http://127.0.0.1:5187";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "hf-wave5-regression-accessibility-screenshot.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: webOrigin,
    trace: "on-first-retry",
  },
});
