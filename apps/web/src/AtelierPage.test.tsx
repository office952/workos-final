import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AtelierPage } from "./AtelierPage";

const fetchOperatorTaskInbox = vi.fn();
const startExecutionTask = vi.fn();
const useOperatorSession = vi.fn();

vi.mock("./atelierApi", () => ({
  fetchOperatorTaskInbox: (...args: unknown[]) => fetchOperatorTaskInbox(...args),
}));

vi.mock("./productApi", () => ({
  startExecutionTask: (...args: unknown[]) => startExecutionTask(...args),
}));

vi.mock("./OperatorSessionContext", () => ({
  useOperatorSession: () => useOperatorSession(),
}));

describe("AtelierPage", () => {
  beforeEach(() => {
    fetchOperatorTaskInbox.mockReset();
    startExecutionTask.mockReset();
    useOperatorSession.mockReset();
  });

  it("asks the operator to identify when there is no session", async () => {
    useOperatorSession.mockReturnValue({
      ready: true,
      operator: null,
    });
    render(
      <MemoryRouter>
        <AtelierPage />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Identifică-te pentru a vedea munca disponibilă."),
    ).toBeInTheDocument();
    expect(fetchOperatorTaskInbox).not.toHaveBeenCalled();
  });

  it("renders ready work and claims through the existing start API", async () => {
    useOperatorSession.mockReturnValue({
      ready: true,
      operator: {
        personId: "per:florin",
        displayName: "Florin CNC",
        availability: "AVAILABLE",
      },
    });
    fetchOperatorTaskInbox.mockResolvedValue({
      operator: {
        personId: "per:florin",
        displayName: "Florin CNC",
        availability: "AVAILABLE",
      },
      inbox: {
        operator: {
          personId: "per:florin",
          displayName: "Florin CNC",
          availability: "AVAILABLE",
        },
        summary: {
          inProgressMine: 0,
          availableReady: 1,
          availableNeedsProvider: 0,
          waitingDependencies: 0,
        },
        inProgressMine: [],
        availableReady: [
          {
            taskId: "task:1",
            planId: "exp:1",
            productLabel: "Litere",
            inscription: "JOB-A",
            customerDisplayName: "Client A",
            processLabel: "Debitare foaie CNC",
            scopeLabel: "Spate",
            seqLabel: "03",
            requiredCapabilityLabel: "Debitare CNC",
            statusLabel: "Planificat",
            providerLabel: "CNC 4020",
            requiresProvider: true,
            waitingForLabels: [],
            reservedForLabel: null,
            canClaimStart: true,
            workspaceHref: "/execution/exp:1?task=task%3A1",
            lane: "available_ready",
            planCreatedAt: "2026-08-17T10:00:00.000Z",
            seq: 3,
          },
        ],
        availableNeedsProvider: [],
        waitingDependencies: [],
        displayOrderNote:
          "Ordinea de afișare nu reprezintă programare sau prioritate de producție.",
      },
    });
    startExecutionTask.mockResolvedValue({
      ok: true,
      executionPlan: { plan: { planId: "exp:1" }, tasks: [] },
    });

    render(
      <MemoryRouter>
        <AtelierPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Pot porni acum" })).toBeInTheDocument();
    expect(screen.getByText("Debitare foaie CNC")).toBeInTheDocument();
    expect(screen.getByText(/Client A/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pornește" })).toBeInTheDocument();
    expect(screen.getByText(/nu reprezintă programare/)).toBeInTheDocument();
  });

  it("keeps provider-needed work secondary and without Pornește", async () => {
    useOperatorSession.mockReturnValue({
      ready: true,
      operator: {
        personId: "per:florin",
        displayName: "Florin CNC",
        availability: "AVAILABLE",
      },
    });
    const needsProvider = Array.from({ length: 3 }, (_, index) => ({
      taskId: `task:need:${index}`,
      planId: "exp:need",
      productLabel: "Litere",
      inscription: `NEED-${index}`,
      customerDisplayName: null,
      processLabel: "Formare profil",
      scopeLabel: "Volum",
      seqLabel: "07",
      requiredCapabilityLabel: "Formare",
      statusLabel: "Planificat",
      providerLabel: null,
      requiresProvider: true,
      waitingForLabels: [],
      reservedForLabel: null,
      canClaimStart: false,
      workspaceHref: `/execution/exp:need?task=task%3Aneed%3A${index}`,
      lane: "available_needs_provider" as const,
      planCreatedAt: "2026-08-17T10:00:00.000Z",
      seq: 7,
    }));
    fetchOperatorTaskInbox.mockResolvedValue({
      operator: {
        personId: "per:florin",
        displayName: "Florin CNC",
        availability: "AVAILABLE",
      },
      inbox: {
        operator: {
          personId: "per:florin",
          displayName: "Florin CNC",
          availability: "AVAILABLE",
        },
        summary: {
          inProgressMine: 0,
          availableReady: 1,
          availableNeedsProvider: 3,
          waitingDependencies: 0,
        },
        inProgressMine: [],
        availableReady: [
          {
            taskId: "task:ready",
            planId: "exp:ready",
            productLabel: "Litere",
            inscription: "READY",
            customerDisplayName: "Client Ready",
            processLabel: "Debitare foaie CNC",
            scopeLabel: "Spate",
            seqLabel: "01",
            requiredCapabilityLabel: "Debitare CNC",
            statusLabel: "Planificat",
            providerLabel: "CNC 4020",
            requiresProvider: true,
            waitingForLabels: [],
            reservedForLabel: null,
            canClaimStart: true,
            workspaceHref: "/execution/exp:ready?task=task%3Aready",
            lane: "available_ready",
            planCreatedAt: "2026-08-17T10:00:00.000Z",
            seq: 1,
          },
        ],
        availableNeedsProvider: needsProvider,
        waitingDependencies: [],
        displayOrderNote:
          "Ordinea de afișare nu reprezintă programare sau prioritate de producție.",
      },
    });

    render(
      <MemoryRouter>
        <AtelierPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Pot porni acum" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pornește" })).toBeInTheDocument();
    const prep = screen.getByText(/Necesită pregătire atelier \(3\)/);
    expect(prep).toBeInTheDocument();
    const details = prep.closest("details");
    expect(details).not.toBeNull();
    expect(details?.open).toBe(false);
  });
});
