import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { emptyCustomerProfile } from "@workos-final/domain";
import { CustomerAdminPage } from "./CustomerAdminPage";
import { fetchCustomers } from "./customerApi";

vi.mock("./customerApi", () => ({
  fetchCustomers: vi.fn(),
  createCustomer: vi.fn(),
  renameCustomer: vi.fn(),
  retireCustomer: vi.fn(),
}));

describe("CustomerAdminPage", () => {
  it("lists customers without exposing ids or CRM language", async () => {
    vi.mocked(fetchCustomers).mockResolvedValue([
      {
        customerId: "cus:hidden",
        displayName: "SC Exemplu SRL",
        status: "ACTIVE",
        createdAt: "2026-08-17T08:00:00.000Z",
        updatedAt: "2026-08-17T08:00:00.000Z",
        retiredAt: null,
        ...emptyCustomerProfile(),
      },
    ]);
    render(
      <MemoryRouter>
        <CustomerAdminPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Clienți" })).toBeInTheDocument();
    expect(screen.getByText("SC Exemplu SRL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adaugă client" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deschide workspace" })).toHaveAttribute(
      "href",
      "/clients/cus%3Ahidden",
    );
    expect(screen.queryByText("cus:hidden")).not.toBeInTheDocument();
    expect(screen.queryByText(/lead|pipeline|oportunit/i)).not.toBeInTheDocument();
  });
});
