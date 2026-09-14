import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const officialKeys = new Set([
  "name",
  "description",
  "model",
  "readonly",
  "is_background",
]);

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, "agent file must have YAML frontmatter");
  const keys = [];
  for (const line of match[1].split(/\r?\n/)) {
    const keyMatch = line.match(/^([A-Za-z0-9_]+):/);
    if (keyMatch) {
      keys.push(keyMatch[1]);
    }
  }
  return keys;
}

test("custom agents use only official frontmatter keys and are readonly", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const files = readdirSync(dir).filter((name) => name.endsWith(".md"));
  assert.deepEqual(
    files.sort(),
    [
      "workos-product-truth-reviewer.md",
      "workos-red-team.md",
      "workos-runtime-evidence-reviewer.md",
    ].sort(),
  );
  for (const file of files) {
    const keys = parseFrontmatter(readFileSync(join(dir, file), "utf8"));
    for (const key of keys) {
      assert.equal(officialKeys.has(key), true, `${file} has unsupported key ${key}`);
    }
    assert.equal(keys.includes("readonly"), true, `${file} must set readonly`);
    assert.match(
      readFileSync(join(dir, file), "utf8"),
      /^readonly:\s*true$/m,
      `${file} must set readonly: true`,
    );
  }
});
