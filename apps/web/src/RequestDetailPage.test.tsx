import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UNCONFIGURED_SITE_INSTALLATION_OFFER,
  projectSiteInstallationRequestOffer,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { RequestDetailPage } from "./RequestDetailPage";
import { fetchProductCatalog } from "./productApi";
import {
  readRequestDetail,
  updateCommercialRequest,
  updateInstallationFacts,
  updateInstallationManualPrice,
} from "./requestsApi";
import {
  REQUESTS_WORKSPACE_ORIGIN_KEY,
  markRequestsWorkspaceOrigin,
} from "./requestsWorkspaceOrigin";

const detail: RequestDetailProjection = {
  request: {
    requestId: "crq:11111111-2222-3333-4444-555555555555",
    reference: "CER-11111111",
    customerId: "cus:1",
    title: "Litere exterior",
    description: "Pe fațadă, text HUB MEDIA.",
    status: "IN_REVIEW",
    optionalScopeIds: [],
    siteInstallationMode: null,
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:00.000Z",
  },
  customerDisplayName: "HUB MEDIA",
  statusLabel: "În lucru",
  commercialProgress: "QUOTE_CREATED",
  commercialProgressLabel: "Ofertă creată",
  canChangeCustomer: false,
  canUpdateStatus: true,
  canUploadAttachments: true,
  attachments: [],
  installationScope: null,
  installationFacts: null,
  canWriteInstallationFacts: false,
  installationOffer: projectSiteInstallationRequestOffer({
    selected: false,
    mode: null,
    offer: UNCONFIGURED_SITE_INSTALLATION_OFFER,
    hasLinkedQuotes: true,
  }),
  linkedOffers: [
    {
      quoteSnapshotId: "qts:1",
      reference: "OF-ABCDEF01",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere volumetrice",
      inscription: "HUB",
      customerId: "cus:1",
      customerDisplayName: "HUB MEDIA",
      createdAt: "2026-08-17T12:00:00.000Z",
      grossDisplay: "624,82",
      currency: "EUR",
      stage: "QUOTE_CREATED",
      stageLabel: "Creată",
      nextAction: "ACCEPT_QUOTE",
      nextActionLabel: "Marchează acceptată",
      href: "/quotes/qts%3A1",
      needsAttention: true,
      attentionLabel: "Urmează acceptarea",
      acceptanceId: null,
      orderSnapshotId: null,
      requestId: null,
      requestReference: null,
    },
  ],
};

vi.mock("./requestsApi", () => ({
  readRequestDetail: vi.fn(),
  updateCommercialRequest: vi.fn(),
  updateInstallationFacts: vi.fn(),
  updateInstallationManualPrice: vi.fn(),
  uploadRequestAttachment: vi.fn(),
  requestAttachmentErrorMessage: (error: string) => error,
  requestServiceErrorMessage: (error: string) => error,
}));

vi.mock("./productApi", () => ({
  fetchProductCatalog: vi.fn(),
}));

describe("RequestDetailPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(readRequestDetail).mockReset();
    vi.mocked(updateCommercialRequest).mockReset();
    vi.mocked(updateInstallationFacts).mockReset();
    vi.mocked(updateInstallationManualPrice).mockReset();
    vi.mocked(fetchProductCatalog).mockReset();
  });

  it("shows request truth, linked offer and catalog product action", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    vi.mocked(updateCommercialRequest).mockResolvedValue({
      ...detail,
      request: { ...detail.request, status: "READY_FOR_QUOTE" },
      statusLabel: "Gata de ofertă",
    });
    vi.mocked(fetchProductCatalog).mockResolvedValue([
      {
        kind: "family",
        id: "fam",
        label: "Familie",
        description: "",
        children: [
          {
            kind: "product",
            code: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
            label: "Litere volumetrice luminoase",
            description: "",
          },
        ],
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Litere exterior" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Înapoi la Cereri" })).toHaveAttribute(
      "href",
      "/requests",
    );
    expect(screen.getByText(/CER-11111111/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HUB MEDIA" })).toHaveAttribute(
      "href",
      "/clients/cus%3A1",
    );
    expect(screen.getByText("Pe fațadă, text HUB MEDIA.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Arată tot" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fișiere client" })).toBeInTheDocument();
    expect(
      screen.getByText("Nu există încă fișiere atașate acestei cereri."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oferte și lucrări legate" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ofertă OF-ABCDEF01/ })).toHaveAttribute(
      "href",
      "/quotes/qts%3A1",
    );
    expect(screen.getByRole("link", { name: "Deschide oferta" })).toHaveAttribute(
      "href",
      "/quotes/qts%3A1",
    );
    expect(screen.queryByRole("link", { name: "Configurează" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: /Montaj la locație/ })).not.toBeInTheDocument();
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();
    expect(screen.queryByText("Lock")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Editează cererea" }));
    await userEvent.selectOptions(screen.getByLabelText("Stare"), "READY_FOR_QUOTE");
    await userEvent.click(screen.getByRole("button", { name: "Salvează" }));
    expect(updateCommercialRequest).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      expect.objectContaining({ status: "READY_FOR_QUOTE" }),
    );
  });

  it("persists Montaj la locație as an optional request scope", async () => {
    const selectable = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      installationOffer: projectSiteInstallationRequestOffer({
        selected: false,
        mode: null,
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "INTERNAL",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
    };
    vi.mocked(readRequestDetail).mockResolvedValue(selectable);
    vi.mocked(updateCommercialRequest).mockResolvedValue({
      ...detail,
      request: {
        ...selectable.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL",
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "INTERNAL",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
    });
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const checkbox = await screen.findByRole("checkbox", { name: /Montaj la locație/ });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(updateCommercialRequest).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      { optionalScopeIds: ["SITE_INSTALLATION"] },
    );
  });

  it("keeps an incompatible persisted mode visible", async () => {
    const incompatible = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      canWriteInstallationFacts: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL" as const,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "SUBCONTRACTED",
          version: 2,
          updatedAt: "2026-08-28T21:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
    };
    vi.mocked(readRequestDetail).mockResolvedValue(incompatible);
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("checkbox", { name: /Montaj la locație/ })).toBeChecked();
    expect(screen.getByText(/Echipă internă/)).toBeInTheDocument();
    expect(screen.getByText(/nu mai este oferit de organizație/)).toBeInTheDocument();
    expect(screen.getByText("Editare")).toBeInTheDocument();
    expect(screen.queryByText("Lock")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvează datele de montaj" })).toBeInTheDocument();
  });

  it("sends expectedVersion 0 when installation facts do not exist yet", async () => {
    const offer = {
      capabilityId: "SITE_INSTALLATION" as const,
      configured: true,
      offerMode: "INTERNAL" as const,
      version: 1,
      updatedAt: "2026-08-28T20:00:00.000Z",
    };
    const selected = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      canWriteInstallationFacts: true,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL" as const,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer,
        hasLinkedQuotes: false,
      }),
      installationFacts: null,
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "PARTIAL" as const,
        commercialCompleteness: "PARTIAL" as const,
        commercialNetPrice: null,
        commercialGrossPrice: null,
        incompleteReasons: [
          { id: "MISSING_COST_EVIDENCE" as const, label: "Evidența de cost pentru montaj lipsește." },
        ],
      },
    };
    vi.mocked(readRequestDetail).mockResolvedValue(selected);
    vi.mocked(updateInstallationFacts).mockResolvedValue(selected);
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Salvează datele de montaj" }));
    expect(updateInstallationFacts).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      expect.any(Object),
      0,
    );
  });

  it("saves typed installation facts and asks before deselect when facts exist", async () => {
    const offer = {
      capabilityId: "SITE_INSTALLATION" as const,
      configured: true,
      offerMode: "INTERNAL" as const,
      version: 1,
      updatedAt: "2026-08-28T20:00:00.000Z",
    };
    const selected = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      canWriteInstallationFacts: true,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL" as const,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer,
        hasLinkedQuotes: false,
      }),
      installationFacts: {
        requestId: detail.request.requestId,
        version: 1,
        siteName: null,
        street: "Strada Fabricii 10",
        city: "București",
        county: null,
        postalCode: null,
        countryCode: "RO",
        contactName: null,
        contactPhone: null,
        accessNotes: null,
        measurementStatus: "OFFICE_MEASURED" as const,
        mountingSurfaceWidthMm: 2400,
        mountingSurfaceHeightMm: 800,
        installationElevationMm: null,
        measuredAt: null,
        measurementNotes: null,
        facadeType: "CONCRETE" as const,
        facadeOtherNote: null,
        fixingMethod: "MECHANICAL_ANCHOR" as const,
        fixingOtherNote: null,
        siteElectrical: "NOT_APPLICABLE" as const,
        crewSize: null,
        plannedDurationHours: null,
        createdAt: "2026-08-29T10:00:00.000Z",
        updatedAt: "2026-08-29T10:00:00.000Z",
      },
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "PARTIAL" as const,
        commercialCompleteness: "PARTIAL" as const,
        commercialNetPrice: null,
        commercialGrossPrice: null,
        incompleteReasons: [
          { id: "MISSING_COST_EVIDENCE" as const, label: "Evidența de cost pentru montaj lipsește." },
        ],
      },
    };
    vi.mocked(readRequestDetail).mockResolvedValue(selected);
    vi.mocked(updateInstallationFacts).mockResolvedValue({
      ...selected,
      installationFacts: selected.installationFacts
        ? { ...selected.installationFacts, accessNotes: "Curte" }
        : null,
    });
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText("Stradă")).toHaveValue("Strada Fabricii 10");
    expect(screen.getByText("Evidența de cost pentru montaj lipsește.")).toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText("Note de acces"));
    await userEvent.type(screen.getByLabelText("Note de acces"), "Curte");
    await userEvent.click(screen.getByRole("button", { name: "Salvează datele de montaj" }));
    expect(updateInstallationFacts).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      expect.objectContaining({
        street: "Strada Fabricii 10",
        city: "București",
        accessNotes: "Curte",
      }),
      1,
    );

    await userEvent.click(screen.getByRole("checkbox", { name: /Montaj la locație/ }));
    expect(screen.getByRole("dialog", { name: "Renunți la montaj?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Anulează" }));
    expect(updateCommercialRequest).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("checkbox", { name: /Montaj la locație/ }));
    vi.mocked(updateCommercialRequest).mockResolvedValue({
      ...detail,
      linkedOffers: [],
      installationFacts: null,
      canWriteInstallationFacts: false,
      installationOffer: projectSiteInstallationRequestOffer({
        selected: false,
        mode: null,
        offer,
        hasLinkedQuotes: false,
      }),
    });
    await userEvent.click(screen.getByRole("button", { name: "Șterge datele de montaj" }));
    expect(updateCommercialRequest).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      expect.objectContaining({
        optionalScopeIds: [],
        confirmDeleteInstallationFacts: true,
      }),
    );
  });

  it("returns to Cereri from registry origin", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/requests/crq:11111111-2222-3333-4444-555555555555",
            state: {
              requestsWorkspaceOrigin: {
                kind: "registry",
                requestId: "crq:11111111-2222-3333-4444-555555555555",
                search: "?q=vest",
                scrollY: 40,
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    const back = await screen.findByRole("link", { name: "Înapoi la Cereri" });
    expect(back).toHaveAttribute("href", "/requests?q=vest");
    expect(back).toHaveTextContent("Cereri");
  });

  it("returns to the Client Hub customer from hub origin", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/requests/crq:11111111-2222-3333-4444-555555555555",
            state: {
              requestsWorkspaceOrigin: {
                kind: "client-hub",
                requestId: "crq:11111111-2222-3333-4444-555555555555",
                customerId: "cus:1",
                customerDisplayName: "Client Alpha S.R.L.",
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    const back = await screen.findByRole("link", { name: "Înapoi la Client Alpha S.R.L." });
    expect(back).toHaveAttribute("href", "/clients/cus%3A1?section=cereri");
    expect(back).toHaveTextContent("Client Alpha S.R.L.");
    expect(screen.queryByRole("link", { name: "Înapoi la Cereri" })).not.toBeInTheDocument();
  });

  it("consumes session fallback once the current history entry owns the origin", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    markRequestsWorkspaceOrigin({
      kind: "client-hub",
      requestId: "crq:11111111-2222-3333-4444-555555555555",
      customerId: "cus:1",
      customerDisplayName: "Client Alpha S.R.L.",
    });
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/requests/crq:11111111-2222-3333-4444-555555555555",
            state: {
              requestsWorkspaceOrigin: {
                kind: "client-hub",
                requestId: "crq:11111111-2222-3333-4444-555555555555",
                customerId: "cus:1",
                customerDisplayName: "Client Alpha S.R.L.",
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("link", { name: "Înapoi la Client Alpha S.R.L." })).toBeVisible();
    expect(sessionStorage.getItem(REQUESTS_WORKSPACE_ORIGIN_KEY)).toBeNull();
  });

  it("adopts a session-only hub origin into the current history entry", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    markRequestsWorkspaceOrigin({
      kind: "client-hub",
      requestId: "crq:11111111-2222-3333-4444-555555555555",
      customerId: "cus:1",
      customerDisplayName: "Client Alpha S.R.L.",
    });
    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByRole("link", { name: "Înapoi la Client Alpha S.R.L." })).toBeVisible();
    await waitFor(() => {
      expect(sessionStorage.getItem(REQUESTS_WORKSPACE_ORIGIN_KEY)).toBeNull();
    });
  });

  it("does not allow BOTH-mode installation activation before a mode is chosen", async () => {
    const selectable = {
      ...detail,
      linkedOffers: [],
      commercialProgress: null,
      commercialProgressLabel: null,
      installationOffer: projectSiteInstallationRequestOffer({
        selected: false,
        mode: null,
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "BOTH",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
    };
    vi.mocked(readRequestDetail).mockResolvedValue(selectable);
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    const checkbox = await screen.findByRole("checkbox", { name: /Montaj la locație/ });
    expect(checkbox).toBeDisabled();
    expect(
      screen.getByText("Alege modul de montaj pentru a activa montajul."),
    ).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole("combobox"), "INTERNAL");
    expect(screen.getByRole("checkbox", { name: /Montaj la locație/ })).toBeEnabled();
  });

  it("does not nest the price notice inside a paragraph", async () => {
    const selected = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      canWriteInstallationFacts: true,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL" as const,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "INTERNAL",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "PARTIAL" as const,
        commercialCompleteness: "PARTIAL" as const,
        commercialNetPrice: null,
        commercialGrossPrice: null,
        incompleteReasons: [
          { id: "MISSING_COST_EVIDENCE" as const, label: "Evidența de cost pentru montaj lipsește." },
        ],
      },
    };
    vi.mocked(readRequestDetail).mockResolvedValue(selected);
    vi.mocked(updateInstallationManualPrice).mockResolvedValue({
      ...selected,
      request: { ...selected.request, installationManualNetEur: 200 },
      installationScope: {
        ...selected.installationScope,
        commercialCompleteness: "COMPLETE",
        commercialNetPrice: 200,
        commercialGrossPrice: 242,
      },
    });
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);
    const { container } = render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.type(await screen.findByLabelText(/Preț montaj/), "200");
    await userEvent.click(screen.getByRole("button", { name: "Confirmă prețul de montaj" }));
    expect(await screen.findByText("Prețul de montaj a fost confirmat.")).toBeInTheDocument();
    expect(container.querySelector("p p")).toBeNull();
    expect(updateInstallationManualPrice).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      200,
    );
  });

  it("shows the request blocker before product confirm when cost evidence is expired", async () => {
    const expired = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      canWriteInstallationFacts: true,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "SUBCONTRACTED" as const,
        installationManualNetEur: 200,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "SUBCONTRACTED",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "SUBCONTRACTED",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "PARTIAL" as const,
        commercialCompleteness: "COMPLETE" as const,
        commercialNetPrice: 200,
        commercialGrossPrice: 242,
        incompleteReasons: [
          {
            id: "SUBCONTRACT_EVIDENCE_INVALID" as const,
            label: "Evidența subcontractantului nu este validă pentru această dată.",
          },
        ],
      },
    };
    vi.mocked(readRequestDetail).mockResolvedValue(expired);
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Selectat · Preț client confirmat · Dovadă subcontract expirată"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dovada subcontractantului nu este valabilă.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Actualizează dovada de cost" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Locație" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Măsurători" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Execuție montaj" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alege produs" })).toBeInTheDocument();
    expect(screen.queryByText("Completă")).not.toBeInTheDocument();
    expect(screen.getByText("Necesită acțiune")).toBeInTheDocument();
    expect(screen.getByText("242,00 EUR cu TVA")).toBeInTheDocument();
    expect(screen.getByText("200,00 EUR fără TVA")).toBeInTheDocument();
    expect(screen.queryByText(/Cost intern/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editează cererea" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvează datele de montaj" })).toBeInTheDocument();
  });

  it("shows the request installation customer price as the commercial focal point when ready", async () => {
    const ready = {
      ...detail,
      linkedOffers: [],
      canChangeCustomer: true,
      commercialProgress: null,
      commercialProgressLabel: null,
      canWriteInstallationFacts: true,
      request: {
        ...detail.request,
        optionalScopeIds: ["SITE_INSTALLATION"],
        siteInstallationMode: "INTERNAL" as const,
        installationManualNetEur: 200,
      },
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "INTERNAL",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
      installationFacts: {
        requestId: "crq:11111111-2222-3333-4444-555555555555",
        version: 1,
        siteName: null,
        street: "Strada Fabricii 10",
        city: "București",
        county: null,
        postalCode: null,
        countryCode: "RO",
        contactName: null,
        contactPhone: null,
        accessNotes: null,
        measurementStatus: "OFFICE_MEASURED" as const,
        mountingSurfaceWidthMm: null,
        mountingSurfaceHeightMm: null,
        installationElevationMm: null,
        measuredAt: null,
        measurementNotes: null,
        facadeType: "CONCRETE" as const,
        facadeOtherNote: null,
        fixingMethod: "MECHANICAL_ANCHOR" as const,
        fixingOtherNote: null,
        siteElectrical: "NOT_APPLICABLE" as const,
        crewSize: 3,
        plannedDurationHours: 4,
        createdAt: "2026-08-29T10:00:00.000Z",
        updatedAt: "2026-08-29T10:00:00.000Z",
      },
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "COMPLETE" as const,
        commercialCompleteness: "COMPLETE" as const,
        commercialNetPrice: 200,
        commercialGrossPrice: 242,
        incompleteReasons: [],
        ownerInternalCost: {
          label: "Cost intern estimat montaj",
          total: 300,
          currency: "EUR" as const,
          quantity: 12,
          unitLabel: "ore-persoană",
          rate: 25,
        },
      },
    };
    vi.mocked(readRequestDetail).mockResolvedValue(ready);
    vi.mocked(fetchProductCatalog).mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("242,00 EUR cu TVA")).toBeInTheDocument();
    expect(screen.getByText("Pregătit pentru previzualizare. Înghețarea rămâne dezactivată în această etapă.")).toBeInTheDocument();
    expect(screen.getByText("200,00 EUR fără TVA")).toBeInTheDocument();
    expect(screen.getByText(/Cost intern estimat · 300,00 EUR/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editează cererea" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alege produs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvează datele de montaj" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Actualizează dovada de cost" })).not.toBeInTheDocument();
  });
});
