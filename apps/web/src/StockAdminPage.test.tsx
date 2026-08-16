import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { projectInventoryItemDetail, projectInventoryStock } from "@workos-final/domain";
import { StockAdminPage } from "./StockAdminPage";

vi.mock("./inventoryApi", () => ({
  fetchInventory: () => Promise.resolve(projectInventoryStock([])),
  fetchInventoryItem: (resourceId: string) => {
    const detail = projectInventoryItemDetail(resourceId, []);
    if (!detail) {
      return Promise.reject(new Error("not_found"));
    }
    return Promise.resolve(detail);
  },
  recordInventoryAdjustment: vi.fn(),
}));

describe("StockAdminPage", () => {
  it("lists stockable materials without purchase or reservation language", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/stock"]}>
        <Routes>
          <Route path="/admin/stock" element={<StockAdminPage />} />
          <Route path="/admin/stock/:resourceId" element={<StockAdminPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Stoc" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Materiale în stoc" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Modul LED 12V" })).toBeInTheDocument();
    expect(screen.getAllByText("Fără mișcări").length).toBeGreaterThan(0);
    expect(screen.queryByText("Inventory Engine")).not.toBeInTheDocument();
    expect(screen.queryByText("Rezervare")).not.toBeInTheDocument();
    expect(screen.queryByText("Comandă de achiziție")).not.toBeInTheDocument();
  });

  it("shows an honest empty movement state on a material detail", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/stock/MAT-LED-MODULE"]}>
        <Routes>
          <Route path="/admin/stock/:resourceId" element={<StockAdminPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Modul LED 12V" })).toBeInTheDocument();
    expect(
      screen.getByText("Nu există mișcări de stoc pentru acest material."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Înregistrează stoc inițial" })).toBeInTheDocument();
    expect(screen.queryByText("OUT")).not.toBeInTheDocument();
    expect(screen.queryByText("ADJUSTMENT")).not.toBeInTheDocument();
  });
});
