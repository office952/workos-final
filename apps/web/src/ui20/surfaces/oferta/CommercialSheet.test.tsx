import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommercialSheet } from "./CommercialSheet";

vi.mock("../../../quotesApi", () => ({
  fetchQuoteInspection: vi.fn(),
}));

vi.mock("../../../jobsApi", () => ({
  fetchJobDetail: vi.fn(),
}));

vi.mock("../../../productApi", () => ({
  acceptQuoteSnapshot: vi.fn(),
  createOrderSnapshot: vi.fn(),
  createProductionRelease: vi.fn(),
}));

import { fetchQuoteInspection } from "../../../quotesApi";

describe("CommercialSheet", () => {
  beforeEach(() => {
    vi.mocked(fetchQuoteInspection).mockResolvedValue({
      ok: true,
      detail: {
        quote: {
          quoteSnapshotId: "qts:1",
          reference: "OF-1",
          productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
          productLabel: "Litere",
          inscription: "HUB",
          customerId: "cus:1",
          customerDisplayName: "Client",
          createdAt: "2026-09-07T00:00:00.000Z",
          grossDisplay: "624,82",
          currency: "EUR",
          stage: "QUOTE_CREATED",
          stageLabel: "Creată",
          nextAction: "ACCEPT_QUOTE",
          nextActionLabel: "Marchează acceptată",
          href: "/quotes/qts:1",
          needsAttention: true,
          attentionLabel: null,
          acceptanceId: null,
          orderSnapshotId: null,
          requestId: "crq:1",
          requestReference: "CER-1",
        },
        quoteSnapshot: {},
        acceptance: null,
        order: null,
        request: { requestId: "crq:1", href: "/requests/crq:1", reference: "CER-1" },
      },
    });
  });

  it("shows the frozen commercial value and no invented extra lines", async () => {
    render(
      <MemoryRouter initialEntries={["/quotes/qts:1"]}>
        <Routes>
          <Route path="/quotes/*" element={<CommercialSheet />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getAllByText(/624,82/)).toHaveLength(1);
    expect(document.querySelector("[data-quote-value]")?.textContent).toContain("624,82");
    expect(screen.getByText("Creată")).toBeInTheDocument();
    expect(screen.queryByText(/5[.,]490/)).not.toBeInTheDocument();
    expect(screen.queryByText(/transport/i)).not.toBeInTheDocument();
  });
});
