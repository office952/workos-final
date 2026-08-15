import {
  PRODUCTION_CAPABILITY_CLASS_IDS,
  type ProductionCapabilityClassId,
} from "../processes/catalog.js";

export const PROVIDER_KINDS = ["WORKCENTER", "MACHINE"] as const;
export type ProviderKind = (typeof PROVIDER_KINDS)[number];

export const PROVIDER_LIFECYCLES = ["ACTIVE", "PLANNED", "RETIRED"] as const;
export type ProviderLifecycle = (typeof PROVIDER_LIFECYCLES)[number];

export const PROVIDER_COVERAGE_STATUSES = [
  "COVERED",
  "PROVIDER_PLANNED",
  "NO_PROVIDER",
] as const;
export type ProviderCoverageStatus = (typeof PROVIDER_COVERAGE_STATUSES)[number];

export type Workcenter = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly lifecycle: ProviderLifecycle;
  readonly capabilityIds: readonly ProductionCapabilityClassId[];
};

export type Machine = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly workcenterId: string | null;
  readonly lifecycle: ProviderLifecycle;
  readonly capabilityIds: readonly ProductionCapabilityClassId[];
};

export type CapabilityProvider = {
  readonly kind: ProviderKind;
  readonly id: string;
  readonly label: string;
  readonly lifecycle: ProviderLifecycle;
  readonly capabilityIds: readonly ProductionCapabilityClassId[];
};

export type WorkcenterRegistry = {
  readonly workcenters: readonly Workcenter[];
  readonly machines: readonly Machine[];
  getWorkcenter(id: string): Workcenter | undefined;
  getMachine(id: string): Machine | undefined;
};

export function createWorkcenterRegistry(
  workcenters: readonly Workcenter[],
  machines: readonly Machine[],
): WorkcenterRegistry {
  const workcenterIds = new Set<string>();
  for (const workcenter of workcenters) {
    validateIdentity(workcenter.id, "workcenter");
    if (workcenterIds.has(workcenter.id)) {
      throw new Error(`Duplicate workcenter: ${workcenter.id}`);
    }
    workcenterIds.add(workcenter.id);
    validateCapabilities(workcenter.capabilityIds, workcenter.id);
  }

  const machineIds = new Set<string>();
  for (const machine of machines) {
    validateIdentity(machine.id, "machine");
    if (machineIds.has(machine.id)) {
      throw new Error(`Duplicate machine: ${machine.id}`);
    }
    if (workcenterIds.has(machine.id)) {
      throw new Error(`Machine id collides with workcenter: ${machine.id}`);
    }
    machineIds.add(machine.id);
    validateCapabilities(machine.capabilityIds, machine.id);
    if (machine.workcenterId && !workcenterIds.has(machine.workcenterId)) {
      throw new Error(`Unknown workcenter ${machine.workcenterId} for ${machine.id}`);
    }
  }

  return {
    workcenters,
    machines,
    getWorkcenter(id) {
      return workcenters.find((item) => item.id === id);
    },
    getMachine(id) {
      return machines.find((item) => item.id === id);
    },
  };
}

export const workcenters: readonly Workcenter[] = [];

export const machines: readonly Machine[] = [];

export const workcenterRegistry = createWorkcenterRegistry(workcenters, machines);

export function providerLifecycleLabel(lifecycle: ProviderLifecycle): string {
  switch (lifecycle) {
    case "ACTIVE":
      return "Activ";
    case "PLANNED":
      return "Planificat";
    case "RETIRED":
      return "Retras";
    default: {
      const _exhaustive: never = lifecycle;
      return _exhaustive;
    }
  }
}

export function providerKindLabel(kind: ProviderKind): string {
  switch (kind) {
    case "WORKCENTER":
      return "Zonă / workcenter";
    case "MACHINE":
      return "Utilaj";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function providerCoverageLabel(status: ProviderCoverageStatus): string {
  switch (status) {
    case "COVERED":
      return "Acoperită";
    case "PROVIDER_PLANNED":
      return "Furnizor planificat";
    case "NO_PROVIDER":
      return "Fără furnizor";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function validateIdentity(id: string, kind: "workcenter" | "machine"): void {
  if (id.trim().length === 0) {
    throw new Error(`${kind} id is required`);
  }
}

function validateCapabilities(
  capabilityIds: readonly ProductionCapabilityClassId[],
  ownerId: string,
): void {
  const seen = new Set<string>();
  for (const capabilityId of capabilityIds) {
    if (!PRODUCTION_CAPABILITY_CLASS_IDS.includes(capabilityId)) {
      throw new Error(`Unknown capability ${capabilityId} on ${ownerId}`);
    }
    if (seen.has(capabilityId)) {
      throw new Error(`Duplicate capability ${capabilityId} on ${ownerId}`);
    }
    seen.add(capabilityId);
  }
}
