import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  FORBIDDEN_E2E_PORTS,
  assertPortAllowed,
  buildIsolatedE2eEnv,
  isolatedDataDir,
  resolvePnpmCommand,
} from "./run-isolated-e2e.mjs";

const cursorDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(cursorDir, "..");

test("isolated E2E env removes Cloud and SQLite and forbids default ports", () => {
  assert.throws(() => assertPortAllowed(5173));
  assert.throws(() => assertPortAllowed(8787));
  const env = buildIsolatedE2eEnv(
    {
      WORKOS_CLOUD_ROOT: "C:/secret-cloud",
      WORKOS_SQLITE_PATH: "C:/secret.sqlite",
      WORKOS_CLOUD_E2E: "1",
      PLAYWRIGHT_CONFIG: "playwright.wave3-cloud.config.ts",
      PORT: "8787",
      PATH: "keep",
    },
    {
      apiPort: 18081,
      webPort: 18181,
      dataDir: ".tmp/isolated-e2e/test",
    },
  );
  assert.equal(Object.hasOwn(env, "WORKOS_CLOUD_ROOT"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_SQLITE_PATH"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_CLOUD_E2E"), false);
  assert.equal(Object.hasOwn(env, "PLAYWRIGHT_CONFIG"), false);
  assert.equal(Object.hasOwn(env, "PORT"), false);
  assert.equal(env.CI, "1");
  assert.equal(env.WORKOS_E2E_API_PORT, "18081");
  assert.equal(env.WORKOS_E2E_WEB_PORT, "18181");
  assert.equal(env.WORKOS_E2E_DATA_DIR, ".tmp/isolated-e2e/test");
  assert.equal(env.PATH, "keep");
  assert.equal(FORBIDDEN_E2E_PORTS.includes(Number(env.WORKOS_E2E_API_PORT)), false);
  assert.equal(FORBIDDEN_E2E_PORTS.includes(Number(env.WORKOS_E2E_WEB_PORT)), false);
});

test("isolated data dir stays under ignored .tmp", () => {
  const data = isolatedDataDir(repoRoot, "fixture");
  assert.match(data.relativeDir, /^\.tmp\/isolated-e2e\/fixture$/);
});

test("Windows isolated runner resolves a spawnable pnpm command", () => {
  const launcher = resolvePnpmCommand();
  assert.equal(launcher.args[0], "e2e");
  if (process.platform === "win32") {
    assert.equal(launcher.command, "pnpm.cmd");
    assert.equal(launcher.shell, true);
  } else {
    assert.equal(launcher.command, "pnpm");
    assert.equal(launcher.shell, false);
  }
});

test("plan-only does not run Playwright or copy secrets", () => {
  const result = spawnSync(
    process.execPath,
    [join(cursorDir, "run-isolated-e2e.mjs"), "--plan-only"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        WORKOS_CLOUD_ROOT: "C:/secret-cloud",
        WORKOS_SQLITE_PATH: "C:/secret.sqlite",
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(result.stdout.trim());
  assert.equal(plan.cloudRemoved, true);
  assert.equal(plan.sqliteRemoved, true);
  assert.equal(FORBIDDEN_E2E_PORTS.includes(plan.apiPort), false);
  assert.equal(FORBIDDEN_E2E_PORTS.includes(plan.webPort), false);
  assert.match(plan.dataDir, /^\.tmp\/isolated-e2e\//);
  assert.deepEqual(plan.command, ["pnpm", "e2e"]);
  assert.equal(result.stdout.includes("5173"), false);
  assert.equal(result.stdout.includes("8787"), false);
  assert.equal(result.stdout.includes("migrate"), false);
  assert.equal(result.stdout.includes("seed"), false);
  assert.equal(result.stdout.includes(".env"), false);
});
