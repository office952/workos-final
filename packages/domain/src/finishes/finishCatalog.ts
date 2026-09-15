import type { FinishApplicationId, FinishCatalogItem, FinishSlot } from "./types.js";
import { isFinishApplicationId } from "./types.js";

export const FINISH_CATALOG_SOURCE = "FC2A_SHARED_FINISH_CATALOG";

export const finishCatalog: readonly FinishCatalogItem[] = [
  {
    id: "finish.none",
    applicationId: "none",
    finishFamily: "none",
    compatibleSlots: ["FACE", "VOLUME"],
    brand: null,
    series: null,
    colorSystem: null,
    requiresColor: false,
    requiresRoll: false,
    rollFamily: null,
    lamination: "none",
    translucent: false,
    intendedResourceId: null,
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.face_letters_standard",
    applicationId: "face_letters_standard",
    finishFamily: "oracal",
    compatibleSlots: ["FACE"],
    brand: "Oracal",
    series: "641",
    colorSystem: "ORACAL_641",
    requiresColor: true,
    requiresRoll: true,
    rollFamily: "oracal",
    lamination: "forbidden",
    translucent: false,
    intendedResourceId: "MAT-VINYL-ORACAL-641",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.face_letters_premium",
    applicationId: "face_letters_premium",
    finishFamily: "oracal",
    compatibleSlots: ["FACE"],
    brand: "Oracal",
    series: "651",
    colorSystem: "ORACAL_651",
    requiresColor: true,
    requiresRoll: true,
    rollFamily: "oracal",
    lamination: "forbidden",
    translucent: false,
    intendedResourceId: "MAT-VINYL-ORACAL-651",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.illuminated_letter_face",
    applicationId: "illuminated_letter_face",
    finishFamily: "oracal",
    compatibleSlots: ["FACE"],
    brand: "Oracal",
    series: "8500",
    colorSystem: "ORACAL_8500",
    requiresColor: true,
    requiresRoll: true,
    rollFamily: "oracal",
    lamination: "forbidden",
    translucent: true,
    intendedResourceId: "MAT-VINYL-ORACAL-8500",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.print_face",
    applicationId: "print_face",
    finishFamily: "print",
    compatibleSlots: ["FACE"],
    brand: null,
    series: null,
    colorSystem: null,
    requiresColor: false,
    requiresRoll: true,
    rollFamily: "print",
    lamination: "forbidden",
    translucent: false,
    intendedResourceId: "MAT-VINYL-PRINT",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.print_face_laminated",
    applicationId: "print_face_laminated",
    finishFamily: "print",
    compatibleSlots: ["FACE"],
    brand: null,
    series: null,
    colorSystem: null,
    requiresColor: false,
    requiresRoll: true,
    rollFamily: "print",
    lamination: "required",
    translucent: false,
    intendedResourceId: "MAT-VINYL-PRINT",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.return_stock",
    applicationId: "return_stock",
    finishFamily: "stock",
    compatibleSlots: ["VOLUME"],
    brand: null,
    series: null,
    colorSystem: null,
    requiresColor: false,
    requiresRoll: false,
    rollFamily: null,
    lamination: "none",
    translucent: false,
    intendedResourceId: null,
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.return_cant_volum_wrapping",
    applicationId: "return_cant_volum_wrapping",
    finishFamily: "oracal",
    compatibleSlots: ["VOLUME"],
    brand: "Oracal",
    series: "651",
    colorSystem: "ORACAL_651",
    requiresColor: true,
    requiresRoll: true,
    rollFamily: "oracal",
    lamination: "forbidden",
    translucent: false,
    intendedResourceId: "MAT-VINYL-ORACAL-651",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
  {
    id: "finish.return_ral",
    applicationId: "return_ral",
    finishFamily: "ral",
    compatibleSlots: ["VOLUME"],
    brand: null,
    series: null,
    colorSystem: "RAL",
    requiresColor: true,
    requiresRoll: false,
    rollFamily: null,
    lamination: "none",
    translucent: false,
    intendedResourceId: "SVC-PAINT-RAL",
    active: true,
    source: FINISH_CATALOG_SOURCE,
  },
];

export function getFinishCatalogItem(
  applicationId: string,
): FinishCatalogItem | undefined {
  if (!isFinishApplicationId(applicationId)) {
    return undefined;
  }
  return finishCatalog.find((item) => item.applicationId === applicationId);
}

export function listFinishApplicationsForSlot(
  slot: FinishSlot,
  allowedApplicationIds: readonly FinishApplicationId[] = finishCatalog.map(
    (item) => item.applicationId,
  ),
): FinishCatalogItem[] {
  const allowed = new Set(allowedApplicationIds);
  return finishCatalog.filter(
    (item) =>
      item.active &&
      allowed.has(item.applicationId) &&
      item.compatibleSlots.includes(slot),
  );
}

export function requiredFinishFields(
  item: FinishCatalogItem,
): readonly ("color" | "roll" | "lamination")[] {
  const fields: Array<"color" | "roll" | "lamination"> = [];
  if (item.requiresColor) {
    fields.push("color");
  }
  if (item.requiresRoll) {
    fields.push("roll");
  }
  if (item.lamination === "required" || item.finishFamily === "print") {
    fields.push("lamination");
  }
  return fields;
}
