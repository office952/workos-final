import {
  createWorkcenterRegistry,
  workcenterRegistry,
  type WorkcenterRegistry,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";
import { bootstrapProductSystemDisplayStore } from "../productSystem/store.js";
import { ensureCostEvidence } from "../resources/store.js";
import { ensureTrustedWorkforce } from "../people/store.js";
import type { BootstrapPolicy } from "./controlPlane.js";

export const EMPTY_WORKCENTER_REGISTRY = createWorkcenterRegistry([], []);

export {
  PLATFORM_DEFAULT_COST_NOTE,
  SYNTHETIC_COST_NOTE,
} from "../resources/store.js";

export function resolveProviderRegistry(
  policy: BootstrapPolicy | "SINGLE_PLANE",
): WorkcenterRegistry {
  switch (policy) {
    case "ADOPT_EXISTING":
    case "SINGLE_PLANE":
      return workcenterRegistry;
    case "NEW_ORGANIZATION":
    case "SYNTHETIC_TEST":
      return EMPTY_WORKCENTER_REGISTRY;
    default: {
      const _exhaustive: never = policy;
      return _exhaustive;
    }
  }
}

export function applyOperationalBootstrap(
  db: SqliteDatabase,
  policy: BootstrapPolicy | undefined,
): void {
  bootstrapProductSystemDisplayStore(db);
  if (policy === "ADOPT_EXISTING") {
    return;
  }
  if (policy === "NEW_ORGANIZATION" || policy === "SYNTHETIC_TEST") {
    ensureCostEvidence(db, policy);
    return;
  }
  ensureCostEvidence(db, "SINGLE_PLANE");
  if (!process.env.VITEST) {
    ensureTrustedWorkforce(db);
  }
}
