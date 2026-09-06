import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { CloudSessionProvider } from "./CloudSessionContext";
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
    vi.mocked(fetchOperatorSession).mockResolvedValue({ operator: null, session: null });
  });

  it("shows the UI20 quiet top shell without sidebar or capability jargon", async () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "WorkOS" })).toBeInTheDocument();
    expect(document.querySelector(".app-sidebar-desktop")).toBeNull();
    expect(document.querySelector(".app-shell")).toHaveClass("is-ui20-top");
    expect(primaryNav()).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Cereri" })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Lucrări" })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Atelier" })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("button", { name: "Comercial" })).toBeInTheDocument();
    expect(within(primaryNav()).getByRole("button", { name: "Mai multe" })).toBeInTheDocument();
    expect(within(primaryNav()).queryByRole("link", { name: "Acasă" })).not.toBeInTheDocument();
    expect(within(primaryNav()).queryByRole("link", { name: "Catalog" })).not.toBeInTheDocument();
    expect(screen.getByText("conținut")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cont" })).toBeInTheDocument();
    expect(screen.queryByText("PRODUCT")).not.toBeInTheDocument();
    expect(screen.queryByText("TRUTH_COMPILER")).not.toBeInTheDocument();
  });

  it("opens Comercial L2 without Cereri and without icons", async () => {
    const user = userEvent.setup();
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    await user.click(within(primaryNav()).getByRole("button", { name: "Comercial" }));
    const panel = screen.getByRole("region", { name: "Comercial" });
    expect(within(panel).getByRole("link", { name: "Clienți" })).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: "Oferte" })).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: "Catalog" })).toBeInTheDocument();
    expect(within(panel).queryByRole("link", { name: "Cereri" })).not.toBeInTheDocument();
    expect(panel.querySelector("svg")).toBeNull();
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
  });

  it("marks Comercial active on quote routes", () => {
    renderShell(
      <AppShell>
        <p>oferte</p>
      </AppShell>,
      ["/quotes"],
    );
    expect(within(primaryNav()).getByRole("button", { name: "Comercial" })).toHaveClass("is-active");
  });

  it("keeps Comercial active when configuring without a commercial continuation", () => {
    renderShell(
      <AppShell>
        <p>configurator</p>
      </AppShell>,
      ["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06"],
    );
    expect(within(primaryNav()).getByRole("button", { name: "Comercial" })).toHaveClass("is-active");
    expect(within(primaryNav()).getByRole("link", { name: "Cereri" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("activates Cereri for a request continuation and Comercial for a quote continuation", () => {
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
    expect(within(primaryNav()).getByRole("button", { name: "Comercial" })).toHaveClass("is-active");
  });

  it("has no dead L1 links among visible top destinations", () => {
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    const hrefs = within(primaryNav())
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(["/requests", "/jobs", "/atelier"]);
    expect(hrefs.every((href) => href && href.startsWith("/") && !href.includes("undefined"))).toBe(
      true,
    );
  });

  it("exposes Administrare from Cont", async () => {
    const user = userEvent.setup();
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    await user.click(screen.getByRole("button", { name: "Cont" }));
    expect(screen.getByRole("link", { name: "Administrare" })).toHaveAttribute("href", "/admin");
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
    expect(screen.getByRole("link", { name: "Administrare" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ieși din cont" })).toBeInTheDocument();
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
    expect(screen.getByLabelText("Schimbă organizația")).toBeInTheDocument();
  });

  it("keeps skip-link and Cont theme controls", async () => {
    const user = userEvent.setup();
    renderShell(
      <AppShell>
        <p>conținut</p>
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "Sari la conținut" })).toHaveAttribute(
      "href",
      "#continut-principal",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "continut-principal");
    await user.click(screen.getByRole("button", { name: "Cont" }));
    expect(screen.getByRole("button", { name: "Deschisă" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Întunecată" })).toBeInTheDocument();
  });

  it("shows interactive operator controls on Atelier and reduces commercial chrome", async () => {
    mockIdentifiedOperator();
    renderShell(
      <AppShell>
        <p>atelier</p>
      </AppShell>,
      ["/atelier"],
    );
    expect(await screen.findByText(/Operator:/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Schimbă" })).toBeInTheDocument();
    expect(document.querySelector(".app-shell")).toHaveClass("is-reduced-chrome");
    expect(within(primaryNav()).queryByRole("button", { name: "Comercial" })).not.toBeInTheDocument();
    expect(within(primaryNav()).getByRole("link", { name: "Atelier" })).toBeInTheDocument();
  });

  it("keeps a passive operator chip on office routes once identified", async () => {
    mockIdentifiedOperator();
    renderShell(
      <AppShell>
        <p>office</p>
      </AppShell>,
      ["/clients"],
    );
    expect(await screen.findByText(/Operator:/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Schimbă" })).not.toBeInTheDocument();
  });
});
