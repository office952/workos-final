import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  getFormSchemaForTemplate,
  getProductTemplate,
} from "@workos-final/domain";
import { ConstructionWorkspace } from "./ConstructionWorkspace";

vi.mock("../../../productApi", () => ({
  fetchTemplateProjection: vi.fn(),
  compileConfiguration: vi.fn(),
  confirmReviewedConfiguration: vi.fn(),
  createQuoteSnapshot: vi.fn(),
}));

vi.mock("../../../requestsApi", () => ({
  readRequestDetail: vi.fn(),
}));

import {
  compileConfiguration,
  confirmReviewedConfiguration,
  fetchTemplateProjection,
} from "../../../productApi";
import { readRequestDetail } from "../../../requestsApi";

function renderWorkspace() {
  return render(
    <MemoryRouter initialEntries={[`/products/${CANONICAL_PRODUCT_CODE}`]}>
      <Routes>
        <Route path="/products/:productCode" element={<ConstructionWorkspace />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ConstructionWorkspace", () => {
  beforeEach(() => {
    vi.mocked(fetchTemplateProjection).mockResolvedValue({
      template: getProductTemplate(CANONICAL_PRODUCT_CODE)!,
      formSchema: getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE)!,
    });
    vi.mocked(readRequestDetail).mockResolvedValue(null);
  });

  it("keeps composition selected via aria-pressed and shows only the lens fields", async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const product = await screen.findByRole("button", { name: "Produs" });
    expect(product).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Textul literelor")).toBeInTheDocument();
    expect(screen.queryByLabelText("Suprafață confirmată (mm²)")).not.toBeInTheDocument();
    expect(screen.queryByText("Preț final client")).not.toBeInTheDocument();
    expect(screen.queryByText(/624,82/)).not.toBeInTheDocument();

    const face = screen.getByRole("button", { name: "Față" });
    face.focus();
    await user.keyboard("{Enter}");
    expect(face).toHaveAttribute("aria-pressed", "true");
    expect(product).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByLabelText(/Suprafață confirmată/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Textul literelor")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Lentilă — Față/ })).toBeInTheDocument();
  });

  it("moves the lens into a confirmed state without leftover role focus", async () => {
    const user = userEvent.setup();
    const definition = {
      templateCode: CANONICAL_PRODUCT_CODE,
      templateVersion: "1",
      familyId: "letters",
      selectedComponentIds: ["ROOT"],
      values: {},
      measurements: [],
      reviewId: "rev-1",
      readiness: "ready" as const,
      missing: [],
    };
    vi.mocked(compileConfiguration).mockResolvedValue(definition);
    vi.mocked(confirmReviewedConfiguration).mockResolvedValue({
      ok: true,
      truth: {
        status: "CONFIRMED_IN_RUNTIME",
        templateCode: definition.templateCode,
        templateVersion: definition.templateVersion,
        familyId: definition.familyId,
        selectedComponentIds: definition.selectedComponentIds,
        values: definition.values,
        measurements: definition.measurements,
        reviewId: definition.reviewId,
        confirmedAt: "2026-09-07T00:00:00.000Z",
      },
      aggregate: {
        derivedFrom: "ProductTruth",
        productLabel: "Litere volumetrice",
        familyLabel: "Litere",
        inscription: "HUB",
        components: [
          { id: "ROOT", label: "Produs", details: [] },
          { id: "FACE", label: "Față", details: [] },
        ],
        quantities: [],
        requirements: [],
        componentStatuses: [],
        unavailable: [],
      },
    } as unknown as Awaited<ReturnType<typeof confirmReviewedConfiguration>>);

    renderWorkspace();
    await screen.findByRole("button", { name: "Produs" });
    await user.click(screen.getByRole("button", { name: "Verifică configurația" }));
    await user.click(await screen.findByRole("button", { name: "Confirmă configurația" }));

    expect(await screen.findByRole("heading", { name: "Configurație confirmată" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Lentilă/ })).not.toBeInTheDocument();
    expect(document.querySelector("[data-lens='confirmed']")).toBeTruthy();
    expect(document.querySelector("[data-composition] [aria-pressed='true']")).toBeNull();
    expect(screen.getByText("HUB")).toBeInTheDocument();
    expect(screen.queryByText("Preț final client")).not.toBeInTheDocument();
    expect(screen.queryByText(/624,82/)).not.toBeInTheDocument();
    expect(screen.queryByText("Compoziție, nu pași")).not.toBeInTheDocument();
  });
});
