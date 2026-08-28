import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProductConfigurationPage } from "./ProductConfigurationPage";
import {
  readExecutionPlan,
  readOrderSnapshot,
  readOrderSnapshotById,
  readProductionRelease,
  readQuoteAcceptance,
  readQuoteSnapshot,
} from "./productApi";
import { readRequestDetail } from "./requestsApi";

vi.mock("./customerApi", () => ({
  fetchCustomers: () => Promise.resolve([]),
  createCustomer: vi.fn(),
}));

vi.mock("./requestsApi", () => ({
  readRequestDetail: vi.fn(),
}));

vi.mock("./productApi", () => ({
  fetchTemplateProjection: () =>
    Promise.resolve({
      template: {
        code: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        version: "1",
        familyId: "FAMILY",
        categoryId: "CATEGORY",
        label: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
        description: "Descriere",
        identityFacts: [
          { id: "face.material", label: "Material față", value: "Plexiglas 3 mm opal" },
        ],
        fixedValues: {},
        formSchemaId: "form",
        status: "PILOT",
        components: [{ id: "FACE", label: "Față", required: true, typeId: "PLEXIGLAS_FACE" }],
      },
      formSchema: {
        id: "form",
        templateCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        sections: [
          {
            id: "product",
            title: "Produs",
            componentId: "ROOT",
            fields: [
              {
                id: "root.inscription",
                componentId: "ROOT",
                label: "Textul literelor",
                type: "text",
                required: true,
                visibleWhen: { kind: "always" },
              },
            ],
          },
        ],
      },
    }),
  compileConfiguration: vi.fn(),
  confirmReviewedConfiguration: vi.fn(),
  acceptProductionSnapshot: vi.fn(),
  createProductionRelease: vi.fn(),
  readProductionRelease: vi.fn(),
  quoteDocumentUrl: (productCode: string, quoteSnapshotId: string) =>
    `/api/products/${productCode}/quote-snapshots/${encodeURIComponent(quoteSnapshotId)}/document`,
  readQuoteSnapshot: vi.fn(),
  readQuoteAcceptance: vi.fn(),
  acceptQuoteSnapshot: vi.fn(),
  createQuoteSnapshot: vi.fn(),
  createOrderSnapshot: vi.fn(),
  readOrderSnapshot: vi.fn(),
  readOrderSnapshotById: vi.fn(),
  readExecutionPlan: vi.fn(),
  createExecutionPlan: vi.fn(),
  assignExecutionTaskProvider: vi.fn(),
  assignExecutionTaskExecutor: vi.fn(),
  startExecutionTask: vi.fn(),
  completeExecutionTask: vi.fn(),
}));

describe("ProductConfigurationPage", () => {
  it("leads with the product and the form action, not internal IDs", async () => {
    render(
      <MemoryRouter initialEntries={["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06"]}>
        <Routes>
          <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Material față: Plexiglas 3 mm opal")).toBeInTheDocument();
    expect(screen.getByLabelText("Textul literelor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verifică configurația" })).toBeInTheDocument();
    expect(screen.queryByText("PRD-LETTERS-FRONTLIT-PLEXI-AL06")).not.toBeInTheDocument();
    expect(screen.queryByText("ProductTruth")).not.toBeInTheDocument();
    expect(screen.queryByText("Aggregate")).not.toBeInTheDocument();
  });

  it("continues a commercial job from the order query without the configure form", async () => {
    vi.mocked(readOrderSnapshotById).mockResolvedValue({
      orderSnapshotId: "ord:test",
      schemaVersion: 1,
      status: "FROZEN",
      createdAt: "2026-08-17T06:00:00.000Z",
      sourceQuoteSnapshotId: "qts:test",
      sourceQuoteContentHash: "hash",
      sourceAcceptanceId: "qad:test",
      sourceAcceptedAt: "2026-08-17T05:00:00.000Z",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "JOB01",
      customer: { customerId: "cus:hidden", displayName: "Client Demo LETTERS" },
      sourceReviewId: "rev:test",
      contentHash: "hash",
      truth: {
        templateCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        templateVersion: "1",
        familyId: "fam",
        selectedComponentIds: [],
        values: {},
        measurements: [],
      },
      quantities: [],
      eic: { total: 382.5, currency: "EUR", completeness: "COMPLETE", lines: [] },
      commercial: {
        policyId: "policy",
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        discountPercent: 0,
        discountAmount: 0,
        adjustmentAmount: 0,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
        completeness: "COMPLETE",
      },
      productionInput: {
        schemaVersion: 1,
        contentHash: "hash",
        requirements: [],
        operations: [],
        usedTechnicalSettings: [],
        usedRecipes: [],
      },
    });
    vi.mocked(readProductionRelease).mockResolvedValue(null);
    vi.mocked(readExecutionPlan).mockResolvedValue(null);

    render(
      <MemoryRouter
        initialEntries={["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord:test"]}
      >
        <Routes>
          <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("JOB01 · Client Demo LETTERS — continuare lucrare comercială."),
    ).toBeInTheDocument();
    expect(screen.getByText("Client: Client Demo LETTERS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comandă creată" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliberează pentru producție" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Textul literelor")).not.toBeInTheDocument();
  });

  it("continues a frozen quote from the quote query without the configure form", async () => {
    vi.mocked(readQuoteSnapshot).mockResolvedValue({
      quoteSnapshotId: "qts:test",
      schemaVersion: 1,
      status: "FROZEN",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere",
      inscription: "QTE01",
      customer: { customerId: "cus:hidden", displayName: "Client Demo LETTERS" },
      sourceReviewId: "rev:test",
      sourceConfirmedAt: "2026-08-17T04:00:00.000Z",
      createdAt: "2026-08-17T05:00:00.000Z",
      contentHash: "abcdef0123456789",
      truth: {
        templateCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
        templateVersion: "1",
        familyId: "fam",
        selectedComponentIds: [],
        values: {},
        measurements: [],
      },
      quantities: [],
      eic: { total: 382.5, currency: "EUR", completeness: "COMPLETE", lines: [] },
      commercial: {
        policyId: "policy",
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        discountPercent: 0,
        discountAmount: 0,
        adjustmentAmount: 0,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
        completeness: "COMPLETE",
      },
      productionInput: {
        schemaVersion: 1,
        contentHash: "hash",
        requirements: [],
        operations: [],
        usedTechnicalSettings: [],
        usedRecipes: [],
      },
    });
    vi.mocked(readQuoteAcceptance).mockResolvedValue(null);
    vi.mocked(readOrderSnapshot).mockResolvedValue(null);

    render(
      <MemoryRouter
        initialEntries={["/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:test"]}
      >
        <Routes>
          <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("QTE01 · Client Demo LETTERS — continuare ofertă."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ofertă creată" })).toBeInTheDocument();
    expect(screen.getByText("Client: Client Demo LETTERS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marchează acceptată" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Textul literelor")).not.toBeInTheDocument();
  });

  it("opens configuration from a request with the request customer locked", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue({
      request: {
        requestId: "crq:11111111-2222-3333-4444-555555555555",
        reference: "CER-11111111",
        customerId: "cus:1",
        title: "Litere exterior",
        description: "Pe fațadă.",
        status: "READY_FOR_QUOTE",
        optionalScopeIds: [],
        createdAt: "2026-08-17T10:00:00.000Z",
        updatedAt: "2026-08-17T10:00:00.000Z",
      },
      customerDisplayName: "HUB MEDIA",
      statusLabel: "Gata de ofertă",
      commercialProgress: null,
      commercialProgressLabel: null,
      canChangeCustomer: true,
      canUpdateStatus: true,
      canUploadAttachments: true,
      attachments: [],
      linkedOffers: [],
      installationScope: null,
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=crq:11111111-2222-3333-4444-555555555555",
        ]}
      >
        <Routes>
          <Route path="/products/:productCode" element={<ProductConfigurationPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect((await screen.findAllByText(/Cerere CER-11111111/)).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Înapoi la cerere" })).toHaveAttribute(
      "href",
      "/requests/crq%3A11111111-2222-3333-4444-555555555555",
    );
    expect(screen.getByText(/Client HUB MEDIA/)).toBeInTheDocument();
    expect(screen.getByLabelText("Textul literelor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verifică configurația" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Client")).not.toBeInTheDocument();
  });
});
