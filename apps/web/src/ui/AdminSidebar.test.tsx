import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ADMIN_L2_WAVE1_SECTION_IDS } from "../adminNavigation";
import { AdminSidebar } from "./AdminSidebar";

describe("AdminSidebar", () => {
  it("renders only available sections and marks the current page", () => {
    render(
      <MemoryRouter>
        <AdminSidebar current="resources" availableSectionIds={ADMIN_L2_WAVE1_SECTION_IDS} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Resurse și cost intern" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Utilaje și zone" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oameni" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Servicii operaționale" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Procese" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guvernanță" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Stoc" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Atelier — execuție" })).not.toBeInTheDocument();
    const labels = screen.getAllByRole("link").map((link) => link.textContent);
    expect(labels).toEqual([
      "Resurse și cost intern",
      "Utilaje și zone",
      "Oameni",
      "Servicii operaționale",
      "Procese",
      "Guvernanță",
    ]);
  });

  it("omits inactive modules instead of rendering dead links", () => {
    render(
      <MemoryRouter>
        <AdminSidebar current="resources" availableSectionIds={["resources"]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Resurse și cost intern" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Oameni" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Utilaje și zone" })).not.toBeInTheDocument();
  });
});
