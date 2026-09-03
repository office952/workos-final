import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { QuoteOverviewItem } from "@workos-final/domain";
import { acceptQuoteSnapshot } from "./productApi";
import { QuoteInspectionPage } from "./QuoteInspectionPage";
import { fetchQuoteInspection, type QuoteInspectionResponse } from "./quotesApi";

vi.mock("./quotesApi", () => ({
  fetchQuoteInspection: vi.fn(),
}));

vi.mock("./productApi", () => ({
  acceptQuoteSnapshot: vi.fn(),
  createOrderSnapshot: vi.fn(),
}));

function quoteItem(overrides: Partial<QuoteOverviewItem> = {}): QuoteOverviewItem {
  return {
    quoteSnapshotId: "qts:1",
    reference: "OF-ABCDEF01",
    productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    productLabel: "Litere",
    inscription: "HUB",
    customerId: "cus:1",
    customerDisplayName: "Client HUB",
    createdAt: "2026-08-17T10:00:00.000Z",
    grossDisplay: "624,82",
    currency: "EUR",
    stage: "QUOTE_CREATED",
    stageLabel: "Creată",
    nextAction: "ACCEPT_QUOTE",
    nextActionLabel: "Marchează acceptată",
    href: "/quotes/qts%3A1",
    needsAttention: true,
    attentionLabel: "Urmează acceptarea",
    acceptanceId: null,
    orderSnapshotId: null,
    requestId: null,
    requestReference: null,
    ...overrides,
  };
}

function inspection(quote: QuoteOverviewItem): QuoteInspectionResponse {
  return {
    quote,
    quoteSnapshot: {
      commercial: { netPrice: 516.38, vatPercent: 21, grossPrice: 624.82 },
    },
    acceptance: quote.acceptanceId ? { acceptanceId: quote.acceptanceId } : null,
    order: null,
    request: null,
  };
}

function renderQuotePage() {
  return render(
    <MemoryRouter initialEntries={["/quotes/qts:1"]}>
      <Routes>
        <Route path="/quotes/:quoteSnapshotId" element={<QuoteInspectionPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("QuoteInspectionPage", () => {
  it("shows member prices and keeps Acceptată as a status, not the only action", async () => {
    vi.mocked(fetchQuoteInspection).mockResolvedValue({
      ok: true,
      detail: inspection(quoteItem()),
    });

    renderQuotePage();

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getAllByText(/OF-ABCDEF01/).length).toBeGreaterThan(0);
    expect(screen.getByText("624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("Preț client")).toBeInTheDocument();
    expect(screen.getByText("TVA 21%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marchează acceptată" })).toBeInTheDocument();
    expect(screen.queryByText("Cost intern")).not.toBeInTheDocument();
    expect(screen.queryByText("qts:1")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Client și sursă" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Valori comerciale" })).toBeInTheDocument();
  });

  it("projects Owner commercial extras in the same composed layout", async () => {
    vi.mocked(fetchQuoteInspection).mockResolvedValue({
      ok: true,
      detail: {
        ...inspection(
          quoteItem({
            stage: "QUOTE_ACCEPTED",
            stageLabel: "Acceptată",
            nextAction: "CREATE_ORDER",
            nextActionLabel: "Creează comanda",
            acceptanceId: "qad:1",
          }),
        ),
        quoteSnapshot: {
          commercial: {
            netPrice: 516.38,
            vatPercent: 21,
            grossPrice: 624.82,
            internalCost: 382.5,
            markupPercent: 35,
            marginAmount: 133.88,
          },
        },
      },
    });

    renderQuotePage();

    expect(await screen.findByRole("heading", { name: "HUB" })).toBeInTheDocument();
    expect(screen.getByText("Acceptată")).toBeInTheDocument();
    expect(screen.getByText("Cost intern")).toBeInTheDocument();
    expect(screen.getByText("Adaos")).toBeInTheDocument();
    expect(screen.getByText("Marjă")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează comanda" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Acceptată" })).not.toBeInTheDocument();
  });

  it("refetches quote inspection after accept instead of writing the next action locally", async () => {
    vi.mocked(fetchQuoteInspection)
      .mockResolvedValueOnce({
        ok: true,
        detail: inspection(quoteItem()),
      })
      .mockResolvedValueOnce({
        ok: true,
        detail: inspection(
          quoteItem({
            stage: "QUOTE_ACCEPTED",
            stageLabel: "Acceptată",
            nextAction: "CREATE_ORDER",
            nextActionLabel: "Creează comanda",
            needsAttention: true,
            attentionLabel: "Urmează comanda",
            acceptanceId: "qad:1",
          }),
        ),
      });
    vi.mocked(acceptQuoteSnapshot).mockResolvedValue({
      ok: true,
      created: true,
      acceptance: { acceptanceId: "qad:1" },
      quoteSnapshot: {},
    } as Awaited<ReturnType<typeof acceptQuoteSnapshot>>);

    renderQuotePage();
    await userEvent.click(await screen.findByRole("button", { name: "Marchează acceptată" }));

    expect(await screen.findByRole("button", { name: "Creează comanda" })).toBeInTheDocument();
    expect(screen.getByText("Acceptată")).toBeInTheDocument();
    expect(vi.mocked(fetchQuoteInspection).mock.calls.at(-1)?.[0]).toBe("qts:1");
  });
});
