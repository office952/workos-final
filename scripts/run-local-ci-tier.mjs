import { spawnSync } from "node:child_process";
import { classifyCiImpact } from "./classify-ci-impact.mjs";

function gitLines(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(" ")} failed`);
  }
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function collectLocalChangedPaths() {
  const ranges = [
    ["diff", "--name-only", "--no-renames", "--cached"],
    ["diff", "--name-only", "--no-renames"],
    ["diff", "--name-only", "--no-renames", "origin/main...HEAD"],
    ["ls-files", "--others", "--exclude-standard"],
  ];
  const paths = new Set();
  for (const args of ranges) {
    try {
      for (const path of gitLines(args)) {
        paths.add(path);
      }
    } catch {
      // Missing origin/main or clean tree is not a classifier failure.
    }
  }
  return [...paths];
}

function commandForCheck(name) {
  switch (name) {
    case "docs:check":
      return ["pnpm", ["docs:check"]];
    case "lint":
      return ["pnpm", ["lint"]];
    case "typecheck":
      return ["pnpm", ["typecheck"]];
    case "test":
      return ["pnpm", ["test"]];
    case "build":
      return ["pnpm", ["build"]];
    case "e2e":
      return ["node", [".cursor/run-isolated-e2e.mjs"]];
    default:
      throw new Error(`unknown check: ${name}`);
  }
}

export function plannedLocalCommands(result) {
  const commands = ["docs:check"];
  if (result.runLint) {
    commands.push("lint");
  }
  if (result.runTypecheck) {
    commands.push("typecheck");
  }
  if (result.runTest) {
    commands.push("test");
  }
  if (result.runBuild) {
    commands.push("build");
  }
  if (result.runE2e) {
    commands.push("e2e");
  }
  return commands;
}

function isMainModule() {
  return process.argv[1] && process.argv[1].endsWith("run-local-ci-tier.mjs");
}

if (isMainModule()) {
  const execute = process.argv.includes("--execute");
  const forceFull = process.argv.includes("--force-full");
  const paths = collectLocalChangedPaths();
  const result = classifyCiImpact(paths, { forceFull });
  const commands = plannedLocalCommands(result);
  process.stdout.write(`TIER=${result.tier}\n`);
  process.stdout.write(`PATHS=${paths.join(",") || "(none → conservative full)"}\n`);
  process.stdout.write(`COMMANDS=${commands.join(" ")}\n`);
  if (!execute) {
    process.exit(0);
  }
  for (const name of commands) {
    const [command, args] = commandForCheck(name);
    const ran = spawnSync(command, args, { stdio: "inherit", shell: true });
    if (ran.status !== 0) {
      process.exit(ran.status ?? 1);
    }
  }
}
