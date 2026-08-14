import { describe, expect, it } from "vitest";
import { capabilities } from "../capabilities.js";
import {
  implementationStateLabel,
  projectSystemGovernance,
} from "./projection.js";

describe("system governance projection", () => {
  it("projects current authority boundaries without a fake freeze", () => {
    const governance = projectSystemGovernance();
    const byId = Object.fromEntries(
      governance.authorities.map((item) => [item.id, item]),
    );
    expect(byId.PRODUCT?.state).toBe("IMPLEMENTED");
    expect(byId.COMPONENT_TECHNICAL_SETTINGS?.state).toBe("IMPLEMENTED");
    expect(byId.COMPONENT_TECHNICAL_SETTINGS?.owns).toEqual(
      expect.arrayContaining([
        "parametrii tehnici reutilizabili activi pentru variantele de componentă",
      ]),
    );
    expect(byId.COMMERCIAL?.state).toBe("NOT_IMPLEMENTED");
    expect(byId.EXECUTION?.state).toBe("NOT_IMPLEMENTED");
    expect(byId.ANALYZER?.state).toBe("NOT_IMPLEMENTED");
    expect(governance.freeze.state).toBe("PLANNED");
    expect(governance.freeze.note).toMatch(/Nu este activă/);
    expect(governance.sources).toContain(
      "Setările tehnice canonice ale variantelor de componentă",
    );
    expect(governance.sources).toContain(
      "Harta canonică de domenii și administrare",
    );
    expect(governance.roadmap.find((item) => item.id === "admin-map")?.state).toBe(
      "IMPLEMENTED",
    );
    expect(
      governance.roadmap.find((item) => item.id === "product-system-admin")?.state,
    ).toBe("IMPLEMENTED");
    expect(governance.sources).toContain(
      "Metadatele de afișare persistate ale Product System",
    );
    expect(
      governance.roadmap.find((item) => item.id === "display-label-write")?.state,
    ).toBe("IMPLEMENTED");
    expect(
      governance.roadmap.find((item) => item.id === "technical-settings-write")
        ?.state,
    ).toBe("NOT_IMPLEMENTED");
    expect(
      governance.authorities.find((item) => item.id === "AUTHORIZATION")?.state,
    ).toBe("NOT_IMPLEMENTED");
    expect(
      governance.boundaries.find((item) => item.id === "intake-settings")?.statement,
    ).toMatch(/Intake nu deține setările tehnice/);
    expect(implementationStateLabel("NOT_IMPLEMENTED")).toBe("Neimplementat");
  });

  it("keeps owner gates and implemented vs planned distinction", () => {
    const governance = projectSystemGovernance();
    expect(governance.ownerGates.map((item) => item.id)).toEqual([
      "scope",
      "commercial",
      "second-product",
      "analyzer",
      "db",
      "invented",
    ]);
    expect(governance.roadmap.find((item) => item.id === "commercial")?.state).toBe(
      "NOT_IMPLEMENTED",
    );
    expect(governance.roadmap.find((item) => item.id === "catalog")?.state).toBe(
      "IMPLEMENTED",
    );
  });

  it("does not promote the capability kernel to ACTIVE", () => {
    const governance = projectSystemGovernance();
    expect(governance.capabilityKernelStatuses).toEqual(
      capabilities.map((item) => ({ id: item.id, status: "PLANNED" })),
    );
  });
});
