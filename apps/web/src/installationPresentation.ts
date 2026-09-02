import {
  LAB_SITE_INSTALL_ID,
  SVC_SITE_INSTALL_SUBCONTRACT_ID,
  type OperationalServiceProviderMode,
  type SiteInstallationIncompleteReason,
} from "@workos-final/domain";

export function installationCostEvidenceHref(input: {
  providerMode?: OperationalServiceProviderMode | null;
  incompleteReasons: readonly SiteInstallationIncompleteReason[];
}): string | null {
  const ids = new Set(input.incompleteReasons.map((reason) => reason.id));
  if (
    ids.has("SUBCONTRACT_EVIDENCE_INVALID") ||
    ids.has("MISSING_SUBCONTRACT_EVIDENCE")
  ) {
    return resourcesCostHref(SVC_SITE_INSTALL_SUBCONTRACT_ID);
  }
  if (
    ids.has("MISSING_INTERNAL_LABOR_EVIDENCE") ||
    (input.providerMode === "INTERNAL" && ids.has("MISSING_COST_EVIDENCE"))
  ) {
    return `/admin/resources?selected=${encodeURIComponent(`resource:${LAB_SITE_INSTALL_ID}`)}`;
  }
  if (input.providerMode === "SUBCONTRACTED" && ids.has("MISSING_COST_EVIDENCE")) {
    return resourcesCostHref(SVC_SITE_INSTALL_SUBCONTRACT_ID);
  }
  return null;
}

function resourcesCostHref(resourceId: string): string {
  return `/admin/resources?selected=${encodeURIComponent(`cost:${resourceId}:unqualified`)}`;
}
