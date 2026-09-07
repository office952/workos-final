import type {
  OperatorInboxLaneKind,
  OperatorInboxTaskItem,
  OperatorTaskInboxProjection,
} from "@workos-final/domain";

export type WorklistEnergy = "current" | "blocked" | "quiet";

export type WorklistRow = {
  item: OperatorInboxTaskItem;
  energy: WorklistEnergy;
  actionLabel: string | null;
};

function energyFor(lane: OperatorInboxLaneKind): WorklistEnergy {
  switch (lane) {
    case "available_ready":
    case "in_progress_mine":
      return "current";
    case "available_needs_provider":
      return "blocked";
    case "waiting_dependencies":
      return "quiet";
    default: {
      const _exhaustive: never = lane;
      return _exhaustive;
    }
  }
}

function actionLabelFor(item: OperatorInboxTaskItem): string | null {
  if (item.canClaimStart) {
    return "Pornește";
  }
  if (item.lane === "in_progress_mine") {
    return null;
  }
  return null;
}

export function projectAtelierWorklist(
  inbox: OperatorTaskInboxProjection,
): WorklistRow[] {
  return [
    ...inbox.inProgressMine,
    ...inbox.availableReady,
    ...inbox.availableNeedsProvider,
    ...inbox.waitingDependencies,
  ].map((item) => ({
    item,
    energy: energyFor(item.lane),
    actionLabel: actionLabelFor(item),
  }));
}
