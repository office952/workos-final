import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
      },
    ]);
    render(<CustomerAdminPage />);
    expect(await screen.findByRole("heading", { name: "Clienți" })).toBeInTheDocument();
    expect(screen.getByText("SC Exemplu SRL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adaugă client" })).toBeInTheDocument();
    expect(screen.queryByText("cus:hidden")).not.toBeInTheDocument();
    expect(screen.queryByText(/lead|pipeline|oportunit/i)).not.toBeInTheDocument();
  });
});
