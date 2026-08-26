import { defineConfig } from "@playwright/test";
import { join } from "node:path";

const e2eDataDir = process.env.WORKOS_E2E_DATA_DIR
  ? join(process.cwd(), process.env.WORKOS_E2E_DATA_DIR)
  : join(process.cwd(), ".tmp", "e2e-data");
const apiPort = process.env.WORKOS_E2E_API_PORT ?? "8787";
const webPort = process.env.WORKOS_E2E_WEB_PORT ?? "5173";
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const webOrigin = `http://127.0.0.1:${webPort}`;

function isolatedEnv(extra: Record<string, string>): NodeJS.ProcessEnv {
  const env = { ...process.env, ...extra };
  delete env.WORKOS_CLOUD_ROOT;
  delete env.WORKOS_SQLITE_PATH;
  return env;
}

export default defineConfig({
  testDir: "./e2e",
  testIgnore: [
    "**/hf-wave3-cloud-login.spec.ts",
    "**/hf-wave4-resources-admin-reuse.spec.ts",
    "**/hf-wave5-regression-accessibility-screenshot.spec.ts",
  ],
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: webOrigin,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter @workos-final/api start",
      url: `${apiOrigin}/api/health`,
      reuseExistingServer: !process.env.CI,
      env: isolatedEnv({
        WORKOS_DATA_DIR: e2eDataDir,
        PORT: apiPort,
      }),
    },
    {
      command: `pnpm --filter @workos-final/web dev --host 127.0.0.1 --port ${webPort}`,
      url: webOrigin,
      reuseExistingServer: !process.env.CI,
      env: isolatedEnv({
        VITE_API_PROXY_TARGET: apiOrigin,
      }),
    },
  ],
});
