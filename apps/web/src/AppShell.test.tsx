import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("shows the Romanian shell chrome without internal capability names", () => {
    render(
      <MemoryRouter>
        <AppShell
          navItems={[
            { to: "/products", label: "Produse" },
            { to: "/admin", label: "Administrare" },
          ]}
        >
          <p>conținut</p>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.getByText("WorkOS Final")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigare principală" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Produse" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Administrare" })).toBeInTheDocument();
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
    expect(screen.queryByText("RESOURCES_COST")).not.toBeInTheDocument();
  });

  it("marks the active section in primary navigation", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppShell
          navItems={[
            { to: "/products", label: "Produse" },
            { to: "/admin", label: "Administrare" },
          ]}
        >
          <p>conținut</p>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Administrare" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Produse" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps Comercial active across commercial routes and shows secondary links", () => {
    render(
      <MemoryRouter initialEntries={["/quotes"]}>
        <AppShell
          navItems={[
            { to: "/", label: "Lucrări" },
            {
              to: "/requests",
              label: "Comercial",
              matchPrefixes: ["/requests", "/quotes", "/clients"],
            },
            { to: "/products", label: "Produse" },
          ]}
        >
          <p>oferte</p>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Comercial" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("navigation", { name: "Navigare comercială" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Clienți" })).toBeInTheDocument();
  });

  it("keeps commercial secondary navigation on a product continuation", () => {
    render(
      <MemoryRouter initialEntries={["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1"]}>
        <AppShell
          navItems={[
            { to: "/", label: "Lucrări" },
            {
              to: "/requests",
              label: "Comercial",
              matchPrefixes: ["/requests", "/quotes", "/clients"],
            },
          ]}
        >
          <p>produs</p>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation", { name: "Navigare comercială" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Comercial" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
