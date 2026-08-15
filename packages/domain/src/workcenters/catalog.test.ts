import { describe, expect, it } from "vitest";
import {
  BOND_LETTER_BODY_ID,
  CUT_SHEET_CNC_ID,
  operationalProcesses,
  PAINT_RAL_ID,
} from "../processes/catalog.js";
import { composeProductProcesses } from "../processes/composition.js";
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
import { compileEic } from "../resources/eic.js";
import {
  createWorkcenterRegistry,
  machines,
  workcenterRegistry,
  workcenters,
  type Machine,
  type Workcenter,
} from "./catalog.js";
import { lettersCapabilityCoverage } from "./coverage.js";
import { projectWorkcentersAdministration } from "./projection.js";
import {
  coverageForCapability,
  providersForCapability,
  providersForProcess,
} from "./providers.js";

const fixtureWorkcenters: readonly Workcenter[] = [
  {
    id: "WC_CNC",
    label: "Zonă CNC (fixture)",
    description: "Fixture only. Not a live shop asset.",
    lifecycle: "ACTIVE",
    capabilityIds: ["CNC_ROUTING"],
  },
  {
    id: "WC_ASSEMBLY",
    label: "Zonă asamblare (fixture)",
    description: "Manual work without a fake machine.",
    lifecycle: "ACTIVE",
    capabilityIds: ["MANUAL_ASSEMBLY"],
  },
  {
    id: "WC_ASSEMBLY_ALT",
    label: "Zonă asamblare planificată (fixture)",
    description: "Second provider for the same capability.",
    lifecycle: "PLANNED",
    capabilityIds: ["MANUAL_ASSEMBLY"],
  },
  {
    id: "WC_PAINTING",
    label: "Zonă vopsire (fixture)",
    description: "Painting provided by a workcenter.",
    lifecycle: "ACTIVE",
    capabilityIds: ["PAINTING"],
  },
];

const fixtureMachines: readonly Machine[] = [
  {
    id: "M_CNC_PROFILE",
    label: "Utilaj CNC/profil (fixture)",
    description: "One machine, two capabilities. Fixture only.",
    workcenterId: "WC_CNC",
    lifecycle: "ACTIVE",
    capabilityIds: ["CNC_ROUTING", "PROFILE_FORMING"],
  },
];

const fixtureRegistry = createWorkcenterRegistry(fixtureWorkcenters, fixtureMachines);

describe("workcenter registry", () => {
  it("keeps live catalogs empty until owner-confirmed identities exist", () => {
    expect(workcenters).toEqual([]);
    expect(machines).toEqual([]);
    expect(workcenterRegistry.workcenters).toEqual([]);
    expect(workcenterRegistry.machines).toEqual([]);
  });

  it("rejects duplicate ids, unknown capabilities, and broken workcenter refs", () => {
    expect(() =>
      createWorkcenterRegistry(
        [
          {
            id: "WC_A",
            label: "A",
            description: "",
            lifecycle: "ACTIVE",
            capabilityIds: ["CNC_ROUTING"],
          },
          {
            id: "WC_A",
            label: "A2",
            description: "",
            lifecycle: "ACTIVE",
            capabilityIds: ["PAINTING"],
          },
        ],
        [],
      ),
    ).toThrow(/Duplicate workcenter/);
    expect(() =>
      createWorkcenterRegistry(
        [],
        [
          {
            id: "M_A",
            label: "A",
            description: "",
            workcenterId: "MISSING",
            lifecycle: "ACTIVE",
            capabilityIds: ["CNC_ROUTING"],
          },
        ],
      ),
    ).toThrow(/Unknown workcenter/);
    expect(() =>
      createWorkcenterRegistry(
        [
          {
            id: "WC_A",
            label: "A",
            description: "",
            lifecycle: "ACTIVE",
            capabilityIds: ["CNC_ROUTING", "CNC_ROUTING"],
          },
        ],
        [],
      ),
    ).toThrow(/Duplicate capability/);
  });
});

describe("capability providers", () => {
  it("derives providers from workcenters and machines without mutating processes", () => {
    expect(providersForProcess(CUT_SHEET_CNC_ID, fixtureRegistry).map((item) => item.id)).toEqual([
      "WC_CNC",
      "M_CNC_PROFILE",
    ]);
    expect(coverageForCapability("CNC_ROUTING", fixtureRegistry)).toBe("COVERED");
    expect(JSON.stringify(operationalProcesses)).not.toMatch(/WC_CNC|M_CNC_PROFILE|machineId/);
  });

  it("lets a workcenter provide manual assembly without a machine", () => {
    const providers = providersForCapability("MANUAL_ASSEMBLY", fixtureRegistry);
    expect(providers.some((item) => item.kind === "WORKCENTER" && item.id === "WC_ASSEMBLY")).toBe(
      true,
    );
    expect(providers.every((item) => item.kind !== "MACHINE")).toBe(true);
    expect(coverageForCapability("MANUAL_ASSEMBLY", fixtureRegistry)).toBe("COVERED");
  });

  it("lets painting be provided by a workcenter while the process stays unchanged", () => {
    expect(providersForProcess(PAINT_RAL_ID, fixtureRegistry).map((item) => item.id)).toEqual([
      "WC_PAINTING",
    ]);
    expect(operationalProcesses.find((item) => item.id === PAINT_RAL_ID)?.requiredCapabilityId).toBe(
      "PAINTING",
    );
  });

  it("allows one machine to provide multiple capabilities and one capability multiple providers", () => {
    const machine = fixtureRegistry.getMachine("M_CNC_PROFILE");
    expect(machine?.capabilityIds).toEqual(["CNC_ROUTING", "PROFILE_FORMING"]);
    expect(providersForCapability("CNC_ROUTING", fixtureRegistry).map((item) => item.id)).toEqual([
      "WC_CNC",
      "M_CNC_PROFILE",
    ]);
    expect(providersForCapability("MANUAL_ASSEMBLY", fixtureRegistry).map((item) => item.id)).toEqual(
      ["WC_ASSEMBLY", "WC_ASSEMBLY_ALT"],
    );
  });

  it("lets a future execution task choose a provider without changing the process", () => {
    const futureTask = {
      processId: BOND_LETTER_BODY_ID,
      providerKind: "WORKCENTER" as const,
      providerId: "WC_ASSEMBLY",
    };
    expect(providersForProcess(futureTask.processId, fixtureRegistry).some((item) => item.id === futureTask.providerId)).toBe(
      true,
    );
    expect(JSON.stringify(operationalProcesses)).not.toMatch(/WC_ASSEMBLY/);
  });
});

describe("letters capability coverage", () => {
  it("reports live Letters demand as missing providers", () => {
    const live = lettersCapabilityCoverage();
    expect(live.productCode).toBe(frontlitPlexiAl06Template.code);
    expect(live.requiredCapabilityIds).toEqual([
      "CNC_ROUTING",
      "PROFILE_FORMING",
      "MANUAL_ASSEMBLY",
      "VINYL_APPLICATION",
      "ELECTRICAL_ASSEMBLY",
      "PAINTING",
      "QUALITY_CONTROL",
      "PACKAGING",
    ]);
    expect(live.coveredCapabilityIds).toEqual([]);
    expect(live.plannedCapabilityIds).toEqual([]);
    expect(live.missingCapabilityIds).toEqual(live.requiredCapabilityIds);
  });

  it("compares Letters demand with a fixture catalog without claiming execution readiness", () => {
    const covered = lettersCapabilityCoverage(fixtureRegistry);
    expect(covered.coveredCapabilityIds).toEqual([
      "CNC_ROUTING",
      "PROFILE_FORMING",
      "MANUAL_ASSEMBLY",
      "PAINTING",
    ]);
    expect(covered.missingCapabilityIds).toEqual([
      "VINYL_APPLICATION",
      "ELECTRICAL_ASSEMBLY",
      "QUALITY_CONTROL",
      "PACKAGING",
    ]);
    const admin = projectWorkcentersAdministration(fixtureRegistry);
    expect(admin.overview.executionState).toBe("NOT_IMPLEMENTED");
    expect(admin.overview.capacityPlanningState).toBe("NOT_IMPLEMENTED");
    expect(JSON.stringify(admin)).not.toMatch(/amount|EUR|hourly|machineHour/);
  });
});

describe("live workcenters projection", () => {
  it("projects an honest empty shop-floor map", () => {
    const admin = projectWorkcentersAdministration();
    expect(admin.writeState).toBe("NOT_IMPLEMENTED");
    expect(admin.workcenters).toEqual([]);
    expect(admin.machines).toEqual([]);
    expect(admin.overview.missingCapabilityCount).toBe(8);
    expect(admin.overview.coveredCapabilityCount).toBe(0);
    expect(admin.capabilities.every((item) => item.coverage === "NO_PROVIDER")).toBe(true);
    expect(admin.processCoverage.every((item) => item.coverage === "NO_PROVIDER")).toBe(true);
    expect(JSON.stringify(admin)).not.toMatch(/CNC-01|Paint Booth|Assembly Station/);
    expect(JSON.stringify(admin)).not.toMatch(/ExecutionPlan|Preț client|machineHour/);
  });

  it("keeps ProductTemplate, Aggregate, Lighting and EIC independent of providers", () => {
    expect(JSON.stringify(frontlitPlexiAl06Template)).not.toMatch(
      /machineId|workcenterId|WC_|M_CNC/,
    );
    const definition = compileDefinition(
      frontlitPlexiAl06Template,
      frontlitPlexiAl06FormSchema,
      {
        templateCode: CANONICAL_PRODUCT_CODE,
        values: {
          "root.inscription": "WORKOS",
          "face.finish": "none",
          "face.confirmedAreaMm2": 250000,
          "volume.depthMm": "60",
          "volume.finish": "none",
          "volume.confirmedPerimeterMm": 12500,
        },
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
    const composition = composeProductProcesses(frontlitPlexiAl06Template, truth.values);
    expect(compileEic(aggregate).total).toBe(320.5);
    expect(aggregate.componentStatuses.find((item) => item.id === "LIGHTING")?.status).toBe(
      "PARTIAL",
    );
    expect(composition.executionReadiness).toBe("NOT_IMPLEMENTED");
    expect(JSON.stringify(aggregate)).not.toMatch(/workcenter|machineId|Utilaje/);
    expect(JSON.stringify(composition)).not.toMatch(/workcenterId|machineId/);
  });
});
