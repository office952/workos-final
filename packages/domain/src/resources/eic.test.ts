import { describe, expect, it } from "vitest";
import {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
} from "../product/compiler.js";
import { seededDisplayLabelCatalog } from "../product/displayMetadata.js";
import {
  CANONICAL_PRODUCT_CODE,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
} from "../product/frontlitPlexiAl06.js";
import {
  costEvidence,
  getCostEvidence,
  getResource,
  resourceCatalog,
} from "./catalog.js";
import { applyRequirement, compileEic, resourceRequirements } from "./eic.js";

const readyValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

function confirmedSpine() {
  const definition = compileDefinition(
    frontlitPlexiAl06Template,
    frontlitPlexiAl06FormSchema,
    {
      templateCode: CANONICAL_PRODUCT_CODE,
      values: readyValues,
    },
  );
  const truth = confirmReviewedDefinition(definition, definition.reviewId);
  if ("ok" in truth) {
    throw new Error("expected confirmed truth");
  }
  const aggregate = compileAggregate(
    truth,
    frontlitPlexiAl06Template,
    frontlitPlexiAl06FormSchema,
    seededDisplayLabelCatalog(),
  );
  return { definition, truth, aggregate };
}

describe("resource ownership", () => {
  it("keeps rates only in the resource catalog", () => {
    expect(JSON.stringify(frontlitPlexiAl06Template)).not.toMatch(/amount|EUR|rate/i);
    const { truth, aggregate } = confirmedSpine();
    expect(JSON.stringify(truth)).not.toMatch(/"amount":10|"amount":15/);
    expect(
      aggregate.quantities.find((item) => item.componentId === "VOLUME")?.value,
    ).toBe(12.5);
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
    expect(requirements).toHaveLength(4);
    const eic = compileEic(aggregate);
    expect(eic.completeness).toBe("PARTIAL");
    expect(eic.currency).toBe("EUR");
    expect(eic.lines.map((line) => line.cost)).toEqual([4, 125, 187.5, 4]);
    expect(eic.total).toBe(320.5);
    expect(eic.excludedComponentLabels).toEqual(["Iluminare"]);
    expect(JSON.stringify(eic)).not.toMatch(/customer|markup|quote/i);
  });

  it("fails explicitly for an unknown resource", () => {
    expect(getResource("missing_resource")).toBeUndefined();
    expect(getCostEvidence("missing_resource")).toBeUndefined();
    expect(() =>
      applyRequirement({
        componentId: "VOLUME",
        resourceId: "missing_resource",
        quantity: 1,
        unit: "m",
      }),
    ).toThrow(/Unknown resource missing_resource/);
  });
});
