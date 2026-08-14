import { describe, expect, it } from "vitest";
import { frontlitPlexiAl06FormSchema } from "./frontlitPlexiAl06.js";
import {
  LED_PITCH_SETTING_ID,
  PSU_RESERVE_SETTING_ID,
  createTechnicalSettingsRegistry,
  listVariantTechnicalSettings,
  projectTechnicalSettings,
  unresolvedSettingReasons,
  type ComponentTechnicalSettingDefinition,
} from "./technicalSettings.js";

function fixtureSetting(
  overrides: Partial<ComponentTechnicalSettingDefinition> &
    Pick<ComponentTechnicalSettingDefinition, "id" | "variantId" | "resolution" | "classification">,
): ComponentTechnicalSettingDefinition {
  return {
    label: overrides.label ?? overrides.id,
    description: "fixture",
    valueType: "number",
    unit: "mm",
    source: "test fixture",
    configurable: true,
    unresolvedReason: `${overrides.id} nerezolvat`,
    ...overrides,
  };
}

describe("technical settings registry", () => {
  it("looks up settings by variant and rejects duplicate ids", () => {
    const registry = createTechnicalSettingsRegistry([
      fixtureSetting({
        id: "wasteFactor",
        variantId: "FACE_PLEXIGLAS_3MM",
        classification: "OWNER_CONFIRMED",
        resolution: { status: "RESOLVED", value: 1.1 },
      }),
      fixtureSetting({
        id: "cncToleranceMm",
        variantId: "FACE_PLEXIGLAS_3MM",
        classification: "OWNER_DECISION_REQUIRED",
        resolution: { status: "UNRESOLVED", reason: "OWNER_DECISION_REQUIRED" },
      }),
    ]);

    expect(registry.get("FACE_PLEXIGLAS_3MM", "wasteFactor")?.resolution).toEqual({
      status: "RESOLVED",
      value: 1.1,
    });
    expect(registry.listByVariant("FACE_PLEXIGLAS_3MM").map((item) => item.id)).toEqual([
      "wasteFactor",
      "cncToleranceMm",
    ]);
    expect(registry.listByVariant("LIGHTING_FRONT_LED")).toEqual([]);
    expect(
      unresolvedSettingReasons(registry.listByVariant("FACE_PLEXIGLAS_3MM"), [
        "wasteFactor",
        "cncToleranceMm",
      ]),
    ).toEqual(["cncToleranceMm nerezolvat"]);

    expect(() =>
      createTechnicalSettingsRegistry([
        fixtureSetting({
          id: "wasteFactor",
          variantId: "FACE_PLEXIGLAS_3MM",
          classification: "OWNER_CONFIRMED",
          resolution: { status: "RESOLVED", value: 1 },
        }),
        fixtureSetting({
          id: "wasteFactor",
          variantId: "FACE_PLEXIGLAS_3MM",
          classification: "OWNER_CONFIRMED",
          resolution: { status: "RESOLVED", value: 2 },
        }),
      ]),
    ).toThrow(/Duplicate technical setting/);
  });

  it("rejects classification that does not match resolution", () => {
    expect(() =>
      createTechnicalSettingsRegistry([
        fixtureSetting({
          id: "broken",
          variantId: "VOLUME_ALUMINIUM_06",
          classification: "OWNER_CONFIRMED",
          resolution: { status: "UNRESOLVED", reason: "OWNER_DECISION_REQUIRED" },
        }),
      ]),
    ).toThrow(/owner-confirmed but not resolved/);
  });
});

describe("canonical lighting settings", () => {
  it("owns LED pitch once and leaves PSU reserve unset", () => {
    const settings = listVariantTechnicalSettings("LIGHTING_FRONT_LED");
    expect(settings.map((item) => item.id)).toEqual([
      LED_PITCH_SETTING_ID,
      PSU_RESERVE_SETTING_ID,
    ]);
    expect(settings[0]?.resolution).toEqual({ status: "RESOLVED", value: 100 });
    expect(settings[1]?.resolution.status).toBe("UNRESOLVED");
    expect(projectTechnicalSettings("LIGHTING_FRONT_LED")).toEqual([
      {
        id: LED_PITCH_SETTING_ID,
        label: "Pas module LED",
        valueDisplay: "100 mm",
        statusLabel: "Setat",
        sourceLabel: "Confirmat de owner",
        administrationLabel: "Configurabil",
      },
      {
        id: PSU_RESERVE_SETTING_ID,
        label: "Rezervă sursă de alimentare",
        valueDisplay: "Nesetat",
        statusLabel: "Necesită decizie owner",
        sourceLabel: "Necesită decizie owner",
        administrationLabel: "Configurabil",
      },
    ]);
  });

  it("keeps system settings out of product intake", () => {
    const fieldIds = frontlitPlexiAl06FormSchema.sections.flatMap((section) =>
      section.fields.map((field) => field.id),
    );
    expect(fieldIds).not.toContain(LED_PITCH_SETTING_ID);
    expect(fieldIds).not.toContain(PSU_RESERVE_SETTING_ID);
    expect(JSON.stringify(frontlitPlexiAl06FormSchema)).not.toMatch(
      /ledPitch|psuReserve|Pas module LED|Rezervă sursă/,
    );
  });
});
