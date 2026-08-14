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
            { to: "/", label: "Stare sistem" },
            { to: "/products", label: "Produse" },
          ]}
        >
          <p>conținut</p>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.getByText("WorkOS Final")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigare principală" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stare sistem" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Produse" })).toBeInTheDocument();
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
    expect(screen.queryByText("RESOURCES_COST")).not.toBeInTheDocument();
  });
});
