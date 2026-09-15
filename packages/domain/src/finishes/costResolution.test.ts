import { describe, expect, it } from "vitest";
import {
  LAB_VINYL_FACE_ID,
  MAT_VINYL_LAMINATE_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
  MAT_VINYL_ORACAL_8500_ID,
  MAT_VINYL_PRINT_ID,
  SVC_LARGE_FORMAT_PRINT_ID,
  SVC_PAINT_RAL_ID,
  costEvidence,
  getResource,
  isValidCostAmount,
} from "../resources/catalog.js";
import { compileFaceFinishCost, faceFinishCostRequirements } from "./costResolution.js";

const FACE_AREA_MM2 = 250_000;

function expectNumericComplete(
  applicationId: Parameters<typeof compileFaceFinishCost>[0],
  expectedResourceIds: readonly string[],
): void {
  const requirements = faceFinishCostRequirements(applicationId, FACE_AREA_MM2);
  expect(requirements.map((item) => item.resourceId)).toEqual(expectedResourceIds);
  expect(requirements.every((item) => item.unit === "m2")).toBe(true);
  expect(requirements.every((item) => item.quantity === 0.25)).toBe(true);
  for (const requirement of requirements) {
    const resource = getResource(requirement.resourceId);
    expect(resource).toBeDefined();
    expect(resource?.unit).toBe(requirement.unit);
  }
  const eic = compileFaceFinishCost(applicationId, FACE_AREA_MM2, costEvidence);
  expect(eic.completeness).toBe("COMPLETE");
  expect(eic.completenessReasons).toEqual([]);
  expect(eic.lines.map((line) => line.resourceId)).toEqual(expectedResourceIds);
  expect(eic.lines.every((line) => isValidCostAmount(line.rate))).toBe(true);
  expect(eic.lines.every((line) => Number.isFinite(line.cost))).toBe(true);
  expect(isValidCostAmount(eic.total) || eic.total === 0).toBe(true);
  expect(eic.total).toBeGreaterThan(0);
}

describe("FC2D face finish cost resolution", () => {
  it("costs Oracal 641 as material plus shared face application labor", () => {
    expectNumericComplete("face_letters_standard", [
      MAT_VINYL_ORACAL_641_ID,
      LAB_VINYL_FACE_ID,
    ]);
  });

  it("preserves Oracal 651 material plus shared face application labor", () => {
    expectNumericComplete("face_letters_premium", [
      MAT_VINYL_ORACAL_651_ID,
      LAB_VINYL_FACE_ID,
    ]);
  });

  it("costs Oracal 8500 as material plus shared face application labor", () => {
    expectNumericComplete("illuminated_letter_face", [
      MAT_VINYL_ORACAL_8500_ID,
      LAB_VINYL_FACE_ID,
    ]);
  });

  it("costs print as media, large-format print, and shared face application labor", () => {
    expectNumericComplete("print_face", [
      MAT_VINYL_PRINT_ID,
      SVC_LARGE_FORMAT_PRINT_ID,
      LAB_VINYL_FACE_ID,
    ]);
  });

  it("costs print plus laminate without a composite or laminate-service identity", () => {
    expectNumericComplete("print_face_laminated", [
      MAT_VINYL_PRINT_ID,
      SVC_LARGE_FORMAT_PRINT_ID,
      MAT_VINYL_LAMINATE_ID,
      LAB_VINYL_FACE_ID,
    ]);
    const ids = faceFinishCostRequirements("print_face_laminated", FACE_AREA_MM2).map(
      (item) => item.resourceId,
    );
    expect(ids).not.toContain("SVC-LAMINATE");
    expect(ids).not.toContain("MAT-VINYL-PRINT-LAMINATED");
  });

  it("does not treat provisional classification as incomplete", () => {
    const eic = compileFaceFinishCost("face_letters_standard", FACE_AREA_MM2, costEvidence);
    const material = eic.lines.find((line) => line.resourceId === MAT_VINYL_ORACAL_641_ID);
    expect(material).toBeDefined();
    expect(eic.completeness).toBe("COMPLETE");
  });

  it("does not map volume or RAL applications onto FACE area costing", () => {
    expect(faceFinishCostRequirements("none", FACE_AREA_MM2)).toEqual([]);
    expect(faceFinishCostRequirements("return_ral", FACE_AREA_MM2)).toEqual([]);
    expect(faceFinishCostRequirements("return_letters_standard", FACE_AREA_MM2)).toEqual([]);
    expect(faceFinishCostRequirements("return_cant_volum_wrapping", FACE_AREA_MM2)).toEqual(
      [],
    );
    const ral = compileFaceFinishCost("return_ral", FACE_AREA_MM2);
    expect(ral.lines.map((line) => line.resourceId)).not.toContain(SVC_PAINT_RAL_ID);
  });
});
