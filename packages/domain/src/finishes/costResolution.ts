import type { ProductAggregate } from "../product/types.js";
import { squareMetersFromMm2 } from "../product/units.js";
import { compileEic, type EicResult } from "../resources/eic.js";
import type { ResourceRequirement } from "../resources/requirement.js";
import {
  LAB_VINYL_FACE_ID,
  MAT_VINYL_LAMINATE_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
  MAT_VINYL_ORACAL_8500_ID,
  MAT_VINYL_PRINT_ID,
  SVC_LARGE_FORMAT_PRINT_ID,
  costEvidence,
  type CostEvidence,
} from "../resources/catalog.js";
import type { FinishApplicationId } from "./types.js";

const FACE_COMPONENT_ID = "FACE";

function faceAreaRequirement(
  resourceId: string,
  confirmedAreaMm2: number,
): ResourceRequirement {
  return {
    componentId: FACE_COMPONENT_ID,
    resourceId,
    quantity: squareMetersFromMm2(confirmedAreaMm2),
    unit: "m2",
  };
}

function oracalFaceRequirements(
  materialId: string,
  confirmedAreaMm2: number,
): ResourceRequirement[] {
  return [
    faceAreaRequirement(materialId, confirmedAreaMm2),
    faceAreaRequirement(LAB_VINYL_FACE_ID, confirmedAreaMm2),
  ];
}

function printFaceRequirements(
  confirmedAreaMm2: number,
  laminated: boolean,
): ResourceRequirement[] {
  const rows = [
    faceAreaRequirement(MAT_VINYL_PRINT_ID, confirmedAreaMm2),
    faceAreaRequirement(SVC_LARGE_FORMAT_PRINT_ID, confirmedAreaMm2),
  ];
  if (laminated) {
    rows.push(faceAreaRequirement(MAT_VINYL_LAMINATE_ID, confirmedAreaMm2));
  }
  rows.push(faceAreaRequirement(LAB_VINYL_FACE_ID, confirmedAreaMm2));
  return rows;
}

export function faceFinishCostRequirements(
  applicationId: FinishApplicationId,
  confirmedAreaMm2: number,
): ResourceRequirement[] {
  switch (applicationId) {
    case "face_letters_standard":
      return oracalFaceRequirements(MAT_VINYL_ORACAL_641_ID, confirmedAreaMm2);
    case "face_letters_premium":
      return oracalFaceRequirements(MAT_VINYL_ORACAL_651_ID, confirmedAreaMm2);
    case "illuminated_letter_face":
      return oracalFaceRequirements(MAT_VINYL_ORACAL_8500_ID, confirmedAreaMm2);
    case "print_face":
      return printFaceRequirements(confirmedAreaMm2, false);
    case "print_face_laminated":
      return printFaceRequirements(confirmedAreaMm2, true);
    case "none":
    case "return_stock":
    case "return_letters_standard":
    case "return_cant_volum_wrapping":
    case "return_ral":
      return [];
    default: {
      const _exhaustive: never = applicationId;
      return _exhaustive;
    }
  }
}

function syntheticFaceAggregate(
  requirements: readonly ResourceRequirement[],
): ProductAggregate {
  return {
    derivedFrom: "ProductTruth",
    productLabel: "FC2D finish cost",
    familyLabel: "FC2D",
    inscription: "",
    components: [],
    quantities: [],
    requirements,
    componentStatuses: [
      {
        id: FACE_COMPONENT_ID,
        label: "Față",
        typeId: "PLEXIGLAS_FACE",
        status: "CALCULATED",
        unavailable: [],
      },
    ],
    unavailable: [],
  };
}

export function faceFinishDirectRequirements(
  applicationId: FinishApplicationId,
  confirmedAreaMm2: number,
): ResourceRequirement[] {
  return faceFinishCostRequirements(applicationId, confirmedAreaMm2).filter(
    (item) => item.resourceId !== LAB_VINYL_FACE_ID,
  );
}

export function compileFaceFinishCost(
  applicationId: FinishApplicationId,
  confirmedAreaMm2: number,
  evidenceRows: readonly CostEvidence[] = costEvidence,
): EicResult {
  return compileEic(
    syntheticFaceAggregate(faceFinishCostRequirements(applicationId, confirmedAreaMm2)),
    undefined,
    evidenceRows,
  );
}
