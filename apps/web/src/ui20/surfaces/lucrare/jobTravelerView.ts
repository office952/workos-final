import type { JobNextAction } from "@workos-final/domain";
import type { JobDetailResponse } from "../../../jobsApi";

export type TravelerItem = {
  id: string;
  label: string;
  href?: string;
};

export type JobTravelerView = {
  past: TravelerItem[];
  current: {
    title: string;
    stateLabel: string;
    nextLabel: string;
    attention: string | null;
  };
  next: TravelerItem[];
};

function currentTitle(nextAction: JobNextAction): string {
  switch (nextAction) {
    case "RELEASE_TO_PRODUCTION":
      return "Eliberare pentru producție";
    case "CREATE_EXECUTION_PLAN":
      return "Plan de execuție";
    case "OPEN_EXECUTION":
    case "CONTINUE_EXECUTION":
      return "Atelier";
    case "VIEW_COMPLETED":
      return "Lucrare încheiată";
    default: {
      const _exhaustive: never = nextAction;
      return _exhaustive;
    }
  }
}

export function projectJobTraveler(detail: JobDetailResponse): JobTravelerView {
  const { job, quote, request, release, execution } = detail;
  const past: TravelerItem[] = [];
  if (request) {
    past.push({
      id: "request",
      label: request.reference ?? "Cerere",
      href: request.href,
    });
  }
  past.push({
    id: "quote",
    label: quote.reference ?? "Ofertă",
    href: quote.href,
  });
  past.push({ id: "order", label: "Comandă" });
  if (job.releaseSnapshotId || release) {
    past.push({ id: "release", label: "Eliberare" });
  }
  if (job.planId || execution?.planId) {
    past.push({
      id: "plan",
      label: "Plan de execuție",
    });
  }

  const next: TravelerItem[] = [];
  if (job.nextAction === "RELEASE_TO_PRODUCTION") {
    next.push({ id: "plan", label: "Plan de execuție" });
    next.push({ id: "atelier", label: "Atelier" });
  } else if (job.nextAction === "CREATE_EXECUTION_PLAN") {
    next.push({ id: "atelier", label: "Atelier" });
  } else if (
    job.nextAction === "OPEN_EXECUTION" ||
    job.nextAction === "CONTINUE_EXECUTION"
  ) {
    next.push({ id: "execution", label: "Execuție" });
  }

  return {
    past,
    current: {
      title: currentTitle(job.nextAction),
      stateLabel: job.stageLabel,
      nextLabel: job.nextActionLabel,
      attention: job.attentionLabel,
    },
    next,
  };
}
