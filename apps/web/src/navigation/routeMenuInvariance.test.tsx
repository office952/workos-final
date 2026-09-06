import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "../AppShell";
import { OperatorSessionProvider } from "../OperatorSessionContext";
import { ThemeProvider } from "../theme/ThemeProvider";

vi.mock("../cloudSessionApi", () => ({
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

vi.mock("../sellerApi", () => ({
  fetchSellerProfile: vi.fn(async () => null),
  updateSellerProfile: vi.fn(),
}));

vi.mock("../operatorSessionApi", () => ({
  fetchOperatorSession: vi.fn(async () => ({ operator: null, session: null })),
  fetchOperatorCandidates: vi.fn(async () => []),
  identifyOperator: vi.fn(),
  logoutOperator: vi.fn(async () => undefined),
}));

const ROUTE_SAMPLES = buildRouteSamples();

let latestNavigate: ((to: string) => void) | undefined;

function NavigateProbe() {
  const navigate = useNavigate();
  latestNavigate = navigate;
  return (
    <AppShell>
      <p>pagina</p>
    </AppShell>
  );
}

function renderShell(initialEntry: string) {
  latestNavigate = undefined;
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <OperatorSessionProvider>
          <NavigateProbe />
        </OperatorSessionProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
  return {
    ...view,
    go(to: string) {
      const navigate = latestNavigate;
      if (!navigate) {
        throw new Error("navigate was not captured");
      }
      navigate(to);
    },
  };
}

function visibleMenu() {
  const nav = screen.getByRole("navigation", { name: "Navigare principală" });
  return {
    links: within(nav)
      .getAllByRole("link")
      .map((link) => ({
        name: link.textContent?.replace(/\s+/g, " ").trim(),
        href: link.getAttribute("href"),
      })),
    triggers: within(nav)
      .getAllByRole("button")
      .map((button) => button.textContent?.replace(/\s+/g, " ").trim()),
  };
}

function activeSlotLabel() {
  const nav = screen.getByRole("navigation", { name: "Navigare principală" });
  const currentLink = within(nav).queryByRole("link", { current: "page" });
  if (currentLink) {
    return currentLink.textContent?.replace(/\s+/g, " ").trim();
  }
  const activeTrigger = nav.querySelector(".global-nav-item.is-trigger.is-active");
  return activeTrigger?.textContent?.replace(/\s+/g, " ").trim() ?? null;
}

function buildRouteSamples(): string[] {
  const ids = ["1", "2", "alpha", "ord:1", "qts:1", "crq:1", "cus:1", "exp:1", "per:1"];
  const samples = [
    "/",
    "/jobs",
    "/atelier",
    "/requests",
    "/quotes",
    "/clients",
    "/products",
    "/admin/resources",
    "/admin/stock",
    "/admin/workcenters",
    "/admin/people",
    "/admin/people/skills",
    "/admin/seller",
    "/admin/operational-services",
    "/admin/product-system",
    "/governance",
    "/system",
    "/components",
    "/admin",
    "/admin/processes",
    "/admin/customers",
    "/commercial",
    "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=crq:1",
    "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1",
    "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord:1",
    "/admin/resources?selected=family:PLEXIGLAS",
    "/admin/resources?nav=basic",
    "/admin/stock/res:1",
    "/suppliers",
    "/people/attendance",
    "/people/payments",
  ];
  for (const id of ids) {
    samples.push(
      `/jobs/${id}`,
      `/clients/${id}`,
      `/requests/${id}`,
      `/quotes/${id}`,
      `/execution/${id}`,
      `/admin/people/${id}`,
    );
  }
  while (samples.length < 100) {
    samples.push(`/jobs/sample-${samples.length}`);
  }
  return samples.slice(0, 120);
}

describe("route menu invariance", () => {
  it("keeps the same visible UI20 top menu structure across at least 100 routes", () => {
    expect(ROUTE_SAMPLES.length).toBeGreaterThanOrEqual(100);
    const { go } = renderShell(ROUTE_SAMPLES[0]);
    const expected = visibleMenu();
    expect(expected.links.map((item) => item.name)).toEqual(["Cereri", "Lucrări", "Atelier"]);
    expect(expected.triggers).toEqual(["Comercial", "Mai multe"]);

    for (const route of ROUTE_SAMPLES.slice(1)) {
      go(route);
      // Atelier/Execution intentionally reduce commercial chrome; office L1 stays invariant.
      if (route.startsWith("/atelier") || route.startsWith("/execution")) {
        continue;
      }
      expect(visibleMenu(), route).toEqual(expected);
    }
  });

  it("keeps Mai multe open for Resurse destinations without changing L1 structure", async () => {
    const user = userEvent.setup();
    renderShell("/admin/stock");
    const before = visibleMenu();
    expect(activeSlotLabel()).toBe("Mai multe");

    await user.click(within(screen.getByRole("navigation", { name: "Navigare principală" })).getByRole("button", { name: "Mai multe" }));
    await user.click(screen.getByRole("link", { name: "Utilaje" }));
    expect(visibleMenu()).toEqual(before);
    expect(activeSlotLabel()).toBe("Mai multe");

    await user.click(within(screen.getByRole("navigation", { name: "Navigare principală" })).getByRole("button", { name: "Mai multe" }));
    await user.click(screen.getByRole("link", { name: "Resurse și costuri" }));
    expect(visibleMenu()).toEqual(before);
    expect(activeSlotLabel()).toBe("Mai multe");
  });

  it("keeps the same visible menu on an unknown path", () => {
    const { go } = renderShell("/admin/stock");
    const before = visibleMenu();
    go("/suppliers");
    expect(visibleMenu()).toEqual(before);
  });
});
