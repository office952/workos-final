import {
  getProductionCapability,
  operationalProcesses,
  productionCapabilityClasses,
  productionCapabilityKindLabel,
  processesForCapability,
  type ProductionCapabilityClassId,
} from "../processes/catalog.js";
import {
  providerCoverageLabel,
  providerKindLabel,
  providerLifecycleLabel,
  workcenterRegistry,
  type CapabilityProvider,
  type Machine,
  type ProviderCoverageStatus,
  type Workcenter,
  type WorkcenterRegistry,
} from "./catalog.js";
import { lettersCapabilityCoverage } from "./coverage.js";
import { coverageForCapability, providersForCapability } from "./providers.js";
import { providerWhereUsed } from "./whereUsed.js";

export type ProviderSummary = {
  kind: CapabilityProvider["kind"];
  kindLabel: string;
  id: string;
  label: string;
  lifecycleLabel: string;
};

export type WorkcenterAdminRecord = Workcenter & {
  lifecycleLabel: string;
  capabilityLabels: readonly string[];
  processLabels: readonly string[];
  machineLabels: readonly string[];
  usedBy: readonly string[];
};

export type MachineAdminRecord = Machine & {
  lifecycleLabel: string;
  workcenterLabel: string | null;
  capabilityLabels: readonly string[];
  usedBy: readonly string[];
};

export type CapabilityProviderAdminRecord = {
  id: string;
  label: string;
  kindLabel: string;
  description: string;
  coverage: ProviderCoverageStatus;
  coverageLabel: string;
  providers: readonly ProviderSummary[];
  requiredByProcesses: readonly { id: string; label: string }[];
};

export type ProcessCoverageAdminRecord = {
  processId: string;
  processLabel: string;
  capabilityId: string;
  capabilityLabel: string;
  coverage: ProviderCoverageStatus;
  coverageLabel: string;
  providers: readonly ProviderSummary[];
};

export type WorkcentersAdminProjection = {
  overview: {
    workcenterCount: number;
    machineCount: number;
    coveredCapabilityCount: number;
    plannedCapabilityCount: number;
    missingCapabilityCount: number;
    capacityPlanningState: "NOT_IMPLEMENTED";
    schedulingState: "NOT_IMPLEMENTED";
    executionState: "NOT_IMPLEMENTED";
    writeState: "NOT_IMPLEMENTED";
  };
  workcenters: readonly WorkcenterAdminRecord[];
  machines: readonly MachineAdminRecord[];
  capabilities: readonly CapabilityProviderAdminRecord[];
  processCoverage: readonly ProcessCoverageAdminRecord[];
  lettersCoverage: {
    productCode: string;
    coveredCapabilityIds: readonly string[];
    plannedCapabilityIds: readonly string[];
    missingCapabilityIds: readonly string[];
    compositions: readonly {
      inspectionId: string;
      label: string;
      processes: readonly ProcessCoverageAdminRecord[];
    }[];
  };
  writeState: "NOT_IMPLEMENTED";
};

export function projectWorkcentersAdministration(
  registry: WorkcenterRegistry = workcenterRegistry,
): WorkcentersAdminProjection {
  const capabilityRecords = productionCapabilityClasses.map((capability) =>
    toCapabilityRecord(capability.id, registry),
  );
  const letters = lettersCapabilityCoverage(registry);
  return {
    overview: {
      workcenterCount: registry.workcenters.length,
      machineCount: registry.machines.length,
      coveredCapabilityCount: capabilityRecords.filter((item) => item.coverage === "COVERED")
        .length,
      plannedCapabilityCount: capabilityRecords.filter(
        (item) => item.coverage === "PROVIDER_PLANNED",
      ).length,
      missingCapabilityCount: capabilityRecords.filter((item) => item.coverage === "NO_PROVIDER")
        .length,
      capacityPlanningState: "NOT_IMPLEMENTED",
      schedulingState: "NOT_IMPLEMENTED",
      executionState: "NOT_IMPLEMENTED",
      writeState: "NOT_IMPLEMENTED",
    },
    workcenters: registry.workcenters.map((item) => toWorkcenterRecord(item, registry)),
    machines: registry.machines.map((item) => toMachineRecord(item, registry)),
    capabilities: capabilityRecords,
    processCoverage: operationalProcesses.map((process) =>
      toProcessCoverage(process.id, process.label, process.requiredCapabilityId, registry),
    ),
    lettersCoverage: {
      productCode: letters.productCode,
      coveredCapabilityIds: letters.coveredCapabilityIds,
      plannedCapabilityIds: letters.plannedCapabilityIds,
      missingCapabilityIds: letters.missingCapabilityIds,
      compositions: letters.compositions.map((item) => ({
        inspectionId: item.inspectionId,
        label: item.label,
        processes: item.processes.map((process) =>
          toProcessCoverage(
            process.processId,
            process.processLabel,
            process.capabilityId,
            registry,
          ),
        ),
      })),
    },
    writeState: "NOT_IMPLEMENTED",
  };
}

export function processProviderCoverage(
  processId: string,
  registry: WorkcenterRegistry = workcenterRegistry,
): ProcessCoverageAdminRecord | undefined {
  const process = operationalProcesses.find((item) => item.id === processId);
  if (!process) {
    return undefined;
  }
  return toProcessCoverage(
    process.id,
    process.label,
    process.requiredCapabilityId,
    registry,
  );
}

function toWorkcenterRecord(
  workcenter: Workcenter,
  registry: WorkcenterRegistry,
): WorkcenterAdminRecord {
  return {
    ...workcenter,
    lifecycleLabel: providerLifecycleLabel(workcenter.lifecycle),
    capabilityLabels: workcenter.capabilityIds.map(capabilityLabel),
    processLabels: uniqueLines(
      workcenter.capabilityIds.flatMap((capabilityId) =>
        processesForCapability(capabilityId).map((item) => item.label),
      ),
    ),
    machineLabels: registry.machines
      .filter((item) => item.workcenterId === workcenter.id)
      .map((item) => item.label),
    usedBy: uniqueLines(
      providerWhereUsed("WORKCENTER", workcenter.id, registry).map((item) => item.displayLine),
    ),
  };
}

function toMachineRecord(
  machine: Machine,
  registry: WorkcenterRegistry,
): MachineAdminRecord {
  return {
    ...machine,
    lifecycleLabel: providerLifecycleLabel(machine.lifecycle),
    workcenterLabel: machine.workcenterId
      ? (registry.getWorkcenter(machine.workcenterId)?.label ?? machine.workcenterId)
      : null,
    capabilityLabels: machine.capabilityIds.map(capabilityLabel),
    usedBy: uniqueLines(
      providerWhereUsed("MACHINE", machine.id, registry).map((item) => item.displayLine),
    ),
  };
}

function toCapabilityRecord(
  capabilityId: ProductionCapabilityClassId,
  registry: WorkcenterRegistry,
): CapabilityProviderAdminRecord {
  const capability = getProductionCapability(capabilityId);
  const coverage = coverageForCapability(capabilityId, registry);
  return {
    id: capabilityId,
    label: capability?.label ?? capabilityId,
    kindLabel: capability ? productionCapabilityKindLabel(capability.kind) : capabilityId,
    description: capability?.description ?? "",
    coverage,
    coverageLabel: providerCoverageLabel(coverage),
    providers: providersForCapability(capabilityId, registry).map(toProviderSummary),
    requiredByProcesses: processesForCapability(capabilityId).map((item) => ({
      id: item.id,
      label: item.label,
    })),
  };
}

function toProcessCoverage(
  processId: string,
  processLabel: string,
  capabilityId: ProductionCapabilityClassId,
  registry: WorkcenterRegistry,
): ProcessCoverageAdminRecord {
  const coverage = coverageForCapability(capabilityId, registry);
  return {
    processId,
    processLabel,
    capabilityId,
    capabilityLabel: capabilityLabel(capabilityId),
    coverage,
    coverageLabel: providerCoverageLabel(coverage),
    providers: providersForCapability(capabilityId, registry).map(toProviderSummary),
  };
}

function toProviderSummary(provider: CapabilityProvider): ProviderSummary {
  return {
    kind: provider.kind,
    kindLabel: providerKindLabel(provider.kind),
    id: provider.id,
    label: provider.label,
    lifecycleLabel: providerLifecycleLabel(provider.lifecycle),
  };
}

function capabilityLabel(capabilityId: ProductionCapabilityClassId): string {
  return getProductionCapability(capabilityId)?.label ?? capabilityId;
}

function uniqueLines(lines: readonly string[]): string[] {
  return [...new Set(lines)];
}
