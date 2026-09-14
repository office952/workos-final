import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CATASTROPHIC_COMMAND_MATCHER,
  matchesCatastrophicCommand,
} from "./lib/catastrophic-matcher.mjs";

test("hooks.json fail-closed matcher matches the shared regex", () => {
  const hooks = JSON.parse(
    readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "hooks.json"), "utf8"),
  );
  const failClosed = hooks.hooks.beforeShellExecution.find(
    (hook) => hook.failClosed === true,
  );
  const general = hooks.hooks.beforeShellExecution.find(
    (hook) => hook.failClosed === false,
  );
  assert.ok(failClosed);
  assert.ok(general);
  assert.equal(failClosed.command, "node .cursor/hooks/catastrophic-deny.mjs");
  assert.equal(general.command, "node .cursor/hooks/before-shell.mjs");
  assert.equal(failClosed.matcher, CATASTROPHIC_COMMAND_MATCHER);
});

test("catastrophic matcher misses ordinary commands", () => {
  assert.equal(matchesCatastrophicCommand("git status"), false);
  assert.equal(matchesCatastrophicCommand("git commit --dry-run"), false);
  assert.equal(matchesCatastrophicCommand("git push origin HEAD"), false);
  assert.equal(matchesCatastrophicCommand("pnpm lint"), false);
  assert.equal(matchesCatastrophicCommand("pnpm e2e"), false);
  assert.equal(
    matchesCatastrophicCommand("node .cursor/run-isolated-e2e.mjs"),
    false,
  );
  assert.equal(
    matchesCatastrophicCommand('git commit -m "reset letter height"'),
    false,
  );
  assert.equal(
    matchesCatastrophicCommand('git commit -m "git push --force"'),
    false,
  );
  assert.equal(
    matchesCatastrophicCommand("git checkout -b chore/cursor-push-docs"),
    false,
  );
});

test("catastrophic matcher hits high-confidence destructive commands", () => {
  assert.equal(matchesCatastrophicCommand("git push --force origin main"), true);
  assert.equal(matchesCatastrophicCommand("git push --force-with-lease"), true);
  assert.equal(matchesCatastrophicCommand("git push -f origin main"), true);
  assert.equal(matchesCatastrophicCommand("git push -uf origin main"), true);
  assert.equal(matchesCatastrophicCommand("git push -fu origin main"), true);
  assert.equal(matchesCatastrophicCommand("git push origin +main"), true);
  assert.equal(matchesCatastrophicCommand("GIT PUSH --FORCE origin main"), true);
  assert.equal(matchesCatastrophicCommand("git reset --hard HEAD"), true);
  assert.equal(matchesCatastrophicCommand("git clean -f"), true);
  assert.equal(matchesCatastrophicCommand("git clean -fd"), true);
  assert.equal(matchesCatastrophicCommand("git clean -xdf"), true);
  assert.equal(matchesCatastrophicCommand("git clean --force"), true);
  assert.equal(matchesCatastrophicCommand("rm -rf data"), true);
  assert.equal(matchesCatastrophicCommand("Remove-Item -Recurse .tmp"), true);
  assert.equal(matchesCatastrophicCommand("rmdir /s temp"), true);
  assert.equal(
    matchesCatastrophicCommand('node -e "git push --force origin main"'),
    true,
  );
});
