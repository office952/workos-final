import { describe, expect, it } from "vitest";
import type { JobDetailResponse } from "../../../jobsApi";
import { projectJobTraveler } from "./jobTravelerView";

function detail(nextAction: JobDetailResponse["job"]["nextAction"]): JobDetailResponse {
  return {
    job: {
      jobId: "ord:1",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "HUB",
      customerId: "cus:1",
      customerDisplayName: "Client",
      createdAt: "2026-09-07T00:00:00.000Z",
      stage: nextAction === "CREATE_EXECUTION_PLAN" ? "RELEASED" : "EXECUTION_PLANNED",
      stageLabel: nextAction === "CREATE_EXECUTION_PLAN" ? "Eliberată" : "Planificată",
      nextAction,
      nextActionLabel:
        nextAction === "CREATE_EXECUTION_PLAN"
          ? "Creează planul de execuție"
          : "Deschide execuția",
      href: "/jobs/ord:1",
      needsAttention: false,
      attentionLabel: null,
      completedCount: null,
      taskCount: null,
      inProgressCount: null,
      progressLabel: null,
      orderSnapshotId: "ord:1",
      releaseSnapshotId: "rel:1",
      planId: nextAction === "CREATE_EXECUTION_PLAN" ? null : "exp:1",
    },
    order: {},
    quote: { quoteSnapshotId: "qts:1", href: "/quotes/qts:1", reference: "OF-1" },
    request: { requestId: "crq:1", href: "/requests/crq:1", reference: "CER-1" },
    release: { releaseSnapshotId: "rel:1" },
    execution: nextAction === "CREATE_EXECUTION_PLAN" ? null : {
      planId: "exp:1",
      href: "/execution/exp:1",
      statusLabel: "Planificat",
      progressLabel: null,
      blocked: false,
      attentionLabel: null,
      view: null,
    },
  };
}

describe("projectJobTraveler", () => {
  it("keeps current dominant and lists only known past/next facts", () => {
    const beforePlan = projectJobTraveler(detail("CREATE_EXECUTION_PLAN"));
    expect(beforePlan.current.title).toBe("Plan de execuție");
    expect(beforePlan.current.stateLabel).toBe("Eliberată");
    expect(beforePlan.past.map((item) => item.id)).toEqual([
      "request",
      "quote",
      "order",
      "release",
    ]);
    expect(beforePlan.next.map((item) => item.label)).toEqual(["Atelier"]);

    const afterPlan = projectJobTraveler(detail("OPEN_EXECUTION"));
    expect(afterPlan.current.title).toBe("Atelier");
    expect(afterPlan.past.some((item) => item.id === "plan")).toBe(true);
    expect(afterPlan.next.map((item) => item.label)).toEqual(["Execuție"]);
  });
});
