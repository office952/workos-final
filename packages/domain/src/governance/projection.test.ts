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
    expect(byId.COMMERCIAL?.state).toBe("NOT_IMPLEMENTED");
    expect(byId.EXECUTION?.state).toBe("NOT_IMPLEMENTED");
    expect(byId.ANALYZER?.state).toBe("NOT_IMPLEMENTED");
    expect(governance.freeze.state).toBe("PLANNED");
    expect(governance.freeze.note).toMatch(/Nu este activă/);
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
