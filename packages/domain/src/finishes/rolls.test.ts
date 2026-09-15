import { describe, expect, it } from "vitest";
import {
  HUB_MEDIA_FINISH_OVERLAY,
  HUB_MEDIA_ORGANIZATION_ID,
  HUB_MEDIA_PRINT_ROLL_1050_ID,
  HUB_MEDIA_PRINT_ROLL_1370_ID,
  SHARED_ORACAL_ROLL_1000_ID,
  SHARED_ORACAL_ROLL_1260_ID,
  SHARED_PRINT_ROLL_1050_ID,
  SHARED_PRINT_ROLL_1370_ID,
  defaultRollProfile,
  resolveCompatibleRolls,
  sharedRollProfiles,
} from "./rolls.js";
import type { OrganizationFinishOverlay, RollProfile } from "./types.js";

const smallCompanyOverlay: OrganizationFinishOverlay = {
  organizationId: "org:small-sign",
  enabledApplicationIds: [
    "none",
    "face_letters_premium",
    "return_stock",
    "return_cant_volum_wrapping",
  ],
  disabledRollProfileIds: [SHARED_ORACAL_ROLL_1260_ID],
  additionalRollProfiles: [],
};

describe("roll registry foundation", () => {
  it("keeps shared Oracal and print defaults; HUB MEDIA print widths remain an overlay", () => {
    const oracal = resolveCompatibleRolls({ family: "oracal" });
    expect(oracal.map((item) => item.widthMm)).toEqual([1000, 1260]);
    expect(defaultRollProfile("oracal")?.id).toBe(SHARED_ORACAL_ROLL_1000_ID);
    expect(resolveCompatibleRolls({ family: "print" }).map((item) => item.id)).toEqual([
      SHARED_PRINT_ROLL_1050_ID,
      SHARED_PRINT_ROLL_1370_ID,
    ]);
    const hubPrint = resolveCompatibleRolls({
      family: "print",
      organization: HUB_MEDIA_FINISH_OVERLAY,
    });
    expect(hubPrint.map((item) => item.id)).toEqual([
      HUB_MEDIA_PRINT_ROLL_1050_ID,
      HUB_MEDIA_PRINT_ROLL_1370_ID,
    ]);
    expect(hubPrint[0]?.scope).toEqual({
      kind: "organization",
      organizationId: HUB_MEDIA_ORGANIZATION_ID,
    });
    expect(defaultRollProfile("print", HUB_MEDIA_FINISH_OVERLAY)?.widthMm).toBe(1050);
  });

  it("lets an organization overlay disable shared rolls and replace a width", () => {
    const replacement: RollProfile = {
      id: "roll:org:small-sign:oracal:1000",
      family: "oracal",
      brand: "Oracal",
      series: null,
      widthMm: 1000,
      active: true,
      isDefault: true,
      scope: { kind: "organization", organizationId: "org:small-sign" },
      notes: "Company-owned 1000 mm stock.",
      source: "ORGANIZATION_OVERRIDE",
    };
    const overlay: OrganizationFinishOverlay = {
      ...smallCompanyOverlay,
      additionalRollProfiles: [replacement],
    };
    const rolls = resolveCompatibleRolls({ family: "oracal", organization: overlay });
    expect(rolls).toHaveLength(1);
    expect(rolls[0]?.id).toBe(replacement.id);
    expect(rolls.some((item) => item.id === SHARED_ORACAL_ROLL_1260_ID)).toBe(false);
    expect(sharedRollProfiles.some((item) => item.id === SHARED_ORACAL_ROLL_1260_ID)).toBe(true);
  });

  it("hides inactive profiles from new configuration", () => {
    const inactive: RollProfile = {
      id: "roll:org:hub-media:print:1520",
      family: "print",
      brand: null,
      series: null,
      widthMm: 1520,
      active: false,
      isDefault: false,
      scope: { kind: "organization", organizationId: HUB_MEDIA_ORGANIZATION_ID },
      notes: "Retired width.",
      source: "ORGANIZATION_OVERRIDE",
    };
    const rolls = resolveCompatibleRolls({
      family: "print",
      organization: {
        ...HUB_MEDIA_FINISH_OVERLAY,
        additionalRollProfiles: [...HUB_MEDIA_FINISH_OVERLAY.additionalRollProfiles, inactive],
      },
    });
    expect(rolls.map((item) => item.widthMm)).toEqual([1050, 1370]);
  });
});
