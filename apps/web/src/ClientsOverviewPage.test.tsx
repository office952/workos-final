import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { CustomerRegistryProjection } from "@workos-final/domain";
import { ClientsOverviewPage } from "./ClientsOverviewPage";
import { createCustomer, fetchCustomerRegistry } from "./customerApi";

function customer(
  overrides: CustomerRegistryProjection["customers"][number],
): CustomerRegistryProjection["customers"][number] {
  return overrides;
}

const registry: CustomerRegistryProjection = {
  summary: { total: 4, active: 3, retired: 1, needsAttention: 2 },
  customers: [
    customer({
      customerId: "cus:zulu",
      displayName: "Zulu Last",
      cui: "RO999",
      contactName: "Zoe",
      phone: null,
      email: null,
      city: "Timișoara",
      status: "ACTIVE",
      statusLabel: "Activ",
      openRequestCount: 0,
      quoteCount: 1,
      jobCount: 0,
      needsAttention: true,
      attentionLabel: "1 ofertă necesită acțiune",
      href: "/clients/cus%3Azulu",
    }),
    customer({
      customerId: "cus:alpha",
      displayName: "Client Alpha",
      cui: "RO111",
      contactName: "Ana",
      phone: null,
      email: null,
      city: "București",
      status: "ACTIVE",
      statusLabel: "Activ",
      openRequestCount: 1,
      quoteCount: 2,
      jobCount: 1,
      needsAttention: true,
      attentionLabel: "1 cerere necesită acțiune",
      href: "/clients/cus%3Aalpha",
    }),
    customer({
      customerId: "cus:retired",
      displayName: "Client Retras",
      cui: null,
      contactName: null,
      phone: null,
      email: null,
      city: null,
      status: "RETIRED",
      statusLabel: "Retras",
      openRequestCount: 0,
      quoteCount: 0,
      jobCount: 0,
      needsAttention: false,
      attentionLabel: null,
      href: "/clients/cus%3Aretired",
    }),
    customer({
      customerId: "cus:aaa",
      displayName: "Aaa First",
      cui: null,
      contactName: "Ion",
      phone: null,
      email: null,
      city: "Cluj",
      status: "ACTIVE",
      statusLabel: "Activ",
      openRequestCount: 0,
      quoteCount: 0,
      jobCount: 2,
      needsAttention: false,
      attentionLabel: null,
      href: "/clients/cus%3Aaaa",
    }),
  ],
};

vi.mock("./customerApi", () => ({
  fetchCustomerRegistry: vi.fn(),
  createCustomer: vi.fn(),
}));

function renderClients(initialEntries: string[] = ["/clients"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ClientsOverviewPage />
    </MemoryRouter>,
  );
}

function metricValue(label: string): string {
  const card = screen.getByText(label, { selector: ".metric-card-label" }).closest(".metric-card");
  expect(card).not.toBeNull();
  return within(card as HTMLElement).getByText(/^\d+$/).textContent ?? "";
}

describe("ClientsOverviewPage", () => {
  it("projects registry metrics and lists A–Z cards as one link each", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue(registry);
    renderClients();
    expect(await screen.findByRole("heading", { name: "Clienți" })).toBeInTheDocument();
    expect(metricValue("Clienți")).toBe("4");
    expect(metricValue("Activi")).toBe("3");
    expect(metricValue("Retrași")).toBe("1");
    expect(metricValue("Necesită atenție")).toBe("2");
    expect(screen.getByText("4 clienți")).toHaveClass("registry-result-count");

    const names = screen.getAllByText(/Aaa First|Client Alpha|Client Retras|Zulu Last/, {
      selector: ".registry-row-name",
    });
    expect(names.map((node) => node.textContent)).toEqual([
      "Aaa First",
      "Client Alpha",
      "Client Retras",
      "Zulu Last",
    ]);

    const alpha = screen.getByRole("link", { name: /Client Alpha/ });
    expect(alpha).toHaveClass("registry-row");
    expect(alpha).toHaveClass("is-attention");
    expect(alpha).toHaveAttribute("href", "/clients/cus%3Aalpha");
    expect(alpha.querySelectorAll("a")).toHaveLength(0);
    expect(within(alpha).getByText("Activ")).toHaveClass("registry-row-status");
    expect(within(alpha).getByText("1 cerere necesită acțiune")).toHaveClass(
      "registry-row-attention",
    );
    expect(within(alpha).getByText("Ana · RO111 · București")).toBeInTheDocument();
    expect(within(alpha).getByLabelText("Activitate comercială")).toHaveTextContent(
      "1Cereri2Oferte1Lucrări",
    );
    expect(screen.getByText("Fără CUI sau contact")).toHaveClass("registry-row-meta");
    expect(screen.queryByRole("link", { name: "Deschide clientul" })).not.toBeInTheDocument();
    expect(screen.queryByText("cus:alpha")).not.toBeInTheDocument();
    expect(screen.queryByText(/lead|pipeline|CRM/i)).not.toBeInTheDocument();
    expect(document.querySelectorAll(".clients-overview .registry-row")).toHaveLength(4);
  });

  it("combines status, attention and search without reordering by attention", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue(registry);
    renderClients();
    await screen.findByText("Aaa First");

    await userEvent.click(screen.getByRole("button", { name: "Retrași" }));
    expect(screen.getByText("1 client")).toBeInTheDocument();
    expect(screen.getByText("Client Retras")).toBeInTheDocument();
    expect(screen.queryByText("Client Alpha")).not.toBeInTheDocument();
    expect(metricValue("Clienți")).toBe("4");

    await userEvent.click(screen.getByRole("button", { name: "Toți" }));
    await userEvent.click(screen.getByRole("button", { name: "Necesită atenție" }));
    expect(screen.getByText("2 clienți")).toBeInTheDocument();
    expect(screen.getByText("Client Alpha")).toBeInTheDocument();
    expect(screen.getByText("Zulu Last")).toBeInTheDocument();
    expect(screen.queryByText("Aaa First")).not.toBeInTheDocument();
    const attentionNames = screen.getAllByText(/Client Alpha|Zulu Last/, {
      selector: ".registry-row-name",
    });
    expect(attentionNames.map((node) => node.textContent)).toEqual(["Client Alpha", "Zulu Last"]);

    await userEvent.click(screen.getByRole("button", { name: "Activi" }));
    expect(screen.getByText("2 clienți")).toBeInTheDocument();
    expect(screen.queryByText("Client Retras")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Caută client"), "RO111");
    expect(screen.getByText("1 client")).toBeInTheDocument();
    expect(screen.getByText("Client Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Zulu Last")).not.toBeInTheDocument();
  });

  it("restores status and attention from the URL", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue(registry);
    renderClients(["/clients?status=retired&attention=1"]);
    await screen.findByRole("heading", { name: "Clienți" });
    expect(screen.getByRole("button", { name: "Retrași" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Necesită atenție" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("0 clienți")).toBeInTheDocument();
    expect(screen.getByText("Niciun client în acest filtru.")).toBeInTheDocument();
  });

  it("creates a client from the registry", async () => {
    vi.mocked(fetchCustomerRegistry).mockResolvedValue({
      summary: { total: 0, active: 0, retired: 0, needsAttention: 0 },
      customers: [],
    });
    vi.mocked(createCustomer).mockResolvedValue({
      customer: {
        customerId: "cus:new",
        displayName: "Client Nou",
        status: "ACTIVE",
        createdAt: "2026-08-17T10:00:00.000Z",
        updatedAt: "2026-08-17T10:00:00.000Z",
        retiredAt: null,
        cui: "RO1",
        contactName: "Ion",
        phone: null,
        email: null,
        address: null,
        city: null,
        notes: null,
      },
      customers: [],
    });
    renderClients();
    await screen.findByRole("heading", { name: "Clienți" });
    expect(screen.getByText("0 clienți")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Client nou" }));
    await userEvent.type(screen.getByLabelText("Nume"), "Client Nou");
    await userEvent.type(screen.getByLabelText("CUI"), "RO1");
    await userEvent.click(screen.getByRole("button", { name: "Salvează clientul" }));
    expect(createCustomer).toHaveBeenCalledWith(
      "Client Nou",
      expect.objectContaining({ cui: "RO1" }),
    );
  });
});
