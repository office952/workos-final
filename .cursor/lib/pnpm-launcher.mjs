export function resolvePnpmLauncher() {
  if (process.platform === "win32") {
    return { command: "pnpm.cmd", shell: true };
  }
  return { command: "pnpm", shell: false };
}

export const WORKTREE_STRIPPED_ENV_KEYS = [
  "WORKOS_CLOUD_ROOT",
  "WORKOS_SQLITE_PATH",
  "WORKOS_CLOUD_E2E",
  "WORKOS_CLOUD_E2E_PASSWORD",
  "WORKOS_WAVE3_CLOUD_ROOT",
  "WORKOS_DATA_DIR",
];

export function stripWorkosChildEnv(parentEnv) {
  const env = { ...parentEnv };
  const forbidden = new Set(
    WORKTREE_STRIPPED_ENV_KEYS.map((key) => key.toUpperCase()),
  );
  for (const key of Object.keys(env)) {
    if (forbidden.has(key.toUpperCase())) {
      delete env[key];
    }
  }
  return env;
}
