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
  lettersFaceReadyValues,
  lettersVolumeReadyValues,
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
    expect(screen.getByRole("button", { name: "PANOU ACM Complet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "COMPOZIȚIE Complet" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Module de configurare" })).toHaveAttribute(
      "data-rail-mode",
      "group",
    );
    expect(screen.queryByRole("button", { name: "ANSAMBLARE" })).not.toBeInTheDocument();
    expect(screen.getByText("ACM 3 mm")).toBeInTheDocument();
    expect(document.querySelector('[data-fact-id="identity:face.material"]')).not.toBeNull();
    expect(screen.getByLabelText("Lățime exterioară (mm)")).toBeInTheDocument();
    expect(screen.queryByText("Ansamblu ACM + litere volumetrice")).not.toBeInTheDocument();
  });

  it("B — presentation fixture can show multi-piece without becoming domain truth", () => {
    renderWorkspace(fixtureAcmMultiPiece());
    expect(screen.getByText("Bucăți:")).toBeInTheDocument();
    expect(screen.getByText("2 × 1600 × 800 mm")).toBeInTheDocument();
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
      ...lettersFaceReadyValues("651"),
      "face.confirmedAreaMm2": 250000,
      ...lettersVolumeReadyValues("stock"),
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

    expect(screen.getByRole("button", { name: "LITERE Complet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "COMPOZIȚIE Complet" })).toBeInTheDocument();
    expect(document.querySelectorAll(".cfg-rail-hug .cfg-section-check.is-complete")).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "Module de configurare" })).toHaveAttribute(
      "data-rail-mode",
      "group",
    );
    expect(screen.getByRole("navigation", { name: "Module de configurare" })).toHaveAttribute(
      "data-rail-count",
      "2",
    );
    expect(screen.getAllByText("FAȚĂ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CANT").length).toBeGreaterThan(0);
    expect(screen.queryByText("Configurezi:")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verifică configurația" })).toBeInTheDocument();
  });

  it("D — personalized fixture uses PERSONALIZAT, not warning copy", () => {
    renderWorkspace(fixtureLettersPersonalized());
    expect(screen.getByText("Personalizat")).toBeInTheDocument();
    expect(screen.getByText("Moștenit")).toBeInTheDocument();
    expect(screen.getByText("Lățime bandă:")).toBeInTheDocument();
    expect(screen.getByText("60 mm")).toBeInTheDocument();
    expect(document.querySelector('[data-fact-kind="personalized"]')).not.toBeNull();
    expect(document.querySelector('[data-fact-kind="inherited"]')).not.toBeNull();
    expect(screen.queryByText(/avertisment/i)).not.toBeInTheDocument();
  });

  it("E/F — assembly fixtures render relation facts only", () => {
    const { rerender } = renderWorkspace(fixtureAssemblyDirect());
    expect(screen.getByText("Montare:")).toBeInTheDocument();
    expect(screen.getByText("Direct")).toBeInTheDocument();
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
    expect(screen.getByText("Distanțate")).toBeInTheDocument();
    expect(screen.getByText("din limita de panou")).toBeInTheDocument();
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
      ...lettersFaceReadyValues("651"),
      "face.confirmedAreaMm2": 250000,
      ...lettersVolumeReadyValues("stock"),
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

  it("H — incomplete required facts show NECONFIGURAT, stars, and compiler ✓", () => {
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
    expect(screen.queryByText("INCOMPLET")).not.toBeInTheDocument();
    expect(screen.queryByText("Necesar")).not.toBeInTheDocument();
    expect(screen.queryByText(/NECESAR:/)).not.toBeInTheDocument();
    expect(screen.getByText("Completează câmpurile marcate cu *.")).toBeInTheDocument();
    expect(screen.getByText("2 din 4 module validate")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^LITERE$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^COMPOZIȚIE$/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "LITERE Complet" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "COMPOZIȚIE Complet" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Complet").length).toBe(
      view.sections.filter((section) => section.complete).length,
    );
    expect(screen.queryByText("Configurare completă")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".cfg-rail-hug .cfg-section-check")).toHaveLength(0);
    expect(document.querySelectorAll(".cfg-rail-reserve")).toHaveLength(2);
    expect(document.querySelector(".cfg-rail-bracket")).toBeNull();
  });

  it("keeps validated review inside the Editor card with structured facts", async () => {
    const user = userEvent.setup();
    const template = getProductTemplate(CANONICAL_PRODUCT_CODE);
    const schema = getFormSchemaForTemplate(CANONICAL_PRODUCT_CODE);
    if (!template || !schema) {
      throw new Error("LETTERS missing");
    }
    const values = {
      "root.inscription": "WORKOS",
      ...lettersFaceReadyValues("651"),
      "face.confirmedAreaMm2": 250000,
      ...lettersVolumeReadyValues("stock"),
    };
    const view = projectConfiguratorView({
      template,
      schema,
      values,
      context,
    });
    const onEdit = vi.fn();
    renderWorkspace(view, {
      mode: "review",
      onConfirm: vi.fn(),
      onEdit,
    });

    expect(screen.getByRole("heading", { name: "Configurare litere" })).toBeInTheDocument();
    expect(
      screen.getByText("Revizuiește configurația înainte de confirmare."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector("ul.review-facts")).toBeNull();
    expect(document.querySelector(".cfg-editor .cfg-editor-accent")).not.toBeNull();
    expect(document.querySelector('.cfg-editor [data-fact-id="face.confirmedAreaMm2"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: "Confirmă configurația" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Modifică configurația" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
