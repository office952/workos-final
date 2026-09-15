import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { classifyShellCommand } from "./lib/classify-shell.mjs";
import { matchesCatastrophicCommand } from "./lib/catastrophic-matcher.mjs";
import { createAuditRecord } from "./lib/audit-write.mjs";
import { parseHookInput } from "./lib/parse-hook-input.mjs";

const hookRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(hookRoot, "..", "..");
const featureBranchOptions = {
  resolveCurrentBranch: () => "chore/cursor-workos-harness-v2",
};

function permission(command, options = featureBranchOptions) {
  return classifyShellCommand(command, options).permission;
}

function resolvedRepoBranch() {
  const result = spawnSync("git", ["-C", repoRoot, "branch", "--show-current"], {
    encoding: "utf8",
    timeout: 5000,
    windowsHide: true,
  });
  return String(result.stdout ?? "").trim();
}

function expectedOriginHeadPushPermission() {
  const branch = resolvedRepoBranch().toLowerCase();
  if (branch.length === 0 || branch === "main" || branch === "master") {
    return "deny";
  }
  return "allow";
}

function isOriginHeadPush(command) {
  return (
    command === "git push origin HEAD" ||
    command === "git push -u origin HEAD" ||
    command === "git push --set-upstream origin HEAD"
  );
}

function hookPermission(command, cwd = repoRoot) {
  const result = spawnSync(process.execPath, [join(hookRoot, "before-shell.mjs")], {
    input: `${JSON.stringify({ command, cwd })}\n`,
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout.trim()).permission;
}

test("readonly git is allowed", () => {
  assert.equal(permission("git status"), "allow");
  assert.equal(permission("git diff --stat HEAD"), "allow");
  assert.equal(permission("git log -1 --oneline"), "allow");
  assert.equal(permission("git --no-pager show HEAD"), "allow");
  assert.equal(permission("git -C repo status --short"), "allow");
  assert.equal(permission("git -C other-repo diff --stat"), "allow");
  assert.equal(permission("git -C other-repo log -1"), "allow");
  assert.equal(permission("git -C other-repo show HEAD"), "allow");
  assert.equal(permission("git -C other-repo rev-parse HEAD"), "allow");
  assert.equal(permission("git rev-parse HEAD"), "allow");
  assert.equal(permission("git hash-object file.txt"), "allow");
  assert.notEqual(permission("git hash-object -w file.txt"), "allow");
  assert.notEqual(permission("git hash-object --literally file.txt"), "allow");
  assert.equal(permission("git branch --show-current"), "allow");
});

test("verification commands are allowed", () => {
  assert.equal(permission("pnpm lint"), "allow");
  assert.equal(permission("pnpm typecheck"), "allow");
  assert.equal(permission("pnpm test"), "allow");
  assert.equal(permission("pnpm build"), "allow");
  assert.equal(permission("pnpm docs:check"), "allow");
  assert.equal(permission("pnpm ci:classify"), "allow");
  assert.equal(permission("pnpm cursor:harness:test"), "allow");
  assert.equal(permission("pnpm -r typecheck"), "allow");
  assert.equal(permission("pnpm --filter @workos-final/web test"), "allow");
  assert.equal(permission("node --test .cursor/hooks/classify-shell.test.mjs"), "allow");
  assert.equal(permission("pnpm install --frozen-lockfile"), "allow");
});

test("commit and normal HEAD push are allowed", () => {
  assert.equal(permission("git commit -m freeze"), "allow");
  assert.equal(
    permission(
      'git -c user.name=office952 -c user.email=office@p-media.ro commit -m "chore(cursor): add WorkOS Harness V2"',
    ),
    "allow",
  );
  assert.notEqual(permission("git commit --amend"), "allow");
  assert.notEqual(permission("git commit --amend --no-edit"), "allow");
  assert.notEqual(permission("git commit --fixup HEAD"), "allow");
  assert.notEqual(permission("git commit --squash HEAD"), "allow");
  assert.equal(permission("git fetch origin"), "allow");
  assert.equal(permission("git push origin HEAD"), "allow");
  assert.equal(permission("git push -u origin HEAD"), "allow");
  assert.equal(permission("git push --set-upstream origin HEAD"), "allow");
  assert.equal(permission("git push -u origin chore/cursor-workos-harness-v2"), "allow");
  assert.equal(permission("git push -u origin HEAD:chore/workos-ci-tiering-v1"), "allow");
  assert.equal(permission("git worktree list"), "allow");
  assert.equal(permission("git worktree add C:/tmp/x origin/main"), "ask");
  assert.equal(permission("git worktree remove C:/tmp/x"), "ask");
});

test("chained readonly git cannot hide a force push", () => {
  assert.equal(permission("git status && git push --force"), "deny");
  assert.equal(permission("git status\ngit push --force"), "deny");
  assert.equal(permission("git push -uf origin main"), "deny");
  assert.equal(permission("git push origin +main"), "deny");
  assert.equal(permission("git log; git reset --hard HEAD"), "deny");
  assert.equal(permission("git diff & git clean -fd"), "deny");
  assert.equal(
    permission('powershell -NoProfile -Command "git status && git push --force"'),
    "deny",
  );
});

test("opaque wrappers are deny because ASK is not a security gate", () => {
  assert.equal(permission("powershell -EncodedCommand RwBpAHQA"), "deny");
  assert.equal(permission("powershell -enc RwBpAHQA"), "deny");
  assert.equal(permission("Invoke-Expression Get-Process"), "deny");
  assert.equal(permission("iex Get-Date"), "deny");
  assert.equal(permission("powershell iex Get-Date"), "deny");
  assert.equal(permission("powershell -NoProfile iex Get-Date"), "deny");
  assert.equal(permission("pwsh Invoke-Expression Get-Date"), "deny");
  assert.equal(permission('node -e "console.log(1)"'), "deny");
  assert.equal(permission("node --eval console.log(1)"), "deny");
  assert.equal(permission('python -c "print(1)"'), "deny");
  assert.equal(permission('python3 -c "print(1)"'), "deny");
  assert.equal(permission('py -c "print(1)"'), "deny");
  assert.equal(permission('bash -c "pnpm lint"'), "deny");
  assert.equal(permission('sh -c "pnpm lint"'), "deny");
  assert.equal(
    permission('powershell -NoProfile -Command "git status"'),
    "allow",
  );
  assert.equal(permission('cmd /c "pnpm lint"'), "allow");
});

test("CAT_HOOK_FORCE_PUSH dedicated hook always denies", () => {
  const result = spawnSync(
    process.execPath,
    [join(hookRoot, "catastrophic-deny.mjs")],
    {
      input: `${JSON.stringify({ command: "git push --force origin main" })}\n`,
      encoding: "utf8",
      cwd: join(hookRoot, "..", ".."),
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout.trim());
  assert.equal(payload.permission, "deny");
  assert.equal(
    payload.agent_message,
    "Catastrophic shell operation blocked by WorkOS Harness.",
  );
  assert.equal(payload.permission === "ask", false);
  assert.equal(result.stdout.includes("push"), false);
});

test("CAT_HOOK_NODE_E_PLAINTEXT_FORCE_PUSH is deny if matcher triggered", () => {
  const command = 'node -e "git push --force origin main"';
  assert.equal(matchesCatastrophicCommand(command), true);
  assert.equal(permission(command), "deny");
  const result = spawnSync(
    process.execPath,
    [join(hookRoot, "catastrophic-deny.mjs")],
    {
      input: `${JSON.stringify({ command })}\n`,
      encoding: "utf8",
      cwd: join(hookRoot, "..", ".."),
    },
  );
  assert.equal(JSON.parse(result.stdout.trim()).permission, "deny");
});

test("force push and hard reset deny", () => {
  assert.equal(permission("git push --force origin main"), "deny");
  assert.equal(permission("GIT PUSH --FORCE origin main"), "deny");
  assert.equal(permission("git push --force-with-lease"), "deny");
  assert.equal(permission("git push -f origin main"), "deny");
  assert.equal(permission("git push origin +main:refs/heads/main"), "deny");
  assert.equal(permission("git reset --hard HEAD"), "deny");
  assert.equal(permission("git clean -fd"), "deny");
  assert.equal(permission("rm -rf data"), "deny");
  assert.equal(permission("Remove-Item -Recurse -Force .tmp"), "deny");
  assert.equal(permission("pnpm prisma migrate reset"), "deny");
  assert.equal(permission("pnpm --filter @workos-final/api cloud:provision"), "deny");
  assert.equal(permission("pnpm exec tsx src/cloud/devProvisionCli.ts"), "deny");
  assert.equal(permission("npx tsx apps/api/src/cloud/adoptCli.ts"), "deny");
});

test("does not treat reset in a commit message as destructive git reset", () => {
  assert.equal(permission('git commit -m "reset letter height"'), "allow");
});

test("does not treat push in a branch name as force push", () => {
  assert.equal(permission("git checkout -b chore/cursor-push-docs"), "ask");
});

test("direct Playwright entrypoints are denied and isolated runner is allowed", () => {
  assert.equal(permission("pnpm e2e"), "deny");
  assert.equal(permission("pnpm run e2e"), "deny");
  assert.equal(permission("npm run e2e"), "deny");
  assert.equal(permission("pnpm exec playwright test"), "deny");
  assert.equal(permission("pnpm dlx playwright test"), "deny");
  assert.equal(permission("pnpm playwright test"), "deny");
  assert.equal(permission("npx playwright test"), "deny");
  assert.equal(permission("npx @playwright/test test"), "deny");
  assert.equal(permission("playwright test"), "deny");
  assert.equal(
    permission("node node_modules/.bin/playwright test"),
    "deny",
  );
  assert.equal(permission("node .cursor/run-isolated-e2e.mjs"), "allow");
  assert.equal(
    permission("node .cursor/run-isolated-e2e.mjs --plan-only"),
    "allow",
  );
  assert.equal(
    permission("node .cursor/run-isolated-e2e.mjs --policy-only"),
    "allow",
  );
});

test("uncertain commands ask", () => {
  assert.equal(permission("pnpm install"), "ask");
  assert.equal(permission("echo hello"), "ask");
  assert.equal(permission(""), "ask");
});

test("audit-observed routine push refspec and gh run watch are allow", () => {
  assert.equal(
    classifyShellCommand("git push origin HEAD:chore/workos-ci-tiering-v1", featureBranchOptions)
      .permission,
    "allow",
  );
  assert.equal(
    classifyShellCommand("gh run watch 34930213292 --repo office952/workos-final --exit-status")
      .permission,
    "allow",
  );
  assert.equal(hookPermission("git push origin HEAD:chore/workos-ci-tiering-v1"), "allow");
  assert.equal(hookPermission("gh run watch 34930213292 --exit-status"), "allow");
  assert.equal(permission("git push origin HEAD:main"), "deny");
  assert.equal(permission("git push --force origin HEAD"), "deny");
  assert.equal(permission("gh pr merge 25"), "deny");
});

test("Owner-observed gh log Select-String pipeline is allow", () => {
  assert.equal(
    classifyShellCommand(
      'gh run view 34927727668 --log | Select-String -Pattern "CI_TIER"',
    ).permission,
    "allow",
  );
  assert.equal(permission('Select-String -Pattern "CI_TIER"'), "allow");
  assert.equal(hookPermission('gh run view 34927727668 --log | Select-String -Pattern "CI_TIER"'), "allow");
  assert.equal(permission("echo hello"), "ask");
  assert.equal(permission("Select-Object -Property { $_.Name }"), "ask");
  assert.equal(permission("gh pr merge 25 | Select-String -Pattern x"), "deny");
});

test("BOM and wrapper parsing", () => {
  const parsed = parseHookInput(
    `\uFEFF${JSON.stringify({ command: "git status" })}`,
  );
  assert.equal(parsed.ok, true);
  assert.equal(permission('powershell -NoProfile -Command "git status"'), "allow");
  assert.equal(permission('cmd /c "pnpm lint"'), "allow");
});

test("audit records omit command and secrets", () => {
  const record = createAuditRecord({
    event: "beforeShellExecution",
    permission: "deny",
    category: "destructive",
    command: "git push --force SECRET=abc",
    task: "do not store",
  });
  const serialized = JSON.stringify(record);
  assert.equal(Object.hasOwn(record, "command"), false);
  assert.equal(serialized.includes("SECRET"), false);
  assert.equal(serialized.includes("force"), false);
});

test("before-shell hook emits valid JSON and does not execute the command", () => {
  const result = spawnSync(
    process.execPath,
    [join(hookRoot, "before-shell.mjs")],
    {
      input: `${JSON.stringify({ command: "git push --force origin main" })}\n`,
      encoding: "utf8",
      cwd: join(hookRoot, "..", ".."),
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout.trim());
  assert.equal(payload.permission, "deny");
  assert.equal(result.stdout.includes("SECRET"), false);
});

test("ordinary review workflow commands are allowed", () => {
  assert.equal(permission("git add ."), "allow");
  assert.equal(permission("git add -- AGENTS.md docs/file.md"), "allow");
  assert.equal(permission("git reset"), "allow");
  assert.equal(permission("git reset HEAD"), "allow");
  assert.equal(permission("git reset -- file"), "allow");
  assert.equal(permission("git reset HEAD -- file"), "allow");
  assert.equal(permission("git reset -q HEAD -- file"), "allow");
  assert.notEqual(permission("git reset main"), "allow");
  assert.notEqual(permission("git reset develop"), "allow");
  assert.notEqual(permission("git reset origin/main"), "allow");
  assert.notEqual(permission("git reset v1"), "allow");
  assert.notEqual(permission("git reset HEAD~1"), "allow");
  assert.notEqual(permission("git reset HEAD^"), "allow");
  assert.notEqual(permission("git reset abcdef0"), "allow");
  assert.notEqual(permission("git reset --soft HEAD"), "allow");
  assert.notEqual(permission("git reset --mixed HEAD"), "allow");
  assert.notEqual(permission("git reset --merge"), "allow");
  assert.notEqual(permission("git reset --keep"), "allow");
  assert.equal(permission("git reset --hard HEAD"), "deny");
  assert.equal(permission("Get-FileHash .tmp/review.patch"), "allow");
  assert.equal(permission("Get-Item .tmp/review.patch"), "allow");
  assert.equal(
    permission("New-Item -ItemType Directory -Force -Path .tmp"),
    "allow",
  );
  assert.equal(
    permission("New-Item -ItemType Directory -Force -Path .tmp/review"),
    "allow",
  );
  assert.equal(
    permission("Set-Content -Path .tmp/hash.txt -Value abc"),
    "allow",
  );
  assert.equal(permission('Write-Output "abc"'), "allow");
  assert.equal(
    permission("New-Item -ItemType Directory -Force -Path .tmp | Out-Null"),
    "allow",
  );
  assert.equal(permission("Test-Path .tmp/review.patch"), "allow");
  assert.equal(
    permission("Out-File -FilePath .tmp/hash.txt -InputObject abc"),
    "allow",
  );
  assert.notEqual(permission("Set-Content -Path ../file.txt -Value abc"), "allow");
  assert.notEqual(permission("Set-Content -Path AGENTS.md -Value abc"), "allow");
  assert.notEqual(permission("Set-Content -Path C:\\temp\\x.txt -Value abc"), "allow");
  assert.notEqual(permission("Out-File -FilePath D:\\x.txt -InputObject abc"), "allow");
  assert.notEqual(permission("New-Item -Path ..\\outside"), "allow");
});

test("previous review workflow classifies allow without ASK", () => {
  const commands = [
    "New-Item -ItemType Directory -Force -Path .tmp | Out-Null",
    "git add -- AGENTS.md docs/CURSOR_PLUGINS.md docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md docs/worklog/WORKOS_CURSOR_HARNESS_V2_IMPLEMENTED_LOCAL_IN_REVIEW.md .cursor/agents .cursor/hooks.json .cursor/hooks .cursor/lib .cursor/rules/agent-orchestration.mdc .cursor/run-isolated-e2e.mjs .cursor/run-isolated-e2e.test.mjs .cursor/setup-worktree.mjs .cursor/setup-worktree.test.mjs .cursor/worktrees.json",
    "git diff --cached --stat",
    "git diff --cached --no-ext-diff --output=.tmp/HARNESS_V2_REVIEW.patch",
    "git reset",
    "Get-FileHash -Algorithm SHA256 .tmp/HARNESS_V2_REVIEW.patch",
    "Set-Content -Path .tmp/HARNESS_V2_REVIEW_SHA256.txt -Value abc -NoNewline",
    'Write-Output "REVIEW_PATCH_SHA256=abc"',
    "git status --short",
  ];
  const approvals = commands.filter((command) => permission(command) === "ask");
  assert.deepEqual(approvals, []);
  for (const command of commands) {
    const result = spawnSync(
      process.execPath,
      [join(hookRoot, "before-shell.mjs")],
      {
        input: `${JSON.stringify({ command })}\n`,
        encoding: "utf8",
        cwd: join(hookRoot, "..", ".."),
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout.trim()).permission, "allow", command);
  }
});

test("invalid hook JSON denies instead of asking", () => {
  const result = spawnSync(
    process.execPath,
    [join(hookRoot, "before-shell.mjs")],
    {
      input: "not-json",
      encoding: "utf8",
      cwd: join(hookRoot, "..", ".."),
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout.trim());
  assert.equal(payload.permission, "deny");
  assert.equal(
    payload.agent_message,
    "Shell command could not be parsed safely. Reformulate as a direct supported command.",
  );
});

test("worktrees.json, hooks.json, and permissions.json parse", () => {
  const cursorDir = join(hookRoot, "..");
  JSON.parse(readFileSync(join(cursorDir, "hooks.json"), "utf8"));
  JSON.parse(readFileSync(join(cursorDir, "worktrees.json"), "utf8"));
  const permissions = JSON.parse(
    readFileSync(join(cursorDir, "permissions.json"), "utf8"),
  );
  assert.equal(Array.isArray(permissions.terminalAllowlist), true);
  assert.equal(Object.hasOwn(permissions, "mcpAllowlist"), false);
  const forbidden = new Set([
    "git",
    "git add",
    "git commit",
    "git push",
    "git push origin HEAD",
    "git push -u origin HEAD",
    "gh",
    "gh pr",
    "gh pr create",
    "pnpm",
    "node",
  ]);
  for (const entry of permissions.terminalAllowlist) {
    assert.equal(forbidden.has(entry), false, `broad or mutating allowlist entry: ${entry}`);
  }
  for (const required of [
    "git status",
    "git fetch",
    "pnpm lint",
    "pnpm cursor:harness:test",
    "node --test",
    "gh pr view",
    "gh pr checks",
    "gh run view",
    "gh run list",
    "gh run watch",
    "Select-String",
    "Select-Object",
    "git worktree list",
  ]) {
    assert.equal(
      permissions.terminalAllowlist.includes(required),
      true,
      `missing allowlist entry: ${required}`,
    );
  }
});

test("autonomy cleanup matrix", () => {
  assert.equal(permission("git commit -m message"), "allow");
  assert.notEqual(permission("git commit --amend"), "allow");
  assert.notEqual(permission("git commit --fixup HEAD"), "allow");
  assert.notEqual(permission("git commit --squash HEAD"), "allow");
  assert.equal(permission("git push origin HEAD"), "allow");
  assert.equal(permission("git push -u origin HEAD"), "allow");
  assert.equal(
    permission("git push origin HEAD", { resolveCurrentBranch: () => "main" }),
    "deny",
  );
  assert.equal(
    permission("git push -u origin HEAD", { resolveCurrentBranch: () => "master" }),
    "deny",
  );
  assert.equal(
    permission("git push origin HEAD", { resolveCurrentBranch: () => "" }),
    "deny",
  );
  assert.equal(permission("git push origin main"), "deny");
  assert.equal(permission("git push origin master"), "deny");
  assert.equal(permission("git push main"), "deny");
  assert.equal(permission("git push origin HEAD:main"), "deny");
  assert.equal(permission("git push origin HEAD:master"), "deny");
  assert.equal(permission("git push -u origin HEAD:chore/workos-ci-tiering-v1"), "allow");
  assert.equal(permission("git push origin HEAD:chore/workos-ci-tiering-v1"), "allow");
  assert.equal(permission("git push -u origin chore/workos-ci-tiering-v1"), "allow");
  assert.equal(permission("gh run watch 34930213292 --repo office952/workos-final --exit-status"), "allow");
  assert.equal(permission("git worktree list"), "allow");
  assert.equal(permission("git push --force origin HEAD"), "deny");
  assert.equal(permission("git push --force-with-lease origin HEAD"), "deny");
  assert.equal(permission("gh pr create --title t --body b"), "allow");
  assert.equal(permission("gh pr view 25 --json url"), "allow");
  assert.equal(permission("gh pr checks 25"), "allow");
  assert.equal(permission("gh run view 123 --json status"), "allow");
  assert.equal(permission("gh run list --branch chore/x"), "allow");
  assert.equal(permission("gh run watch 34930213292 --exit-status"), "allow");
  assert.equal(
    permission('gh run view 34927727668 --log | Select-String -Pattern "CI_TIER"'),
    "allow",
  );
  assert.equal(permission('Select-String -Pattern "CI_TIER"'), "allow");
  assert.equal(permission("Select-Object -First 40"), "allow");
  assert.equal(
    permission(
      'gh run view 34927727668 --repo office952/workos-final --log | Select-String -Pattern "CI_TIER" | Select-Object -First 40',
    ),
    "allow",
  );
  assert.equal(permission("Select-Object -Property { $_.Name }"), "ask");
  assert.equal(permission("ForEach-Object { $_ }"), "ask");
  assert.equal(permission("gh pr merge 25"), "deny");
  assert.equal(permission("gh --repo office952/workos-final pr merge 25"), "deny");
  assert.equal(permission("gh pr --repo office952/workos-final merge 25"), "deny");
  assert.equal(permission("gh api repos/office952/workos-final/pulls/25/merge"), "deny");
  assert.equal(
    permission("gh api --method PUT /repos/office952/workos-final/pulls/25/merge"),
    "deny",
  );
  assert.equal(permission("gh api repos/office952/workos-final/merges"), "deny");
  assert.equal(
    permission(
      'gh api graphql -f query=mutation { mergePullRequest(input: {pullRequestId: "x"}) { clientMutationId } }',
    ),
    "deny",
  );
  assert.equal(
    permission('git -c alias.push="push --force" push origin HEAD'),
    "deny",
  );
  assert.equal(
    permission('git -c alias.commit="commit --amend" commit -m message'),
    "deny",
  );
  assert.equal(
    permission("gh --repo office952/workos-final pr view 25 --json url"),
    "allow",
  );
  assert.equal(permission("git reset --hard HEAD"), "deny");
  assert.equal(permission("git clean -fd"), "deny");
  assert.equal(permission('node -e "console.log(1)"'), "deny");
  assert.equal(permission("pnpm lint"), "allow");
  assert.equal(permission("pnpm typecheck"), "allow");
  assert.equal(permission("pnpm test"), "allow");
  assert.equal(permission("pnpm build"), "allow");
  assert.equal(permission("node .cursor/run-isolated-e2e.mjs"), "allow");
  assert.equal(permission("pnpm e2e"), "deny");
  assert.equal(permission("echo hello"), "ask");
  assert.equal(permission("git -C other-repo add ."), "deny");
  assert.equal(permission("git -C other-repo commit -m message"), "deny");
  assert.equal(permission("git -C other-repo reset"), "deny");
  assert.equal(permission("git -C other-repo push origin HEAD"), "deny");
  assert.equal(permission("git -Cother-repo push origin HEAD"), "deny");
  assert.equal(permission("git commit -C HEAD -m message"), "allow");
  assert.equal(permission("git --git-dir external/.git commit -m message"), "deny");
  assert.equal(permission("git --git-dir=external/.git commit -m message"), "deny");
  assert.equal(permission("git --work-tree external add ."), "deny");
  assert.equal(permission("git --work-tree=external add ."), "deny");
  assert.equal(
    permission(
      'git -c user.name=office952 -c user.email=office@p-media.ro commit -m "chore(cursor): close cross-repo git mutation bypass"',
    ),
    "allow",
  );
});

test("commit push PR workflow classifies allow without ASK", () => {
  const commands = [
    "git fetch origin",
    "git status --short",
    "git diff --stat",
    "git diff --name-only",
    "node --test .cursor/hooks/classify-shell.test.mjs .cursor/setup-worktree.test.mjs",
    "pnpm lint",
    "pnpm typecheck",
    "pnpm test",
    "pnpm cursor:harness:test",
    "pnpm build",
    "git add -- .cursor/permissions.json .cursor/hooks/lib/classify-shell.mjs",
    "git diff --cached --stat",
    "git diff --cached --name-only",
    "git diff --cached --check",
    'git -c user.name=office952 -c user.email=office@p-media.ro commit -m "chore(cursor): add WorkOS Harness V2"',
    "git rev-parse HEAD",
    "git log -1 --format=%H",
    "git push -u origin HEAD",
    "gh pr create --base main --head chore/cursor-workos-harness-v2 --title t --body b",
    "gh pr view 25 --json number,url,state,headRefOid",
    "gh run list --branch chore/cursor-workos-harness-v2 --limit 5",
    "gh run view 34904624451 --json headSha,status,conclusion",
    "gh run watch 34930213292 --exit-status",
    "git push origin HEAD:chore/workos-ci-tiering-v1",
    "git worktree list",
    'gh run view 34927727668 --log | Select-String -Pattern "CI_TIER"',
    'Select-String -Pattern "CI_TIER"',
  ];
  const approvals = commands.filter((command) => permission(command) === "ask");
  assert.deepEqual(approvals, []);
  for (const command of commands) {
    const expected = isOriginHeadPush(command)
      ? expectedOriginHeadPushPermission()
      : "allow";
    assert.equal(hookPermission(command), expected, command);
  }
  const headPush = expectedOriginHeadPushPermission();
  assert.equal(hookPermission("git push origin HEAD"), headPush);
  assert.equal(hookPermission("git push origin HEAD", ""), headPush);
  const omittedCwd = spawnSync(
    process.execPath,
    [join(hookRoot, "before-shell.mjs")],
    {
      input: `${JSON.stringify({ command: "git push origin HEAD" })}\n`,
      encoding: "utf8",
      cwd: repoRoot,
    },
  );
  assert.equal(omittedCwd.status, 0, omittedCwd.stderr);
  assert.equal(JSON.parse(omittedCwd.stdout.trim()).permission, headPush);
  assert.equal(
    classifyShellCommand("git push origin HEAD", { cwd: repoRoot }).permission,
    headPush,
  );
  assert.equal(classifyShellCommand("git push origin HEAD").permission, "deny");
});
