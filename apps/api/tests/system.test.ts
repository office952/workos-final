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
        variants: Array<{
          variantId: string;
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
    expect(body.roles[0]?.variants[0]?.usedBy[0]?.productCode).toBe(
      CANONICAL_PRODUCT_CODE,
    );
    expect(body.roles[3]?.variants[0]?.eic).toBe("Indisponibil");
    expect(body.roles[3]?.variants[0]?.technicalSettings).toEqual([
      expect.objectContaining({ id: "ledPitchMm", valueDisplay: "100 mm" }),
      expect.objectContaining({ id: "psuReservePercent", valueDisplay: "Nesetat" }),
    ]);
    expect(JSON.stringify(body)).not.toMatch(/RETURN_CANT/);
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
