import {
  basename,
  splitShellSegments,
  tokenize,
  unwrapCommand,
} from "./tokenize.mjs";

const ALLOWED_PNPM_SCRIPTS = new Set([
  "lint",
  "typecheck",
  "test",
  "build",
]);

const ISOLATED_E2E_SCRIPT = ".cursor/run-isolated-e2e.mjs";

const GIT_READONLY = new Set([
  "status",
  "diff",
  "log",
  "show",
  "rev-parse",
]);

const PS_DIAGNOSTIC_CMDLETS = new Set([
  "get-filehash",
  "get-item",
  "test-path",
  "write-output",
  "out-null",
]);

const PS_ARTIFACT_WRITE_CMDLETS = new Set([
  "new-item",
  "set-content",
  "out-file",
]);

function decision(permission, category, agentMessage) {
  return { permission, category, agentMessage };
}

function findToolIndex(tokens, names) {
  return tokens.findIndex((token) => names.has(basename(token)));
}

function skipGitGlobals(args) {
  const remaining = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "-C" || token === "--git-dir" || token === "--work-tree") {
      index += 1;
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    remaining.push(token);
    remaining.push(...args.slice(index + 1));
    break;
  }
  return remaining;
}

function gitSubcommand(tokens) {
  const gitIndex = findToolIndex(tokens, new Set(["git"]));
  if (gitIndex < 0) {
    return null;
  }
  const remaining = skipGitGlobals(tokens.slice(gitIndex + 1));
  return remaining[0]?.toLowerCase() ?? null;
}

function gitArgs(tokens) {
  const gitIndex = findToolIndex(tokens, new Set(["git"]));
  if (gitIndex < 0) {
    return [];
  }
  return tokens.slice(gitIndex + 1);
}

function gitSubcommandArgs(tokens) {
  const gitIndex = findToolIndex(tokens, new Set(["git"]));
  if (gitIndex < 0) {
    return [];
  }
  return skipGitGlobals(tokens.slice(gitIndex + 1)).slice(1);
}

function isAllowedGitAdd(tokens) {
  return gitSubcommand(tokens) === "add";
}

function isAllowedUnstageReset(tokens) {
  if (gitSubcommand(tokens) !== "reset" || isHardReset(tokens)) {
    return false;
  }
  const after = gitSubcommandArgs(tokens);
  let index = 0;
  if (after[index] === "-q" || after[index] === "--quiet") {
    index += 1;
  }
  if (after[index] === "HEAD") {
    index += 1;
  }
  if (index === after.length) {
    return true;
  }
  if (after[index] !== "--") {
    return false;
  }
  const pathspecs = after.slice(index + 1);
  return (
    pathspecs.length > 0 &&
    pathspecs.every((token) => token.length > 0 && !token.startsWith("-"))
  );
}

function isAllowedHashObject(tokens) {
  if (gitSubcommand(tokens) !== "hash-object") {
    return false;
  }
  return !gitSubcommandArgs(tokens).some(
    (token) => token === "-w" || token === "--literally" || token.startsWith("--literally="),
  );
}

function isAllowedGitBranchShow(tokens) {
  if (gitSubcommand(tokens) !== "branch") {
    return false;
  }
  const after = gitSubcommandArgs(tokens);
  return after.length === 1 && after[0] === "--show-current";
}

function collectPowerShellDestinations(tokens) {
  const destinations = [];
  for (let index = 0; index < tokens.length; index += 1) {
    if (/^-(Path|LiteralPath|FilePath)$/i.test(tokens[index])) {
      destinations.push(tokens[index + 1] ?? "");
    }
  }
  return destinations;
}

function isTmpRelativeDestination(rawPath) {
  const value = String(rawPath ?? "").trim();
  if (value.length === 0) {
    return false;
  }
  if (/^[a-zA-Z]:/.test(value) || value.startsWith("\\\\") || value.startsWith("//") || value.startsWith("/")) {
    return false;
  }
  let normalized = value.replace(/\\/g, "/");
  while (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }
  if (normalized.split("/").includes("..")) {
    return false;
  }
  return normalized === ".tmp" || normalized.startsWith(".tmp/");
}

function isAllowedPowerShellCmdlet(tokens) {
  const name = basename(tokens[0] ?? "");
  if (PS_DIAGNOSTIC_CMDLETS.has(name)) {
    return true;
  }
  if (!PS_ARTIFACT_WRITE_CMDLETS.has(name)) {
    return false;
  }
  if (tokens.some((token) => /^-(Recurse)$/i.test(token))) {
    return false;
  }
  if (tokens.some((token) => isInvokeExpressionToken(token))) {
    return false;
  }
  const destinations = collectPowerShellDestinations(tokens);
  return destinations.length > 0 && destinations.every((path) => isTmpRelativeDestination(path));
}

function isForcePush(tokens) {
  if (gitSubcommand(tokens) !== "push") {
    return false;
  }
  const args = gitArgs(tokens);
  if (
    args.some((token) => {
      const lower = token.toLowerCase();
      return (
        lower === "--force" ||
        lower === "-f" ||
        lower === "-uf" ||
        lower === "-fu" ||
        lower === "--force-with-lease" ||
        lower.startsWith("--force-with-lease=") ||
        (/^-[^-]*f[^-]*$/i.test(token) && /f/i.test(token))
      );
    })
  ) {
    return true;
  }
  return args.some((token) => token.startsWith("+"));
}

function isHardReset(tokens) {
  return (
    gitSubcommand(tokens) === "reset" &&
    gitArgs(tokens).some((token) => token.toLowerCase() === "--hard")
  );
}

function isDestructiveClean(tokens) {
  if (gitSubcommand(tokens) !== "clean") {
    return false;
  }
  const args = gitArgs(tokens);
  if (
    args.some((token) => {
      const lower = token.toLowerCase();
      return lower === "-n" || lower === "--dry-run";
    })
  ) {
    return false;
  }
  return args.some((token) => {
    const lower = token.toLowerCase();
    return (
      lower === "--force" ||
      /^-.*f/i.test(token) ||
      lower === "-d" ||
      /^-.*d/i.test(token) ||
      lower === "-x" ||
      /^-.*x/i.test(token)
    );
  });
}

function isGitRm(tokens) {
  return gitSubcommand(tokens) === "rm";
}

function isRecursiveDelete(tokens) {
  if (isGitRm(tokens)) {
    return false;
  }
  const rmIndex = findToolIndex(tokens, new Set(["rm"]));
  if (rmIndex >= 0) {
    const flags = tokens
      .slice(rmIndex + 1)
      .filter((token) => token.startsWith("-"));
    if (flags.some((flag) => /r/i.test(flag))) {
      return true;
    }
  }
  const removeIndex = tokens.findIndex((token) => /^Remove-Item$/i.test(token));
  if (
    removeIndex >= 0 &&
    tokens.some((token) => /^-(Recurse|r)$/i.test(token))
  ) {
    return true;
  }
  const rdIndex = findToolIndex(tokens, new Set(["rd", "rmdir"]));
  if (rdIndex >= 0 && tokens.some((token) => /^\/s$/i.test(token))) {
    return true;
  }
  return false;
}

function joinedLower(tokens) {
  return tokens.join(" ").toLowerCase();
}

function isDestructiveDb(tokens) {
  const text = joinedLower(tokens);
  return (
    /\bprisma\s+migrate\s+reset\b/.test(text) ||
    /\bmigrate\s+reset\b/.test(text) ||
    /\bdb:reset\b/.test(text) ||
    /\bdrop\s+(table|database)\b/.test(text)
  );
}

function isCloudMutation(tokens) {
  const text = joinedLower(tokens);
  return (
    /\bcloud:(provision|adopt|configure-providers)\b/.test(text) ||
    /\b(devprovisioncli|adoptcli|configureproviderscli)\.ts\b/.test(text) ||
    (/\bworkos_cloud_root\b/.test(text) &&
      /\b(rm|remove-item|del|unlink)\b/.test(text))
  );
}

function rank(permission) {
  if (permission === "deny") {
    return 2;
  }
  if (permission === "ask") {
    return 1;
  }
  return 0;
}

function mergeDecisions(decisions) {
  return decisions.reduce((worst, current) =>
    rank(current.permission) >= rank(worst.permission) ? current : worst,
  );
}

function isAllowedPnpm(tokens) {
  const pnpmIndex = findToolIndex(tokens, new Set(["pnpm"]));
  if (pnpmIndex < 0) {
    return false;
  }
  const args = tokens.slice(pnpmIndex + 1);
  if (args[0] === "install") {
    const extras = args.filter(
      (token) => token !== "install" && token !== "--frozen-lockfile",
    );
    return args.includes("--frozen-lockfile") && extras.length === 0;
  }
  const scripts = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--filter" || token === "-F") {
      index += 1;
      continue;
    }
    if (token.startsWith("--filter=")) {
      continue;
    }
    if (token === "run" || token === "-r" || token === "--recursive") {
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    scripts.push(token);
  }
  return (
    scripts.length === 1 && ALLOWED_PNPM_SCRIPTS.has(scripts[0].toLowerCase())
  );
}

function isNodeTest(tokens) {
  const nodeIndex = findToolIndex(tokens, new Set(["node"]));
  if (nodeIndex < 0) {
    return false;
  }
  return tokens[nodeIndex + 1] === "--test";
}

function packageManagerScripts(tokens, managers) {
  const managerIndex = findToolIndex(tokens, managers);
  if (managerIndex < 0) {
    return [];
  }
  const args = tokens.slice(managerIndex + 1);
  const scripts = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--filter" || token === "-F" || token === "--prefix") {
      index += 1;
      continue;
    }
    if (token.startsWith("--filter=") || token.startsWith("--prefix=")) {
      continue;
    }
    if (token === "run" || token === "-r" || token === "--recursive") {
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    scripts.push(token);
  }
  return scripts;
}

function isDirectPnpmE2e(tokens) {
  return packageManagerScripts(tokens, new Set(["pnpm"])).some(
    (script) => script.toLowerCase() === "e2e",
  );
}

function isDirectNpmE2e(tokens) {
  return packageManagerScripts(tokens, new Set(["npm"])).some(
    (script) => script.toLowerCase() === "e2e",
  );
}

function hasEncodedPowerShellFlag(tokens) {
  const hasPowerShell =
    findToolIndex(tokens, new Set(["powershell", "pwsh"])) >= 0;
  return tokens.some((token) => {
    if (/^-(EncodedCommand|enc|ec)$/i.test(token)) {
      return true;
    }
    return hasPowerShell && /^-e$/i.test(token);
  });
}

function isInvokeExpressionToken(token) {
  return /^Invoke-Expression$/i.test(token) || /^iex$/i.test(token);
}

function isInvokeExpression(tokens) {
  const iexIndex = tokens.findIndex((token) => isInvokeExpressionToken(token));
  if (iexIndex < 0) {
    return false;
  }
  if (iexIndex === 0) {
    return true;
  }
  const before = tokens.slice(0, iexIndex).map((token) => basename(token));
  return before.includes("powershell") || before.includes("pwsh");
}

function hasEvalFlag(tokens, tools, flags) {
  const toolIndex = findToolIndex(tokens, tools);
  if (toolIndex < 0) {
    return false;
  }
  return tokens.slice(toolIndex + 1).some((token) => {
    if (flags.has(token)) {
      return true;
    }
    return [...flags].some(
      (flag) => flag.startsWith("--") && token.startsWith(`${flag}=`),
    );
  });
}

function isOpaqueWrapper(tokens) {
  if (hasEncodedPowerShellFlag(tokens) || isInvokeExpression(tokens)) {
    return true;
  }
  if (
    hasEvalFlag(tokens, new Set(["node"]), new Set(["-e", "--eval"]))
  ) {
    return true;
  }
  if (
    hasEvalFlag(
      tokens,
      new Set(["python", "python3", "py"]),
      new Set(["-c"]),
    )
  ) {
    return true;
  }
  if (hasEvalFlag(tokens, new Set(["bash", "sh"]), new Set(["-c"]))) {
    return true;
  }
  return false;
}

function isPlaywrightTool(token) {
  const name = basename(token);
  if (name === "playwright") {
    return true;
  }
  const normalized = String(token ?? "").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.endsWith("/playwright") ||
    normalized.endsWith("/playwright.js") ||
    normalized.endsWith("/playwright/cli.js") ||
    normalized.includes("@playwright/test")
  );
}

function isDirectPlaywrightInvocation(tokens) {
  const playwrightIndex = tokens.findIndex((token) => isPlaywrightTool(token));
  if (playwrightIndex < 0) {
    return false;
  }
  if (playwrightIndex === 0) {
    return true;
  }
  const before = tokens
    .slice(0, playwrightIndex)
    .map((token) => basename(token));
  if (before.includes("npx") || before.includes("pnpx")) {
    return true;
  }
  if (before.includes("pnpm") || before.includes("npm")) {
    return true;
  }
  if (before.includes("node") && isPlaywrightTool(tokens[playwrightIndex])) {
    return true;
  }
  return false;
}

function isIsolatedE2eRunner(tokens) {
  const nodeIndex = findToolIndex(tokens, new Set(["node"]));
  if (nodeIndex < 0) {
    return false;
  }
  const script = String(tokens[nodeIndex + 1] ?? "").replace(/\\/g, "/");
  if (!script.endsWith(ISOLATED_E2E_SCRIPT)) {
    return false;
  }
  const extras = tokens.slice(nodeIndex + 2);
  return extras.every(
    (token) => token === "--plan-only" || token === "--policy-only",
  );
}

function classifySegment(command) {
  const tokens = tokenize(unwrapCommand(command));
  if (tokens.length === 0) {
    return decision(
      "ask",
      "uncertain",
      "Shell command could not be tokenized.",
    );
  }

  if (isForcePush(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Force-push and +refspec pushes are blocked.",
    );
  }
  if (isHardReset(tokens)) {
    return decision("deny", "destructive", "git reset --hard is blocked.");
  }
  if (isDestructiveClean(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Destructive git clean is blocked.",
    );
  }
  if (isRecursiveDelete(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Recursive destructive deletion is blocked.",
    );
  }
  if (isDestructiveDb(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Destructive database reset/drop is blocked.",
    );
  }
  if (isCloudMutation(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Production/real-cloud mutation patterns are blocked.",
    );
  }
  if (isOpaqueWrapper(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Opaque interpreter wrappers are blocked because ASK is not a security gate.",
    );
  }
  if (
    isDirectPlaywrightInvocation(tokens) ||
    isDirectPnpmE2e(tokens) ||
    isDirectNpmE2e(tokens)
  ) {
    return decision(
      "deny",
      "destructive",
      "Use the Harness isolated E2E runner: node .cursor/run-isolated-e2e.mjs",
    );
  }
  if (isIsolatedE2eRunner(tokens)) {
    return decision(
      "allow",
      "verification",
      "Harness isolated E2E runner is allowed.",
    );
  }

  const git = gitSubcommand(tokens);
  if (git) {
    if (GIT_READONLY.has(git)) {
      return decision(
        "allow",
        "readonly",
        "Readonly git inspection is allowed.",
      );
    }
    if (
      git === "clean" &&
      gitArgs(tokens).some((token) => {
        const lower = token.toLowerCase();
        return lower === "-n" || lower === "--dry-run";
      })
    ) {
      return decision("allow", "readonly", "git clean dry-run is allowed.");
    }
    if (
      isAllowedGitAdd(tokens) ||
      isAllowedUnstageReset(tokens) ||
      isAllowedGitBranchShow(tokens) ||
      isAllowedHashObject(tokens)
    ) {
      return decision(
        "allow",
        "verification",
        "Ordinary repository-local git workflow is allowed.",
      );
    }
    return decision(
      "ask",
      "state_changing",
      "Legitimate state-changing git requires task-specific authorization.",
    );
  }

  if (isAllowedPowerShellCmdlet(tokens)) {
    return decision(
      "allow",
      "verification",
      "Ordinary repository-local PowerShell workflow is allowed.",
    );
  }

  if (isAllowedPnpm(tokens) || isNodeTest(tokens)) {
    return decision(
      "allow",
      "verification",
      "Classified verification command is allowed.",
    );
  }

  return decision(
    "ask",
    "uncertain",
    "Uncertain shell command requires confirmation.",
  );
}

export function classifyShellCommand(command) {
  if (typeof command !== "string" || command.trim().length === 0) {
    return decision(
      "ask",
      "uncertain",
      "Empty shell command is treated as uncertain.",
    );
  }

  const unwrapped = unwrapCommand(command);
  if (/\s-(EncodedCommand|enc|ec)\b/i.test(` ${unwrapped} `)) {
    return decision(
      "deny",
      "destructive",
      "Encoded PowerShell is blocked because ASK is not a security gate.",
    );
  }

  const segments = splitShellSegments(unwrapped);
  if (segments.length === 0) {
    return classifySegment(unwrapped);
  }
  return mergeDecisions(segments.map((segment) => classifySegment(segment)));
}
