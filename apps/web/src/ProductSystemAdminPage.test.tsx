import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  projectProductSystemAdministration,
  seededDisplayLabelCatalog,
} from "@workos-final/domain";
import { ProductSystemAdminPage } from "./ProductSystemAdminPage";
import { fetchProductSystemAdministration } from "./systemApi";

vi.mock("./systemApi", () => ({
  fetchProductSystemAdministration: vi.fn(),
  patchDisplayLabel: vi.fn(),
}));

describe("ProductSystemAdminPage", () => {
  beforeEach(() => {
    vi.mocked(fetchProductSystemAdministration).mockResolvedValue(
      projectProductSystemAdministration(seededDisplayLabelCatalog()),
    );
  });

  it("links a product template to resources without a product-specific branch", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/product-system"]}>
        <ProductSystemAdminPage />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole("button", { name: "Produse" }));
    await user.click(
      screen.getByRole("button", {
        name: /Litere volumetrice luminoase/,
      }),
    );

    expect(screen.getByRole("link", { name: "Resurse și costuri" })).toHaveAttribute(
      "href",
      `/admin/resources?product=${encodeURIComponent(CANONICAL_PRODUCT_CODE)}`,
    );
  });
});
