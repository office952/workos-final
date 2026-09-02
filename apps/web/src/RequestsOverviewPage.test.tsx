import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { emptyCustomerProfile, type RequestOverviewProjection } from "@workos-final/domain";
import { RequestsOverviewPage } from "./RequestsOverviewPage";
import { createCustomer, fetchCustomers } from "./customerApi";
import { createCommercialRequest, fetchRequestOverview } from "./requestsApi";

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
    newCount: 0,
    inReview: 0,
    waitingCustomer: 0,
    readyForQuote: 1,
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
      status: "READY_FOR_QUOTE",
      statusLabel: "Gata de ofertă",
      commercialProgress: null,
      commercialProgressLabel: null,
      nextAction: "CHOOSE_PRODUCT",
      nextActionLabel: "Alege produs",
      href: "/requests/crq:11111111-2222-3333-4444-555555555555",
      nextActionHref: "/products?request=crq%3A11111111-2222-3333-4444-555555555555",
      needsAttention: true,
      attentionLabel: "Urmează oferta",
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
  it("renders the worklist without nested client or next-action links", async () => {
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
    expect(screen.getByRole("button", { name: "Necesită atenție" })).toBeInTheDocument();
    const row = screen.getByRole("link", { name: /Litere exterior/ });
    expect(row).toHaveAttribute("href", "/requests/crq:11111111-2222-3333-4444-555555555555");
    expect(row).toHaveTextContent("CER-11111111 · HUB MEDIA");
    expect(row).toHaveTextContent("Gata de ofertă");
    expect(row).toHaveTextContent("Urmează oferta");
    expect(row).toHaveTextContent("Alege produs");
    expect(row).toHaveClass("is-attention");
    expect(screen.queryByText("De preluat")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Client: HUB MEDIA" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Alege produs$/ })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cerere nouă" }));
    expect(screen.getByRole("button", { name: "Creează cererea" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clientul nu e în listă" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Clientul nu e în listă" }));
    expect(screen.getByRole("textbox", { name: "Nume client" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează clientul" })).toBeInTheDocument();
    expect(screen.queryByLabelText("CUI")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Telefon")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Adresă")).not.toBeInTheDocument();
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();
    expect(screen.queryByText("Intake")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Gata de ofertă" }));
    expect(screen.getByText("Litere exterior")).toBeInTheDocument();
  });

  it("creates a client from the name-only quick create and keeps the request form", async () => {
    vi.mocked(fetchRequestOverview).mockResolvedValue(emptyOverview);
    vi.mocked(fetchCustomers).mockResolvedValue([]);
    vi.mocked(createCustomer).mockResolvedValue({
      customer: {
        customerId: "cus:new",
        displayName: "Client Rapid",
        status: "ACTIVE",
        createdAt: "2026-08-17T08:00:00.000Z",
        updatedAt: "2026-08-17T08:00:00.000Z",
        retiredAt: null,
        ...emptyCustomerProfile(),
      },
      customers: [
        {
          customerId: "cus:new",
          displayName: "Client Rapid",
          status: "ACTIVE",
          createdAt: "2026-08-17T08:00:00.000Z",
          updatedAt: "2026-08-17T08:00:00.000Z",
          retiredAt: null,
          ...emptyCustomerProfile(),
        },
      ],
    });
    render(
      <MemoryRouter>
        <RequestsOverviewPage />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByRole("button", { name: "Cerere nouă" }));
    await userEvent.click(screen.getByRole("button", { name: "Clientul nu e în listă" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Nume client" }), "Client Rapid");
    await userEvent.click(screen.getByRole("button", { name: "Creează clientul" }));
    expect(createCustomer).toHaveBeenCalledWith("Client Rapid");
    expect(await screen.findByRole("combobox", { name: "Client" })).toHaveValue("cus:new");
    expect(screen.queryByRole("textbox", { name: "Nume client" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează cererea" })).toBeInTheDocument();
    expect(createCommercialRequest).not.toHaveBeenCalled();
  });

  it("locks the client when the drawer opens from Client Hub", async () => {
    vi.mocked(fetchRequestOverview).mockResolvedValue(emptyOverview);
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
      <MemoryRouter initialEntries={["/requests?customer=cus:1"]}>
        <RequestsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("dialog", { name: "Cerere nouă" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Client" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clientul nu e în listă" })).not.toBeInTheDocument();
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
