import { defineConfig } from "@playwright/test";

const apiOrigin = "http://127.0.0.1:8801";
const webOrigin = "http://127.0.0.1:5187";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "hf-wave4-resources-admin-reuse.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: webOrigin,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter @workos-final/api start",
      url: `${apiOrigin}/api/health`,
      reuseExistingServer: true,
    },
    {
      command: `pnpm --filter @workos-final/web dev --host 127.0.0.1 --port 5187`,
      url: webOrigin,
      reuseExistingServer: true,
    },
  ],
});
