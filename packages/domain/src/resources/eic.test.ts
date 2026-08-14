import { describe, expect, it } from "vitest";
import {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
} from "../product/compiler.js";
import { lettersFormSchema, lettersTemplate } from "../product/letters.js";
import {
  costEvidence,
  getCostEvidence,
  getResource,
  resourceCatalog,
} from "./catalog.js";
import { applyRequirement, compileEic, resourceRequirements } from "./eic.js";

const readyValues = {
  "root.inscription": "WORKOS",
  "face.material": "plexiglas",
  "face.finish": "none",
  "returnCant.material": "aluminum",
  "returnCant.depthMm": 60,
  "returnCant.finish": "none",
  "returnCant.confirmedPerimeterMm": 12500,
  "back.material": "forex",
  "lighting.selected": false,
};

function confirmedSpine() {
  const definition = compileDefinition(lettersTemplate, lettersFormSchema, {
    templateCode: "letters",
    values: readyValues,
  });
  const truth = confirmReviewedDefinition(definition, definition.reviewId);
  if ("ok" in truth) {
    throw new Error("expected confirmed truth");
  }
  const aggregate = compileAggregate(truth, lettersTemplate, lettersFormSchema);
  return { definition, truth, aggregate };
}

describe("resource ownership", () => {
  it("keeps rates only in the resource catalog", () => {
    expect(JSON.stringify(lettersTemplate)).not.toMatch(/amount|EUR|rate/i);
    const { truth, aggregate } = confirmedSpine();
    expect(JSON.stringify(truth)).not.toMatch(/"amount":10|"amount":15/);
    expect(aggregate.quantities[0]?.value).toBe(12.5);
    expect(JSON.stringify(aggregate)).not.toMatch(/"amount":10|"amount":15/);
    expect(costEvidence.map((item) => item.resourceId).sort()).toEqual(
      resourceCatalog.map((item) => item.id).sort(),
    );
  });
});

describe("EIC", () => {
  it("multiplies confirmed quantity by catalog rates and stays partial", () => {
    const { aggregate } = confirmedSpine();
    const requirements = resourceRequirements(aggregate);
    expect(requirements).toHaveLength(2);
    const eic = compileEic(aggregate);
    expect(eic.completeness).toBe("PARTIAL");
    expect(eic.currency).toBe("EUR");
    expect(eic.lines.map((line) => line.cost)).toEqual([125, 187.5]);
    expect(eic.total).toBe(312.5);
    expect(eic.excludedComponentLabels).toEqual(["Față", "Spate", "Iluminare"]);
    expect(JSON.stringify(eic)).not.toMatch(/customer|markup|quote/i);
  });

  it("fails explicitly for an unknown resource", () => {
    expect(getResource("missing_resource")).toBeUndefined();
    expect(getCostEvidence("missing_resource")).toBeUndefined();
    expect(() =>
      applyRequirement({
        componentId: "RETURN_CANT",
        resourceId: "missing_resource",
        quantity: 1,
        unit: "m",
      }),
    ).toThrow(/Unknown resource missing_resource/);
  });
});
