import { getColorById, listColorsBySystem } from "./colorRegistry.js";
import { getFinishCatalogItem, listFinishApplicationsForSlot, requiredFinishFields } from "./finishCatalog.js";
import { getRollProfile, resolveCompatibleRolls } from "./rolls.js";
import type {
  FinishApplicationId,
  FinishCompatibilityFailure,
  FinishCompatibilityInput,
  FinishCompatibilityResult,
  FinishCompatibilitySuccess,
  OrganizationFinishOverlay,
} from "./types.js";
import { isFinishApplicationId } from "./types.js";

function enabledApplicationIds(
  allowed: readonly FinishApplicationId[],
  organization?: OrganizationFinishOverlay,
): FinishApplicationId[] {
  if (!organization || organization.enabledApplicationIds === "all") {
    return [...allowed];
  }
  const enabled = new Set(organization.enabledApplicationIds);
  return allowed.filter((id) => enabled.has(id));
}

function fail(
  code: FinishCompatibilityFailure["code"],
  reason: string,
  visibleApplicationIds: readonly FinishApplicationId[],
): FinishCompatibilityFailure {
  return { status: "FAILED", code, reason, visibleApplicationIds };
}

export function listVisibleFinishApplications(
  input: Pick<FinishCompatibilityInput, "slot" | "allowedApplicationIds" | "organization">,
): FinishApplicationId[] {
  const enabled = enabledApplicationIds(input.allowedApplicationIds, input.organization);
  return listFinishApplicationsForSlot(input.slot, enabled).map((item) => item.applicationId);
}

export function resolveFinishCompatibility(
  input: FinishCompatibilityInput,
): FinishCompatibilityResult {
  const visibleApplicationIds = listVisibleFinishApplications(input);
  const selectedId = input.selection.applicationId;

  if (selectedId === null) {
    return fail(
      "MISSING_REQUIRED_CONFIGURATION",
      "Aplicația de finisaj nu este selectată.",
      visibleApplicationIds,
    );
  }

  if (!isFinishApplicationId(selectedId)) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Referința de finisaj nu există în catalog.",
      visibleApplicationIds,
    );
  }

  const application = getFinishCatalogItem(selectedId);
  if (!application || !application.active) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Referința de finisaj nu există în catalog.",
      visibleApplicationIds,
    );
  }

  if (!application.compatibleSlots.includes(input.selection.slot)) {
    return fail(
      "PRODUCT_TRUTH_CONFLICT",
      "Aplicația de finisaj nu este permisă pe acest slot.",
      visibleApplicationIds,
    );
  }

  if (input.selection.slot !== input.slot) {
    return fail(
      "PRODUCT_TRUTH_CONFLICT",
      "Slotul selecției nu coincide cu slotul cerut.",
      visibleApplicationIds,
    );
  }

  if (!visibleApplicationIds.includes(selectedId)) {
    return fail(
      "PRODUCT_TRUTH_CONFLICT",
      "Aplicația de finisaj nu este permisă pentru acest produs sau organizație.",
      visibleApplicationIds,
    );
  }

  const extra = input.extraColors ?? [];
  const compatibleColors = application.colorSystem
    ? listColorsBySystem(application.colorSystem, extra).filter((item) => item.active)
    : [];
  const compatibleRolls = application.rollFamily
    ? resolveCompatibleRolls({
        family: application.rollFamily,
        organization: input.organization,
      })
    : [];

  if (application.requiresColor && !input.selection.colorId) {
    return fail(
      "MISSING_REQUIRED_CONFIGURATION",
      "Culoarea este obligatorie pentru acest finisaj.",
      visibleApplicationIds,
    );
  }

  if (application.requiresRoll && !input.selection.rollProfileId && input.selection.rollWidthMm == null) {
    return fail(
      "MISSING_REQUIRED_CONFIGURATION",
      "Lățimea de rolă este obligatorie pentru acest finisaj.",
      visibleApplicationIds,
    );
  }

  const selectedColor = input.selection.colorId
    ? getColorById(input.selection.colorId, extra)
    : undefined;
  if (input.selection.colorId && !selectedColor) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Referința de culoare nu există în catalog.",
      visibleApplicationIds,
    );
  }
  if (selectedColor && application.colorSystem && selectedColor.system !== application.colorSystem) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Sistemul de culoare nu este compatibil cu finisajul selectat.",
      visibleApplicationIds,
    );
  }

  const extraRolls = input.organization?.additionalRollProfiles ?? [];
  const selectedRoll = input.selection.rollProfileId
    ? getRollProfile(input.selection.rollProfileId, extraRolls)
    : undefined;
  if (input.selection.rollProfileId && !selectedRoll) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Referința de rolă nu există în catalog.",
      visibleApplicationIds,
    );
  }
  if (selectedRoll && application.rollFamily && selectedRoll.family !== application.rollFamily) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Familia de rolă nu este compatibilă cu finisajul selectat.",
      visibleApplicationIds,
    );
  }
  if (selectedRoll && !compatibleRolls.some((item) => item.id === selectedRoll?.id)) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Profilul de rolă nu este activ pentru această organizație.",
      visibleApplicationIds,
    );
  }
  if (
    selectedRoll &&
    input.selection.rollWidthMm != null &&
    selectedRoll.widthMm !== input.selection.rollWidthMm
  ) {
    return fail(
      "INVALID_CATALOG_REFERENCE",
      "Lățimea persistată nu coincide cu profilul de rolă selectat.",
      visibleApplicationIds,
    );
  }

  if (application.lamination === "required" && input.selection.laminated !== true) {
    return fail(
      "MISSING_REQUIRED_CONFIGURATION",
      "Laminarea este obligatorie pentru acest finisaj.",
      visibleApplicationIds,
    );
  }
  if (application.lamination === "forbidden" && input.selection.laminated === true) {
    return fail(
      "PRODUCT_TRUTH_CONFLICT",
      "Laminarea nu este permisă pentru acest finisaj.",
      visibleApplicationIds,
    );
  }

  if (
    application.intendedResourceId &&
    input.knownResourceIds &&
    !input.knownResourceIds.has(application.intendedResourceId)
  ) {
    return fail(
      "NO_RESOLVABLE_RESOURCE",
      "Resursa intenționată pentru acest finisaj nu poate fi rezolvată.",
      visibleApplicationIds,
    );
  }

  const success: FinishCompatibilitySuccess = {
    status: "OK",
    visibleApplicationIds,
    application,
    requiredFields: requiredFinishFields(application),
    colorSystem: application.colorSystem,
    rollFamily: application.rollFamily,
    compatibleColors,
    compatibleRolls,
    intendedResourceId: application.intendedResourceId,
  };
  return success;
}
