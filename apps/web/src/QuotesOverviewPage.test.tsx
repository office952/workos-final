import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { QuoteOverviewProjection } from "@workos-final/domain";
import { QuotesOverviewPage } from "./QuotesOverviewPage";
import { fetchQuoteOverview } from "./quotesApi";

const overview: QuoteOverviewProjection = {
  summary: { total: 1, needsAttention: 1, accepted: 0, ordered: 0 },
  quotes: [
    {
      quoteSnapshotId: "qts:1",
      reference: "OF-ABCDEF01",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "HUB",
      customerId: "cus:1",
      customerDisplayName: "HUB MEDIA",
      createdAt: "2026-08-17T12:00:00.000Z",
      grossDisplay: "624,82",
      currency: "EUR",
      stage: "QUOTE_CREATED",
      stageLabel: "Creată",
      nextAction: "ACCEPT_QUOTE",
      nextActionLabel: "Marchează acceptată",
      href: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1",
      needsAttention: true,
      attentionLabel: "Urmează acceptarea",
      acceptanceId: null,
      orderSnapshotId: null,
    },
  ],
};

vi.mock("./quotesApi", () => ({
  fetchQuoteOverview: vi.fn(),
}));

describe("QuotesOverviewPage", () => {
  it("links the frozen client to the Client Workspace", async () => {
    vi.mocked(fetchQuoteOverview).mockResolvedValue(overview);
    render(
      <MemoryRouter>
        <QuotesOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Oferte" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Client: HUB MEDIA" })).toHaveAttribute(
      "href",
      "/clients/cus%3A1",
    );
  });
});
