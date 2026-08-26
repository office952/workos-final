import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { CustomerRegistryProjection } from "@workos-final/domain";
import { ClientsOverviewPage } from "./ClientsOverviewPage";
import { createCustomer, fetchCustomerRegistry } from "./customerApi";

const registry: CustomerRegistryProjection = {
  summary: { total: 2, active: 1, retired: 1, needsAttention: 1 },
  customers: [
    {
      customerId: "cus:alpha",
      displayName: "Client Alpha",
      cui: "RO111",
      contactName: "Ana",
      phone: null,
      email: null,
      city: null,
      status: "ACTIVE",
      statusLabel: "Activ",
      openRequestCount: 1,
      quoteCount: 2,
      jobCount: 1,
      needsAttention: true,
      attentionLabel: "1 cerere necesită acțiune",
      href: "/clients/cus%3Aalpha",
    },
    {
      customerId: "cus:retired",
      displayName: "Client Retras",
      cui: null,
      contactName: null,
      phone: null,
      email: null,
      city: null,
      status: "RETIRED",
      statusLabel: "Retras",
      openRequestCount: 0,
      quoteCount: 0,
      jobCount: 0,
      needsAttention: false,
      attentionLabel: null,
      href: "/clients/cus%3Aretired",
    },
  ],
};

vi.mock("./customerApi", () => ({
  fetchCustomerRegistry: vi.fn(),
  createCustomer: vi.fn(),
}));

describe("ClientsOverviewPage", () => {
  it("lists clients with commercial counts and opens the workspace", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue(registry);
    render(
      <MemoryRouter>
        <ClientsOverviewPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Clienți" })).toBeInTheDocument();
    expect(screen.getByText("Client Alpha")).toBeInTheDocument();
    expect(screen.getByText(/RO111/)).toBeInTheDocument();
    expect(screen.getByText(/Cereri deschise 1/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Deschide clientul" })[0]).toHaveAttribute(
      "href",
      "/clients/cus%3Aalpha",
    );
    expect(screen.queryByText("cus:alpha")).not.toBeInTheDocument();
    expect(screen.queryByText(/lead|pipeline|CRM/i)).not.toBeInTheDocument();
  });

  it("filters retired clients and searches current profile", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue(registry);
    render(
      <MemoryRouter>
        <ClientsOverviewPage />
      </MemoryRouter>,
    );
    await screen.findByText("Client Alpha");
    await userEvent.click(screen.getByRole("button", { name: "Retrasi" }));
    expect(screen.getByText("Client Retras")).toBeInTheDocument();
    expect(screen.queryByText("Client Alpha")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Toți" }));
    await userEvent.type(screen.getByLabelText("Caută client"), "RO111");
    expect(screen.getByText("Client Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Client Retras")).not.toBeInTheDocument();
  });

  it("creates a client from the registry", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue({
      summary: { total: 0, active: 0, retired: 0, needsAttention: 0 },
      customers: [],
    });
    vi.mocked(createCustomer).mockResolvedValue({
      customer: {
        customerId: "cus:new",
        displayName: "Client Nou",
        status: "ACTIVE",
        createdAt: "2026-08-17T10:00:00.000Z",
        updatedAt: "2026-08-17T10:00:00.000Z",
        retiredAt: null,
        cui: "RO1",
        contactName: "Ion",
        phone: null,
        email: null,
        address: null,
        city: null,
        notes: null,
      },
      customers: [],
    });
    render(
      <MemoryRouter>
        <ClientsOverviewPage />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: "Clienți" });
    await userEvent.click(screen.getByRole("button", { name: "Client nou" }));
    await userEvent.type(screen.getByLabelText("Nume"), "Client Nou");
    await userEvent.type(screen.getByLabelText("CUI"), "RO1");
    await userEvent.click(screen.getByRole("button", { name: "Salvează clientul" }));
    expect(createCustomer).toHaveBeenCalledWith(
      "Client Nou",
      expect.objectContaining({ cui: "RO1" }),
    );
  });
});
