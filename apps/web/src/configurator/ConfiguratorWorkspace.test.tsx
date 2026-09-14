import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  getFormSchemaForTemplate,
  getProductTemplate,
} from "@workos-final/domain";
import { ConfiguratorWorkspace } from "./ConfiguratorWorkspace";
import {
  fixtureAcmMultiPiece,
  fixtureAssemblyDirect,
  fixtureAssemblyJoint,
  fixtureLettersPersonalized,
} from "./configuratorPresentationFixtures";
import { projectConfiguratorView, type ConfiguratorView } from "./configuratorView";

const context = {
  returnHref: "/products",
  returnLabel: "Catalog",
  requestReference: null as string | null,
  clientName: null as string | null,
  objectLabel: null as string | null,
};

function renderWorkspace(
  view: ConfiguratorView,
  extras: Partial<ComponentProps<typeof ConfiguratorWorkspace>> = {},
) {
  return render(
    <MemoryRouter>
      <ConfiguratorWorkspace
        view={view}
        mode="edit"
        onScopeChange={vi.fn()}
        {...extras}
      />
    </MemoryRouter>,
  );
}

describe("ConfiguratorWorkspace", () => {
  it("A — renders ACM scopes and real cassette fields without invented assembly title", () => {
    const template = getProductTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE);
    const schema = getFormSchemaForTemplate(ACM_CASSETTE_NONE_PRODUCT_CODE);
    if (!template || !schema) {
      throw new Error("ACM missing");
    }
    const view = projectConfiguratorView({
      template,
      schema,
      values: {
        "root.inscription": "PANOU ACM",
        "root.mountingSystem": "steel_angle",
        "face.widthMm": 1000,
        "face.heightMm": 500,
        "face.cassetteDepthMm": "40",
        "face.foldCount": "1",
      },
      context,
    });
    renderWorkspace(view, {
      template,
      schema,
      values: {
        "root.inscription": "PANOU ACM",
        "root.mountingSystem": "steel_angle",
        "face.widthMm": 1000,
        "face.heightMm": 500,
        "face.cassetteDepthMm": "40",
        "face.foldCount": "1",
      },
      onChange: vi.fn(),
      onVerify: vi.fn(),
    });

    expect(screen.getByRole("heading", { name: "Panou ACM casetat" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PANOU ACM" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ANSAMBLARE" })).not.toBeInTheDocument();
    expect(screen.getByText("Material casetă: ACM 3 mm")).toBeInTheDocument();
    expect(screen.getByLabelText("Lățime exterioară (mm)")).toBeInTheDocument();
    expect(screen.queryByText("Ansamblu ACM + litere volumetrice")).not.toBeInTheDocument();
  });

  it("B — presentation fixture can show multi-piece without becoming domain truth", () => {
    renderWorkspace(fixtureAcmMultiPiece());
    expect(screen.getByText("Bucăți: 2 × 1600 × 800 mm")).toBeInTheDocument();
    expect(document.querySelector('[data-fact-id="face.pieces"]')).not.toBeNull();
  });

  it("C — LETTERS COMUN shows FAȚĂ/CANT and hides target selector when no groups exist", () => {
    const template = getProductTemplate(CANONICAL_PRODUCT_CODE);
    const schema = getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE);
    if (!template || !schema) {
      throw new Error("LETTERS missing");
    }
    const values = {
      "root.inscription": "WORKOS",
      "face.finish": "vinyl",
      "face.color": "alb",
      "face.confirmedAreaMm2": 250000,
      "volume.depthMm": "60",
      "volume.finish": "none",
      "volume.confirmedPerimeterMm": 12500,
    };
    const view = projectConfiguratorView({
      template,
      schema,
      values,
      context,
    });
    renderWorkspace(view, {
      template,
      schema,
      values,
      onChange: vi.fn(),
      onVerify: vi.fn(),
    });

    expect(screen.getByRole("button", { name: "LITERE" })).toBeInTheDocument();
    expect(screen.getAllByText("FAȚĂ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CANT").length).toBeGreaterThan(0);
    expect(screen.queryByText("Configurezi:")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verifică configurația" })).toBeInTheDocument();
  });

  it("D — personalized fixture uses PERSONALIZAT, not warning copy", () => {
    renderWorkspace(fixtureLettersPersonalized());
    expect(screen.getByText("Personalizat")).toBeInTheDocument();
    expect(screen.getByText("Moștenit")).toBeInTheDocument();
    expect(screen.getByText(/Lățime bandă: 60 mm/)).toBeInTheDocument();
    expect(document.querySelector('[data-fact-kind="personalized"]')).not.toBeNull();
    expect(document.querySelector('[data-fact-kind="inherited"]')).not.toBeNull();
    expect(screen.queryByText(/avertisment/i)).not.toBeInTheDocument();
  });

  it("E/F — assembly fixtures render relation facts only", () => {
    const { rerender } = renderWorkspace(fixtureAssemblyDirect());
    expect(screen.getByText("Montare: Direct")).toBeInTheDocument();
    expect(document.querySelector('[data-fact-id="assembly.mount"]')).not.toBeNull();
    rerender(
      <MemoryRouter>
        <ConfiguratorWorkspace
          view={fixtureAssemblyJoint()}
          mode="edit"
          onScopeChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Montare: Distanțate")).toBeInTheDocument();
    expect(screen.getByText(/Joint: din limita de panou/)).toBeInTheDocument();
  });

  it("G — composition is read-only navigation without mutation CTA", async () => {
    const user = userEvent.setup();
    const template = getProductTemplate(CANONICAL_PRODUCT_CODE);
    const schema = getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE);
    if (!template || !schema) {
      throw new Error("LETTERS missing");
    }
    const values = {
      "root.inscription": "WORKOS",
      "face.finish": "vinyl",
      "face.color": "alb",
      "face.confirmedAreaMm2": 250000,
      "volume.depthMm": "60",
      "volume.finish": "none",
      "volume.confirmedPerimeterMm": 12500,
    };
    const view = projectConfiguratorView({
      template,
      schema,
      values,
      context,
      activeScopeId: "compozitie",
    });
    const onScopeChange = vi.fn();
    renderWorkspace(view, {
      template,
      schema,
      values,
      onChange: vi.fn(),
      onVerify: vi.fn(),
      onScopeChange,
    });

    expect(screen.queryByRole("button", { name: "Verifică configurația" })).not.toBeInTheDocument();
    expect(
      screen.getByText("Rezumat numai-citire al acestui produs. Nu se modifică aici."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/ansamblu/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează în PANOU ACM" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editează în LITERE" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Editează în LITERE" }));
    expect(onScopeChange).toHaveBeenCalledWith("litere");
  });

  it("H — incomplete required facts show NECONFIGURAT and NECESAR", () => {
    const template = getProductTemplate(CANONICAL_PRODUCT_CODE);
    const schema = getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE);
    if (!template || !schema) {
      throw new Error("LETTERS missing");
    }
    const view = projectConfiguratorView({
      template,
      schema,
      values: {},
      context,
    });
    renderWorkspace(view, {
      template,
      schema,
      values: {},
      onChange: vi.fn(),
      onVerify: vi.fn(),
    });

    expect(screen.getAllByText(/NECONFIGURAT/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("NECESAR").length).toBeGreaterThan(0);
    expect(screen.getByText("2 din 4 module validate")).toBeInTheDocument();
    expect(screen.queryByText("Configurare completă")).not.toBeInTheDocument();
  });
});
