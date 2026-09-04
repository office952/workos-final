import {
  applyActiveCostEvidenceWrite,
  applyResourcesAdministrationWrite,
  type CostEvidence,
  type ResourcesAdministrationWriteStats,
  type ResourcesAdminProjection,
} from "@workos-final/domain";

export type ResourcesAdministrationReuse = {
  evidence(): CostEvidence[];
  admin(): ResourcesAdminProjection;
  applySuccessfulWrite(next: CostEvidence, supersededRowId?: string | null): void;
};

export function createResourcesAdministrationReuse(input: {
  loadEvidence: () => CostEvidence[];
  project: (rows: readonly CostEvidence[]) => ResourcesAdminProjection;
  observeEvidenceLoad?: () => void;
  observeFullBuild?: () => void;
  observeDelta?: (stats: ResourcesAdministrationWriteStats) => void;
}): ResourcesAdministrationReuse {
  let evidence: CostEvidence[] | undefined;
  let admin: ResourcesAdminProjection | undefined;

  const currentEvidence = (): CostEvidence[] => {
    if (!evidence) {
      input.observeEvidenceLoad?.();
      evidence = input.loadEvidence();
    }
    return evidence;
  };

  return {
    evidence: currentEvidence,
    admin() {
      const rows = currentEvidence();
      if (!admin) {
        input.observeFullBuild?.();
        admin = input.project(rows);
      }
      return admin;
    },
    applySuccessfulWrite(next, supersededRowId) {
      if (!evidence) {
        return;
      }
      evidence = applyActiveCostEvidenceWrite(evidence, next, supersededRowId);
      if (!admin) {
        return;
      }
      const result = applyResourcesAdministrationWrite(
        admin,
        evidence,
        next,
        new Date().toISOString(),
      );
      admin = result.admin;
      input.observeDelta?.(result.stats);
    },
  };
}
