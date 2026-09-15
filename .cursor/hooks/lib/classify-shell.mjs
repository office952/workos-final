import { spawnSync } from "node:child_process";
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
  "docs:check",
  "ci:classify",
  "cursor:harness:test",
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

const PS_READONLY_FILTER_CMDLETS = new Set([
  "select-string",
  "select-object",
]);

const PS_ARTIFACT_WRITE_CMDLETS = new Set([
  "new-item",
  "set-content",
  "out-file",
]);

export const REFORMULATE_AGENT_MESSAGE =
  "Unsupported command formulation. Reformulate as a safe supported command and continue autonomously. Do not ask the Owner for command approval.";

export const HOOK_PERMISSIONS = Object.freeze(["allow", "deny"]);

export function finalizeHookDecision(decision) {
  if (decision && decision.permission === "allow") {
    return {
      permission: "allow",
      category: decision.category ?? "verification",
      agentMessage: decision.agentMessage ?? "Classified command is allowed.",
    };
  }
  return {
    permission: "deny",
    category: decision?.category ?? "uncertain",
    agentMessage: decision?.agentMessage || REFORMULATE_AGENT_MESSAGE,
  };
}

export function hookPermissionAskCount(decisions) {
  return decisions.filter((decision) => decision?.permission === "ask").length;
}

function decision(permission, category, agentMessage) {
  return finalizeHookDecision({ permission, category, agentMessage });
}

function findToolIndex(tokens, names) {
  return tokens.findIndex((token) => names.has(basename(token)));
}

function skipGitGlobals(args) {
  const remaining = [];
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (
      token === "-C" ||
      token === "--git-dir" ||
      token === "--work-tree" ||
      token === "-c" ||
      token === "--config"
    ) {
      index += 1;
      continue;
    }
    if (
      token.startsWith("--git-dir=") ||
      token.startsWith("--work-tree=") ||
      token.startsWith("--config=")
    ) {
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

function hasRepositoryRedirection(tokens) {
  const gitIndex = findToolIndex(tokens, new Set(["git"]));
  if (gitIndex < 0) {
    return false;
  }
  const args = tokens.slice(gitIndex + 1);
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    const lower = token.toLowerCase();
    if (token === "-C" || (token.startsWith("-C") && !token.startsWith("--") && token.length > 2)) {
      return true;
    }
    if (token === "--git-dir" || token === "--work-tree") {
      return true;
    }
    if (token.startsWith("--git-dir=") || token.startsWith("--work-tree=")) {
      return true;
    }
    if (lower === "-c" || lower === "--config") {
      const value = String(args[index + 1] ?? "").toLowerCase();
      if (value.startsWith("core.worktree") || value.startsWith("core.gitdir")) {
        return true;
      }
      index += 1;
      continue;
    }
    if (lower.startsWith("--config=core.worktree") || lower.startsWith("--config=core.gitdir")) {
      return true;
    }
    if (lower.startsWith("-c") && lower.length > 2 && (lower.startsWith("-ccore.worktree") || lower.startsWith("-ccore.gitdir"))) {
      return true;
    }
    if (token.startsWith("-")) {
      continue;
    }
    break;
  }
  return false;
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

const COMMIT_VALUE_FLAGS = new Set([
  "-m",
  "--message",
  "-f",
  "--file",
  "-c",
  "-C",
  "--reedit-message",
  "--reuse-message",
  "--template",
  "--author",
  "--date",
  "--cleanup",
]);

function isHistoryRewriteCommit(tokens) {
  if (gitSubcommand(tokens) !== "commit") {
    return false;
  }
  const after = gitSubcommandArgs(tokens);
  for (let index = 0; index < after.length; index += 1) {
    const token = after[index];
    const lower = token.toLowerCase();
    if (COMMIT_VALUE_FLAGS.has(lower)) {
      index += 1;
      continue;
    }
    if (
      lower.startsWith("--message=") ||
      lower.startsWith("--file=") ||
      lower.startsWith("--template=") ||
      lower.startsWith("--author=") ||
      lower.startsWith("--date=") ||
      lower.startsWith("--cleanup=")
    ) {
      continue;
    }
    if (
      lower === "--amend" ||
      lower === "--fixup" ||
      lower === "--squash" ||
      lower.startsWith("--fixup=") ||
      lower.startsWith("--squash=")
    ) {
      return true;
    }
  }
  return false;
}

function isAllowedGitCommit(tokens) {
  return gitSubcommand(tokens) === "commit" && !isHistoryRewriteCommit(tokens);
}

function isGitAliasOverride(tokens) {
  if (findToolIndex(tokens, new Set(["git"])) < 0) {
    return false;
  }
  const args = gitArgs(tokens);
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    const lower = token.toLowerCase();
    if (lower === "-c" || lower === "--config") {
      const value = String(args[index + 1] ?? "").toLowerCase();
      if (value.startsWith("alias.")) {
        return true;
      }
    }
    if (lower.startsWith("-calias.")) {
      return true;
    }
    if (lower.startsWith("--config=") && lower.slice("--config=".length).startsWith("alias.")) {
      return true;
    }
  }
  return false;
}

function readCurrentBranch(cwd) {
  if (typeof cwd !== "string" || cwd.trim().length === 0) {
    return "";
  }
  const result = spawnSync("git", ["-C", cwd, "branch", "--show-current"], {
    encoding: "utf8",
    timeout: 5000,
    windowsHide: true,
  });
  if (result.status !== 0) {
    return "";
  }
  return String(result.stdout ?? "").trim();
}

function resolveCurrentBranch(options = {}) {
  try {
    if (typeof options.resolveCurrentBranch === "function") {
      return String(options.resolveCurrentBranch(options.cwd) ?? "").trim();
    }
    return readCurrentBranch(options.cwd);
  } catch {
    return "";
  }
}

function isProtectedCurrentBranch(branch) {
  const value = String(branch ?? "").trim().toLowerCase();
  return value === "main" || value === "master";
}

function classifyHeadPush(options) {
  const branch = resolveCurrentBranch(options);
  if (branch.length === 0) {
    return decision(
      "deny",
      "destructive",
      "Current branch could not be resolved safely.",
    );
  }
  if (isProtectedCurrentBranch(branch)) {
    return decision(
      "deny",
      "destructive",
      "Direct push to main or master is blocked.",
    );
  }
  return decision(
    "allow",
    "verification",
    "Ordinary repository-local git workflow is allowed.",
  );
}

function isAllowedGitFetch(tokens) {
  return gitSubcommand(tokens) === "fetch";
}

const PUSH_VALUE_FLAGS = new Set([
  "--repo",
  "--exec",
  "--receive-pack",
  "--push-option",
  "--signed",
  "-o",
]);

function collectPushPositionals(tokens) {
  const after = gitSubcommandArgs(tokens);
  const positionals = [];
  for (let index = 0; index < after.length; index += 1) {
    const token = after[index];
    if (token.startsWith("--") && token.includes("=")) {
      continue;
    }
    if (PUSH_VALUE_FLAGS.has(token.toLowerCase())) {
      index += 1;
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    positionals.push(token);
  }
  return positionals;
}

function isProtectedBranchRef(rawRef) {
  const value = String(rawRef ?? "").replace(/^\+/, "");
  if (
    value === "main" ||
    value === "master" ||
    value === "refs/heads/main" ||
    value === "refs/heads/master"
  ) {
    return true;
  }
  const dest = value.includes(":") ? value.slice(value.indexOf(":") + 1) : value;
  if (
    dest === "main" ||
    dest === "master" ||
    dest === "refs/heads/main" ||
    dest === "refs/heads/master"
  ) {
    return true;
  }
  const base = dest.split("/").pop();
  return base === "main" || base === "master";
}

function isDirectMainPush(tokens) {
  if (gitSubcommand(tokens) !== "push") {
    return false;
  }
  const positionals = collectPushPositionals(tokens);
  if (positionals.length === 0) {
    return false;
  }
  if (positionals.length === 1) {
    return isProtectedBranchRef(positionals[0]);
  }
  return positionals.slice(1).some((refspec) => isProtectedBranchRef(refspec));
}

function featurePushDestination(tokens) {
  const after = gitSubcommandArgs(tokens);
  let index = 0;
  if (after[index] === "-u" || after[index] === "--set-upstream") {
    index += 1;
  }
  if (after.length !== index + 2 || after[index] !== "origin") {
    return null;
  }
  return after[index + 1];
}

function isAllowedFeatureBranchPush(tokens) {
  if (gitSubcommand(tokens) !== "push") {
    return false;
  }
  if (isForcePush(tokens) || isDirectMainPush(tokens)) {
    return false;
  }
  const dest = featurePushDestination(tokens);
  if (!dest) {
    return false;
  }
  if (isProtectedBranchRef(dest)) {
    return false;
  }
  return dest === "HEAD" || !dest.startsWith(":");
}

const GH_VALUE_FLAGS = new Set(["-r", "--repo", "--hostname"]);

function ghPositionals(tokens) {
  if (basename(tokens[0] ?? "") !== "gh") {
    return [];
  }
  const positionals = [];
  const args = tokens.slice(1);
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token.startsWith("--") && token.includes("=")) {
      continue;
    }
    if (GH_VALUE_FLAGS.has(token.toLowerCase())) {
      index += 1;
      continue;
    }
    if (token.startsWith("-")) {
      continue;
    }
    positionals.push(token);
  }
  return positionals;
}

function isGhPrMerge(tokens) {
  const positionals = ghPositionals(tokens);
  return positionals[0] === "pr" && positionals[1] === "merge";
}

function isGhApiMerge(tokens) {
  if (basename(tokens[0] ?? "") !== "gh") {
    return false;
  }
  const positionals = ghPositionals(tokens);
  if (positionals[0] !== "api") {
    return false;
  }
  const text = tokens.join(" ").toLowerCase();
  if (/\/pulls\/\d+\/merge\b/.test(text) || /\/merges\b/.test(text)) {
    return true;
  }
  return (
    positionals.includes("graphql") &&
    /merge(pullrequest|branch)\b/.test(text)
  );
}

function isAllowedGhWorkflow(tokens) {
  const positionals = ghPositionals(tokens);
  if (
    positionals[0] === "pr" &&
    (positionals[1] === "create" ||
      positionals[1] === "view" ||
      positionals[1] === "checks")
  ) {
    return true;
  }
  return (
    positionals[0] === "run" &&
    (positionals[1] === "view" ||
      positionals[1] === "list" ||
      positionals[1] === "watch")
  );
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

function hasPowerShellScriptblock(tokens) {
  return tokens.some((token) => token.includes("{") || token.includes("}"));
}

function isAllowedReadOnlyFilterCmdlet(tokens) {
  const name = basename(tokens[0] ?? "");
  if (!PS_READONLY_FILTER_CMDLETS.has(name)) {
    return false;
  }
  if (tokens.some((token) => isInvokeExpressionToken(token))) {
    return false;
  }
  if (hasPowerShellScriptblock(tokens)) {
    return false;
  }
  return true;
}

function isAllowedPowerShellCmdlet(tokens) {
  const name = basename(tokens[0] ?? "");
  if (isAllowedReadOnlyFilterCmdlet(tokens)) {
    return true;
  }
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
  return permission === "deny" ? 1 : 0;
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

function hasNodeInjectionFlag(tokens) {
  return (
    hasEvalFlag(
      tokens,
      new Set(["node"]),
      new Set(["-e", "--eval", "-p", "--print", "--import", "--require", "-r"]),
    ) ||
    tokens.some((token) => {
      const lower = token.toLowerCase();
      return lower.startsWith("--input-type");
    })
  );
}

function isDangerousCheckoutFlag(token) {
  const lower = String(token ?? "").toLowerCase();
  return (
    lower === "-f" ||
    lower === "--force" ||
    lower === "--ours" ||
    lower === "--theirs" ||
    lower === "-m" ||
    lower === "--merge" ||
    lower === "--conflict" ||
    lower.startsWith("--conflict=") ||
    lower === "--discard-changes" ||
    lower === "--patch" ||
    lower === "-p"
  );
}

function isAllowedFeatureBranchCreate(tokens) {
  const git = gitSubcommand(tokens);
  const after = gitSubcommandArgs(tokens);
  if (after.some((token) => isDangerousCheckoutFlag(token))) {
    return false;
  }
  if (git === "checkout") {
    const index = after.findIndex((token) => token === "-b" || token === "-B");
    if (index < 0) {
      return false;
    }
    const name = after[index + 1];
    return Boolean(name) && !name.startsWith("-") && !isProtectedBranchRef(name);
  }
  if (git === "switch") {
    const index = after.findIndex((token) => token === "-c" || token === "-C");
    if (index < 0) {
      return false;
    }
    const name = after[index + 1];
    return Boolean(name) && !name.startsWith("-") && !isProtectedBranchRef(name);
  }
  return false;
}

function isAllowedPathCheckout(tokens) {
  if (gitSubcommand(tokens) !== "checkout") {
    return false;
  }
  const after = gitSubcommandArgs(tokens);
  if (after.some((token) => isDangerousCheckoutFlag(token))) {
    return false;
  }
  const separator = after.indexOf("--");
  if (separator < 0) {
    return false;
  }
  const pathspecs = after.slice(separator + 1);
  return (
    pathspecs.length > 0 &&
    pathspecs.every((token) => token.length > 0 && !token.startsWith("-"))
  );
}

function isGitMergeOrRebase(tokens) {
  const git = gitSubcommand(tokens);
  return git === "merge" || git === "rebase";
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
  if (hasNodeInjectionFlag(tokens)) {
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

function classifySegment(command, options = {}) {
  const tokens = tokenize(unwrapCommand(command));
  if (tokens.length === 0) {
    return decision("deny", "uncertain", REFORMULATE_AGENT_MESSAGE);
  }

  if (isGitAliasOverride(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Git alias overrides are blocked because they can hide destructive commands.",
    );
  }
  if (isForcePush(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Force-push and +refspec pushes are blocked.",
    );
  }
  if (isDirectMainPush(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Direct push to main or master is blocked.",
    );
  }
  if (isGhPrMerge(tokens) || isGhApiMerge(tokens)) {
    return decision(
      "deny",
      "destructive",
      "Pull request merge remains Owner-gated.",
    );
  }
  if (isHistoryRewriteCommit(tokens)) {
    return decision(
      "deny",
      "destructive",
      "git commit --amend / --fixup / --squash is blocked.",
    );
  }
  if (isGitMergeOrRebase(tokens)) {
    return decision(
      "deny",
      "destructive",
      "git merge and git rebase remain Owner-gated.",
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
    if (isAllowedGitBranchShow(tokens)) {
      return decision(
        "allow",
        "verification",
        "Ordinary repository-local git workflow is allowed.",
      );
    }
    if (git === "worktree" && gitSubcommandArgs(tokens)[0] === "list") {
      return decision(
        "allow",
        "readonly",
        "Readonly git inspection is allowed.",
      );
    }
    if (hasRepositoryRedirection(tokens)) {
      return decision(
        "deny",
        "destructive",
        "State-changing git with -C / --git-dir / --work-tree is blocked. Run it from the intended WorkOS worktree.",
      );
    }
    if (isAllowedFeatureBranchPush(tokens)) {
      if (featurePushDestination(tokens) === "HEAD") {
        return classifyHeadPush(options);
      }
      return decision(
        "allow",
        "verification",
        "Ordinary repository-local git workflow is allowed.",
      );
    }
    if (
      isAllowedGitAdd(tokens) ||
      isAllowedUnstageReset(tokens) ||
      isAllowedGitBranchShow(tokens) ||
      isAllowedHashObject(tokens) ||
      isAllowedGitCommit(tokens) ||
      isAllowedGitFetch(tokens) ||
      isAllowedFeatureBranchCreate(tokens) ||
      isAllowedPathCheckout(tokens)
    ) {
      return decision(
        "allow",
        "verification",
        "Ordinary repository-local git workflow is allowed.",
      );
    }
    return decision("deny", "uncertain", REFORMULATE_AGENT_MESSAGE);
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

  if (isAllowedGhWorkflow(tokens)) {
    return decision(
      "allow",
      "verification",
      "Classified GitHub CLI workflow command is allowed.",
    );
  }

  return decision("deny", "uncertain", REFORMULATE_AGENT_MESSAGE);
}

export function classifyShellCommand(command, options = {}) {
  if (typeof command !== "string" || command.trim().length === 0) {
    return decision("deny", "uncertain", REFORMULATE_AGENT_MESSAGE);
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
    return classifySegment(unwrapped, options);
  }
  return mergeDecisions(
    segments.map((segment) => classifySegment(segment, options)),
  );
}
