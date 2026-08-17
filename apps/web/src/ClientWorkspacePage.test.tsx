import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { emptyCustomerProfile, type CustomerWorkspaceProjection } from "@workos-final/domain";
import { ClientWorkspacePage } from "./ClientWorkspacePage";
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
  nextActions: [
    { label: "1 cerere necesită acțiune", href: "/requests/crq:alpha" },
  ],
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

function renderWorkspace(path = "/clients/cus:alpha") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/clients/:customerId" element={<ClientWorkspacePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ClientWorkspacePage", () => {
  it("shows current identity and overview without stacking empty future tabs", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace();
    expect(await screen.findByRole("heading", { name: "Client Alpha" })).toBeInTheDocument();
    expect(screen.getByText("Activ")).toBeInTheDocument();
    expect(screen.getByText("RO111 · Ana · 0722000000")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Date curente" })).toBeInTheDocument();
    expect(screen.getByText("1 cerere necesită acțiune")).toBeInTheDocument();
    expect(screen.queryByText("Documente")).not.toBeInTheDocument();
    expect(screen.queryByText("Facturi")).not.toBeInTheDocument();
    expect(screen.queryByText("cus:alpha")).not.toBeInTheDocument();
  });

  it("opens request, quote and job sections from the same workspace", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    renderWorkspace("/clients/cus:alpha?section=cereri");
    expect(await screen.findByText("CER-AAAAAAAA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deschide" })).toHaveAttribute(
      "href",
      "/requests/crq:alpha",
    );
    cleanup();

    renderWorkspace("/clients/cus:alpha?section=oferte");
    expect(await screen.findByText(/OF-ABCDEF01/)).toBeInTheDocument();
    expect(screen.getByText(/624,82 EUR/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Descarcă oferta PDF" })).toBeInTheDocument();
    cleanup();

    renderWorkspace("/clients/cus:alpha?section=lucrari");
    expect(await screen.findByText("Comandă creată")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Eliberează pentru producție" }),
    ).toBeInTheDocument();
  });

  it("edits the current profile and keeps a retired workspace readable", async () => {
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue(workspace);
    vi.mocked(updateCustomer).mockResolvedValue({
      customer: { ...workspace.customer, displayName: "Client Alpha SRL" },
      customers: [],
    });
    renderWorkspace();
    await screen.findByRole("heading", { name: "Client Alpha" });
    await userEvent.click(screen.getByRole("button", { name: "Editează datele" }));
    const name = screen.getByLabelText("Nume");
    await userEvent.clear(name);
    await userEvent.type(name, "Client Alpha SRL");
    await userEvent.click(screen.getByRole("button", { name: "Salvează datele" }));
    expect(updateCustomer).toHaveBeenCalledWith(
      "cus:alpha",
      expect.objectContaining({ displayName: "Client Alpha SRL" }),
    );

    cleanup();
    vi.mocked(fetchCustomerWorkspace).mockResolvedValue({
      ...workspace,
      customer: { ...workspace.customer, status: "RETIRED" },
      statusLabel: "Retras",
      canCreateRequest: false,
    });
    renderWorkspace();
    expect(await screen.findByText("Client retras. Istoricul rămâne vizibil.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Cerere nouă" })).not.toBeInTheDocument();
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
