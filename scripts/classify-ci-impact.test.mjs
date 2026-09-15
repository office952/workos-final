import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TIER_1_DOCS,
  TIER_2_STATIC_LOGIC,
  TIER_3_RUNTIME_E2E,
  TIER_4_CONSERVATIVE_FULL,
  classifyCiImpact,
  classifyCiPath,
  checksForTier,
} from "./classify-ci-impact.mjs";

describe("classify-ci-impact", () => {
  it("CASE 1: docs-only markdown is docs tier without E2E", () => {
    const result = classifyCiImpact(["docs/README.md"]);
    assert.equal(result.tier, TIER_1_DOCS);
    assert.equal(result.runE2e, false);
    assert.equal(result.installChromium, false);
    assert.equal(result.runDocsCheck, true);
  });

  it("CASE 2: apps/web change is runtime E2E", () => {
    const result = classifyCiImpact(["apps/web/src/App.tsx"]);
    assert.equal(result.tier, TIER_3_RUNTIME_E2E);
    assert.equal(result.runE2e, true);
    assert.equal(result.runBuild, true);
  });

  it("CASE 3: apps/api change is runtime E2E", () => {
    const result = classifyCiImpact(["apps/api/src/server.ts"]);
    assert.equal(result.tier, TIER_3_RUNTIME_E2E);
    assert.equal(result.runE2e, true);
  });

  it("CASE 4: packages/domain change is runtime E2E", () => {
    const result = classifyCiImpact(["packages/domain/src/product/compiler.ts"]);
    assert.equal(result.tier, TIER_3_RUNTIME_E2E);
    assert.equal(result.runE2e, true);
  });

  it("CASE 5: GitHub workflow change is conservative full", () => {
    const result = classifyCiImpact([".github/workflows/ci.yml"]);
    assert.equal(result.tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(result.runE2e, true);
  });

  it("CASE 6: CI classifier change is conservative full", () => {
    const result = classifyCiImpact(["scripts/classify-ci-impact.mjs"]);
    assert.equal(result.tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiPath("scripts/classify-ci-impact.test.mjs"), TIER_4_CONSERVATIVE_FULL);
  });

  it("CASE 7: unknown executable path is conservative full", () => {
    const result = classifyCiImpact(["tools/unknown-bin.js"]);
    assert.equal(result.tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(result.reason === "HIGHEST_RISK_WINS" || result.tier === TIER_4_CONSERVATIVE_FULL, true);
  });

  it("CASE 8: ordinary worklog update is docs tier", () => {
    const result = classifyCiImpact([
      "docs/worklog/WORKOS_CI_TIERING_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md",
    ]);
    assert.equal(result.tier, TIER_1_DOCS);
    assert.equal(result.runE2e, false);
  });

  it("CASE 9: package.json or test harness is conservative full", () => {
    assert.equal(classifyCiImpact(["package.json"]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact(["pnpm-lock.yaml"]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact(["playwright.config.ts"]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact([".cursor/run-isolated-e2e.mjs"]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact([".cursor/hooks/lib/classify-shell.mjs"]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact(["apps/web/package.json"]).tier, TIER_4_CONSERVATIVE_FULL);
  });

  it("CASE 10: mixed paths take the highest-risk tier", () => {
    const result = classifyCiImpact([
      "docs/README.md",
      "scripts/verify-workos-docs-continuity.mjs",
      "apps/web/src/main.tsx",
    ]);
    assert.equal(result.tier, TIER_3_RUNTIME_E2E);
    assert.equal(result.runE2e, true);
  });

  it("never classifies apps/web, apps/api, or packages/domain as docs-only", () => {
    assert.equal(classifyCiPath("apps/web/README.md"), TIER_3_RUNTIME_E2E);
    assert.equal(classifyCiPath("apps/api/README.md"), TIER_3_RUNTIME_E2E);
    assert.equal(classifyCiPath("packages/domain/README.md"), TIER_3_RUNTIME_E2E);
  });

  it("never lets a workflow or classifier change downgrade itself", () => {
    const mixed = classifyCiImpact(["docs/README.md", ".github/workflows/ci.yml"]);
    assert.equal(mixed.tier, TIER_4_CONSERVATIVE_FULL);
  });

  it("treats empty or forced classification as conservative full", () => {
    assert.equal(classifyCiImpact([]).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(classifyCiImpact(["docs/README.md"], { forceFull: true }).tier, TIER_4_CONSERVATIVE_FULL);
    assert.equal(checksForTier(TIER_1_DOCS).runE2e, false);
    assert.equal(checksForTier(TIER_2_STATIC_LOGIC).runE2e, false);
    assert.equal(checksForTier(TIER_2_STATIC_LOGIC).runBuild, true);
  });

  it("classifies non-markdown docs evidence as docs, not Chromium E2E", () => {
    const result = classifyCiImpact(["docs/worklog/screenshots/configurator.png"]);
    assert.equal(result.tier, TIER_1_DOCS);
    assert.equal(result.runE2e, false);
  });

  it("classifies ordinary docs-adjacent scripts as static logic, not docs", () => {
    const result = classifyCiImpact(["scripts/verify-workos-docs-continuity.mjs"]);
    assert.equal(result.tier, TIER_2_STATIC_LOGIC);
    assert.equal(result.runBuild, true);
    assert.equal(result.runE2e, false);
  });
});
