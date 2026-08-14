import { defineConfig } from "@playwright/test";
import { join } from "node:path";

const e2eDataDir = join(process.cwd(), ".tmp", "e2e-data");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter @workos-final/api start",
      url: "http://127.0.0.1:8787/api/health",
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        WORKOS_DATA_DIR: e2eDataDir,
      },
    },
    {
      command: "pnpm --filter @workos-final/web dev --host 127.0.0.1 --port 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
