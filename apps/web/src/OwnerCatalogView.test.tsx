import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { OwnerCatalogView } from "./OwnerCatalogView";
import type { OwnerCatalog } from "./ownerCatalog";

const catalog: OwnerCatalog = {
  categories: [
    {
      id: "product-components",
      label: "Componente de produs",
      kindLabel: "Categorie",
      items: [
        {
          id: "FACE",
          label: "Față",
          kindLabel: "Componentă",
          summary: "Deține suprafața.",
          groups: [
            {
              id: "FACE_PLEXIGLAS_3MM",
              kindLabel: "Variantă",
              title: "Plexiglas 3 mm",
              sections: [
                {
                  id: "general",
                  title: "General",
                  facts: [{ label: "Calcul independent", value: "Da" }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "future",
      label: "Resurse",
      kindLabel: "Categorie",
      items: [
        {
          id: "sheet",
          label: "Foaie",
          kindLabel: "Resursă",
          groups: [
            {
              id: "sheet",
              kindLabel: "Resursă",
              title: "Foaie",
              sections: [{ id: "note", title: "Notă", lines: ["doar test"] }],
            },
          ],
        },
      ],
    },
  ],
};

describe("OwnerCatalogView", () => {
  it("navigates category then item without stacking every category", async () => {
    const user = userEvent.setup();
    render(
      <OwnerCatalogView catalog={catalog} title="Module și componente" lead="Proiecție." />,
    );

    expect(screen.getByRole("navigation", { name: "Categorii catalog" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Componente de produs" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Față" })).toBeInTheDocument();
    expect(screen.getByText("Variantă")).toBeInTheDocument();
    expect(screen.queryByText("doar test")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Resurse" }));
    expect(screen.getByRole("heading", { name: "Foaie", level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Foaie", level: 3 })).not.toBeInTheDocument();
    expect(screen.getByText("doar test")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Față" })).not.toBeInTheDocument();
  });
});
