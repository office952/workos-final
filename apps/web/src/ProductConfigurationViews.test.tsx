import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  AcceptedProductionSnapshot,
  EicResult,
  ProductAggregate,
  ProductDefinition,
  ProductTemplate,
  ProductTruth,
} from "@workos-final/domain";
import {
  AcceptedSnapshotSection,
  ConfirmedSummary,
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
    expect(screen.getByText("Plexiglas: 0,25 m²")).toBeInTheDocument();
    expect(screen.getByText("Detalii cost intern").closest("details")).toHaveTextContent(
      "40,00 EUR/m²",
    );
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
