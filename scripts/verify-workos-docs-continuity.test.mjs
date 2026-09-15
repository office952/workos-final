import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  repoRootFrom,
  verifyRoadmapFc1,
  verifySessionCurrent,
  verifyTerminologyConcepts,
  verifyWorkosDocsContinuity,
} from "./verify-workos-docs-continuity.mjs";

describe("verify-workos-docs-continuity", () => {
  it("passes against the current repository", () => {
    const result = verifyWorkosDocsContinuity(repoRootFrom());
    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it("rejects a silently authorized next slice", () => {
    const errors = [];
    verifySessionCurrent(
      [
        "LIVE_MAIN_AUTHORITY",
        "GITHUB_ORIGIN_MAIN",
        "LIVE_GITHUB_WINS = YES",
        "DELIVERY_ROADMAP",
        "AUTHORITY_MAP",
        "TERMINOLOGY_CANON",
        "CURSOR_WORKFLOW",
        "CURSOR_PLUGIN_REGISTRY",
        "FIGMA_WORKFLOW",
        "PRODUCT_TRUTH_AUTHORITIES",
        "UI_UX_AUTHORITIES",
        "NEXT_PRODUCT_SLICE = FC2",
        "FC2_AUTHORIZED = YES",
      ].join("\n"),
      errors,
    );
    assert.ok(errors.some((item) => item.includes("must not silently authorize")));
    assert.ok(errors.some((item) => item.includes("must not authorize FC2")));
  });

  it("rejects duplicate terminology CONCEPT ids", () => {
    const errors = [];
    verifyTerminologyConcepts("### CONCEPT = CLIENT\n\n### CONCEPT = CLIENT\n", errors);
    assert.deepEqual(errors, ["duplicate CONCEPT: CLIENT"]);
  });

  it("rejects stale FC1 local-in-review living-roadmap copy", () => {
    const errors = [];
    verifyRoadmapFc1(
      [
        "FORM_COMPLETENESS_FC1 = INTEGRATED_ON_MAIN",
        "PR26 = INTEGRATED_ON_MAIN",
        "NEXT_PRODUCT_SLICE = NOT_AUTHORIZED_AFTER_FC1",
        "FORM_COMPLETENESS = FC1_IMPLEMENTED_LOCAL_IN_REVIEW",
      ].join("\n"),
      errors,
    );
    assert.ok(errors.some((item) => item.includes("local-in-review")));
  });

  it("does not treat an empty temp tree as the repo", () => {
    const empty = mkdtempSync(join(tmpdir(), "workos-docs-"));
    mkdirSync(join(empty, "docs"));
    writeFileSync(join(empty, "docs", "README.md"), "empty\n");
    const result = verifyWorkosDocsContinuity(empty);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((item) => item.startsWith("missing required doc:")));
  });
});
