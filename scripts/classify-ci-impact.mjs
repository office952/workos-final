import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TIER_1_DOCS = "TIER_1_DOCS";
export const TIER_2_STATIC_LOGIC = "TIER_2_STATIC_LOGIC";
export const TIER_3_RUNTIME_E2E = "TIER_3_RUNTIME_E2E";
export const TIER_4_CONSERVATIVE_FULL = "TIER_4_CONSERVATIVE_FULL";

const RANK = {
  [TIER_1_DOCS]: 1,
  [TIER_2_STATIC_LOGIC]: 2,
  [TIER_3_RUNTIME_E2E]: 3,
  [TIER_4_CONSERVATIVE_FULL]: 4,
};

const EXECUTABLE_OR_CONFIG_EXT =
  /\.(?:js|mjs|cjs|ts|tsx|jsx|mts|cts|py|sh|bash|ps1|yml|yaml|json|lock|wasm)$/i;

const KNOWN_SAFE_STATIC_SCRIPTS = new Set([
  "scripts/verify-workos-docs-continuity.mjs",
  "scripts/verify-workos-docs-continuity.test.mjs",
]);

export function normalizeCiPath(input) {
  return String(input ?? "")
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

function isConservativeFullPath(path) {
  if (path.startsWith(".github/workflows/")) {
    return true;
  }
  if (path.startsWith(".github/") && (path.endsWith(".yml") || path.endsWith(".yaml"))) {
    return true;
  }
  if (
    path === "scripts/classify-ci-impact.mjs" ||
    path === "scripts/classify-ci-impact.test.mjs" ||
    path === "scripts/run-local-ci-tier.mjs"
  ) {
    return true;
  }
  if (path === "package.json" || path.endsWith("/package.json")) {
    return true;
  }
  if (path === "pnpm-lock.yaml" || path === "pnpm-workspace.yaml") {
    return true;
  }
  if (/^playwright(?:\.[^/]+)?\.config\.(?:ts|js|mjs)$/.test(path)) {
    return true;
  }
  if (path.startsWith(".cursor/")) {
    return true;
  }
  if (
    /^(?:eslint\.config\.(?:js|mjs|cjs)|vitest\.config\.(?:ts|js|mjs)|vite\.config\.(?:ts|js|mjs))$/.test(
      path,
    )
  ) {
    return true;
  }
  if (/^tsconfig(?:\.[^/]+)?\.json$/.test(path)) {
    return true;
  }
  if (
    /^(?:apps|packages)\//.test(path) &&
    /(?:^|\/)(?:vite\.config|vitest\.config|eslint\.config|tsconfig(?:\.[^/]+)?)\.(?:ts|js|mjs|cjs|json)$/.test(
      path,
    )
  ) {
    return true;
  }
  return false;
}

function isRuntimePath(path) {
  return (
    path.startsWith("apps/web/") ||
    path.startsWith("apps/api/") ||
    path.startsWith("packages/domain/") ||
    path.startsWith("e2e/")
  );
}

function isStaticLogicPath(path) {
  return KNOWN_SAFE_STATIC_SCRIPTS.has(path);
}

function isDocsPath(path) {
  if (path.startsWith("docs/")) {
    return !EXECUTABLE_OR_CONFIG_EXT.test(path);
  }
  if (path === "README.md" || path.endsWith("/README.md")) {
    return true;
  }
  if (path === "AGENTS.md" || path === "LICENSE" || path === "LICENSE.md") {
    return true;
  }
  if (path === ".github/pull_request_template.md") {
    return true;
  }
  return path.endsWith(".md") && !path.startsWith(".github/workflows/");
}

export function classifyCiPath(path) {
  const normalized = normalizeCiPath(path);
  if (!normalized) {
    return TIER_4_CONSERVATIVE_FULL;
  }
  if (isConservativeFullPath(normalized)) {
    return TIER_4_CONSERVATIVE_FULL;
  }
  if (isRuntimePath(normalized)) {
    return TIER_3_RUNTIME_E2E;
  }
  if (isStaticLogicPath(normalized)) {
    return TIER_2_STATIC_LOGIC;
  }
  if (isDocsPath(normalized)) {
    return TIER_1_DOCS;
  }
  if (EXECUTABLE_OR_CONFIG_EXT.test(normalized)) {
    return TIER_4_CONSERVATIVE_FULL;
  }
  return TIER_4_CONSERVATIVE_FULL;
}

export function checksForTier(tier) {
  const rank = RANK[tier] ?? RANK[TIER_4_CONSERVATIVE_FULL];
  return {
    runDocsCheck: true,
    runLint: rank >= 2,
    runTypecheck: rank >= 2,
    runTest: rank >= 2,
    runBuild: rank >= 2,
    runE2e: rank >= 3,
    installChromium: rank >= 3,
    runHarnessTests: rank >= 4,
  };
}

export function classifyCiImpact(paths, options = {}) {
  if (options.forceFull) {
    return {
      tier: TIER_4_CONSERVATIVE_FULL,
      reason: "FORCE_FULL",
      paths: [],
      ...checksForTier(TIER_4_CONSERVATIVE_FULL),
    };
  }

  const unique = [...new Set((paths ?? []).map(normalizeCiPath).filter(Boolean))];
  if (unique.length === 0) {
    return {
      tier: TIER_4_CONSERVATIVE_FULL,
      reason: "UNKNOWN_IMPACT_EMPTY",
      paths: [],
      ...checksForTier(TIER_4_CONSERVATIVE_FULL),
    };
  }

  const classified = unique.map((path) => ({ path, tier: classifyCiPath(path) }));
  let winner = TIER_1_DOCS;
  for (const item of classified) {
    if ((RANK[item.tier] ?? 4) > RANK[winner]) {
      winner = item.tier;
    }
  }

  return {
    tier: winner,
    reason: "HIGHEST_RISK_WINS",
    paths: classified,
    ...checksForTier(winner),
  };
}

export function formatGithubOutput(result) {
  return [
    `tier=${result.tier}`,
    `run_docs_check=${result.runDocsCheck}`,
    `run_lint=${result.runLint}`,
    `run_typecheck=${result.runTypecheck}`,
    `run_test=${result.runTest}`,
    `run_build=${result.runBuild}`,
    `run_e2e=${result.runE2e}`,
    `install_chromium=${result.installChromium}`,
    `run_harness_tests=${result.runHarnessTests}`,
  ].join("\n");
}

function parseArgs(argv) {
  const paths = [];
  let pathsFile;
  let forceFull = false;
  let githubOutput = false;
  let json = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--force-full":
        forceFull = true;
        break;
      case "--github-output":
        githubOutput = true;
        break;
      case "--json":
        json = true;
        break;
      case "--paths-file":
        pathsFile = argv[index + 1];
        index += 1;
        break;
      default:
        if (!arg.startsWith("-")) {
          paths.push(arg);
        }
        break;
    }
  }
  return { paths, pathsFile, forceFull, githubOutput, json };
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }
  return resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  const args = parseArgs(process.argv.slice(2));
  const fromFile = args.pathsFile
    ? readFileSync(args.pathsFile, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  const result = classifyCiImpact([...fromFile, ...args.paths], { forceFull: args.forceFull });
  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (args.githubOutput) {
    process.stdout.write(`${formatGithubOutput(result)}\n`);
  } else {
    process.stdout.write(`${result.tier}\n`);
  }
}
