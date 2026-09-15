import { describe, expect, it } from "vitest";
import {
  LAB_VINYL_VOLUME_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
  SVC_PAINT_RAL_ID,
} from "../resources/catalog.js";
import { compileDefinition } from "../product/compiler.js";
import {
  CANONICAL_PRODUCT_CODE,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06FormSchemaV1,
  frontlitPlexiAl06Template,
  frontlitPlexiAl06TemplateV1,
} from "../product/frontlitPlexiAl06.js";
import { evaluateProductComponents } from "../product/componentEvaluation.js";
import { composeProductProcessesFromTruth } from "../processes/composition.js";
import { confirmReviewedDefinition } from "../product/compiler.js";
import { compileEic } from "../resources/eic.js";
import { compileAggregate } from "../product/compiler.js";
import { seededDisplayLabelCatalog } from "../product/displayMetadata.js";
import { getColorById } from "./colorRegistry.js";
import { lettersFaceReadyValues } from "./lettersFace.js";
import {
  LETTERS_VOLUME_COLOR_651_010_ID,
  LETTERS_VOLUME_RAL_9005_ID,
  LETTERS_VOLUME_RAL_9010_ID,
  LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS,
  VOLUME_COLOR_CODE_FIELD,
  VOLUME_COLOR_DISPLAY_NAME_FIELD,
  VOLUME_COLOR_ID_FIELD,
  VOLUME_COLOR_SWATCH_FIELD,
  VOLUME_FINISH_APPLICATION_FIELD,
  VOLUME_FINISH_FIELD,
  VOLUME_RAL_COLOR_ID_FIELD,
  VOLUME_RETURN_WRAP_ALLOWANCE_FIELD,
  VOLUME_ROLL_PROFILE_FIELD,
  VOLUME_ROLL_WIDTH_MM_FIELD,
  VOLUME_STOCK_COLOR_FIELD,
  VOLUME_VINYL_SERIES_FIELD,
  lettersVolumeReadyValues,
  normalizeLettersVolumeDraft,
  projectLettersVolumeOptions,
  resolveLettersVolumeDraft,
} from "./lettersVolume.js";
import { defaultFinishOrganization as sharedOrg } from "./lettersFace.js";
import {
  SHARED_ORACAL_ROLL_1000_ID,
  SHARED_ORACAL_ROLL_1260_ID,
  SHARED_PRINT_ROLL_1050_ID,
} from "./rolls.js";
import type { ColorCatalogItem, OrganizationFinishOverlay, RollProfile } from "./types.js";
import type { DraftValues } from "../product/types.js";

const readyFace: DraftValues = {
  "root.inscription": "WORKOS",
  ...lettersFaceReadyValues("none"),
};

function compileVolume(values: DraftValues) {
  return compileDefinition(frontlitPlexiAl06Template, frontlitPlexiAl06FormSchema, {
    templateCode: CANONICAL_PRODUCT_CODE,
    values: { ...readyFace, ...values },
  });
}

function volumeResources(values: DraftValues): string[] {
  const compiled = compileVolume(values);
  const evaluations = evaluateProductComponents({
    template: frontlitPlexiAl06Template,
    selectedComponentIds: compiled.selectedComponentIds,
    values: compiled.values,
    measurements: compiled.measurements,
  });
  return (
    evaluations
      .find((item) => item.component.id === "VOLUME")
      ?.result.requirements.map((item) => item.resourceId) ?? []
  );
}

function volumeVinylQuantity(values: DraftValues): number | undefined {
  const compiled = compileVolume(values);
  const evaluations = evaluateProductComponents({
    template: frontlitPlexiAl06Template,
    selectedComponentIds: compiled.selectedComponentIds,
    values: compiled.values,
    measurements: compiled.measurements,
  });
  return evaluations
    .find((item) => item.component.id === "VOLUME")
    ?.result.requirements.find(
      (item) =>
        item.resourceId === MAT_VINYL_ORACAL_641_ID ||
        item.resourceId === MAT_VINYL_ORACAL_651_ID,
    )?.quantity;
}

describe("LETTERS VOLUME V2 resolver", () => {
  it("accepts stock at 30/60/80/100 without Oracal or RAL cost rows", () => {
    for (const depth of ["30", "60", "80", "100"] as const) {
      const compiled = compileVolume({
        ...lettersVolumeReadyValues("stock"),
        "volume.depthMm": depth,
      });
      expect(compiled.readiness, depth).toBe("ready");
      expect(compiled.values[VOLUME_FINISH_FIELD]).toBe("stock");
      expect(compiled.values[VOLUME_FINISH_APPLICATION_FIELD]).toBe("return_stock");
      const resources = volumeResources({
        ...lettersVolumeReadyValues("stock"),
        "volume.depthMm": depth,
      });
      expect(resources).not.toEqual(
        expect.arrayContaining([
          MAT_VINYL_ORACAL_641_ID,
          MAT_VINYL_ORACAL_651_ID,
          SVC_PAINT_RAL_ID,
        ]),
      );
    }
  });

  it("accepts 641, 651 and RAL selections", () => {
    for (const kind of ["641", "651", "painted"] as const) {
      expect(compileVolume(lettersVolumeReadyValues(kind)).readiness, kind).toBe("ready");
    }
  });

  it("projects 641 from the 651 palette and resolves the 641 material", () => {
    const compiled = compileVolume(lettersVolumeReadyValues("641"));
    expect(compiled.values[VOLUME_FINISH_APPLICATION_FIELD]).toBe("return_letters_standard");
    expect(compiled.values[VOLUME_COLOR_ID_FIELD]).toBe(LETTERS_VOLUME_COLOR_651_010_ID);
    expect(compiled.values[VOLUME_RETURN_WRAP_ALLOWANCE_FIELD]).toBe(10);
    expect(volumeResources(lettersVolumeReadyValues("641"))).toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_641_ID]),
    );
    expect(volumeResources(lettersVolumeReadyValues("641"))).not.toContain(MAT_VINYL_ORACAL_651_ID);
    const options = projectLettersVolumeOptions({
      template: frontlitPlexiAl06Template,
      values: lettersVolumeReadyValues("641"),
    });
    expect(options.catalogColors[VOLUME_COLOR_ID_FIELD]).toHaveLength(79);
  });

  it("resolves 651 material and RAL service without double-charging vinyl", () => {
    expect(volumeResources(lettersVolumeReadyValues("651"))).toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_651_ID]),
    );
    expect(volumeResources(lettersVolumeReadyValues("painted"))).not.toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_641_ID, MAT_VINYL_ORACAL_651_ID]),
    );
    const painted = compileVolume(lettersVolumeReadyValues("painted"));
    const truth = confirmReviewedDefinition(painted, painted.reviewId);
    if ("ok" in truth) {
      throw new Error("expected painted truth");
    }
    const aggregate = compileAggregate(
      truth,
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      seededDisplayLabelCatalog(),
    );
    const composition = composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template);
    const eic = compileEic(aggregate, composition);
    expect(eic.lines.some((line) => line.resourceId === SVC_PAINT_RAL_ID)).toBe(true);
    expect(eic.lines.filter((line) => line.resourceId === SVC_PAINT_RAL_ID)).toHaveLength(1);
    const oracal = compileVolume(lettersVolumeReadyValues("651"));
    const oracalTruth = confirmReviewedDefinition(oracal, oracal.reviewId);
    if ("ok" in oracalTruth) {
      throw new Error("expected oracal truth");
    }
    const oracalEic = compileEic(
      compileAggregate(
        oracalTruth,
        frontlitPlexiAl06Template,
        frontlitPlexiAl06FormSchema,
        seededDisplayLabelCatalog(),
      ),
      composeProductProcessesFromTruth(oracalTruth, frontlitPlexiAl06Template),
    );
    expect(oracalEic.lines.some((line) => line.resourceId === LAB_VINYL_VOLUME_ID)).toBe(true);
    expect(oracalEic.lines.filter((line) => line.resourceId === LAB_VINYL_VOLUME_ID)).toHaveLength(1);
  });

  it("uses perimeter × (depth + 10 mm) and does not add 20% waste", () => {
    expect(volumeVinylQuantity(lettersVolumeReadyValues("651"))).toBe(0.875);
    expect(volumeVinylQuantity({ ...lettersVolumeReadyValues("651"), "volume.depthMm": "80" })).toBe(
      1.125,
    );
  });

  it("blocks missing Oracal series, color and roll", () => {
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { [VOLUME_FINISH_FIELD]: "oracal" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "MISSING_ORACAL_SERIES" }] });
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { [VOLUME_FINISH_FIELD]: "oracal", [VOLUME_VINYL_SERIES_FIELD]: "651" },
      }),
    ).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: "MISSING_ORACAL_COLOR" }),
        expect.objectContaining({ code: "MISSING_ORACAL_ROLL" }),
      ]),
    });
  });

  it("blocks invalid, wrong-system and inactive colors", () => {
    const base = {
      [VOLUME_FINISH_FIELD]: "oracal",
      [VOLUME_VINYL_SERIES_FIELD]: "651",
      [VOLUME_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
    };
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_COLOR_ID_FIELD]: "oracal:651:missing" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INVALID_COLOR" }] });
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_COLOR_ID_FIELD]: LETTERS_VOLUME_RAL_9005_ID },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "WRONG_SERIES_COLOR" }] });
    const inactive: ColorCatalogItem = {
      ...getColorById(LETTERS_VOLUME_COLOR_651_010_ID)!,
      id: "oracal:651:inactive-volume",
      active: false,
    };
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_COLOR_ID_FIELD]: inactive.id },
        extraColors: [inactive],
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INACTIVE_COLOR" }] });
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { [VOLUME_FINISH_FIELD]: "painted" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "MISSING_RAL_COLOR" }] });
  });

  it("blocks invalid, inactive and wrong-family rolls", () => {
    const base = {
      [VOLUME_FINISH_FIELD]: "oracal",
      [VOLUME_VINYL_SERIES_FIELD]: "651",
      [VOLUME_COLOR_ID_FIELD]: LETTERS_VOLUME_COLOR_651_010_ID,
    };
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_ROLL_PROFILE_FIELD]: "roll:missing" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INVALID_ROLL" }] });
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_ROLL_PROFILE_FIELD]: SHARED_PRINT_ROLL_1050_ID },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "WRONG_FAMILY_ROLL" }] });
    const inactive: RollProfile = {
      id: "roll:test:oracal:inactive-volume",
      family: "oracal",
      brand: "Oracal",
      series: null,
      widthMm: 900,
      active: false,
      isDefault: false,
      scope: { kind: "shared" },
      notes: "Inactive fixture",
      source: "TEST",
    };
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [VOLUME_ROLL_PROFILE_FIELD]: inactive.id },
        extraRolls: [inactive],
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INACTIVE_ROLL" }] });
  });

  it("ignores hidden stale Oracal values after switching to RAL or stock", () => {
    const toRal = compileVolume({
      ...lettersVolumeReadyValues("651"),
      [VOLUME_FINISH_FIELD]: "painted",
      [VOLUME_RAL_COLOR_ID_FIELD]: LETTERS_VOLUME_RAL_9005_ID,
    });
    expect(toRal.readiness).toBe("ready");
    expect(toRal.values[VOLUME_COLOR_ID_FIELD]).toBeUndefined();
    expect(toRal.values[VOLUME_ROLL_PROFILE_FIELD]).toBeUndefined();
    expect(toRal.values[VOLUME_VINYL_SERIES_FIELD]).toBeUndefined();
    expect(toRal.values[VOLUME_FINISH_APPLICATION_FIELD]).toBe("return_ral");
    expect(volumeResources({
      ...lettersVolumeReadyValues("651"),
      [VOLUME_FINISH_FIELD]: "painted",
      [VOLUME_RAL_COLOR_ID_FIELD]: LETTERS_VOLUME_RAL_9005_ID,
    })).not.toContain(MAT_VINYL_ORACAL_651_ID);

    const toStock = compileVolume({
      ...lettersVolumeReadyValues("painted"),
      [VOLUME_FINISH_FIELD]: "stock",
      [VOLUME_STOCK_COLOR_FIELD]: "Negru",
    });
    expect(toStock.readiness).toBe("ready");
    expect(toStock.values[VOLUME_RAL_COLOR_ID_FIELD]).toBeUndefined();
    expect(toStock.values[VOLUME_COLOR_CODE_FIELD]).toBeUndefined();
    expect(toStock.values[VOLUME_STOCK_COLOR_FIELD]).toBe("Negru");
  });

  it("snapshots color, roll and wrap allowance primitives", () => {
    const compiled = compileVolume(lettersVolumeReadyValues("651"));
    const color = getColorById(LETTERS_VOLUME_COLOR_651_010_ID);
    expect(compiled.values[VOLUME_COLOR_CODE_FIELD]).toBe(color?.code);
    expect(compiled.values[VOLUME_COLOR_DISPLAY_NAME_FIELD]).toBe(color?.displayName);
    expect(compiled.values[VOLUME_COLOR_SWATCH_FIELD]).toBe(color?.swatch);
    expect(compiled.values[VOLUME_ROLL_WIDTH_MM_FIELD]).toBe(1260);
    expect(compiled.values[VOLUME_RETURN_WRAP_ALLOWANCE_FIELD]).toBe(10);
  });

  it("normalizes legacy vinyl and none drafts", () => {
    const vinyl = normalizeLettersVolumeDraft({
      [VOLUME_FINISH_FIELD]: "vinyl",
      "volume.color": "010",
    });
    expect(vinyl[VOLUME_FINISH_FIELD]).toBe("oracal");
    expect(vinyl[VOLUME_VINYL_SERIES_FIELD]).toBe("651");
    expect(vinyl[VOLUME_COLOR_ID_FIELD]).toBe(LETTERS_VOLUME_COLOR_651_010_ID);
    const none = normalizeLettersVolumeDraft({ [VOLUME_FINISH_FIELD]: "none" });
    expect(none[VOLUME_FINISH_FIELD]).toBe("stock");
    const painted = normalizeLettersVolumeDraft({
      [VOLUME_FINISH_FIELD]: "painted",
      "volume.color": "RAL 9010",
    });
    expect(painted[VOLUME_RAL_COLOR_ID_FIELD]).toBe(LETTERS_VOLUME_RAL_9010_ID);
    const ambiguous = normalizeLettersVolumeDraft({
      [VOLUME_FINISH_FIELD]: "vinyl",
      "volume.color": "alb",
    });
    expect(ambiguous[VOLUME_COLOR_ID_FIELD]).toBeUndefined();
  });

  it("does not recompile a historical V1 snapshot through V2", () => {
    const v1 = compileDefinition(frontlitPlexiAl06TemplateV1, frontlitPlexiAl06FormSchemaV1, {
      templateCode: CANONICAL_PRODUCT_CODE,
      values: {
        "root.inscription": "WORKOS",
        "face.finish": "none",
        "face.confirmedAreaMm2": 250000,
        "volume.depthMm": "60",
        [VOLUME_FINISH_FIELD]: "vinyl",
        "volume.color": "alb",
        "volume.confirmedPerimeterMm": 12500,
      },
    });
    expect(v1.templateVersion).toBe("1");
    expect(v1.readiness).toBe("ready");
    expect(v1.values[VOLUME_FINISH_FIELD]).toBe("vinyl");
    expect(v1.values["volume.color"]).toBe("alb");
    expect(v1.values[VOLUME_COLOR_ID_FIELD]).toBeUndefined();
    expect(v1.values[VOLUME_FINISH_APPLICATION_FIELD]).toBeUndefined();
    const evaluations = evaluateProductComponents({
      template: frontlitPlexiAl06TemplateV1,
      selectedComponentIds: v1.selectedComponentIds,
      values: v1.values,
      measurements: v1.measurements,
    });
    const vinyl = evaluations
      .find((item) => item.component.id === "VOLUME")
      ?.result.requirements.find((item) => item.resourceId === MAT_VINYL_ORACAL_651_ID);
    expect(vinyl?.quantity).toBe(0.75);
  });

  it("projects catalog options from shared registries, not FormSchema literals", () => {
    const oracal = projectLettersVolumeOptions({
      template: frontlitPlexiAl06Template,
      values: { [VOLUME_FINISH_FIELD]: "oracal", [VOLUME_VINYL_SERIES_FIELD]: "651" },
    });
    expect(oracal.catalogColors[VOLUME_COLOR_ID_FIELD]).toHaveLength(79);
    expect(oracal.catalogRolls[VOLUME_ROLL_PROFILE_FIELD]?.map((item) => item.id)).toEqual([
      SHARED_ORACAL_ROLL_1000_ID,
      SHARED_ORACAL_ROLL_1260_ID,
    ]);
    const ral = projectLettersVolumeOptions({
      template: frontlitPlexiAl06Template,
      values: { [VOLUME_FINISH_FIELD]: "painted" },
    });
    expect(ral.catalogColors[VOLUME_RAL_COLOR_ID_FIELD]).toHaveLength(213);
    expect(LETTERS_VOLUME_V2_ALLOWED_APPLICATIONS).toEqual([
      "return_stock",
      "return_letters_standard",
      "return_cant_volum_wrapping",
      "return_ral",
    ]);
    expect(
      frontlitPlexiAl06FormSchema.sections
        .flatMap((section) => section.fields)
        .some((field) => field.id === VOLUME_COLOR_ID_FIELD && (field.options?.length ?? 0) > 0),
    ).toBe(false);
  });

  it("blocks org-disabled volume applications", () => {
    const organization: OrganizationFinishOverlay = {
      ...sharedOrg(),
      enabledApplicationIds: ["return_stock"],
    };
    expect(
      resolveLettersVolumeDraft({
        template: frontlitPlexiAl06Template,
        values: lettersVolumeReadyValues("651"),
        organization,
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "ORG_CAPABILITY_DISABLED" }] });
  });
});
