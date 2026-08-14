import { getResource } from "../resources/catalog.js";
import {
  getProductionCapability,
  operationalProcesses,
  processCategoryLabel,
  processLifecycleLabel,
  processReadinessLabel,
  processesForCapability,
  processesForCategory,
  productionCapabilityClasses,
  productionCapabilityKindLabel,
  PROCESS_CATEGORIES,
  type OperationalProcess,
  type ProcessCategory,
  type ProductionCapabilityClass,
} from "./catalog.js";
import { processWhereUsed, type ProcessUse } from "./whereUsed.js";

export type ProcessAdminRecord = {
  id: string;
  label: string;
  description: string;
  category: ProcessCategory;
  categoryLabel: string;
  requiredCapabilityId: string;
  requiredCapabilityLabel: string;
  requiredCapabilityKindLabel: string;
  outcome: string;
  lifecycleLabel: string;
  readinessLabel: string;
  readinessNote: string;
  resourceLinks: readonly { id: string; label: string }[];
  usedBy: readonly ProcessUse[];
};

export type CapabilityAdminRecord = ProductionCapabilityClass & {
  kindLabel: string;
  processes: readonly ProcessAdminRecord[];
};

export type OperationalProcessesAdminProjection = {
  categories: readonly {
    id: ProcessCategory;
    label: string;
    processes: readonly ProcessAdminRecord[];
  }[];
  processes: readonly ProcessAdminRecord[];
  capabilities: readonly CapabilityAdminRecord[];
  writeState: "NOT_IMPLEMENTED";
};

export function projectOperationalProcessesAdministration(): OperationalProcessesAdminProjection {
  const processes = operationalProcesses.map(toAdminRecord);
  return {
    categories: PROCESS_CATEGORIES.map((category) => ({
      id: category,
      label: processCategoryLabel(category),
      processes: processesForCategory(category).map(toAdminRecord),
    })).filter((item) => item.processes.length > 0),
    processes,
    capabilities: productionCapabilityClasses.map((capability) => ({
      ...capability,
      kindLabel: productionCapabilityKindLabel(capability.kind),
      processes: processesForCapability(capability.id).map(toAdminRecord),
    })),
    writeState: "NOT_IMPLEMENTED",
  };
}

function toAdminRecord(process: OperationalProcess): ProcessAdminRecord {
  const capability = getProductionCapability(process.requiredCapabilityId);
  return {
    id: process.id,
    label: process.label,
    description: process.description,
    category: process.category,
    categoryLabel: processCategoryLabel(process.category),
    requiredCapabilityId: process.requiredCapabilityId,
    requiredCapabilityLabel: capability?.label ?? process.requiredCapabilityId,
    requiredCapabilityKindLabel: capability
      ? productionCapabilityKindLabel(capability.kind)
      : process.requiredCapabilityId,
    outcome: process.outcome,
    lifecycleLabel: processLifecycleLabel(process.lifecycle),
    readinessLabel: processReadinessLabel(process.readiness),
    readinessNote: process.readinessNote,
    resourceLinks: process.resourceIds.map((id) => ({
      id,
      label: getResource(id)?.label ?? id,
    })),
    usedBy: processWhereUsed(process.id),
  };
}
