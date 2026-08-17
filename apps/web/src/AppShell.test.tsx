import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { OperatorSessionProvider } from "./OperatorSessionContext";

vi.mock("./operatorSessionApi", () => ({
  fetchOperatorSession: vi.fn(async () => ({ operator: null, session: null })),
  fetchOperatorCandidates: vi.fn(async () => []),
  identifyOperator: vi.fn(),
  logoutOperator: vi.fn(async () => undefined),
}));

function renderShell(ui: ReactElement, initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <OperatorSessionProvider>{ui}</OperatorSessionProvider>
    </MemoryRouter>,
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the Romanian shell chrome without internal capability names", async () => {
    renderShell(
      <AppShell
        navItems={[
          { to: "/products", label: "Produse" },
          { to: "/admin", label: "Administrare" },
        ]}
      >
        <p>conținut</p>
      </AppShell>,
    );

    expect(screen.getByText("WorkOS Final")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigare principală" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Produse" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Administrare" })).toBeInTheDocument();
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Identifică-te" })).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
    expect(screen.queryByText("RESOURCES_COST")).not.toBeInTheDocument();
  });

  it("marks the active section in primary navigation", () => {
    renderShell(
      <AppShell
        navItems={[
          { to: "/products", label: "Produse" },
          { to: "/admin", label: "Administrare" },
        ]}
      >
        <p>conținut</p>
      </AppShell>,
      ["/admin"],
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
    renderShell(
      <AppShell
        navItems={[
          { to: "/", label: "Lucrări" },
          { to: "/atelier", label: "Atelier" },
          {
            to: "/requests",
            label: "Comercial",
            matchPrefixes: ["/requests", "/quotes", "/clients"],
          },
          { to: "/products", label: "Produse" },
        ]}
      >
        <p>oferte</p>
      </AppShell>,
      ["/quotes"],
    );

    expect(screen.getByRole("link", { name: "Comercial" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Atelier" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigare comercială" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Clienți" })).toBeInTheDocument();
  });

  it("keeps commercial secondary navigation on a product continuation", () => {
    renderShell(
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
      </AppShell>,
      ["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1"],
    );

    expect(screen.getByRole("navigation", { name: "Navigare comercială" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Comercial" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
