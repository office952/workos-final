import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { JobDetailPage } from "./JobDetailPage";
import { fetchJobDetail } from "./jobsApi";

vi.mock("./jobsApi", () => ({
  fetchJobDetail: vi.fn(),
}));

describe("JobDetailPage", () => {
  it("projects a planned job without inventing an execution plan", async () => {
    vi.mocked(fetchJobDetail).mockResolvedValue({
      ok: true,
      detail: {
        job: {
          jobId: "ord:1",
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          productLabel: "Litere",
          inscription: "HUB",
          customerId: "cus:1",
          customerDisplayName: "Client HUB",
          createdAt: "2026-08-17T10:00:00.000Z",
          stage: "ORDER_CREATED",
          stageLabel: "Comandă creată",
          nextAction: "RELEASE_TO_PRODUCTION",
          nextActionLabel: "Eliberează pentru producție",
          href: "/jobs/ord%3A1",
          needsAttention: true,
          attentionLabel: "Urmează eliberarea pentru producție",
          completedCount: null,
          taskCount: null,
          inProgressCount: null,
          progressLabel: null,
          orderSnapshotId: "ord:1",
          releaseSnapshotId: null,
          planId: null,
        },
        order: {
          commercial: { netPrice: 516.38, vatPercent: 21, grossPrice: 624.82 },
          truth: { values: { "volume.depthMm": "60" } },
        },
        quote: { quoteSnapshotId: "qts:1", href: "/quotes/qts%3A1", reference: "OF-ABCDEF01" },
        request: null,
        release: null,
        execution: null,
      },
    });

    render(
      <MemoryRouter initialEntries={["/jobs/ord:1"]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getByText("Brut: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("TVA 21%")).toBeInTheDocument();
    expect(screen.getByText("Fără plan de execuție încă.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Eliberează pentru producție" })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord%3A1",
    );
    expect(screen.queryByRole("link", { name: "Deschide execuția" })).not.toBeInTheDocument();
    expect(screen.queryByText("ord:1")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Configurație" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
  });

  it("composes a blocked job with the same identity and an execution action", async () => {
    vi.mocked(fetchJobDetail).mockResolvedValue({
      ok: true,
      detail: {
        job: {
          jobId: "ord:1",
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          productLabel: "Litere",
          inscription: "HUB",
          customerId: "cus:1",
          customerDisplayName: "Client HUB",
          createdAt: "2026-08-17T10:00:00.000Z",
          stage: "EXECUTION_PLANNED",
          stageLabel: "Plan de execuție",
          nextAction: "OPEN_EXECUTION",
          nextActionLabel: "Deschide execuția",
          href: "/jobs/ord%3A1",
          needsAttention: true,
          attentionLabel: "Lipsă utilaj dedicat",
          completedCount: 0,
          taskCount: 12,
          inProgressCount: 0,
          progressLabel: "0 / 12 finalizate",
          orderSnapshotId: "ord:1",
          releaseSnapshotId: "rel:1",
          planId: "exp:1",
        },
        order: { commercial: { netPrice: 516.38, vatPercent: 21, grossPrice: 624.82 } },
        quote: { quoteSnapshotId: "qts:1", href: "/quotes/qts%3A1", reference: "OF-ABCDEF01" },
        request: { requestId: "req:1", href: "/requests/req%3A1", reference: "CER-1" },
        release: { releaseSnapshotId: "rel:1" },
        execution: {
          planId: "exp:1",
          href: "/execution/exp:1",
          statusLabel: "Planificat",
          progressLabel: "0 / 12 finalizate",
          blocked: true,
          attentionLabel: "Lipsă utilaj dedicat",
          view: null,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/jobs/ord:1"]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blocaj" })).toBeInTheDocument();
    expect(screen.getByText("0 din 12")).toBeInTheDocument();
    expect(screen.getByText("12 operații · 0 finalizate · 0 în lucru")).toBeInTheDocument();
    expect(screen.getByText("Brut: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deschide execuția" })).toHaveAttribute(
      "href",
      "/execution/exp:1",
    );
    expect(screen.getByRole("link", { name: "Ofertă OF-ABCDEF01" })).toBeInTheDocument();
  });

  it("keeps recovered state on the same job without inventing another scenario", async () => {
    vi.mocked(fetchJobDetail).mockResolvedValue({
      ok: true,
      detail: {
        job: {
          jobId: "ord:1",
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          productLabel: "Litere",
          inscription: "HUB",
          customerId: "cus:1",
          customerDisplayName: "Client HUB",
          createdAt: "2026-08-17T10:00:00.000Z",
          stage: "EXECUTION_PLANNED",
          stageLabel: "Plan de execuție",
          nextAction: "OPEN_EXECUTION",
          nextActionLabel: "Deschide execuția",
          href: "/jobs/ord%3A1",
          needsAttention: false,
          attentionLabel: null,
          completedCount: 0,
          taskCount: 12,
          inProgressCount: 0,
          progressLabel: "0 / 12 finalizate",
          orderSnapshotId: "ord:1",
          releaseSnapshotId: "rel:1",
          planId: "exp:1",
        },
        order: { commercial: { netPrice: 516.38, vatPercent: 21, grossPrice: 624.82 } },
        quote: { quoteSnapshotId: "qts:1", href: "/quotes/qts%3A1", reference: "OF-ABCDEF01" },
        request: null,
        release: { releaseSnapshotId: "rel:1" },
        execution: {
          planId: "exp:1",
          href: "/execution/exp:1",
          statusLabel: "Planificat",
          progressLabel: "0 / 12 finalizate",
          blocked: false,
          attentionLabel: null,
          view: null,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/jobs/ord:1"]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getByText(/Aceeași lucrare, fără blocaj curent/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Blocaj" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deschide execuția" })).toBeInTheDocument();
  });

  it("shows forbidden without leaking identifiers", async () => {
    vi.mocked(fetchJobDetail).mockResolvedValue({ ok: false, reason: "forbidden" });
    render(
      <MemoryRouter initialEntries={["/jobs/ord:hidden"]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Nu ai acces la această lucrare.")).toBeInTheDocument();
  });
});
