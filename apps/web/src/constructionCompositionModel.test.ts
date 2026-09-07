import { describe, expect, it } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  getFormSchemaForTemplate,
  getProductTemplate,
} from "@workos-final/domain";
import { projectConstructionComposition } from "./constructionCompositionModel";

describe("projectConstructionComposition", () => {
  it("projects LETTERS roles from the template, including lighting as a branch", () => {
    const template = getProductTemplate(CANONICAL_PRODUCT_CODE)!;
    const nodes = projectConstructionComposition(
      template,
      getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE)!,
      {},
    );
    expect(nodes.map((node) => node.id)).toEqual(["ROOT", "FACE", "VOLUME", "BACK", "LIGHTING"]);
    expect(nodes.find((node) => node.id === "LIGHTING")?.attachesToId).toBe("VOLUME");
    expect(nodes.some((node) => node.role === "VOLUME")).toBe(true);
    expect(nodes.some((node) => node.role === "LIGHTING")).toBe(true);
  });

  it("does not invent VOLUME or LIGHTING for ACM cassette", () => {
    const template = getProductTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE)!;
    const nodes = projectConstructionComposition(
      template,
      getFormSchemaForTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE)!,
      {},
    );
    expect(nodes.map((node) => node.id)).toEqual(["ROOT", "FACE", "BACK"]);
    expect(nodes.some((node) => node.role === "VOLUME")).toBe(false);
    expect(nodes.some((node) => node.role === "LIGHTING")).toBe(false);
    expect(nodes.find((node) => node.id === "FACE")?.label).toBe("Corp casetă ACM");
  });
});
