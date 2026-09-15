import { describe, expect, it } from "vitest";
import { createManualOracal641Color, getColorById } from "./colorRegistry.js";
import {
  HUB_MEDIA_FINISH_OVERLAY,
  HUB_MEDIA_PRINT_ROLL_1050_ID,
  SHARED_ORACAL_ROLL_1000_ID,
  SHARED_ORACAL_ROLL_1260_ID,
} from "./rolls.js";
import { resolveFinishCompatibility } from "./resolve.js";
import { snapshotFinishSelection } from "./snapshot.js";
import type { FinishApplicationId, FinishSelection, OrganizationFinishOverlay } from "./types.js";

const FACE_ALLOWANCE: readonly FinishApplicationId[] = [
  "none",
  "face_letters_standard",
  "face_letters_premium",
  "illuminated_letter_face",
  "print_face",
  "print_face_laminated",
];

const VOLUME_ALLOWANCE: readonly FinishApplicationId[] = [
  "none",
  "return_stock",
  "return_cant_volum_wrapping",
  "return_ral",
];

function faceSelection(
  applicationId: FinishApplicationId | null,
  extras: Partial<FinishSelection> = {},
): FinishSelection {
  return {
    slot: "FACE",
    applicationId,
    colorId: null,
    rollProfileId: null,
    rollWidthMm: null,
    laminated: null,
    ...extras,
  };
}

describe("finish compatibility resolver", () => {
  it("exposes HUB MEDIA foundation capabilities without binding LETTERS FormSchema", () => {
    const visible = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:010",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(visible.status).toBe("OK");
    if (visible.status !== "OK") {
      throw new Error("expected compatible 651 face");
    }
    expect(visible.visibleApplicationIds).toEqual(FACE_ALLOWANCE);
    expect(visible.colorSystem).toBe("ORACAL_651");
    expect(visible.rollFamily).toBe("oracal");
    expect(visible.compatibleRolls.map((item) => item.widthMm)).toEqual([1000, 1260]);
    expect(visible.intendedResourceId).toBe("MAT-VINYL-ORACAL-651");
  });

  it("keeps a small company on 651 and one roll, and hides print without blocking vinyl", () => {
    const small: OrganizationFinishOverlay = {
      organizationId: "org:small-sign",
      enabledApplicationIds: ["none", "face_letters_premium", "return_cant_volum_wrapping"],
      disabledRollProfileIds: [SHARED_ORACAL_ROLL_1260_ID],
      additionalRollProfiles: [],
    };
    const vinyl = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: small,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:070",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(vinyl.status).toBe("OK");
    if (vinyl.status !== "OK") {
      throw new Error("expected small-company 651");
    }
    expect(vinyl.visibleApplicationIds).toEqual(["none", "face_letters_premium"]);
    expect(vinyl.compatibleRolls.map((item) => item.id)).toEqual([SHARED_ORACAL_ROLL_1000_ID]);
    const print = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: small,
      selection: faceSelection("print_face", {
        rollProfileId: HUB_MEDIA_PRINT_ROLL_1050_ID,
        rollWidthMm: 1050,
      }),
    });
    expect(print).toMatchObject({
      status: "FAILED",
      code: "ORG_CAPABILITY_DISABLED",
    });
  });

  it("treats a template-forbidden application as Product Truth conflict", () => {
    const result = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: ["none", "face_letters_premium"],
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("print_face", {
        rollProfileId: HUB_MEDIA_PRINT_ROLL_1050_ID,
        rollWidthMm: 1050,
      }),
    });
    expect(result).toMatchObject({
      status: "FAILED",
      code: "PRODUCT_TRUTH_CONFLICT",
    });
  });

  it("disables print for a company without print rolls and still resolves Oracal", () => {
    const noPrint: OrganizationFinishOverlay = {
      organizationId: "org:no-print",
      enabledApplicationIds: [
        "none",
        "face_letters_standard",
        "face_letters_premium",
        "illuminated_letter_face",
      ],
      disabledRollProfileIds: [],
      additionalRollProfiles: [],
    };
    const oracal = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: noPrint,
      selection: faceSelection("illuminated_letter_face", {
        colorId: "oracal:8500:010",
        rollProfileId: SHARED_ORACAL_ROLL_1260_ID,
        rollWidthMm: 1260,
      }),
    });
    expect(oracal.status).toBe("OK");
    const print = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: noPrint,
      selection: faceSelection("print_face"),
    });
    expect(print).toMatchObject({
      status: "FAILED",
      code: "ORG_CAPABILITY_DISABLED",
    });
  });

  it("rejects an invalid color or roll reference with a typed failure", () => {
    const unknownColor = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:missing",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(unknownColor).toMatchObject({
      status: "FAILED",
      code: "INVALID_CATALOG_REFERENCE",
    });
    const unknownRoll = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:010",
        rollProfileId: "roll:missing",
        rollWidthMm: 1000,
      }),
    });
    expect(unknownRoll).toMatchObject({
      status: "FAILED",
      code: "INVALID_CATALOG_REFERENCE",
    });
  });

  it("does not treat a 641 manual needs-review color as a resolver failure", () => {
    const manual = createManualOracal641Color("888");
    const result = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      extraColors: [manual],
      selection: faceSelection("face_letters_standard", {
        colorId: manual.id,
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(result.status).toBe("OK");
    expect(manual.needsReview).toBe(true);
  });

  it("reports no resolvable resource only when a lookup set is provided and misses", () => {
    const selection = faceSelection("face_letters_premium", {
      colorId: "oracal:651:010",
      rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
      rollWidthMm: 1000,
    });
    const withoutLookup = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      selection,
    });
    expect(withoutLookup.status).toBe("OK");
    const missing = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      selection,
      knownResourceIds: new Set(),
    });
    expect(missing).toMatchObject({
      status: "FAILED",
      code: "NO_RESOLVABLE_RESOURCE",
    });
  });

  it("keeps vinyl resolvable when print rolls are absent", () => {
    const noPrintRolls: OrganizationFinishOverlay = {
      organizationId: "org:no-print-rolls",
      enabledApplicationIds: "all",
      disabledRollProfileIds: [],
      additionalRollProfiles: [],
    };
    const vinyl = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: noPrintRolls,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:010",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(vinyl.status).toBe("OK");
    const print = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: noPrintRolls,
      selection: faceSelection("print_face"),
    });
    expect(print).toMatchObject({
      status: "FAILED",
      code: "MISSING_REQUIRED_CONFIGURATION",
    });
  });

  it("requires laminate only for the laminated print application", () => {
    const missing = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("print_face_laminated", {
        rollProfileId: HUB_MEDIA_PRINT_ROLL_1050_ID,
        rollWidthMm: 1050,
      }),
    });
    expect(missing).toMatchObject({
      status: "FAILED",
      code: "MISSING_REQUIRED_CONFIGURATION",
    });
    const ok = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("print_face_laminated", {
        rollProfileId: HUB_MEDIA_PRINT_ROLL_1050_ID,
        rollWidthMm: 1050,
        laminated: true,
      }),
    });
    expect(ok.status).toBe("OK");
  });

  it("rejects return wrap on FACE as a product-truth conflict", () => {
    const result = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      selection: faceSelection("return_cant_volum_wrapping", {
        colorId: "oracal:651:010",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(result).toMatchObject({
      status: "FAILED",
      code: "PRODUCT_TRUTH_CONFLICT",
    });
  });

  it("resolves return RAL color without requiring a roll", () => {
    const result = resolveFinishCompatibility({
      slot: "VOLUME",
      allowedApplicationIds: VOLUME_ALLOWANCE,
      selection: {
        slot: "VOLUME",
        applicationId: "return_ral",
        colorId: "ral:9010",
        rollProfileId: null,
        rollWidthMm: null,
        laminated: null,
      },
    });
    expect(result.status).toBe("OK");
    if (result.status !== "OK") {
      throw new Error("expected return RAL");
    }
    expect(result.colorSystem).toBe("RAL");
    expect(result.rollFamily).toBeNull();
    expect(result.compatibleColors.some((item) => item.id === "ral:9010")).toBe(true);
  });
});

describe("snapshot stability and enable-later modularity", () => {
  it("keeps a frozen selection when print is enabled later and the catalog changes", () => {
    const beforePrint: OrganizationFinishOverlay = {
      organizationId: "org:grows-print",
      enabledApplicationIds: ["none", "face_letters_premium"],
      disabledRollProfileIds: [],
      additionalRollProfiles: [],
    };
    const resolved = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: beforePrint,
      selection: faceSelection("face_letters_premium", {
        colorId: "oracal:651:010",
        rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
        rollWidthMm: 1000,
      }),
    });
    expect(resolved.status).toBe("OK");
    if (resolved.status !== "OK") {
      throw new Error("expected snapshot source");
    }
    const color = getColorById("oracal:651:010");
    expect(color).toBeDefined();
    if (!color) {
      throw new Error("expected 651 010");
    }
    const snapshotColor = { ...color };
    const snapshot = snapshotFinishSelection({
      application: resolved.application,
      color: snapshotColor,
      roll: resolved.compatibleRolls[0],
    });
    const afterPrint = resolveFinishCompatibility({
      slot: "FACE",
      allowedApplicationIds: FACE_ALLOWANCE,
      organization: HUB_MEDIA_FINISH_OVERLAY,
      selection: faceSelection("print_face", {
        rollProfileId: HUB_MEDIA_PRINT_ROLL_1050_ID,
        rollWidthMm: 1050,
        laminated: false,
      }),
    });
    expect(afterPrint.status).toBe("OK");
    snapshotColor.displayName = "MUTATED";
    expect(snapshot).toEqual({
      applicationId: "face_letters_premium",
      colorId: "oracal:651:010",
      colorCode: "010",
      colorDisplayName: "White",
      swatch: "#E6E9EE",
      rollProfileId: SHARED_ORACAL_ROLL_1000_ID,
      rollWidthMm: 1000,
      laminated: null,
    });
  });
});
