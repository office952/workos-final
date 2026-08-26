import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { emptyCustomerProfile, type RequestOverviewProjection } from "@workos-final/domain";
import { RequestsOverviewPage } from "./RequestsOverviewPage";
import { fetchCustomers } from "./customerApi";
import { fetchRequestOverview } from "./requestsApi";

const emptyOverview: RequestOverviewProjection = {
  summary: {
    total: 0,
    needsAttention: 0,
    newCount: 0,
    inReview: 0,
    waitingCustomer: 0,
    readyForQuote: 0,
    blocked: 0,
  },
  requests: [],
};

const readyOverview: RequestOverviewProjection = {
  summary: {
    total: 1,
    needsAttention: 1,
    newCount: 1,
    inReview: 0,
    waitingCustomer: 0,
    readyForQuote: 0,
    blocked: 0,
  },
  requests: [
    {
      requestId: "crq:11111111-2222-3333-4444-555555555555",
      reference: "CER-11111111",
      customerId: "cus:1",
      customerDisplayName: "HUB MEDIA",
      title: "Litere exterior",
      createdAt: "2026-08-17T10:00:00.000Z",
      status: "NEW",
      statusLabel: "Nouă",
      commercialProgress: null,
      commercialProgressLabel: null,
      nextAction: "OPEN_REQUEST",
      nextActionLabel: "Deschide",
      href: "/requests/crq:11111111-2222-3333-4444-555555555555",
      nextActionHref: "/requests/crq:11111111-2222-3333-4444-555555555555",
      needsAttention: true,
      attentionLabel: "Urmează preluarea",
      linkedQuoteCount: 0,
    },
  ],
};

vi.mock("./requestsApi", () => ({
  fetchRequestOverview: vi.fn(),
  createCommercialRequest: vi.fn(),
}));

vi.mock("./customerApi", () => ({
  fetchCustomers: vi.fn(),
  createCustomer: vi.fn(),
}));

describe("RequestsOverviewPage", () => {
  it("renders human labels and the create form", async () => {
    vi.mocked(fetchRequestOverview).mockResolvedValue(readyOverview);
    vi.mocked(fetchCustomers).mockResolvedValue([
      {
        customerId: "cus:1",
        displayName: "HUB MEDIA",
        status: "ACTIVE",
        createdAt: "2026-08-17T08:00:00.000Z",
        updatedAt: "2026-08-17T08:00:00.000Z",
        retiredAt: null,
        ...emptyCustomerProfile(),
      },
    ]);
    render(
      <MemoryRouter>
        <RequestsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Cereri de ofertă" })).toBeInTheDocument();
    expect(screen.getByText("Litere exterior")).toBeInTheDocument();
    expect(screen.getByText("CER-11111111")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Client: HUB MEDIA" })).toHaveAttribute(
      "href",
      "/clients/cus%3A1",
    );
    expect(screen.getByText("Nouă")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Litere exterior" })).toHaveAttribute(
      "href",
      "/requests/crq:11111111-2222-3333-4444-555555555555",
    );
    expect(screen.getByRole("link", { name: "Deschide" })).toHaveAttribute(
      "href",
      "/requests/crq:11111111-2222-3333-4444-555555555555",
    );
    await userEvent.click(screen.getByRole("button", { name: "Cerere nouă" }));
    expect(screen.getByRole("button", { name: "Creează cererea" })).toBeInTheDocument();
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();
    expect(screen.queryByText("Intake")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Noi" }));
    expect(screen.getByText("Litere exterior")).toBeInTheDocument();
  });

  it("shows an empty state without demo requests", async () => {
    vi.mocked(fetchRequestOverview).mockResolvedValue(emptyOverview);
    vi.mocked(fetchCustomers).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <RequestsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Nu există încă cereri de ofertă.")).toBeInTheDocument();
  });
});
