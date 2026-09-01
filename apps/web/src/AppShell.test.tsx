import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { CloudSessionProvider } from "./CloudSessionContext";
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from "./navigation/navigationRegistry";
import { fetchOperatorSession } from "./operatorSessionApi";
import { OperatorSessionProvider } from "./OperatorSessionContext";
import { ThemeProvider } from "./theme/ThemeProvider";

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

vi.mock("./sellerApi", () => ({
  fetchSellerProfile: vi.fn(async () => null),
  updateSellerProfile: vi.fn(),
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
      <ThemeProvider>
        <OperatorSessionProvider>{ui}</OperatorSessionProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

function primaryNav() {
  return screen.getByRole("navigation", { name: "Navigare principală" });
}

function mockIdentifiedOperator(displayName = "Ana Pop") {
  vi.mocked(fetchOperatorSession).mockResolvedValue({
    operator: {
      personId: "per:ana",
      displayName,
      availability: "AVAILABLE",
    },
    session: {
      sessionId: "ops:1",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  });
}

describe("AppShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.removeItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    vi.mocked(fetchOperatorSession).mockResolvedValue({ operator: null, session: null });
  });

  it("shows the Romanian sidebar without internal capability names or top-nav L2", async () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "WorkOS" })).toBeInTheDocument();
    expect(screen.queryByText("WorkOS Final")).not.toBeInTheDocument();
    expect(primaryNav()).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Lucrări" })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Catalog" })).toBeInTheDocument();
    expect(within(primaryNav()).queryByRole("link", { name: /^Comercial$/ })).not.toBeInTheDocument();
    expect(within(primaryNav()).queryByRole("link", { name: /^Administrare$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Navigare comercială" })).not.toBeInTheDocument();
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Identifică-te" })).not.toBeInTheDocument();
    expect(document.querySelector(".app-context-title")).toBeNull();
    expect(screen.getByRole("button", { name: "Cont" })).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
    expect(screen.queryByText("RESOURCES_COST")).not.toBeInTheDocument();
  });

  it("treats categories as labels, not links, and gives pages Lucide icons", () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    const nav = primaryNav();
    for (const category of ["Comercial", "Producție", "Resurse", "Oameni", "Administrare"]) {
      const label = within(nav).getByText(category);
      expect(label.tagName).toBe("P");
      expect(label.closest("a")).toBeNull();
      expect(label.querySelector("svg")).toBeNull();
    }
    const lucrari = within(nav).getByRole("link", { name: "Lucrări" });
    expect(lucrari.querySelector("svg")).not.toBeNull();
    expect(
      within(nav).queryByRole("link", { name: "Acasă" }),
    ).not.toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: "Plăți și avansuri" }),
    ).not.toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Guvernanță" })).toBeInTheDocument();
  });

  it("marks Lucrări current on / and /jobs object routes", () => {
    renderShell(
      <AppShell>
        <p>lucrare</p>
      </AppShell>,
      ["/jobs/ord:1"],
    );
    expect(within(primaryNav()).getByRole("link", { name: "Lucrări" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(primaryNav()).getByRole("link", { name: "Catalog" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("activates Oferte on quote routes without a Comercial L2", () => {
    renderShell(
      <AppShell>
        <p>oferte</p>
      </AppShell>,
      ["/quotes"],
    );
    expect(within(primaryNav()).getByRole("link", { name: "Oferte" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("navigation", { name: "Navigare comercială" })).not.toBeInTheDocument();
  });

  it("keeps Catalog current when configuring without a commercial continuation", () => {
    renderShell(
      <AppShell>
        <p>configurator</p>
      </AppShell>,
      ["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06"],
    );
    expect(within(primaryNav()).getByRole("link", { name: "Catalog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(primaryNav()).getByRole("link", { name: "Cereri" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("activates Cereri for a request continuation and Oferte for a quote continuation", () => {
    const request = renderShell(
      <AppShell>
        <p>cerere</p>
      </AppShell>,
      ["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=crq:1"],
    );
    expect(within(primaryNav()).getByRole("link", { name: "Cereri" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    request.unmount();
    renderShell(
      <AppShell>
        <p>ofertă</p>
      </AppShell>,
      ["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1"],
    );
    expect(within(primaryNav()).getByRole("link", { name: "Oferte" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("has no dead links among visible destinations", () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    const hrefs = within(primaryNav())
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/clients",
      "/requests",
      "/quotes",
      "/products",
      "/jobs",
      "/atelier",
      "/admin/resources",
      "/admin/stock",
      "/admin/workcenters",
      "/admin/people",
      "/admin/seller",
      "/admin/operational-services",
      "/admin/product-system",
      "/governance",
    ]);
    expect(hrefs.every((href) => href && href.startsWith("/") && !href.includes("undefined"))).toBe(
      true,
    );
  });

  it("persists collapsed sidebar preference", async () => {
    const user = userEvent.setup();
    const first = renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    expect(document.querySelector(".app-shell")).not.toHaveClass("is-sidebar-collapsed");
    await user.click(screen.getByRole("button", { name: "Restrânge meniul" }));
    expect(document.querySelector(".app-shell")).toHaveClass("is-sidebar-collapsed");
    expect(window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)).toBe("1");
    first.unmount();
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    expect(document.querySelector(".app-shell")).toHaveClass("is-sidebar-collapsed");
    expect(within(primaryNav()).getByRole("link", { name: /Guvernanță/ })).toBeInTheDocument();
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
        <ThemeProvider>
          <CloudSessionProvider>
            <OperatorSessionProvider>
              <AppShell>
                <p>conținut</p>
              </AppShell>
            </OperatorSessionProvider>
          </CloudSessionProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Cont" }));
    expect(screen.getByText("Atelier Alpha")).toBeInTheDocument();
    expect(screen.queryByText(/^Organizație:/)).not.toBeInTheDocument();
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
        <ThemeProvider>
          <CloudSessionProvider>
            <OperatorSessionProvider>
              <AppShell>
                <p>conținut</p>
              </AppShell>
            </OperatorSessionProvider>
          </CloudSessionProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Cont" }));
    expect(await screen.findByLabelText("Schimbă organizația")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Atelier Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "TEST COMPANY" })).toBeInTheDocument();
  });

  it("keeps skip link, theme and Cont utilities available", async () => {
    renderShell(
      <AppShell>
        <h1>Conținut</h1>
      </AppShell>,
      ["/jobs/ord:1"],
    );

    const skip = screen.getByRole("link", { name: "Sari la conținut" });
    expect(skip).toHaveAttribute("href", "#continut-principal");
    const user = userEvent.setup();
    await user.tab();
    expect(skip).toHaveFocus();
    await user.click(skip);
    expect(document.getElementById("continut-principal")).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Cont" }));
    expect(screen.getByRole("group", { name: "Temă" })).toBeInTheDocument();
    expect(screen.getByLabelText("Cont")).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Lucrări" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("hides Identifică-te on admin routes and keeps skip link off-screen until focus", async () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
      ["/admin/resources"],
    );
    expect(screen.queryByRole("button", { name: "Identifică-te" })).not.toBeInTheDocument();
    const skip = screen.getByRole("link", { name: "Sari la conținut" });
    expect(skip.className).toContain("skip-link");
    const user = userEvent.setup();
    await user.tab();
    expect(skip).toHaveFocus();
    expect(within(primaryNav()).getByRole("link", { name: "Resurse și costuri" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps Clients header free of page title and identify CTA when no operator exists", async () => {
    renderShell(
      <AppShell>
        <h1>Clienți</h1>
      </AppShell>,
      ["/clients"],
    );

    expect(await screen.findByRole("link", { name: "WorkOS" })).toBeInTheDocument();
    expect(screen.queryByText("WorkOS Final")).not.toBeInTheDocument();
    expect(document.querySelector(".app-context-title")).toBeNull();
    expect(screen.queryByRole("button", { name: "Identifică-te" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Operator curent")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cont" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Clienți" })).toBeInTheDocument();
  });

  it("keeps operator identification available on Atelier when required", async () => {
    renderShell(
      <AppShell>
        <p>atelier</p>
      </AppShell>,
      ["/atelier"],
    );

    expect(await screen.findByRole("button", { name: "Identifică-te" })).toBeInTheDocument();
    expect(document.querySelector(".app-context-title")).toBeNull();
  });

  it("shows an identified operator passively on commercial pages", async () => {
    mockIdentifiedOperator();
    renderShell(
      <AppShell>
        <h1>Clienți</h1>
      </AppShell>,
      ["/clients"],
    );

    expect(await screen.findByLabelText("Operator curent")).toHaveTextContent("Operator: Ana Pop");
    expect(screen.queryByRole("button", { name: "Identifică-te" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Schimbă" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ieși" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cont" })).toBeInTheDocument();
  });

  it("keeps Schimbă and Ieși on Execution after identification", async () => {
    mockIdentifiedOperator();
    renderShell(
      <AppShell>
        <p>execuție</p>
      </AppShell>,
      ["/execution/exp:1"],
    );

    expect(await screen.findByRole("button", { name: "Schimbă" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ieși" })).toBeInTheDocument();
    expect(screen.getByLabelText("Operator curent")).toHaveTextContent("Operator: Ana Pop");
  });
});
