import { defineConfig } from "@playwright/test";
import { join } from "node:path";

const cloudRoot =
  process.env.WORKOS_WAVE3_CLOUD_ROOT ??
  join(process.cwd(), ".tmp", "hf-wave3-cloud-e2e");
const apiPort = process.env.WORKOS_E2E_API_PORT ?? "8803";
const webPort = process.env.WORKOS_E2E_WEB_PORT ?? "5189";
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const webOrigin = `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "hf-wave3-cloud-login.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  globalSetup: "./e2e/wave3-cloud-global-setup.ts",
  use: {
    baseURL: webOrigin,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter @workos-final/api start",
      url: `${apiOrigin}/api/health`,
      reuseExistingServer: false,
      env: {
        ...process.env,
        WORKOS_CLOUD_ROOT: cloudRoot,
        WORKOS_SQLITE_PATH: "",
        PORT: apiPort,
        WORKOS_DATA_DIR: join(cloudRoot, "data"),
      },
    },
    {
      command: `pnpm --filter @workos-final/web dev --host 127.0.0.1 --port ${webPort}`,
      url: webOrigin,
      reuseExistingServer: false,
      env: {
        ...process.env,
        VITE_API_PROXY_TARGET: apiOrigin,
      },
    },
  ],
});
