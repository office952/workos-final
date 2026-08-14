import { describe, expect, it } from "vitest";
import {
  projectComponentArchitecture,
  projectSystemGovernance,
} from "@workos-final/domain";
import { buildComponentCatalog, buildGovernanceCatalog } from "./ownerCatalog";

describe("component catalog presentation", () => {
  it("places FACE VOLUME BACK LIGHTING under product components", () => {
    const catalog = buildComponentCatalog(projectComponentArchitecture());
    expect(catalog.categories.map((item) => item.id)).toEqual(["product-components"]);
    expect(catalog.categories[0]?.label).toBe("Componente de produs");
    expect(catalog.categories[0]?.items.map((item) => item.id)).toEqual([
      "FACE",
      "VOLUME",
      "BACK",
      "LIGHTING",
    ]);
    expect(catalog.categories[0]?.items[0]?.kindLabel).toBe("Componentă");
    expect(catalog.categories[0]?.items[0]?.groups[0]?.kindLabel).toBe("Variantă");
    expect(catalog.categories[0]?.items[0]?.groups[0]?.title).toBe("Plexiglas 3 mm");
    expect(
      catalog.categories[0]?.items[3]?.groups[0]?.sections.find((item) => item.id === "resources")
        ?.facts?.[0]?.value,
    ).toBe("Indisponibil");
    expect(JSON.stringify(catalog)).not.toMatch(/RETURN_CANT/);
  });

  it("keeps products-using derived and accepts extra categories without rewrite", () => {
    const catalog = buildComponentCatalog(projectComponentArchitecture());
    const usedBy = catalog.categories[0]?.items[0]?.groups[0]?.sections
      .find((item) => item.id === "general")
      ?.facts?.find((item) => item.label === "Folosită de")?.value;
    expect(usedBy).toContain("Litere volumetrice luminoase");
    const extended = {
      categories: [
        ...catalog.categories,
        { id: "future", label: "Resurse", kindLabel: "Categorie", items: [] },
      ],
    };
    expect(extended.categories.map((item) => item.id)).toEqual([
      "product-components",
      "future",
    ]);
  });
});

describe("governance catalog presentation", () => {
  it("groups existing governance records without duplicating truth", () => {
    const governance = projectSystemGovernance();
    const catalog = buildGovernanceCatalog(governance);
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "authority",
      "limits",
      "maturity",
      "ui",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.id)).toEqual([
      "owners",
      "sources",
    ]);
    expect(catalog.categories[1]?.items.map((item) => item.id)).toEqual([
      "boundaries",
      "protection",
      "gates",
    ]);
    expect(catalog.categories[2]?.items.map((item) => item.id)).toEqual([
      "roadmap",
      "freeze",
      "capabilities",
    ]);
    const freeze = catalog.categories[2]?.items
      .find((item) => item.id === "freeze")
      ?.groups[0]?.sections[0]?.statusLines?.[0];
    expect(freeze?.state).toBe("PLANNED");
    expect(freeze?.note).toMatch(/Nu este activă/);
    expect(
      catalog.categories[1]?.items
        .find((item) => item.id === "gates")
        ?.groups[0]?.sections[0]?.lines,
    ).toEqual(governance.ownerGates.map((item) => item.statement));
  });
});
