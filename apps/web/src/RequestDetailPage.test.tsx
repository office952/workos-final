import { render, screen } from "@testing-library/react";
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
} from "./requestsApi";

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
  uploadRequestAttachment: vi.fn(),
  requestAttachmentErrorMessage: (error: string) => error,
  requestServiceErrorMessage: (error: string) => error,
}));

vi.mock("./productApi", () => ({
  fetchProductCatalog: vi.fn(),
}));

describe("RequestDetailPage", () => {
  beforeEach(() => {
    vi.mocked(readRequestDetail).mockReset();
    vi.mocked(updateCommercialRequest).mockReset();
    vi.mocked(updateInstallationFacts).mockReset();
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
    expect(screen.getByText(/CER-11111111/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Client: HUB MEDIA" })).toHaveAttribute(
      "href",
      "/clients/cus%3A1",
    );
    expect(screen.getByLabelText("Descriere")).toHaveValue("Pe fațadă, text HUB MEDIA.");
    expect(screen.getByRole("heading", { name: "Fișiere client" })).toBeInTheDocument();
    expect(
      screen.getByText("Nu există încă fișiere atașate acestei cereri."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oferte legate" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "OF-ABCDEF01" })).toHaveAttribute(
      "href",
      "/quotes/qts%3A1",
    );
    expect(screen.getAllByRole("link", { name: "Deschide catalogul" })[0]).toHaveAttribute(
      "href",
      "/products?request=crq%3A11111111-2222-3333-4444-555555555555",
    );
    expect(screen.getByRole("link", { name: "Configurează" })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=crq%3A11111111-2222-3333-4444-555555555555",
    );
    expect(screen.queryByRole("checkbox", { name: /Montaj la locație/ })).not.toBeInTheDocument();
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();

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
    expect(screen.getByText(/Mod salvat: Echipă internă/)).toBeInTheDocument();
    expect(screen.getByText(/nu mai este oferit de organizație/)).toBeInTheDocument();
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
        createdAt: "2026-08-29T10:00:00.000Z",
        updatedAt: "2026-08-29T10:00:00.000Z",
      },
      installationScope: {
        scopeId: "SITE_INSTALLATION" as const,
        label: "Montaj la locație" as const,
        eicCompleteness: "PARTIAL" as const,
        commercialCompleteness: "PARTIAL" as const,
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
});
