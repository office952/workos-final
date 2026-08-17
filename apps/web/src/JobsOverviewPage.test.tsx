import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { JobOverviewProjection } from "@workos-final/domain";
import { JobsOverviewPage } from "./JobsOverviewPage";
import { fetchJobOverview } from "./jobsApi";

const emptyOverview: JobOverviewProjection = {
  summary: { total: 0, active: 0, inExecution: 0, needsAttention: 0, completed: 0 },
  jobs: [],
};

const readyOverview: JobOverviewProjection = {
  summary: { total: 3, active: 2, inExecution: 1, needsAttention: 1, completed: 1 },
  jobs: [
    {
      jobId: "ord:active",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere volumetrice",
      inscription: "ACTIV",
      customerId: "cus:letters",
      customerDisplayName: "Client Demo LETTERS",
      createdAt: "2026-08-17T10:00:00.000Z",
      stage: "EXECUTION_IN_PROGRESS",
      stageLabel: "În lucru",
      nextAction: "CONTINUE_EXECUTION",
      nextActionLabel: "Continuă execuția",
      href: "/execution/exp:active",
      needsAttention: false,
      attentionLabel: null,
      completedCount: 3,
      taskCount: 12,
      inProgressCount: 1,
      progressLabel: "3 / 12 finalizate · 1 în lucru",
      orderSnapshotId: "ord:active",
      releaseSnapshotId: "aps:active",
      planId: "exp:active",
    },
    {
      jobId: "ord:gap",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere volumetrice",
      inscription: "GAP",
      customerId: "cus:letters",
      customerDisplayName: "Client Demo LETTERS",
      createdAt: "2026-08-17T09:00:00.000Z",
      stage: "EXECUTION_PLANNED",
      stageLabel: "Plan creat",
      nextAction: "OPEN_EXECUTION",
      nextActionLabel: "Deschide execuția",
      href: "/execution/exp:gap",
      needsAttention: true,
      attentionLabel: "Lipsă echipament",
      completedCount: 0,
      taskCount: 12,
      inProgressCount: 0,
      progressLabel: "0 / 12 finalizate",
      orderSnapshotId: "ord:gap",
      releaseSnapshotId: "aps:gap",
      planId: "exp:gap",
    },
    {
      jobId: "ord:done",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere volumetrice",
      inscription: "GATA",
      customerId: "cus:acm",
      customerDisplayName: "Client Demo ACM",
      createdAt: "2026-08-16T10:00:00.000Z",
      stage: "EXECUTION_COMPLETED",
      stageLabel: "Finalizată",
      nextAction: "VIEW_COMPLETED",
      nextActionLabel: "Lucrare finalizată",
      href: "/execution/exp:done",
      needsAttention: false,
      attentionLabel: null,
      completedCount: 12,
      taskCount: 12,
      inProgressCount: 0,
      progressLabel: "12 / 12 finalizate",
      orderSnapshotId: "ord:done",
      releaseSnapshotId: "aps:done",
      planId: "exp:done",
    },
  ],
};

vi.mock("./jobsApi", () => ({
  fetchJobOverview: vi.fn(),
}));

describe("JobsOverviewPage", () => {
  it("shows a useful empty state without demo jobs", async () => {
    vi.mocked(fetchJobOverview).mockResolvedValue(emptyOverview);
    render(
      <MemoryRouter>
        <JobsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Lucrări" })).toBeInTheDocument();
    expect(screen.getByText("Nu există încă lucrări comerciale.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deschide produsele" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(screen.queryByText("ord:active")).not.toBeInTheDocument();
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();
  });

  it("projects backend jobs and filters without inventing status", async () => {
    vi.mocked(fetchJobOverview).mockResolvedValue(readyOverview);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <JobsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("ACTIV")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Client: Client Demo LETTERS" }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("3 / 12 finalizate · 1 în lucru")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continuă execuția" })).toHaveAttribute(
      "href",
      "/execution/exp:active",
    );
    expect(screen.getByText("Lipsă echipament")).toBeInTheDocument();
    expect(screen.getByText("GATA")).toBeInTheDocument();
    expect(screen.queryByText("ExecutionPlanId")).not.toBeInTheDocument();
    expect(screen.queryByText("ProviderRequirement")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Finalizate" }));
    expect(screen.queryByText("ACTIV")).not.toBeInTheDocument();
    expect(screen.getByText("GATA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lucrare finalizată" })).toBeInTheDocument();
  });
});
