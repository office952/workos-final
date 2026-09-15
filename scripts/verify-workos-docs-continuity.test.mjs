import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  repoRootFrom,
  verifyConfiguratorUiAuthority,
  verifyOwnerUiUxApprovalScope,
  verifyProtectedRegionLaw,
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

  it("rejects claiming FC2 is on main", () => {
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
        "FIGMA_RUNTIME_REGISTRY",
        "PRODUCT_TRUTH_AUTHORITIES",
        "UI_UX_AUTHORITIES",
        "FC2A_IMPLEMENTED_LOCAL_IN_REVIEW = YES",
        "FC2A1_IMPLEMENTED_LOCAL_IN_REVIEW = YES",
        "FC2D_IMPLEMENTED_LOCAL_IN_REVIEW = YES",
        "FC2B_IMPLEMENTED_LOCAL_IN_REVIEW = YES",
        "FC2C_IMPLEMENTED_LOCAL_IN_REVIEW = YES",
        "FC2D_AUTHORIZED = NO",
        "FC2B_AUTHORIZED = NO",
        "FC2C_AUTHORIZED = NO",
        "FC2_INTEGRATED_ON_MAIN = YES",
        "FIGMA_WRITE = NO",
      ].join("\n"),
      errors,
    );
    assert.ok(errors.some((item) => item.includes("must not claim FC2 is integrated on main")));
  });

  it("rejects the unrestricted Figma layout-polish sentence", () => {
    const errors = [];
    verifyProtectedRegionLaw(
      [
        "EXISTING_ACCEPTED_SURFACE",
        "NEW_OR_UNACCEPTED_SURFACE",
        "OWNER_REOPEN_UI_FRAMEWORK",
        "MUTABLE_PRESENTATION_DELTA",
        "PROTECTED_REGION_DELTA",
        "Figma may polish presentation: layout, spacing, typography, hierarchy, density, grouping, control presentation, responsive composition",
      ].join("\n"),
      "FRAMEWORK_CLASS PROTECTED_EXISTING",
      "SURFACE_FRAMEWORK_STATUS",
      "PROTECTED_EXISTING WORKOS_FIGMA_WORKFLOW.md",
      "PROTECTED BY DEFAULT ACCORDING TO ITS CANON",
      "WORKOS_FIGMA_WORKFLOW.md",
      errors,
    );
    assert.ok(errors.some((item) => item.includes("unrestricted global layout-polish")));
  });

  it("rejects stale FC1 local-in-review living-roadmap copy", () => {
    const errors = [];
    verifyRoadmapFc1(
      [
        "FORM_COMPLETENESS_FC1 = INTEGRATED_ON_MAIN",
        "PR26 = INTEGRATED_ON_MAIN",
        "PR27 = INTEGRATED_ON_MAIN",
        "NEXT_PRODUCT_SLICE = NOT_AUTHORIZED_AFTER_FC1",
        "FORM_COMPLETENESS = FC1_IMPLEMENTED_LOCAL_IN_REVIEW",
      ].join("\n"),
      errors,
    );
    assert.ok(errors.some((item) => item.includes("local-in-review")));
  });

  it("rejects treating Figma 219:3 as current Configurator implementation authority", () => {
    const errors = [];
    verifyConfiguratorUiAuthority(
      [
        "CURRENT_IMPLEMENTED_UI_AUTHORITY = APPLICATION_ON_MAIN",
        "FIGMA_ROLE = ACCEPTED_BASELINE_REFERENCE",
        "FORCE_SYNC_APP_TO_FIGMA = NO",
      ].join("\n"),
      [
        "### Configurator V1 — VISUAL_AUTHORITY",
        "CLASS = ACCEPTED_BASELINE_REFERENCE",
        "CURRENT_IMPLEMENTED_UI_AUTHORITY = APPLICATION_ON_MAIN",
        "FORCE_SYNC_APP_TO_FIGMA = NO",
        "Only section `219:3` is Configurator implementation visual authority.",
      ].join("\n"),
      "apps/web CONFIGURATOR_V1_UI_FRAMEWORK ACCEPTED_BASELINE_REFERENCE",
      [
        "CONFIGURATOR_CURRENT_UI_UX_AUTHORITY = CURRENT_IMPLEMENTED_APPLICATION_ON_MAIN",
        "FIGMA_219_3_ROLE = ACCEPTED_BASELINE_REFERENCE",
        "FORCE_SYNC_APP_TO_FIGMA = NO",
      ].join("\n"),
      errors,
    );
    assert.ok(
      errors.some((item) => item.includes("must not treat Figma 219:3 as sole/current")),
    );
  });

  it("rejects a framework that still treats Figma as the implemented UI owner", () => {
    const errors = [];
    verifyConfiguratorUiAuthority(
      "AUTHORITY = CONFIGURATOR_V1_UI_FRAMEWORK\nFIGMA_SECTION = 219:3\n",
      [
        "CLASS = ACCEPTED_BASELINE_REFERENCE",
        "CURRENT_IMPLEMENTED_UI_AUTHORITY = APPLICATION_ON_MAIN",
        "FORCE_SYNC_APP_TO_FIGMA = NO",
      ].join("\n"),
      "apps/web CONFIGURATOR_V1_UI_FRAMEWORK ACCEPTED_BASELINE_REFERENCE",
      [
        "CONFIGURATOR_CURRENT_UI_UX_AUTHORITY = CURRENT_IMPLEMENTED_APPLICATION_ON_MAIN",
        "FIGMA_219_3_ROLE = ACCEPTED_BASELINE_REFERENCE",
        "FORCE_SYNC_APP_TO_FIGMA = NO",
      ].join("\n"),
      errors,
    );
    assert.ok(errors.some((item) => item.includes("CURRENT_IMPLEMENTED_UI_AUTHORITY")));
    assert.ok(errors.some((item) => item.includes("FIGMA_ROLE")));
    assert.ok(errors.some((item) => item.includes("FORCE_SYNC_APP_TO_FIGMA")));
  });

  it("rejects blanket UI20 page Owner acceptance in living continuity docs", () => {
    const errors = [];
    verifyOwnerUiUxApprovalScope(
      [
        "OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
        "CONFIGURATOR_CURRENT_UI_UX = OWNER_APPROVED_IMPLEMENTED_APPLICATION",
        "OTHER_PAGE_UI_UX_OWNER_ACCEPTANCE = NOT_GRANTED",
        "ALL_UI20_PAGES_OWNER_ACCEPTED = YES",
      ].join("\n"),
      [
        "PAGE_LEVEL_OWNER_ACCEPTANCE = NOT_IMPLIED",
        "OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
      ].join("\n"),
      "CONFIGURATOR_ONLY",
      "CONFIGURATOR_ONLY page-level Owner acceptance",
      "OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
      errors,
    );
    assert.ok(errors.some((item) => item.includes("must not imply all UI20")));
  });

  it("rejects a session that omits Configurator-only Owner approval scope", () => {
    const errors = [];
    verifyOwnerUiUxApprovalScope(
      "FORCE_SYNC_APP_TO_FIGMA = NO\n",
      [
        "PAGE_LEVEL_OWNER_ACCEPTANCE = NOT_IMPLIED",
        "OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
      ].join("\n"),
      "CONFIGURATOR_ONLY",
      "CONFIGURATOR_ONLY page-level Owner acceptance",
      "OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
      errors,
    );
    assert.ok(errors.some((item) => item.includes("OWNER_APPROVED_CURRENT_UI_UX_SURFACES")));
    assert.ok(errors.some((item) => item.includes("OTHER_PAGE_UI_UX_OWNER_ACCEPTANCE")));
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
