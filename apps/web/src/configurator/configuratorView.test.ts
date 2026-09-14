import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  getFormSchemaForTemplate,
  getProductTemplate,
} from "@workos-final/domain";
import { describe, expect, it } from "vitest";
import { projectConfiguratorView } from "./configuratorView";

const context = {
  returnHref: "/products",
  returnLabel: "Catalog",
  requestReference: null,
  clientName: null,
  objectLabel: null,
};

function lettersTemplate() {
  const template = getProductTemplate(CANONICAL_PRODUCT_CODE);
  const schema = getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE);
  if (!template || !schema) {
    throw new Error("LETTERS template missing");
  }
  return { template, schema };
}

function acmTemplate() {
  const template = getProductTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE);
  const schema = getFormSchemaForTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE);
  if (!template || !schema) {
    throw new Error("ACM template missing");
  }
  return { template, schema };
}

const lettersFilled = {
  "root.inscription": "WORKOS",
  "face.finish": "vinyl",
  "face.color": "alb",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

describe("projectConfiguratorView", () => {
  it("A — Panou ACM simple projects only ACM + composition scopes and real cassette facts", () => {
    const { template, schema } = acmTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: {
        "root.inscription": "PANOU ACM",
        "root.mountingSystem": "steel_angle",
        "face.widthMm": 1000,
        "face.heightMm": 500,
        "face.cassetteDepthMm": "40",
        "face.foldCount": "1",
      },
      context,
    });

    expect(view.title).toBe("Panou ACM casetat");
    expect(view.scopes.map((scope) => scope.id)).toEqual(["panou-acm", "compozitie"]);
    expect(view.targets).toEqual([]);
    expect(view.complete).toBe(true);
    expect(view.statusLabel).toBe("Configurare completă");
    expect(view.sections.flatMap((section) => section.facts.map((fact) => fact.id))).toContain(
      "face.widthMm",
    );
    expect(view.sections.flatMap((section) => section.facts.map((fact) => fact.display))).toContain(
      "1000 mm",
    );
    expect(view.sections.flatMap((section) => section.facts.map((fact) => fact.display))).toContain(
      "O îndoitură",
    );
    expect(JSON.stringify(view)).not.toContain("1600");
    expect(JSON.stringify(view)).not.toContain("GRĂDINIȚA");
    expect(view.compositionItems).toHaveLength(1);
    expect(view.compositionItems[0]?.editLabel).toBe("Editează în PANOU ACM");
  });

  it("B — current ACM does not invent multi-piece equal segments from foldCount", () => {
    const { template, schema } = acmTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: {
        "root.inscription": "PANOU ACM",
        "root.mountingSystem": "steel_angle",
        "face.widthMm": 3200,
        "face.heightMm": 800,
        "face.cassetteDepthMm": "40",
        "face.foldCount": "2",
      },
      context,
    });

    const displays = view.sections.flatMap((section) =>
      section.facts.map((fact) => fact.display),
    );
    expect(displays).toContain("Două îndoituri");
    expect(displays.some((display) => display.includes("1600"))).toBe(false);
    expect(view.scopes.some((scope) => scope.id === "ansamblare")).toBe(false);
  });

  it("C — Litere COMUN projects letters + composition without invented group targets", () => {
    const { template, schema } = lettersTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: lettersFilled,
      context,
      activeScopeId: "litere",
    });

    expect(view.title).toBe(
      "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    );
    expect(view.scopes.map((scope) => scope.id)).toEqual(["litere", "compozitie"]);
    expect(view.targets).toEqual([]);
    expect(view.complete).toBe(true);
    expect(view.statusLabel).toBe("Configurare completă");
    expect(view.sections.some((section) => section.label === "CANT")).toBe(true);
    expect(view.sections.some((section) => section.label === "FAȚĂ")).toBe(true);
    expect(view.sections.flatMap((section) => section.facts.map((fact) => fact.display))).toContain(
      "60 mm",
    );
    expect(view.sections.flatMap((section) => section.facts.map((fact) => fact.display))).toContain(
      "Plexiglas 3 mm opal",
    );
    expect(JSON.stringify(view)).not.toContain("PRICHINDEL");
    expect(JSON.stringify(view)).not.toContain("CER-1042");
  });

  it("D — current LETTERS does not emit personalized group overrides", () => {
    const { template, schema } = lettersTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: lettersFilled,
      context,
    });

    expect(view.targets).toEqual([]);
    expect(
      view.sections.flatMap((section) => section.facts).some((fact) => fact.kind === "personalized"),
    ).toBe(false);
    expect(
      view.sections.flatMap((section) => section.facts).some((fact) => fact.kind === "inherited"),
    ).toBe(false);
  });

  it("E/F — current products do not expose Ansamblare", () => {
    const letters = projectConfiguratorView({
      ...lettersTemplate(),
      values: lettersFilled,
      context,
    });
    const acm = projectConfiguratorView({
      ...acmTemplate(),
      values: {
        "root.inscription": "PANOU",
        "root.mountingSystem": "steel_angle",
        "face.widthMm": 1000,
        "face.heightMm": 500,
        "face.cassetteDepthMm": "40",
        "face.foldCount": "1",
      },
      context,
    });

    expect(letters.scopes.some((scope) => scope.id === "ansamblare")).toBe(false);
    expect(acm.scopes.some((scope) => scope.id === "ansamblare")).toBe(false);
  });

  it("G — Compoziție is a read-only projection of contributing scopes", () => {
    const { template, schema } = lettersTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: lettersFilled,
      context,
      activeScopeId: "compozitie",
    });

    expect(view.activeScopeId).toBe("compozitie");
    expect(view.compositionItems).toHaveLength(1);
    expect(view.compositionItems[0]?.complete).toBe(true);
    expect(view.compositionItems[0]?.editLabel).toBe("Editează în LITERE");
    expect(view.complete).toBe(true);
  });

  it("H — incomplete required facts are NECONFIGURAT, optional empty facts stay hidden", () => {
    const { template, schema } = lettersTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: {},
      context,
    });

    expect(view.complete).toBe(false);
    expect(view.statusLabel).toBe("2 din 4 module validate");
    const missing = view.sections.flatMap((section) =>
      section.facts.filter((fact) => fact.kind === "missing"),
    );
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every((fact) => fact.display === "NECONFIGURAT")).toBe(true);
    expect(view.blueprintIncomplete).toBe(true);
    expect(JSON.stringify(view.sections)).not.toMatch(/: "-"/);
    expect(
      view.sections
        .flatMap((section) => section.facts)
        .some((fact) => fact.display === "-" || fact.display === "—"),
    ).toBe(false);
  });

  it("does not invent assembly title or letter group names from Figma fixtures", () => {
    const { template, schema } = lettersTemplate();
    const view = projectConfiguratorView({
      template,
      schema,
      values: {},
      context,
    });
    expect(view.title).not.toBe("Ansamblu ACM + litere volumetrice");
    expect(view.targets.map((target) => target.label)).not.toContain("GRĂDINIȚA");
    expect(view.targets.map((target) => target.label)).not.toContain("LOGO");
  });
});
