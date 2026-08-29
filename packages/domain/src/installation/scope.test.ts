import { describe, expect, it } from "vitest";
import { DEFAULT_COMMERCIAL_POLICY } from "../commercial/policy.js";
import { projectCommercialPrice } from "../commercial/price.js";
import {
  SITE_INSTALLATION_FREEZE_REASON,
  SITE_INSTALLATION_INCOMPLETE_REASON_IDS,
  SITE_INSTALLATION_LABEL,
  SITE_INSTALLATION_SCOPE_ID,
  normalizeOptionalScopeIds,
  presentSiteInstallationScope,
  projectSiteInstallationScope,
  siteInstallationBlocksQuoteFreeze,
  siteInstallationFreezeRefusal,
  siteInstallationIncompleteReasons,
} from "./scope.js";

describe("optional site installation scope", () => {
  it("is completely silent when unselected", () => {
    expect(projectSiteInstallationScope({ selected: false })).toBeNull();
    expect(presentSiteInstallationScope(null)).toBeNull();
    expect(siteInstallationBlocksQuoteFreeze([])).toBe(false);
    expect(siteInstallationFreezeRefusal([])).toBeNull();
  });

  it("projects a separate PARTIAL EIC and commercial price without LETTERS resources", () => {
    const projected = projectSiteInstallationScope({ selected: true });
    expect(projected).not.toBeNull();
    if (!projected) {
      throw new Error("expected selected projection");
    }
    expect(projected.scopeId).toBe(SITE_INSTALLATION_SCOPE_ID);
    expect(projected.label).toBe(SITE_INSTALLATION_LABEL);
    expect(projected.eic.completeness).toBe("PARTIAL");
    expect(projected.eic.lines).toEqual([]);
    expect(projected.eic.geometryLabel).toBeNull();
    expect(projected.eic.completenessReasons).toEqual(
      siteInstallationIncompleteReasons().map((reason) => reason.label),
    );
    expect(projected.commercial).toEqual(
      projectCommercialPrice({
        total: projected.eic.total,
        currency: "EUR",
        completeness: "PARTIAL",
      }),
    );
    expect(projected.commercial.completeness).toBe("PARTIAL");
    expect(projected.commercial.policyId).toBe(DEFAULT_COMMERCIAL_POLICY.id);
    expect(JSON.stringify(projected.eic.lines)).not.toMatch(/RES-|RCP-|LED|PLEXI|ALUMINIUM/);
  });

  it("keeps incomplete reasons typed and deduplicated", () => {
    const projected = projectSiteInstallationScope({ selected: true });
    if (!projected) {
      throw new Error("expected selected projection");
    }
    const ids = projected.incompleteReasons.map((reason) => reason.id);
    expect(ids).toEqual(["MISSING_COST_EVIDENCE"]);
    expect(
      projectSiteInstallationScope({ selected: true, facts: null })?.incompleteReasons.map(
        (reason) => reason.id,
      ),
    ).toEqual([...SITE_INSTALLATION_INCOMPLETE_REASON_IDS]);
    expect(ids).toContain("MISSING_COST_EVIDENCE");
    expect(ids).not.toContain("TRANSPORT_UNCONFIRMED");
    expect(ids).not.toContain("HEIGHT_ACCESS_UNCONFIRMED");
    expect(new Set(ids).size).toBe(ids.length);
    expect(projected.incompleteReasons.map((reason) => reason.label).join(" ")).not.toMatch(
      /inspectat|verificat la fața locului|măsurat efectiv/i,
    );
  });

  it("presents operator view without a 0 EUR cost or price", () => {
    const presented = presentSiteInstallationScope(
      projectSiteInstallationScope({ selected: true }),
    );
    expect(presented).toMatchObject({
      scopeId: SITE_INSTALLATION_SCOPE_ID,
      eicCompleteness: "PARTIAL",
      commercialCompleteness: "PARTIAL",
    });
    expect(JSON.stringify(presented)).not.toMatch(/0(?:[.,]0+)? EUR|internalCost|grossPrice|"total"/);
  });

  it("normalizes known scopes and refuses unknown ones", () => {
    expect(
      normalizeOptionalScopeIds([SITE_INSTALLATION_SCOPE_ID, SITE_INSTALLATION_SCOPE_ID]),
    ).toEqual({ ok: true, ids: [SITE_INSTALLATION_SCOPE_ID] });
    expect(normalizeOptionalScopeIds([])).toEqual({ ok: true, ids: [] });
    expect(normalizeOptionalScopeIds(["NOT_A_SCOPE"])).toEqual({
      ok: false,
      error: "unknown_optional_scope",
    });
  });

  it("blocks quote freeze only when the selected installation EIC is not COMPLETE", () => {
    expect(siteInstallationBlocksQuoteFreeze([SITE_INSTALLATION_SCOPE_ID])).toBe(true);
    expect(siteInstallationFreezeRefusal([SITE_INSTALLATION_SCOPE_ID])).toEqual({
      error: "incomplete_offer",
      reasons: [SITE_INSTALLATION_FREEZE_REASON],
    });
  });
});
