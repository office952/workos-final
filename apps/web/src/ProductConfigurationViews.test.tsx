import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type {
  AcceptedProductionSnapshot,
  CommercialPriceProjection,
  EicResult,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
  OrderSnapshot,
  QuoteAcceptanceDecision,
  QuoteSnapshot,
} from "@workos-final/domain";
import {
  AcceptedSnapshotSection,
  CommercialPriceSection,
  ConfiguratorSummary,
  ConfirmedSummary,
  OrderSnapshotSection,
  QuoteSnapshotSection,
  ConstructionFacts,
  EicSection,
  InstallationScopeSection,
  ReadinessNotice,
  ReviewPanel,
} from "./ProductConfigurationViews";

const template: ProductTemplate = {
  code: "PRD-TEST",
  version: "1",
  familyId: "FAMILY",
  categoryId: "CATEGORY",
  label: "Litere de test",
  description: "Descriere",
  identityFacts: [
    { id: "face.material", label: "Material față", value: "Plexiglas 3 mm opal" },
  ],
  fixedValues: {},
  formSchemaId: "form",
  status: "PILOT",
  components: [{ id: "FACE", label: "Față", required: true, typeId: "PLEXIGLAS_FACE" }],
};

const blocked: ProductDefinition = {
  templateCode: "PRD-TEST",
  templateVersion: "1",
  familyId: "FAMILY",
  selectedComponentIds: ["FACE"],
  values: {},
  measurements: [],
  reviewId: "rev-hidden",
  readiness: "blocked",
  missing: [
    { fieldId: "face.confirmedAreaMm2", componentId: "FACE", label: "Suprafață confirmată (mm²)" },
  ],
};

const ready: ProductDefinition = {
  ...blocked,
  readiness: "ready",
  missing: [],
  values: { "root.inscription": "WORKOS", "face.confirmedAreaMm2": 250000 },
};

const aggregate: ProductAggregate = {
  derivedFrom: "ProductTruth",
  productLabel: "Litere de test",
  familyLabel: "Familie",
  inscription: "WORKOS",
  components: [{ id: "FACE", label: "Față", details: ["Fără finisaj"] }],
  quantities: [
    {
      componentId: "FACE",
      id: "face.area",
      label: "Suprafață față",
      value: 0.25,
      unit: "m2",
      basis: "confirmed_area",
    },
  ],
  requirements: [],
  componentStatuses: [],
  unavailable: [],
};

const truth: ProductTruth = {
  status: "CONFIRMED_IN_RUNTIME",
  templateCode: "PRD-TEST",
  templateVersion: "1",
  familyId: "FAMILY",
  selectedComponentIds: ["FACE"],
  values: ready.values,
  measurements: [],
  reviewId: "rev-hidden",
  confirmedAt: "2026-08-16T10:00:00.000Z",
};

const eic: EicResult = {
  completeness: "PARTIAL",
  completenessReasons: ["Costuri încă în calibrare"],
  geometryLabel: "Geometrie confirmată",
  currency: "EUR",
  total: 595,
  excludedComponentLabels: [],
  lines: [
    {
      resourceId: "MAT_PLEXI",
      label: "Plexiglas",
      quantity: 0.25,
      unit: "m2",
      rate: 40,
      currency: "EUR",
      cost: 10,
      kind: "MATERIAL",
      group: "materials",
    },
  ],
};

describe("Product configuration views", () => {
  it("renders construction facts without product codes", () => {
    render(<ConstructionFacts facts={template.identityFacts} />);
    expect(screen.getByText("Material față: Plexiglas 3 mm opal")).toBeInTheDocument();
    expect(screen.queryByText("PRD-TEST")).not.toBeInTheDocument();
  });

  it("shows compact readiness problems from supplied missing labels", () => {
    render(<ReadinessNotice definition={blocked} />);
    expect(screen.getByText("Probleme de rezolvat: 1")).toBeInTheDocument();
    expect(screen.getByText("Mai sunt informații de completat.")).toBeInTheDocument();
    expect(screen.getByText("Suprafață confirmată (mm²)")).toBeInTheDocument();
  });

  it("shows review primary and secondary actions without review IDs", () => {
    render(
      <ReviewPanel
        template={template}
        formSchema={{
          id: "form",
          templateCode: "PRD-TEST",
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
        }}
        definition={ready}
        busy={false}
        onConfirm={() => undefined}
        onEdit={() => undefined}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmă configurația" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Modifică configurația" })).toBeInTheDocument();
    expect(screen.queryByText("rev-hidden")).not.toBeInTheDocument();
  });

  it("leads confirmed result with inscription and calculated quantities", () => {
    render(<ConfirmedSummary aggregate={aggregate} truth={truth} />);
    expect(screen.getByRole("heading", { name: "Configurație confirmată" })).toBeInTheDocument();
    expect(screen.getByText("WORKOS")).toBeInTheDocument();
    expect(screen.getByText("Suprafață față: 0,25 m²")).toBeInTheDocument();
    expect(screen.queryByText("ProductTruth")).not.toBeInTheDocument();
  });

  it("keeps EIC readable without dominating with rates", () => {
    render(<EicSection eic={eic} aggregate={aggregate} />);
    expect(screen.getByText("Total cost intern estimat: 595,00 EUR")).toBeInTheDocument();
    expect(screen.getByText("Parțial")).toBeInTheDocument();
    expect(screen.getByText("Geometrie confirmată.")).toBeInTheDocument();
    expect(
      screen.getByText("Costul intern rămâne parțial: Costuri încă în calibrare."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Geometrie din Analyzer")).not.toBeInTheDocument();
    expect(screen.getByText("Plexiglas: 0,25 m²")).toBeInTheDocument();
    expect(screen.getByText("Detalii cost intern").closest("details")).toHaveTextContent(
      "40,00 EUR/m²",
    );
  });

  it("renders complete commercial price from the projection only", () => {
    const price: CommercialPriceProjection = {
      internalCost: 382.5,
      internalCostCurrency: "EUR",
      internalCostCompleteness: "COMPLETE",
      policyId: "DEFAULT_COMMERCIAL_POLICY",
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
      unavailableReasons: [],
    };
    render(<CommercialPriceSection price={price} />);
    expect(screen.getByRole("heading", { name: "Preț client" })).toBeInTheDocument();
    expect(screen.getByText("Complet")).toBeInTheDocument();
    expect(screen.getByText("Preț final client: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("516,38 EUR")).toBeInTheDocument();
    expect(screen.getByText("21% · 108,44 EUR")).toBeInTheDocument();
    expect(screen.queryByText("382,50 EUR")).not.toBeInTheDocument();
    expect(screen.queryByText("35%")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Discount")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Ajustare comercială")).not.toBeInTheDocument();
  });

  it("does not present a final customer price when commercial is partial", () => {
    const price: CommercialPriceProjection = {
      internalCost: 345,
      internalCostCurrency: "EUR",
      internalCostCompleteness: "PARTIAL",
      policyId: "DEFAULT_COMMERCIAL_POLICY",
      policyVersion: 1,
      markupPercent: 35,
      markupAmount: 120.75,
      discountPercent: 0,
      discountAmount: 0,
      adjustmentAmount: 0,
      netPrice: 465.75,
      vatPercent: 21,
      vatAmount: 97.81,
      grossPrice: 563.56,
      currency: "EUR",
      completeness: "PARTIAL",
      unavailableReasons: ["Costul intern nu este complet pentru această configurație."],
    };
    render(<CommercialPriceSection price={price} />);
    expect(screen.getByRole("heading", { name: "Preț client" })).toBeInTheDocument();
    expect(screen.getByText("Parțial")).toBeInTheDocument();
    expect(screen.getByText("Parțial / indisponibil pentru finalizare")).toBeInTheDocument();
    expect(
      screen.getByText("Costul intern nu este complet pentru această configurație."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Preț final client: 563,56 EUR")).not.toBeInTheDocument();
    expect(screen.queryByText("624,82 EUR")).not.toBeInTheDocument();
  });

  it("offers quote freeze only when commercial is complete", () => {
    const complete: CommercialPriceProjection = {
      internalCost: 382.5,
      internalCostCurrency: "EUR",
      internalCostCompleteness: "COMPLETE",
      policyId: "DEFAULT_COMMERCIAL_POLICY",
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
      unavailableReasons: [],
    };
    const { rerender } = render(
      <QuoteSnapshotSection
        price={complete}
        reused={false}
        busy={false}
        onFreeze={() => undefined}
        onAccept={() => undefined}
        onCreateOrder={() => undefined}
      />,
    );
    expect(screen.getByRole("button", { name: "Creează oferta" })).toBeInTheDocument();
    rerender(
      <QuoteSnapshotSection
        price={{ ...complete, completeness: "PARTIAL", unavailableReasons: ["gap"] }}
        reused={false}
        busy={false}
        onFreeze={() => undefined}
        onAccept={() => undefined}
        onCreateOrder={() => undefined}
      />,
    );
    expect(screen.queryByRole("button", { name: "Creează oferta" })).not.toBeInTheDocument();
    expect(screen.getByText("Prețul clientului nu poate fi calculat.")).toBeInTheDocument();
  });

  it("keeps Creează oferta visible but disabled when installation is PARTIAL", () => {
    const complete: CommercialPriceProjection = {
      internalCost: 407.7,
      internalCostCurrency: "EUR",
      internalCostCompleteness: "COMPLETE",
      policyId: "DEFAULT_COMMERCIAL_POLICY",
      policyVersion: 1,
      markupPercent: 35,
      markupAmount: 142.7,
      discountPercent: 0,
      discountAmount: 0,
      adjustmentAmount: 0,
      netPrice: 550.4,
      vatPercent: 21,
      vatAmount: 115.58,
      grossPrice: 665.98,
      currency: "EUR",
      completeness: "COMPLETE",
      unavailableReasons: [],
    };
    render(
      <QuoteSnapshotSection
        price={complete}
        reused={false}
        busy={false}
        selectedCustomerId="cus:1"
        onFreeze={() => undefined}
        onAccept={() => undefined}
        onCreateOrder={() => undefined}
        installationScope={{
          scopeId: "SITE_INSTALLATION",
          label: "Montaj la locație",
          eicCompleteness: "PARTIAL",
          commercialCompleteness: "PARTIAL",
          commercialNetPrice: null,
          commercialGrossPrice: null,
          incompleteReasons: [
            { id: "MISSING_COST_EVIDENCE", label: "Evidența de cost pentru montaj lipsește." },
          ],
        }}
      />,
    );
    const freeze = screen.getByRole("button", { name: "Creează oferta" });
    expect(freeze).toBeDisabled();
    expect(screen.getByText("Montajul nu are încă un cost complet.")).toBeInTheDocument();
    expect(screen.getByText("Produs: 665,98 EUR")).toBeInTheDocument();
    expect(screen.getByText("Totalul ofertei nu este gata.")).toBeInTheDocument();
    expect(screen.getByText("Total ofertă indisponibil")).toBeInTheDocument();
    expect(screen.queryByText("Preț final client: 665,98 EUR")).not.toBeInTheDocument();
    expect(screen.queryByText("Total ofertă client")).not.toBeInTheDocument();
    expect(screen.queryByText("Preț client neconfirmat.")).not.toBeInTheDocument();
  });

  it("does not call a confirmed install price unconfirmed when the job total is blocked", () => {
    render(
      <MemoryRouter>
        <ConfiguratorSummary
          statusLabel="Preț client confirmat · Dovadă subcontract expirată"
          statusTone="warn"
          facts={["Litere"]}
          priceUnavailableLabel="Total ofertă indisponibil"
          catalogHref="/products"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Total ofertă indisponibil")).toBeInTheDocument();
    expect(screen.queryByText("Preț client neconfirmat.")).not.toBeInTheDocument();
  });

  it("shows the projected job total without adding prices in the UI", () => {
    const complete: CommercialPriceProjection = {
      internalCost: 382.5,
      internalCostCurrency: "EUR",
      internalCostCompleteness: "COMPLETE",
      policyId: "DEFAULT_COMMERCIAL_POLICY",
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
      unavailableReasons: [],
    };
    render(
      <QuoteSnapshotSection
        price={complete}
        reused={false}
        busy={false}
        selectedCustomerId="cus:1"
        onFreeze={() => undefined}
        onAccept={() => undefined}
        onCreateOrder={() => undefined}
        installationScope={{
          scopeId: "SITE_INSTALLATION",
          label: "Montaj la locație",
          eicCompleteness: "COMPLETE",
          commercialCompleteness: "COMPLETE",
          commercialNetPrice: 200,
          commercialGrossPrice: 242,
          incompleteReasons: [],
        }}
        jobCommercial={{
          netPrice: 716.38,
          vatAmount: 150.44,
          grossPrice: 866.82,
          currency: "EUR",
          completeness: "COMPLETE",
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Creează oferta" })).toBeDisabled();
    expect(
      screen.getByText(
        "Previzualizarea ofertei cu montaj este pregătită. Înghețarea acestei oferte nu este activată în această etapă.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Total ofertă client")).toBeInTheDocument();
    expect(screen.getByText("866,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("Produs")).toBeInTheDocument();
    expect(screen.getByText("624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("Montaj la locație")).toBeInTheDocument();
    expect(screen.getByText("242,00 EUR")).toBeInTheDocument();
    expect(screen.queryByText("Preț final client: 866,82 EUR")).not.toBeInTheDocument();
  });

  it("renders installation PARTIAL reasons without a 0 EUR price", () => {
    render(
      <InstallationScopeSection
        scope={{
          scopeId: "SITE_INSTALLATION",
          label: "Montaj la locație",
          eicCompleteness: "PARTIAL",
          commercialCompleteness: "PARTIAL",
          commercialNetPrice: null,
          commercialGrossPrice: null,
          incompleteReasons: [
            { id: "MISSING_COST_EVIDENCE", label: "Evidența de cost pentru montaj lipsește." },
            {
              id: "SITE_MEASUREMENTS_UNCONFIRMED",
              label: "Măsurătorile la locație nu sunt confirmate.",
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Montaj la locație" })).toBeInTheDocument();
    expect(screen.getByText("Incomplet")).toBeInTheDocument();
    expect(screen.getByText("Prețul de montaj pentru client nu este confirmat.")).toBeInTheDocument();
    expect(screen.getByText("Evidența de cost pentru montaj lipsește.")).toBeInTheDocument();
    expect(screen.queryByText(/0(?:[.,]00)? EUR/)).not.toBeInTheDocument();
    expect(screen.queryByText("Complet")).not.toBeInTheDocument();
  });

  it("shows Owner installation EIC separately from the customer price", () => {
    render(
      <InstallationScopeSection
        scope={{
          scopeId: "SITE_INSTALLATION",
          label: "Montaj la locație",
          eicCompleteness: "COMPLETE",
          commercialCompleteness: "COMPLETE",
          commercialNetPrice: 200,
          commercialGrossPrice: 242,
          incompleteReasons: [],
          ownerInternalCost: {
            label: "Cost intern estimat montaj",
            total: 300,
            currency: "EUR",
            quantity: 12,
            unitLabel: "ore-persoană",
            rate: 25,
          },
        }}
      />,
    );
    expect(screen.getByText("Pregătit pentru ofertă")).toBeInTheDocument();
    expect(screen.getByText("Preț montaj client: 242,00 EUR")).toBeInTheDocument();
    expect(screen.getByText(/Cost intern estimat montaj: 300,00 EUR/)).toBeInTheDocument();
    expect(screen.getByText(/12 ore-persoană × 25,00 EUR/)).toBeInTheDocument();
  });

  it("keeps an expired subcontract commercially visible but not overall complete", () => {
    render(
      <MemoryRouter>
        <InstallationScopeSection
          providerMode="SUBCONTRACTED"
          scope={{
            scopeId: "SITE_INSTALLATION",
            label: "Montaj la locație",
            eicCompleteness: "PARTIAL",
            commercialCompleteness: "COMPLETE",
            commercialNetPrice: 200,
            commercialGrossPrice: 242,
            incompleteReasons: [
              {
                id: "SUBCONTRACT_EVIDENCE_INVALID",
                label: "Evidența subcontractantului nu este validă pentru această dată.",
              },
            ],
          }}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Preț client confirmat · Dovadă subcontract expirată"),
    ).toBeInTheDocument();
    expect(screen.getByText("Preț montaj client: 242,00 EUR")).toBeInTheDocument();
    expect(screen.queryByText("Complet")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Actualizează dovada de cost" }),
    ).toHaveAttribute(
      "href",
      "/admin/resources?selected=cost%3ASVC-SITE-INSTALL-SUBCONTRACT%3Aunqualified",
    );
  });

  it("renders frozen quote values from the snapshot only", () => {
    const snapshot = {
      quoteSnapshotId: "qts:hidden",
      productCode: "PRD-TEST",
      productLabel: "Litere",
      createdAt: "2026-08-17T00:00:00.000Z",
      commercial: {
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
      customer: { customerId: "cus:hidden", displayName: "Client Demo LETTERS" },
    } as unknown as QuoteSnapshot;
    render(
      <MemoryRouter>
        <QuoteSnapshotSection
          price={{ completeness: "COMPLETE" } as CommercialPriceProjection}
          snapshot={snapshot}
          reused={false}
          busy={false}
          onFreeze={() => undefined}
          onAccept={() => undefined}
          onCreateOrder={() => undefined}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Ofertă creată" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Client: Client Demo LETTERS" })).toHaveAttribute(
      "href",
      "/clients/cus%3Ahidden",
    );
    expect(screen.queryByText("cus:hidden")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Descarcă oferta PDF" })).toHaveAttribute(
      "href",
      "/api/products/PRD-TEST/quote-snapshots/qts%3Ahidden/document",
    );
    expect(screen.getByText("Preț final: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inspectează oferta" })).toHaveAttribute(
      "href",
      "/quotes/qts%3Ahidden",
    );
    expect(screen.getByRole("button", { name: "Marchează acceptată" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Creează oferta" })).not.toBeInTheDocument();
    expect(screen.queryByText("382,50 EUR")).not.toBeInTheDocument();
  });

  it("hides accept and PDF actions on a frozen service-inclusive quote", () => {
    const snapshot = {
      quoteSnapshotId: "qts:v2",
      schemaVersion: 2,
      productCode: "PRD-TEST",
      productLabel: "Litere",
      createdAt: "2026-08-17T00:00:00.000Z",
      commercial: {
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      jobCommercial: {
        netPrice: 716.38,
        vatAmount: 150.44,
        grossPrice: 866.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
    } as unknown as QuoteSnapshot;
    render(
      <MemoryRouter>
        <QuoteSnapshotSection
          price={{ completeness: "COMPLETE" } as CommercialPriceProjection}
          snapshot={snapshot}
          reused={false}
          busy={false}
          onFreeze={() => undefined}
          onAccept={() => undefined}
          onCreateOrder={() => undefined}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Ofertă creată" })).toBeInTheDocument();
    expect(
      screen.getByText("Oferta cu montaj nu poate fi acceptată în această etapă."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Marchează acceptată" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Descarcă oferta PDF" })).not.toBeInTheDocument();
  });

  it("renders accepted quote from the frozen snapshot only", () => {
    const snapshot = {
      quoteSnapshotId: "qts:hidden",
      productCode: "PRD-TEST",
      productLabel: "Litere",
      createdAt: "2026-08-17T00:00:00.000Z",
      commercial: {
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
    } as unknown as QuoteSnapshot;
    const acceptance = {
      acceptanceId: "qad:qts:hidden",
      acceptedAt: "2026-08-17T01:00:00.000Z",
    } as unknown as QuoteAcceptanceDecision;
    render(
      <QuoteSnapshotSection
        price={{ completeness: "COMPLETE" } as CommercialPriceProjection}
        snapshot={snapshot}
        acceptance={acceptance}
        reused={false}
        busy={false}
        onFreeze={() => undefined}
        onAccept={() => undefined}
        onCreateOrder={() => undefined}
      />,
    );
    expect(screen.getByRole("heading", { name: "Ofertă acceptată" })).toBeInTheDocument();
    expect(screen.getByText("Preț final: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("Următorul pas: creează comanda.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează comanda" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Marchează acceptată" })).not.toBeInTheDocument();
    expect(screen.queryByText("Comandă creată")).not.toBeInTheDocument();
  });

  it("renders frozen order values from the order snapshot only", () => {
    const snapshot = {
      quoteSnapshotId: "qts:hidden",
      productCode: "PRD-TEST",
      productLabel: "Litere",
      createdAt: "2026-08-17T00:00:00.000Z",
      commercial: {
        policyVersion: 1,
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
    } as unknown as QuoteSnapshot;
    const acceptance = {
      acceptanceId: "qad:qts:hidden",
      acceptedAt: "2026-08-17T01:00:00.000Z",
    } as unknown as QuoteAcceptanceDecision;
    const order = {
      orderSnapshotId: "ord:qad:qts:hidden:hash",
      createdAt: "2026-08-17T02:00:00.000Z",
      sourceAcceptedAt: "2026-08-17T01:00:00.000Z",
      sourceQuoteSnapshotId: "qts:hidden",
      productLabel: "Litere",
      commercial: {
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
    } as unknown as OrderSnapshot;
    render(
      <>
        <QuoteSnapshotSection
          price={{ completeness: "COMPLETE" } as CommercialPriceProjection}
          snapshot={snapshot}
          acceptance={acceptance}
          order={order}
          reused={false}
          busy={false}
          onFreeze={() => undefined}
          onAccept={() => undefined}
          onCreateOrder={() => undefined}
        />
        <OrderSnapshotSection snapshot={order} onRelease={() => undefined} />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Ofertă acceptată" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Comandă creată" })).toBeInTheDocument();
    expect(screen.getAllByText("Preț final: 624,82 EUR")).toHaveLength(2);
    expect(screen.queryByText("382,50 EUR")).not.toBeInTheDocument();
    expect(screen.queryByText("35% · 133,88 EUR")).not.toBeInTheDocument();
    expect(
      screen.getByText("Comanda nu a fost încă eliberată pentru producție."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliberează pentru producție" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Acceptă pentru producție" })).not.toBeInTheDocument();
    expect(
      screen.queryByText("Oferta acceptată nu a fost încă transformată în comandă."),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Creează comanda" })).not.toBeInTheDocument();
  });

  it("shows the released commercial state without a second production accept action", () => {
    const order = {
      orderSnapshotId: "ord:qad:qts:hidden:hash",
      createdAt: "2026-08-17T02:00:00.000Z",
      sourceAcceptedAt: "2026-08-17T01:00:00.000Z",
      sourceQuoteSnapshotId: "qts:hidden",
      productLabel: "Litere",
      commercial: {
        markupPercent: 35,
        markupAmount: 133.88,
        netPrice: 516.38,
        vatPercent: 21,
        vatAmount: 108.44,
        grossPrice: 624.82,
        currency: "EUR",
      },
      eic: { total: 382.5, currency: "EUR" },
    } as unknown as OrderSnapshot;
    const release = {
      snapshotId: "aps:released",
      releaseSource: "ORDER",
      sourceOrderSnapshotId: order.orderSnapshotId,
      productLabel: "Litere",
      createdAt: "2026-08-17T03:00:00.000Z",
      operations: Array.from({ length: 12 }),
      eic: { total: 382.5, currency: "EUR", completeness: "COMPLETE" },
    } as unknown as AcceptedProductionSnapshot;
    render(
      <>
        <OrderSnapshotSection snapshot={order} release={release} />
        <AcceptedSnapshotSection
          snapshot={release}
          reused={false}
          onCreatePlan={() => undefined}
          busy={false}
          hasExecutionPlan={false}
        />
      </>,
    );
    expect(screen.getByText("Eliberată pentru producție.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Eliberată pentru producție" })).toBeInTheDocument();
    expect(
      screen.getByText("Următorul pas: creează planul de execuție pentru atelier."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Eliberează pentru producție" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Acceptă pentru producție" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează planul de execuție" })).toBeInTheDocument();
  });

  it("hides the create-plan action after the persisted plan exists", () => {
    const release = {
      snapshotId: "aps:released",
      releaseSource: "ORDER",
      sourceOrderSnapshotId: "ord:qad:qts:hidden:hash",
      productLabel: "Litere",
      createdAt: "2026-08-17T03:00:00.000Z",
      operations: Array.from({ length: 12 }),
      eic: { total: 382.5, currency: "EUR", completeness: "COMPLETE" },
    } as unknown as AcceptedProductionSnapshot;
    render(
      <AcceptedSnapshotSection
        snapshot={release}
        reused={true}
        onCreatePlan={() => undefined}
        busy={false}
        hasExecutionPlan={true}
      />,
    );
    expect(screen.getByText("Plan de execuție creat.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Creează planul de execuție" })).not.toBeInTheDocument();
  });

  it("does not duplicate the commercial formula in the UI module", () => {
    const source = readFileSync("src/ProductConfigurationViews.tsx", "utf8");
    expect(source).not.toMatch(/markupPercent\s*[*/]/);
    expect(source).not.toMatch(/vatPercent\s*[*/]/);
    expect(source).not.toMatch(/projectCommercialPrice/);
    expect(source).not.toMatch(/internalCost\s*\*/);
  });

  it("keeps snapshot reference in details", () => {
    const snapshot = {
      snapshotId: "aps:hidden",
      productLabel: "Litere",
      createdAt: "2026-08-16T10:00:00.000Z",
      operations: Array.from({ length: 12 }),
      eic: { total: 595, currency: "EUR", completeness: "PARTIAL" },
    } as unknown as AcceptedProductionSnapshot;
    render(
      <AcceptedSnapshotSection
        snapshot={snapshot}
        reused={false}
        onCreatePlan={() => undefined}
        busy={false}
        hasExecutionPlan={false}
      />,
    );
    expect(screen.getByRole("heading", { name: "Acceptat pentru producție" })).toBeInTheDocument();
    expect(screen.getByText("Operații: 12")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creează planul de execuție" })).toBeInTheDocument();
    expect(screen.getByText("Referință: aps:hidden")).toBeInTheDocument();
  });
});
