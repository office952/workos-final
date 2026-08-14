import { describe, expect, it } from "vitest";
import { CANONICAL_PRODUCT_CODE } from "@workos-final/domain";
import { createApp } from "../src/app.js";

describe("system projection API", () => {
  it("projects reusable components from domain contracts", async () => {
    const response = await createApp().request("/api/components");
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      roles: Array<{
        role: string;
        label: string;
        types: Array<{
          typeId: string;
          eic: string;
          usedBy: Array<{ productCode: string }>;
          technicalSettings: Array<{ id: string; valueDisplay: string }>;
        }>;
      }>;
    };
    expect(body.roles.map((item) => item.role)).toEqual([
      "FACE",
      "VOLUME",
      "BACK",
      "LIGHTING",
    ]);
    expect(body.roles.map((item) => item.label)).toEqual([
      "Față",
      "Volum",
      "Spate",
      "Iluminare",
    ]);
    expect(body.roles[0]?.types[0]?.usedBy[0]?.productCode).toBe(
      CANONICAL_PRODUCT_CODE,
    );
    expect(body.roles[3]?.types[0]?.eic).toBe("Indisponibil");
    expect(body.roles[3]?.types[0]?.technicalSettings).toEqual([
      expect.objectContaining({ id: "ledPitchMm", valueDisplay: "100 mm" }),
      expect.objectContaining({ id: "psuReservePercent", valueDisplay: "Nesetat" }),
    ]);
    expect(JSON.stringify(body)).not.toMatch(/RETURN_CANT/);
  });

  it("projects product system administration from canonical registries", async () => {
    const response = await createApp().request("/api/product-system-admin");
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      families: Array<{ id: string; productCodes: string[] }>;
      products: Array<{
        code: string;
        composition: Array<{ typeId: string }>;
      }>;
      types: Array<{
        typeId: string;
        usedByProductCodes: string[];
        technicalSettings: Array<{ id: string }>;
      }>;
    };
    expect(body.families[0]?.id).toBe("LIGHTED_VOLUMETRIC_SIGNS");
    expect(body.families[0]?.productCodes).toEqual([CANONICAL_PRODUCT_CODE]);
    expect(body.products[0]?.composition.map((item) => item.typeId)).toEqual([
      "PLEXIGLAS_FACE",
      "ALUMINIUM_VOLUME",
      "FOREX_BACK",
      "LIGHTING_FRONT_LED",
    ]);
    expect(
      body.types.find((item) => item.typeId === "LIGHTING_FRONT_LED")
        ?.usedByProductCodes,
    ).toEqual([CANONICAL_PRODUCT_CODE]);
  });

  it("projects resources administration from the typed catalog", async () => {
    const response = await createApp().request("/api/resources-admin");
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      writeState: string;
      families: Array<{ id: string; specifications: Array<{ id: string }> }>;
      services: Array<{ id: string; kind: string }>;
      costEvidence: Array<{ resourceId: string; amount: number }>;
    };
    expect(body.writeState).toBe("NOT_IMPLEMENTED");
    expect(body.families.map((item) => item.id)).toEqual([
      "PLEXIGLAS",
      "FOREX",
      "ALUMINIUM",
    ]);
    expect(body.families[0]?.specifications[0]?.id).toBe("plexiglas_3mm_opal");
    expect(body.services[0]).toEqual(
      expect.objectContaining({ id: "return_cant_forming", kind: "SERVICE" }),
    );
    expect(body.costEvidence).toHaveLength(4);
    expect(JSON.stringify(body)).not.toMatch(/plexiglas_face_3mm|forex_back_10mm/);
  });

  it("projects operational processes from the typed catalog", async () => {
    const response = await createApp().request("/api/operational-processes");
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      writeState: string;
      processes: Array<{
        id: string;
        requiredCapabilityId: string;
        resourceLinks: Array<{ id: string }>;
      }>;
      capabilities: Array<{ id: string }>;
    };
    expect(body.writeState).toBe("NOT_IMPLEMENTED");
    expect(body.processes.map((item) => item.id)).toEqual([
      "CUT_SHEET_CNC",
      "FORM_ALUMINIUM_PROFILE",
      "APPLY_SURFACE_FINISH",
      "BOND_LETTER_BODY",
      "PLACE_LED_MODULES",
      "PAINT_RAL",
      "WIRE_LIGHTING",
      "INSTALL_OR_CONNECT_PSU",
      "TEST_LIGHTING_IGNITION",
      "CLOSE_LETTER_BODY",
      "TEST_ILLUMINATION_UNIFORMITY",
      "INSPECT_FINISHED_LETTER",
      "PACK_PRODUCT",
    ]);
    expect(
      body.processes.find((item) => item.id === "FORM_ALUMINIUM_PROFILE")
        ?.requiredCapabilityId,
    ).toBe("PROFILE_FORMING");
    expect(
      body.processes.find((item) => item.id === "FORM_ALUMINIUM_PROFILE")
        ?.resourceLinks[0]?.id,
    ).toBe("return_cant_forming");
    expect(body.capabilities.map((item) => item.id)).toContain("CNC_ROUTING");
    expect(JSON.stringify(body)).not.toMatch(/machineId|ExecutionPlan|employeeId/);
    expect(
      (body as { compositions?: Array<{ id: string }> }).compositions?.map(
        (item) => item.id,
      ),
    ).toEqual([
      "letters-finish-none",
      "letters-finish-vinyl",
      "letters-volume-painted",
    ]);
  });

  it("projects letters process composition without mutating the product", async () => {
    const response = await createApp().request(
      `/api/products/${CANONICAL_PRODUCT_CODE}/process-composition?faceFinish=vinyl&volumeFinish=vinyl`,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      composition: {
        completeness: string;
        nodes: Array<{ id: string; processId: string }>;
      };
    };
    expect(body.composition.completeness).toBe("BLOCKED");
    expect(body.composition.nodes.map((item) => item.id)).toContain(
      "FACE:CUT_SHEET_CNC",
    );
    expect(body.composition.nodes.map((item) => item.id)).toContain(
      "BACK:CUT_SHEET_CNC",
    );
    expect(body.composition.nodes.map((item) => item.id)).toContain(
      "BODY:BOND_LETTER_BODY",
    );
    expect(JSON.stringify(body)).not.toMatch(
      /machineId|employeeId|ExecutionPlan|ExecutionTask/,
    );
  });

  it("projects governance without an active freeze or commercial", async () => {
    const response = await createApp().request("/api/governance");
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      authorities: Array<{ id: string; state: string }>;
      freeze: { state: string };
    };
    expect(
      body.authorities.find((item) => item.id === "COMPONENT_TECHNICAL_SETTINGS")?.state,
    ).toBe("IMPLEMENTED");
    expect(body.authorities.find((item) => item.id === "COMMERCIAL")?.state).toBe(
      "NOT_IMPLEMENTED",
    );
    expect(body.authorities.find((item) => item.id === "ANALYZER")?.state).toBe(
      "NOT_IMPLEMENTED",
    );
    expect(body.freeze.state).toBe("PLANNED");
  });
});
