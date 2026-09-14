import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  WORKTREE_SETUP_COMMAND,
  WORKTREE_SETUP_POLICY,
  assertWorktreeSetupPolicy,
  buildWorktreeChildEnv,
  probePnpmVersion,
  resolveWorktreePnpmLauncher,
} from "./setup-worktree.mjs";

const cursorDir = dirname(fileURLToPath(import.meta.url));

test("worktree setup policy forbids env, DB, migrate, seed, and servers", () => {
  assert.deepEqual(WORKTREE_SETUP_COMMAND, [
    "pnpm",
    "install",
    "--frozen-lockfile",
  ]);
  assert.equal(WORKTREE_SETUP_POLICY.copyEnv, false);
  assert.equal(WORKTREE_SETUP_POLICY.copyDb, false);
  assert.equal(WORKTREE_SETUP_POLICY.migrate, false);
  assert.equal(WORKTREE_SETUP_POLICY.seed, false);
  assert.equal(WORKTREE_SETUP_POLICY.startServer, false);
  assertWorktreeSetupPolicy();
});

test("worktree setup source does not copy secrets or start servers", () => {
  const source = readFileSync(join(cursorDir, "setup-worktree.mjs"), "utf8");
  assert.equal(/\bCopy-Item\b/.test(source), false);
  assert.equal(/\bdev:web\b/.test(source), false);
  assert.equal(/\bdev:api\b/.test(source), false);
  assert.equal(/\bapplyMigrations\b/.test(source), false);
});

test("policy-only mode does not install", () => {
  const result = spawnSync(
    process.execPath,
    [join(cursorDir, "setup-worktree.mjs"), "--policy-only"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /WORKTREE_SETUP_POLICY=SAFE/);
});

test("Windows pnpm launcher matches the proven isolated E2E path", () => {
  const launcher = resolveWorktreePnpmLauncher();
  if (process.platform === "win32") {
    assert.equal(launcher.command, "pnpm.cmd");
    assert.equal(launcher.shell, true);
  } else {
    assert.equal(launcher.command, "pnpm");
    assert.equal(launcher.shell, false);
  }
  const probe = probePnpmVersion();
  assert.equal(probe.status, 0, "pnpm --version must succeed via the same launcher");
  assert.equal(probe.command, launcher.command);
  assert.equal(probe.shell, launcher.shell);
  assert.match(probe.version, /^\d+\.\d+/);
});

test("worktree child environment removes WorkOS Cloud and SQLite pointers", () => {
  const env = buildWorktreeChildEnv({
    PATH: "keep-path",
    PNPM_HOME: "keep-pnpm",
    WORKOS_CLOUD_ROOT: "C:/secret-cloud",
    WORKOS_SQLITE_PATH: "C:/secret.sqlite",
    WORKOS_CLOUD_E2E: "1",
    WORKOS_CLOUD_E2E_PASSWORD: "secret",
    WORKOS_WAVE3_CLOUD_ROOT: "C:/wave3",
    WORKOS_DATA_DIR: "C:/data",
  });
  assert.equal(Object.hasOwn(env, "WORKOS_CLOUD_ROOT"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_SQLITE_PATH"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_CLOUD_E2E"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_CLOUD_E2E_PASSWORD"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_WAVE3_CLOUD_ROOT"), false);
  assert.equal(Object.hasOwn(env, "WORKOS_DATA_DIR"), false);
  assert.equal(env.PATH, "keep-path");
  assert.equal(env.PNPM_HOME, "keep-pnpm");
});
