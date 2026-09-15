import { createServer } from "node:net";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePnpmLauncher, stripWorkosChildEnv } from "./lib/pnpm-launcher.mjs";

export const FORBIDDEN_E2E_PORTS = [5173, 8787];
export const ISOLATED_E2E_PORT_FLOOR = 18080;

export function assertPortAllowed(port) {
  const value = Number(port);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Isolated E2E port is invalid.");
  }
  if (FORBIDDEN_E2E_PORTS.includes(value)) {
    throw new Error("Isolated E2E must not use 5173 or 8787.");
  }
}

const STRIPPED_ISOLATED_EXTRA_KEYS = ["PLAYWRIGHT_CONFIG", "PORT"];

export function resolvePnpmCommand() {
  const launcher = resolvePnpmLauncher();
  return { ...launcher, args: ["e2e"] };
}

export function buildIsolatedE2eEnv(parentEnv, options) {
  assertPortAllowed(options.apiPort);
  assertPortAllowed(options.webPort);
  const env = stripWorkosChildEnv(parentEnv);
  for (const key of STRIPPED_ISOLATED_EXTRA_KEYS) {
    delete env[key];
  }
  for (const key of Object.keys(env)) {
    if (key.toUpperCase() === "PLAYWRIGHT_CONFIG" || key.toUpperCase() === "PORT") {
      delete env[key];
    }
  }
  env.WORKOS_E2E_API_PORT = String(options.apiPort);
  env.WORKOS_E2E_WEB_PORT = String(options.webPort);
  env.WORKOS_E2E_DATA_DIR = options.dataDir;
  env.CI = "1";
  return env;
}

export function isolatedDataDir(repoRoot, token = randomBytes(8).toString("hex")) {
  const dir = join(repoRoot, ".tmp", "isolated-e2e", token);
  const relativeDir = relative(repoRoot, dir).replace(/\\/g, "/");
  if (!relativeDir.startsWith(".tmp/isolated-e2e/")) {
    throw new Error("Isolated E2E data dir must stay under .tmp/isolated-e2e/.");
  }
  return { dir, relativeDir };
}

function listen(port) {
  return new Promise((resolveListen, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolveListen(address.port);
      });
    });
  });
}

export async function allocateUnusedPort(start) {
  for (let port = start; port < start + 200; port += 1) {
    if (FORBIDDEN_E2E_PORTS.includes(port)) {
      continue;
    }
    try {
      return await listen(port);
    } catch {
      continue;
    }
  }
  throw new Error("Could not allocate an unused isolated E2E port.");
}

export async function planIsolatedE2e(repoRoot, parentEnv = process.env) {
  const apiPort = await allocateUnusedPort(ISOLATED_E2E_PORT_FLOOR);
  const webPort = await allocateUnusedPort(ISOLATED_E2E_PORT_FLOOR + 100);
  const data = isolatedDataDir(repoRoot);
  const env = buildIsolatedE2eEnv(parentEnv, {
    apiPort,
    webPort,
    dataDir: data.relativeDir,
  });
  return {
    apiPort,
    webPort,
    dataDir: data.relativeDir,
    absoluteDataDir: data.dir,
    cloudRemoved: !Object.hasOwn(env, "WORKOS_CLOUD_ROOT"),
    sqliteRemoved: !Object.hasOwn(env, "WORKOS_SQLITE_PATH"),
    launcher: resolvePnpmCommand(),
    command: ["pnpm", "e2e"],
    env,
  };
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }
  return resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
}

async function main() {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const planOnly =
    process.argv.includes("--plan-only") || process.argv.includes("--policy-only");
  const plan = await planIsolatedE2e(repoRoot, process.env);
  if (planOnly) {
    process.stdout.write(
      `${JSON.stringify({
        apiPort: plan.apiPort,
        webPort: plan.webPort,
        dataDir: plan.dataDir,
        cloudRemoved: plan.cloudRemoved,
        sqliteRemoved: plan.sqliteRemoved,
        command: plan.command,
      })}\n`,
    );
    return;
  }

  mkdirSync(plan.absoluteDataDir, { recursive: true });
  const playwrightArgs = process.argv
    .slice(2)
    .filter((token) => token !== "--plan-only" && token !== "--policy-only")
    .reduce((args, token) => {
      if (token === "--") {
        return args;
      }
      args.push(token);
      return args;
    }, []);
  const result = spawnSync(plan.launcher.command, [...plan.launcher.args, ...playwrightArgs], {
    cwd: repoRoot,
    env: plan.env,
    stdio: "inherit",
    shell: plan.launcher.shell,
  });
  try {
    rmSync(plan.absoluteDataDir, { recursive: true, force: true });
  } catch {
    // Temporary data is under .tmp and must not block the Playwright exit code.
  }
  process.exit(result.status ?? 1);
}

if (isMainModule()) {
  await main();
}
