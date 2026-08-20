import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { CloudSessionProvider } from "./CloudSessionContext";
import { OperatorSessionProvider } from "./OperatorSessionContext";

vi.mock("./cloudSessionApi", () => ({
  fetchCloudSession: vi.fn(async () => ({
    mode: "single_plane",
    user: null,
    organization: null,
    memberships: [],
  })),
  loginCloud: vi.fn(),
  logoutCloud: vi.fn(),
  switchCloudOrganization: vi.fn(),
}));

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

  it("shows the organization name only in Cloud mode", async () => {
    const { fetchCloudSession } = await import("./cloudSessionApi");
    vi.mocked(fetchCloudSession).mockResolvedValue({
      mode: "cloud",
      user: { userId: "usr:1", email: "owner@example.test" },
      organization: {
        organizationId: "org:1",
        displayName: "Atelier Alpha",
        slug: "alpha",
        role: "owner",
      },
      memberships: [
        {
          organizationId: "org:1",
          displayName: "Atelier Alpha",
          slug: "alpha",
          role: "owner",
          status: "ACTIVE",
        },
      ],
    });

    render(
      <MemoryRouter>
        <CloudSessionProvider>
          <OperatorSessionProvider>
            <AppShell navItems={[{ to: "/admin", label: "Administrare" }]}>
              <p>conținut</p>
            </AppShell>
          </OperatorSessionProvider>
        </CloudSessionProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText("Organizație curentă")).toBeInTheDocument();
    expect(screen.getByText("Atelier Alpha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ieși din cont" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Schimbă organizația")).not.toBeInTheDocument();
  });

  it("shows the organization switcher only for multi-membership accounts", async () => {
    const { fetchCloudSession } = await import("./cloudSessionApi");
    vi.mocked(fetchCloudSession).mockResolvedValue({
      mode: "cloud",
      user: { userId: "usr:c", email: "user.c@isolation.test" },
      organization: {
        organizationId: "org:a",
        displayName: "Atelier Alpha",
        slug: "alpha",
        role: "owner",
      },
      memberships: [
        {
          organizationId: "org:a",
          displayName: "Atelier Alpha",
          slug: "alpha",
          role: "owner",
          status: "ACTIVE",
        },
        {
          organizationId: "org:b",
          displayName: "TEST COMPANY",
          slug: "test-company",
          role: "owner",
          status: "ACTIVE",
        },
      ],
    });

    render(
      <MemoryRouter>
        <CloudSessionProvider>
          <OperatorSessionProvider>
            <AppShell navItems={[{ to: "/admin", label: "Administrare" }]}>
              <p>conținut</p>
            </AppShell>
          </OperatorSessionProvider>
        </CloudSessionProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText("Schimbă organizația")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Atelier Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "TEST COMPANY" })).toBeInTheDocument();
  });
});
