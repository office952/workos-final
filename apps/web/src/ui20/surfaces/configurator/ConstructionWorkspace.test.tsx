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

import { fetchTemplateProjection } from "../../../productApi";
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
});
