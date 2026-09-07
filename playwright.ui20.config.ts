import { defineConfig } from "@playwright/test";
import { join } from "node:path";

const e2eDataDir = join(process.cwd(), ".tmp", "e2e-ui20-pass-a");
const apiPort = "8791";
const ui20Port = "5183";
const currentPort = "5184";
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const ui20Origin = `http://127.0.0.1:${ui20Port}`;
const currentOrigin = `http://127.0.0.1:${currentPort}`;
process.env.WORKOS_E2E_CURRENT_ORIGIN = currentOrigin;

function isolatedEnv(extra: Record<string, string>): NodeJS.ProcessEnv {
  const env = { ...process.env, ...extra };
  delete env.WORKOS_CLOUD_ROOT;
  delete env.WORKOS_SQLITE_PATH;
  delete env.WORKOS_E2E_API_PORT;
  delete env.WORKOS_E2E_WEB_PORT;
  return env;
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/ui20-vertical-north-star-pass-a.spec.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  timeout: 240000,
  retries: 0,
  use: {
    baseURL: ui20Origin,
    trace: "on-first-retry",
  },
  metadata: {
    currentOrigin,
  },
  webServer: [
    {
      command: "pnpm --filter @workos-final/api start",
      url: `${apiOrigin}/api/health`,
      reuseExistingServer: false,
      env: isolatedEnv({
        WORKOS_DATA_DIR: e2eDataDir,
        PORT: apiPort,
      }),
    },
    {
      command: "pnpm --filter @workos-final/web dev:ui20",
      url: ui20Origin,
      reuseExistingServer: false,
      env: isolatedEnv({
        VITE_API_PROXY_TARGET: apiOrigin,
        WORKOS_E2E_UI20_PORT: ui20Port,
      }),
    },
    {
      command: `pnpm --filter @workos-final/web dev --host 127.0.0.1 --port ${currentPort}`,
      url: currentOrigin,
      reuseExistingServer: false,
      env: isolatedEnv({
        VITE_API_PROXY_TARGET: apiOrigin,
      }),
    },
  ],
});
