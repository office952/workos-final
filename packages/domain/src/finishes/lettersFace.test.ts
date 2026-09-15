import { describe, expect, it } from "vitest";
import {
  MAT_VINYL_LAMINATE_ID,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_651_ID,
  MAT_VINYL_ORACAL_8500_ID,
  MAT_VINYL_PRINT_ID,
  SVC_LARGE_FORMAT_PRINT_ID,
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
import { getColorById } from "./colorRegistry.js";
import {
  FACE_COLOR_CODE_FIELD,
  FACE_COLOR_DISPLAY_NAME_FIELD,
  FACE_COLOR_ID_FIELD,
  FACE_COLOR_SWATCH_FIELD,
  FACE_FINISH_APPLICATION_FIELD,
  FACE_FINISH_FIELD,
  FACE_PRINT_ROLL_PROFILE_FIELD,
  FACE_ROLL_PROFILE_FIELD,
  FACE_ROLL_WIDTH_MM_FIELD,
  FACE_VINYL_SERIES_FIELD,
  LETTERS_FACE_COLOR_651_010_ID,
  LETTERS_FACE_COLOR_8500_010_ID,
  LETTERS_FACE_V2_ALLOWED_APPLICATIONS,
  defaultFinishOrganization,
  lettersFaceReadyValues,
  normalizeLettersFaceDraft,
  projectLettersFaceOptions,
  resolveLettersFaceDraft,
} from "./lettersFace.js";
import {
  SHARED_ORACAL_ROLL_1000_ID,
  SHARED_ORACAL_ROLL_1260_ID,
  SHARED_PRINT_ROLL_1050_ID,
} from "./rolls.js";
import type { ColorCatalogItem, OrganizationFinishOverlay, RollProfile } from "./types.js";
import type { DraftValues } from "../product/types.js";

const readyBase: DraftValues = {
  "root.inscription": "WORKOS",
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

function compileFace(values: DraftValues) {
  return compileDefinition(frontlitPlexiAl06Template, frontlitPlexiAl06FormSchema, {
    templateCode: CANONICAL_PRODUCT_CODE,
    values: { ...readyBase, ...values },
  });
}

function faceResources(values: DraftValues): string[] {
  const compiled = compileFace(values);
  const evaluations = evaluateProductComponents({
    template: frontlitPlexiAl06Template,
    selectedComponentIds: compiled.selectedComponentIds,
    values: compiled.values,
    measurements: compiled.measurements,
  });
  return evaluations
    .find((item) => item.component.id === "FACE")
    ?.result.requirements.map((item) => item.resourceId) ?? [];
}

describe("LETTERS FACE V2 resolver", () => {
  it("keeps FACE none ready without finish materials", () => {
    const compiled = compileFace(lettersFaceReadyValues("none"));
    expect(compiled.readiness).toBe("ready");
    expect(compiled.templateVersion).toBe("2");
    expect(compiled.values[FACE_FINISH_APPLICATION_FIELD]).toBeUndefined();
    expect(faceResources(lettersFaceReadyValues("none"))).not.toEqual(
      expect.arrayContaining([
        MAT_VINYL_ORACAL_651_ID,
        MAT_VINYL_PRINT_ID,
      ]),
    );
  });

  it("accepts valid 641, 651, 8500, print and print+lamination selections", () => {
    for (const kind of ["641", "651", "8500", "print", "print_laminated"] as const) {
      const compiled = compileFace(lettersFaceReadyValues(kind));
      expect(compiled.readiness, kind).toBe("ready");
    }
  });

  it("resolves 641 to the 641 resource while using the 651 palette", () => {
    const compiled = compileFace(lettersFaceReadyValues("641"));
    expect(compiled.values[FACE_FINISH_APPLICATION_FIELD]).toBe("face_letters_standard");
    expect(compiled.values[FACE_COLOR_ID_FIELD]).toBe(LETTERS_FACE_COLOR_651_010_ID);
    expect(faceResources(lettersFaceReadyValues("641"))).toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_641_ID]),
    );
    expect(faceResources(lettersFaceReadyValues("641"))).not.toContain(MAT_VINYL_ORACAL_651_ID);
  });

  it("resolves 651 and 8500 to their own resources", () => {
    expect(faceResources(lettersFaceReadyValues("651"))).toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_651_ID]),
    );
    expect(faceResources(lettersFaceReadyValues("8500"))).toEqual(
      expect.arrayContaining([MAT_VINYL_ORACAL_8500_ID]),
    );
  });

  it("resolves print resources and adds laminate only when selected", () => {
    const print = faceResources(lettersFaceReadyValues("print"));
    expect(print).toEqual(
      expect.arrayContaining([MAT_VINYL_PRINT_ID, SVC_LARGE_FORMAT_PRINT_ID]),
    );
    expect(print).not.toContain(MAT_VINYL_LAMINATE_ID);
    const laminated = faceResources(lettersFaceReadyValues("print_laminated"));
    expect(laminated).toEqual(
      expect.arrayContaining([
        MAT_VINYL_PRINT_ID,
        SVC_LARGE_FORMAT_PRINT_ID,
        MAT_VINYL_LAMINATE_ID,
      ]),
    );
  });

  it("blocks missing Oracal series, color and roll", () => {
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { [FACE_FINISH_FIELD]: "oracal" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "MISSING_ORACAL_SERIES" }] });
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { [FACE_FINISH_FIELD]: "oracal", [FACE_VINYL_SERIES_FIELD]: "651" },
      }),
    ).toMatchObject({
      ok: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: "MISSING_ORACAL_COLOR" }),
        expect.objectContaining({ code: "MISSING_ORACAL_ROLL" }),
      ]),
    });
  });

  it("blocks invalid, wrong-series and inactive colors", () => {
    const base = {
      [FACE_FINISH_FIELD]: "oracal",
      [FACE_VINYL_SERIES_FIELD]: "651",
      [FACE_ROLL_PROFILE_FIELD]: SHARED_ORACAL_ROLL_1260_ID,
    };
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_COLOR_ID_FIELD]: "oracal:651:missing" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INVALID_COLOR" }] });
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_COLOR_ID_FIELD]: LETTERS_FACE_COLOR_8500_010_ID },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "WRONG_SERIES_COLOR" }] });
    const inactive: ColorCatalogItem = {
      ...getColorById(LETTERS_FACE_COLOR_651_010_ID)!,
      id: "oracal:651:inactive-test",
      active: false,
    };
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_COLOR_ID_FIELD]: inactive.id },
        extraColors: [inactive],
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INACTIVE_COLOR" }] });
  });

  it("blocks invalid, inactive and wrong-family rolls", () => {
    const base = {
      [FACE_FINISH_FIELD]: "oracal",
      [FACE_VINYL_SERIES_FIELD]: "651",
      [FACE_COLOR_ID_FIELD]: LETTERS_FACE_COLOR_651_010_ID,
    };
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_ROLL_PROFILE_FIELD]: "roll:missing" },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INVALID_ROLL" }] });
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_ROLL_PROFILE_FIELD]: SHARED_PRINT_ROLL_1050_ID },
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "WRONG_FAMILY_ROLL" }] });
    const inactive: RollProfile = {
      id: "roll:test:oracal:inactive",
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
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: { ...base, [FACE_ROLL_PROFILE_FIELD]: inactive.id },
        extraRolls: [inactive],
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "INACTIVE_ROLL" }] });
  });

  it("blocks org-disabled applications as ORG_CAPABILITY_DISABLED", () => {
    const organization: OrganizationFinishOverlay = {
      ...defaultFinishOrganization(),
      enabledApplicationIds: ["none", "face_letters_premium"],
    };
    expect(
      resolveLettersFaceDraft({
        template: frontlitPlexiAl06Template,
        values: lettersFaceReadyValues("print_laminated"),
        organization,
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "ORG_CAPABILITY_DISABLED" }] });
  });

  it("blocks template-forbidden applications as PRODUCT_TRUTH_CONFLICT", () => {
    const template = {
      ...frontlitPlexiAl06Template,
      slotFinishAllowances: [
        {
          slot: "FACE" as const,
          allowedApplicationIds: ["none", "face_letters_premium"] as const,
        },
      ],
    };
    expect(
      resolveLettersFaceDraft({
        template,
        values: lettersFaceReadyValues("print"),
      }),
    ).toMatchObject({ ok: false, issues: [{ code: "PRODUCT_TRUTH_CONFLICT" }] });
  });

  it("ignores hidden stale Oracal values after switching to none", () => {
    const compiled = compileFace({
      ...lettersFaceReadyValues("651"),
      [FACE_FINISH_FIELD]: "none",
    });
    expect(compiled.readiness).toBe("ready");
    expect(compiled.values[FACE_COLOR_ID_FIELD]).toBeUndefined();
    expect(compiled.values[FACE_ROLL_PROFILE_FIELD]).toBeUndefined();
    expect(compiled.values[FACE_COLOR_CODE_FIELD]).toBeUndefined();
    expect(compiled.values[FACE_FINISH_APPLICATION_FIELD]).toBeUndefined();
    expect(faceResources({ ...lettersFaceReadyValues("651"), [FACE_FINISH_FIELD]: "none" })).not.toContain(
      MAT_VINYL_ORACAL_651_ID,
    );
  });

  it("snapshots color and roll primitives", () => {
    const compiled = compileFace(lettersFaceReadyValues("651"));
    const color = getColorById(LETTERS_FACE_COLOR_651_010_ID);
    expect(compiled.values[FACE_COLOR_CODE_FIELD]).toBe(color?.code);
    expect(compiled.values[FACE_COLOR_DISPLAY_NAME_FIELD]).toBe(color?.displayName);
    expect(compiled.values[FACE_COLOR_SWATCH_FIELD]).toBe(color?.swatch);
    expect(compiled.values[FACE_ROLL_WIDTH_MM_FIELD]).toBe(1260);
  });

  it("normalizes a legacy vinyl draft and resolves a deterministic catalog color", () => {
    const normalized = normalizeLettersFaceDraft({
      [FACE_FINISH_FIELD]: "vinyl",
      "face.color": "010",
    });
    expect(normalized[FACE_FINISH_FIELD]).toBe("oracal");
    expect(normalized[FACE_VINYL_SERIES_FIELD]).toBe("651");
    expect(normalized[FACE_COLOR_ID_FIELD]).toBe(LETTERS_FACE_COLOR_651_010_ID);
    const guessed = normalizeLettersFaceDraft({
      [FACE_FINISH_FIELD]: "vinyl",
      "face.color": "alb",
    });
    expect(guessed[FACE_COLOR_ID_FIELD]).toBeUndefined();
  });

  it("does not recompile a historical V1 snapshot through V2", () => {
    const v1 = compileDefinition(frontlitPlexiAl06TemplateV1, frontlitPlexiAl06FormSchemaV1, {
      templateCode: CANONICAL_PRODUCT_CODE,
      values: {
        ...readyBase,
        [FACE_FINISH_FIELD]: "vinyl",
        "face.color": "alb",
        "face.confirmedAreaMm2": 250000,
      },
    });
    expect(v1.templateVersion).toBe("1");
    expect(v1.readiness).toBe("ready");
    expect(v1.values[FACE_FINISH_FIELD]).toBe("vinyl");
    expect(v1.values["face.color"]).toBe("alb");
    expect(v1.values[FACE_COLOR_ID_FIELD]).toBeUndefined();
    expect(v1.values[FACE_FINISH_APPLICATION_FIELD]).toBeUndefined();
  });

  it("projects catalog options from shared registries, not FormSchema literals", () => {
    const oracal = projectLettersFaceOptions({
      template: frontlitPlexiAl06Template,
      values: { [FACE_FINISH_FIELD]: "oracal", [FACE_VINYL_SERIES_FIELD]: "651" },
    });
    expect(oracal.catalogColors[FACE_COLOR_ID_FIELD]).toHaveLength(79);
    expect(oracal.catalogRolls[FACE_ROLL_PROFILE_FIELD]?.map((item) => item.id)).toEqual([
      SHARED_ORACAL_ROLL_1000_ID,
      SHARED_ORACAL_ROLL_1260_ID,
    ]);
    const print = projectLettersFaceOptions({
      template: frontlitPlexiAl06Template,
      values: { [FACE_FINISH_FIELD]: "print" },
    });
    expect(print.catalogRolls[FACE_PRINT_ROLL_PROFILE_FIELD]?.map((item) => item.widthMm)).toEqual([
      1050, 1370,
    ]);
    expect(LETTERS_FACE_V2_ALLOWED_APPLICATIONS).toEqual([
      "none",
      "face_letters_standard",
      "face_letters_premium",
      "illuminated_letter_face",
      "print_face",
      "print_face_laminated",
    ]);
    expect(
      frontlitPlexiAl06FormSchema.sections
        .flatMap((section) => section.fields)
        .some((field) => field.id === FACE_COLOR_ID_FIELD && (field.options?.length ?? 0) > 0),
    ).toBe(false);
  });
});
