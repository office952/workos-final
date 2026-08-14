import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { CatalogTreeNode } from "@workos-final/domain";
import { CatalogTree } from "./CatalogTree";

const nestedTree: CatalogTreeNode[] = [
  {
    kind: "family",
    id: "F",
    label: "Familie test",
    description: "Descriere familie",
    children: [
      {
        kind: "category",
        id: "C1",
        label: "Categorie test",
        children: [
          {
            kind: "category",
            id: "C2",
            label: "Subcategorie test",
            children: [
              {
                kind: "product",
                code: "P1",
                label: "Produs test",
                description: "",
              },
            ],
          },
        ],
      },
      {
        kind: "category",
        id: "C3",
        label: "Categorie goală",
        children: [],
      },
    ],
  },
];

describe("CatalogTree", () => {
  it("renders nested categories and does not assume two levels", () => {
    render(
      <MemoryRouter>
        <CatalogTree nodes={nestedTree} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Familie test" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Categorie test" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Subcategorie test" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Produs test" })).toHaveAttribute(
      "href",
      "/products/P1",
    );
    expect(
      screen.getByText("Nu există încă produse în această categorie."),
    ).toBeInTheDocument();
  });
});
