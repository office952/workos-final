import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProductConfigurationPage } from "./ProductConfigurationPage";

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
});
