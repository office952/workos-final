import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  AcceptedProductionSnapshot,
  CommercialPriceProjection,
  EicResult,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
  QuoteSnapshot,
} from "@workos-final/domain";
import {
  AcceptedSnapshotSection,
  CommercialPriceSection,
  ConfirmedSummary,
  QuoteSnapshotSection,
  ConstructionFacts,
  EicSection,
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
    expect(screen.getByText("382,50 EUR")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByText("516,38 EUR")).toBeInTheDocument();
    expect(screen.getByText("21% · 108,44 EUR")).toBeInTheDocument();
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
      />,
    );
    expect(screen.getByRole("button", { name: "Îngheață oferta" })).toBeInTheDocument();
    rerender(
      <QuoteSnapshotSection
        price={{ ...complete, completeness: "PARTIAL", unavailableReasons: ["gap"] }}
        reused={false}
        busy={false}
        onFreeze={() => undefined}
      />,
    );
    expect(screen.queryByRole("button", { name: "Îngheață oferta" })).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Oferta nu poate fi înghețată până când costul intern și prețul client nu sunt complete.",
      ),
    ).toBeInTheDocument();
  });

  it("renders frozen quote values from the snapshot only", () => {
    const snapshot = {
      quoteSnapshotId: "qts:hidden",
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
    render(
      <QuoteSnapshotSection
        price={{ completeness: "COMPLETE" } as CommercialPriceProjection}
        snapshot={snapshot}
        reused={false}
        busy={false}
        onFreeze={() => undefined}
      />,
    );
    expect(screen.getByRole("heading", { name: "Ofertă salvată" })).toBeInTheDocument();
    expect(screen.getByText("Preț final: 624,82 EUR")).toBeInTheDocument();
    expect(screen.getByText("Politică comercială v1", { exact: false })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Îngheață oferta" })).not.toBeInTheDocument();
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
