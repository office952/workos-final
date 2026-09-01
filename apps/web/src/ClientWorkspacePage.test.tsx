import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { emptyCustomerProfile, type CustomerWorkspaceProjection } from "@workos-final/domain";
import { ClientWorkspacePage } from "./ClientWorkspacePage";
import { CLIENTS_WORKSPACE_ORIGIN_KEY, markClientsWorkspaceOrigin } from "./clientsWorkspaceOrigin";
import { fetchCustomerWorkspace, updateCustomer } from "./customerApi";

const workspace: CustomerWorkspaceProjection = {
  customer: {
    customerId: "cus:alpha",
    displayName: "Client Alpha",
    status: "ACTIVE",
    createdAt: "2026-08-17T08:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
    retiredAt: null,
    ...emptyCustomerProfile(),
    cui: "RO111",
    contactName: "Ana",
    phone: "0722000000",
    city: "București",
  },
  statusLabel: "Activ",
  canCreateRequest: true,
  summary: {
    requestCount: 1,
    openRequestCount: 1,
    requestNeedsAction: 1,
    quoteCount: 1,
    quoteNeedsAction: 1,
    jobCount: 1,
    jobNeedsAction: 0,
  },
  nextActions: [{ label: "1 cerere necesită acțiune", href: "/requests/crq:alpha" }],
  recentActivity: [
    {
      at: "2026-08-17T11:00:00.000Z",
      label: "Ofertă OF-ABCDEF01",
      href: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts%3Aalpha",
    },
  ],
  requests: [
    {
      requestId: "crq:alpha",
      reference: "CER-AAAAAAAA",
      customerId: "cus:alpha",
      customerDisplayName: "Client Alpha",
      title: "Litere exterior",
      createdAt: "2026-08-17T10:00:00.000Z",
      status: "NEW",
      statusLabel: "Nouă",
      commercialProgress: null,
      commercialProgressLabel: null,
      nextAction: "OPEN_REQUEST",
      nextActionLabel: "Deschide",
      href: "/requests/crq:alpha",
      nextActionHref: "/requests/crq:alpha",
      needsAttention: true,
      attentionLabel: "Cerere nouă",
      linkedQuoteCount: 0,
    },
  ],
  quotes: [
    {
      quoteSnapshotId: "qts:alpha",
      reference: "OF-ABCDEF01",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "ALPHA",
      customerId: "cus:alpha",
      customerDisplayName: "Client Alpha",
      createdAt: "2026-08-17T11:00:00.000Z",
      grossDisplay: "624,82",
      currency: "EUR",
      stage: "QUOTE_CREATED",
      stageLabel: "Creată",
      nextAction: "ACCEPT_QUOTE",
      nextActionLabel: "Marchează acceptată",
      href: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts%3Aalpha",
      needsAttention: true,
      attentionLabel: "Urmează acceptarea",
      acceptanceId: null,
      orderSnapshotId: null,
      requestId: null,
      requestReference: null,
    },
  ],
  jobs: [
    {
      jobId: "ord:alpha",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "ALPHA",
      customerId: "cus:alpha",
      customerDisplayName: "Client Alpha",
      createdAt: "2026-08-17T12:00:00.000Z",
      stage: "ORDER_CREATED",
      stageLabel: "Comandă creată",
      nextAction: "RELEASE_TO_PRODUCTION",
      nextActionLabel: "Eliberează pentru producție",
      href: "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord%3Aalpha",
      needsAttention: false,
      attentionLabel: null,
      completedCount: null,
      taskCount: null,
      inProgressCount: null,
      progressLabel: null,
      orderSnapshotId: "ord:alpha",
      releaseSnapshotId: null,
      planId: null,
    },
  ],
};

vi.mock("./customerApi", () => ({
  fetchCustomerWorkspace: vi.fn(),
  updateCustomer: vi.fn(),
}));

function renderWorkspace(
  path = "/clients/cus:alpha",
  state?: { clientsWorkspaceOrigin?: { customerId: string; search: string; scrollY: number } },
) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: path.split("?")[0], search: path.includes("?") ? `?${path.split("?")[1]}` : "", state }]}>
      <Routes>
        <Route path="/clients/:customerId" element={<ClientWorkspacePage />} />
        <Route path="/clients" element={<p>Registry</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ClientWorkspacePage", () => {
  afterEach(() => {
    cleanup();
    sessionStorage.removeItem(CLIENTS_WORKSPACE_ORIGIN_KEY);
  });

  it("shows current identity without a status chip or stacked commercial lists", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace();
    expect(await screen.findByRole("heading", { name: "Client Alpha" })).toBeInTheDocument();
    expect(screen.queryByText("Activ")).not.toBeInTheDocument();
    expect(screen.getByText("RO111 · Ana · București")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Date client" })).toBeInTheDocument();
    expect(screen.getByText("1 cerere necesită acțiune")).toBeInTheDocument();
    expect(screen.queryByText("Litere exterior")).not.toBeInTheDocument();
    expect(screen.queryByText("Documente")).not.toBeInTheDocument();
    expect(screen.queryByText("cus:alpha")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cerere nouă" })).toBeInTheDocument();
    const rail = screen.getByLabelText("Rezumat comercial");
    expect(within(rail).queryByRole("link")).not.toBeInTheDocument();
    expect(rail).toHaveTextContent(/1\s*Cereri/);
    expect(rail).toHaveTextContent(/1\s*Oferte/);
    expect(rail).toHaveTextContent(/1\s*Lucrări/);
  });

  it("keeps attention above profile and ignores next-action fallback", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace();
    await screen.findByRole("heading", { name: "Client Alpha" });
    const attention = screen.getByRole("link", { name: /Necesită atenție/ });
    const profile = screen.getByRole("heading", { name: "Date client" });
    expect(attention.compareDocumentPosition(profile) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    cleanup();
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue({
      ...workspace,
      summary: {
        requestCount: 0,
        openRequestCount: 0,
        requestNeedsAction: 0,
        quoteCount: 0,
        quoteNeedsAction: 0,
        jobCount: 0,
        jobNeedsAction: 0,
      },
      nextActions: [{ label: "Creează o cerere de ofertă", href: "/requests?customer=cus%3Aalpha" }],
      recentActivity: [],
      requests: [],
      quotes: [],
      jobs: [],
    });
    renderWorkspace();
    expect(await screen.findByText("Clientul nu are încă activitate comercială.")).toBeInTheDocument();
    expect(screen.getByText("Nicio activitate înregistrată.")).toBeInTheDocument();
    expect(screen.queryByText("Necesită atenție")).not.toBeInTheDocument();
    expect(screen.queryByText("Creează o cerere de ofertă")).not.toBeInTheDocument();
    expect(screen.getAllByText("Nesetat").length).toBeGreaterThan(0);
  });

  it("opens request, quote and job sections from the same workspace", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace("/clients/cus:alpha?section=cereri");
    expect(await screen.findByText("CER-AAAAAAAA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Litere exterior/ })).toHaveAttribute(
      "href",
      "/requests/crq:alpha",
    );
    cleanup();

    renderWorkspace("/clients/cus:alpha?section=oferte");
    expect(await screen.findByText(/OF-ABCDEF01/)).toBeInTheDocument();
    expect(screen.getByText(/624,82 EUR/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Descarcă oferta PDF" })).toBeInTheDocument();
    const quoteRow = document.querySelector(".client-quote-row");
    expect(quoteRow).not.toBeNull();
    expect(quoteRow!.querySelector("a.client-collection-chevron")).toBeNull();
    expect(quoteRow!.querySelector("span.client-collection-chevron")).not.toBeNull();
    const quoteLinks = within(quoteRow as HTMLElement).getAllByRole("link");
    expect(quoteLinks).toHaveLength(3);
    expect(quoteLinks[0]).toHaveAttribute("href", "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts%3Aalpha");
    expect(quoteLinks[1]).toHaveAttribute("aria-label", "Descarcă oferta PDF");
    expect(quoteLinks[2]).toHaveTextContent("Marchează acceptată");
    cleanup();

    renderWorkspace("/clients/cus:alpha?section=lucrari");
    expect(await screen.findByText("Comandă creată")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Eliberează pentru producție/ })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord%3Aalpha",
    );
  });

  it("edits in a drawer without changing the current section", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    vi.mocked(updateCustomer).mockResolvedValue({
      customer: { ...workspace.customer, displayName: "Client Alpha SRL" },
      customers: [],
    });
    renderWorkspace("/clients/cus:alpha?section=oferte");
    await screen.findByText(/OF-ABCDEF01/);
    await userEvent.click(screen.getByRole("button", { name: "Editează datele" }));
    expect(screen.getByRole("heading", { name: "Editează clientul" })).toBeInTheDocument();
    const name = screen.getByLabelText("Nume");
    fireEvent.change(name, { target: { value: "Client Alpha SRL" } });
    await userEvent.click(screen.getByRole("button", { name: "Salvează" }));
    expect(updateCustomer).toHaveBeenCalledWith(
      "cus:alpha",
      expect.objectContaining({ displayName: "Client Alpha SRL" }),
    );
    expect(screen.getByText(/OF-ABCDEF01/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toHaveAttribute("aria-current", "page");
  });

  it("cancels the edit drawer without leaving the current section", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace("/clients/cus:alpha?section=oferte");
    await screen.findByText(/OF-ABCDEF01/);
    await userEvent.click(screen.getByRole("button", { name: "Editează datele" }));
    expect(screen.getByRole("heading", { name: "Editează clientul" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Anulează" }));
    expect(screen.queryByRole("heading", { name: "Editează clientul" })).not.toBeInTheDocument();
    expect(screen.getByText(/OF-ABCDEF01/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oferte" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps a retired workspace readable without Cerere nouă", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue({
      ...workspace,
      customer: { ...workspace.customer, status: "RETIRED" },
      statusLabel: "Retras",
      canCreateRequest: false,
    });
    renderWorkspace();
    expect(await screen.findByText("Retras · Istoricul rămâne vizibil.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Cerere nouă" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editează datele" })).toBeInTheDocument();
  });

  it("returns through the registry origin marker and falls back on deep link", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace("/clients/cus:alpha", {
      clientsWorkspaceOrigin: {
        customerId: "cus:alpha",
        search: "?q=alpha&status=active&attention=1",
        scrollY: 180,
      },
    });
    const back = await screen.findByRole("link", { name: "Înapoi la Clienți" });
    expect(back).toHaveAttribute("href", "/clients?q=alpha&status=active&attention=1");

    cleanup();
    sessionStorage.removeItem(CLIENTS_WORKSPACE_ORIGIN_KEY);
    renderWorkspace("/clients/cus:alpha");
    expect(await screen.findByRole("link", { name: "Înapoi la Clienți" })).toHaveAttribute(
      "href",
      "/clients",
    );

    cleanup();
    markClientsWorkspaceOrigin({
      customerId: "cus:alpha",
      search: "?q=stored&status=all",
      scrollY: 90,
    });
    renderWorkspace("/clients/cus:alpha");
    expect(await screen.findByRole("link", { name: "Înapoi la Clienți" })).toHaveAttribute(
      "href",
      "/clients?q=stored&status=all",
    );

    cleanup();
    markClientsWorkspaceOrigin({
      customerId: "cus:alpha",
      search: "?q=stale&status=active&attention=1",
      scrollY: 400,
    });
    renderWorkspace("/clients/cus:alpha", {
      clientsWorkspaceOrigin: {
        customerId: "cus:alpha",
        search: "?q=live&status=active",
        scrollY: 80,
      },
    });
    expect(await screen.findByRole("link", { name: "Înapoi la Clienți" })).toHaveAttribute(
      "href",
      "/clients?q=live&status=active",
    );
  });

  it("wraps a two-line legal name without exposing backend identifiers", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue({
      ...workspace,
      customer: {
        ...workspace.customer,
        displayName:
          "Client Alpha Construcții Metalice, Publicitate Exterior și Amenajări Comerciale București S.R.L.",
      },
    });
    renderWorkspace();
    expect(
      await screen.findByRole("heading", {
        name: "Client Alpha Construcții Metalice, Publicitate Exterior și Amenajări Comerciale București S.R.L.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("cus:alpha")).not.toBeInTheDocument();
  });

  it("shows missing and error states", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(null);
    renderWorkspace();
    expect(await screen.findByText("Clientul cerut nu este disponibil.")).toBeInTheDocument();

    vi.mocked(fetchCustomerWorkspace).mockRejectedValue(new Error("down"));
    renderWorkspace();
    expect(await screen.findByText("Clientul nu a putut fi încărcat.")).toBeInTheDocument();
  });
});
