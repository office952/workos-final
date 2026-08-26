import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProductCatalogPage } from "./ProductCatalogPage";
import { fetchProductCatalog } from "./productApi";

vi.mock("./productApi", () => ({
  fetchProductCatalog: vi.fn(),
}));

describe("ProductCatalogPage", () => {
  it("lists saleable products and keeps Configurează contextual", async () => {
    vi.mocked(fetchProductCatalog).mockResolvedValue([
      {
        kind: "family",
        id: "F1",
        label: "Litere și semne volumetrice luminoase",
        description: "",
        children: [
          {
            kind: "product",
            code: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
            label: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
            description: "Configurabil",
          },
        ],
      },
    ]);
    render(
      <MemoryRouter>
        <ProductCatalogPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Catalog" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Litere și semne volumetrice luminoase" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
      }),
    ).toHaveAttribute("href", "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06");
    expect(screen.getByRole("link", { name: "Configurează" })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    );
    expect(screen.queryByText("Product System")).not.toBeInTheDocument();
    expect(screen.queryByText("PRD-LETTERS-FRONTLIT-PLEXI-AL06")).not.toBeInTheDocument();
  });
});
