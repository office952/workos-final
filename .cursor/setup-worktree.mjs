import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolvePnpmLauncher,
  stripWorkosChildEnv,
} from "./lib/pnpm-launcher.mjs";

export const WORKTREE_SETUP_COMMAND = ["pnpm", "install", "--frozen-lockfile"];

export const WORKTREE_SETUP_POLICY = {
  copyEnv: false,
  copyDb: false,
  migrate: false,
  seed: false,
  startServer: false,
};

export function resolveWorktreePnpmLauncher() {
  return resolvePnpmLauncher();
}

export function buildWorktreeChildEnv(parentEnv) {
  return stripWorkosChildEnv(parentEnv);
}

export function probePnpmVersion() {
  const launcher = resolveWorktreePnpmLauncher();
  const result = spawnSync(launcher.command, ["--version"], {
    encoding: "utf8",
    shell: launcher.shell,
  });
  const version = String(result.stdout ?? "")
    .trim()
    .split(/\r?\n/)[0];
  return {
    command: launcher.command,
    shell: launcher.shell,
    version,
    status: result.status ?? 1,
  };
}

export function assertWorktreeSetupPolicy(policy = WORKTREE_SETUP_POLICY) {
  if (
    policy.copyEnv ||
    policy.copyDb ||
    policy.migrate ||
    policy.seed ||
    policy.startServer
  ) {
    throw new Error("Worktree setup policy forbids env, DB, migrate, seed, or server start.");
  }
  if (
    WORKTREE_SETUP_COMMAND.length !== 3 ||
    WORKTREE_SETUP_COMMAND[0] !== "pnpm" ||
    WORKTREE_SETUP_COMMAND[1] !== "install" ||
    WORKTREE_SETUP_COMMAND[2] !== "--frozen-lockfile"
  ) {
    throw new Error("Worktree setup may only run pnpm install --frozen-lockfile.");
  }
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }
  return resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
}

function main() {
  const policyOnly = process.argv.includes("--policy-only");
  const probeOnly = process.argv.includes("--probe-only");
  assertWorktreeSetupPolicy();
  if (policyOnly) {
    process.stdout.write("WORKTREE_SETUP_POLICY=SAFE\n");
    process.exit(0);
  }

  const launcher = resolveWorktreePnpmLauncher();
  if (probeOnly) {
    const probe = probePnpmVersion();
    process.stdout.write(
      `WORKTREE_PNPM_LAUNCHER=${probe.command}\nWORKTREE_PNPM_SHELL=${probe.shell}\nWORKTREE_PNPM_VERSION=${probe.version}\n`,
    );
    process.exit(probe.status);
  }

  const result = spawnSync(launcher.command, ["install", "--frozen-lockfile"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: launcher.shell,
    env: buildWorktreeChildEnv(process.env),
  });
  process.exit(result.status ?? 1);
}

if (isMainModule()) {
  main();
}
