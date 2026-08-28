import {
  projectCommercialPrice,
  type CommercialPriceCompleteness,
  type CommercialPriceProjection,
} from "../commercial/price.js";
import type { EicResult } from "../resources/eic.js";

export const SITE_INSTALLATION_SCOPE_ID = "SITE_INSTALLATION";
export const SITE_INSTALLATION_LABEL = "Montaj la locație";
export const SITE_INSTALLATION_FREEZE_REASON =
  "Montajul nu are încă un cost complet.";

export const OPTIONAL_COMMERCIAL_SCOPE_IDS = [SITE_INSTALLATION_SCOPE_ID] as const;
export type OptionalCommercialScopeId = (typeof OPTIONAL_COMMERCIAL_SCOPE_IDS)[number];

export const SITE_INSTALLATION_INCOMPLETE_REASON_IDS = [
  "MISSING_COST_EVIDENCE",
  "SITE_MEASUREMENTS_UNCONFIRMED",
  "HEIGHT_ACCESS_UNCONFIRMED",
  "TRANSPORT_UNCONFIRMED",
  "SITE_ELECTRICAL_UNCONFIRMED",
] as const;
export type SiteInstallationIncompleteReasonId =
  (typeof SITE_INSTALLATION_INCOMPLETE_REASON_IDS)[number];

export type SiteInstallationIncompleteReason = {
  id: SiteInstallationIncompleteReasonId;
  label: string;
};

export type SiteInstallationScopeProjection = {
  scopeId: typeof SITE_INSTALLATION_SCOPE_ID;
  label: typeof SITE_INSTALLATION_LABEL;
  eic: EicResult;
  commercial: CommercialPriceProjection;
  incompleteReasons: readonly SiteInstallationIncompleteReason[];
};

export type SiteInstallationOperatorView = {
  scopeId: typeof SITE_INSTALLATION_SCOPE_ID;
  label: typeof SITE_INSTALLATION_LABEL;
  eicCompleteness: EicResult["completeness"];
  commercialCompleteness: CommercialPriceCompleteness;
  incompleteReasons: readonly SiteInstallationIncompleteReason[];
};

export function isKnownOptionalScopeId(value: string): value is OptionalCommercialScopeId {
  return (OPTIONAL_COMMERCIAL_SCOPE_IDS as readonly string[]).includes(value);
}

export function normalizeOptionalScopeIds(
  ids: readonly string[],
): { ok: true; ids: readonly string[] } | { ok: false; error: "unknown_optional_scope" } {
  const normalized: string[] = [];
  for (const raw of ids) {
    if (!isKnownOptionalScopeId(raw)) {
      return { ok: false, error: "unknown_optional_scope" };
    }
    if (!normalized.includes(raw)) {
      normalized.push(raw);
    }
  }
  return { ok: true, ids: normalized };
}

export function sameOptionalScopeIds(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

export function commercialRequestHasOptionalScope(
  optionalScopeIds: readonly string[],
  scopeId: string,
): boolean {
  return optionalScopeIds.includes(scopeId);
}

export function siteInstallationIncompleteReasonLabel(
  id: SiteInstallationIncompleteReasonId,
): string {
  switch (id) {
    case "MISSING_COST_EVIDENCE":
      return "Evidența de cost pentru montaj lipsește.";
    case "SITE_MEASUREMENTS_UNCONFIRMED":
      return "Măsurătorile la locație nu sunt confirmate.";
    case "HEIGHT_ACCESS_UNCONFIRMED":
      return "Accesul și înălțimea de lucru nu sunt confirmate.";
    case "TRANSPORT_UNCONFIRMED":
      return "Transportul nu este confirmat.";
    case "SITE_ELECTRICAL_UNCONFIRMED":
      return "Racordul electric de șantier nu este confirmat.";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function siteInstallationIncompleteReasons(): readonly SiteInstallationIncompleteReason[] {
  const seen = new Set<SiteInstallationIncompleteReasonId>();
  const reasons: SiteInstallationIncompleteReason[] = [];
  for (const id of SITE_INSTALLATION_INCOMPLETE_REASON_IDS) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    reasons.push({ id, label: siteInstallationIncompleteReasonLabel(id) });
  }
  return reasons;
}

export function projectSiteInstallationScope(input: {
  selected: boolean;
}): SiteInstallationScopeProjection | null {
  if (!input.selected) {
    return null;
  }
  const incompleteReasons = siteInstallationIncompleteReasons();
  const eic: EicResult = {
    completeness: "PARTIAL",
    completenessReasons: incompleteReasons.map((reason) => reason.label),
    geometryLabel: null,
    currency: "EUR",
    lines: [],
    total: 0,
    excludedComponentLabels: [],
  };
  return {
    scopeId: SITE_INSTALLATION_SCOPE_ID,
    label: SITE_INSTALLATION_LABEL,
    eic,
    commercial: projectCommercialPrice({
      total: eic.total,
      currency: eic.currency,
      completeness: eic.completeness,
    }),
    incompleteReasons,
  };
}

export function presentSiteInstallationScope(
  projection: SiteInstallationScopeProjection | null,
): SiteInstallationOperatorView | null {
  if (!projection) {
    return null;
  }
  return {
    scopeId: projection.scopeId,
    label: projection.label,
    eicCompleteness: projection.eic.completeness,
    commercialCompleteness: projection.commercial.completeness,
    incompleteReasons: projection.incompleteReasons,
  };
}

export function siteInstallationBlocksQuoteFreeze(
  optionalScopeIds: readonly string[],
): boolean {
  const projection = projectSiteInstallationScope({
    selected: commercialRequestHasOptionalScope(
      optionalScopeIds,
      SITE_INSTALLATION_SCOPE_ID,
    ),
  });
  return projection !== null && projection.eic.completeness !== "COMPLETE";
}

export type IncompleteOfferRefusal = {
  error: "incomplete_offer";
  reasons: readonly string[];
};

export function siteInstallationFreezeRefusal(
  optionalScopeIds: readonly string[],
): IncompleteOfferRefusal | null {
  if (!siteInstallationBlocksQuoteFreeze(optionalScopeIds)) {
    return null;
  }
  return {
    error: "incomplete_offer",
    reasons: [SITE_INSTALLATION_FREEZE_REASON],
  };
}
