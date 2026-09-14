import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { FormSchema, ProductTemplate } from "@workos-final/domain";
import { FormRenderer } from "./FormRenderer";

const template: ProductTemplate = {
  code: "sample",
  version: "1",
  familyId: "SAMPLE_FAMILY",
  categoryId: "SAMPLE_CATEGORY",
  label: "Exemplu",
  description: "",
  identityFacts: [],
  fixedValues: {},
  formSchemaId: "sample-form",
  status: "PILOT",
  components: [
    { id: "FACE", label: "Față", required: true, typeId: "PLEXIGLAS_FACE" },
    {
      id: "LIGHTING",
      label: "Iluminare",
      required: false,
      typeId: "LIGHTING_FRONT_LED",
      selectionFieldId: "extra.selected",
    },
  ],
};

const schema: FormSchema = {
  id: "sample-form",
  templateCode: "sample",
  sections: [
    {
      id: "main",
      title: "Secțiune",
      componentId: "FACE",
      fields: [
        {
          id: "face.name",
          componentId: "FACE",
          label: "Nume față",
          type: "text",
          required: true,
          visibleWhen: { kind: "always" },
        },
      ],
    },
    {
      id: "extra",
      title: "Opțional",
      componentId: "LIGHTING",
      fields: [
        {
          id: "extra.selected",
          componentId: "LIGHTING",
          label: "Include opțional",
          type: "boolean",
          required: false,
          visibleWhen: { kind: "always" },
        },
        {
          id: "extra.detail",
          componentId: "LIGHTING",
          label: "Detaliu opțional",
          type: "text",
          required: true,
          visibleWhen: { kind: "componentSelected", componentId: "LIGHTING" },
        },
        {
          id: "extra.finish",
          componentId: "LIGHTING",
          label: "Finisaj",
          type: "select",
          required: true,
          options: [
            { value: "none", label: "Fără finisaj" },
            { value: "vinyl", label: "Colantat" },
          ],
          visibleWhen: { kind: "componentSelected", componentId: "LIGHTING" },
        },
      ],
    },
  ],
};

describe("FormRenderer", () => {
  it("renders schema fields and hides unselected module fields", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <FormRenderer
        template={template}
        schema={schema}
        values={{ "extra.selected": false }}
        onChange={onChange}
      />,
    );

    expect(screen.getByLabelText("Nume față")).toBeInTheDocument();
    expect(screen.getByLabelText("Include opțional")).toBeInTheDocument();
    expect(screen.queryByLabelText("Detaliu opțional")).not.toBeInTheDocument();
    expect(screen.queryByText("letters")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Include opțional"));
    expect(onChange).toHaveBeenCalledWith("extra.selected", true);

    rerender(
      <FormRenderer
        template={template}
        schema={schema}
        values={{ "extra.selected": true }}
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText("Detaliu opțional")).toBeInTheDocument();
  });

  it("makes visible choice chips the accessible select control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <FormRenderer
        template={template}
        schema={schema}
        values={{ "extra.selected": true }}
        onChange={onChange}
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "Finisaj" });
    const none = screen.getByRole("radio", { name: "Fără finisaj" });
    const vinyl = screen.getByRole("radio", { name: "Colantat" });
    const native = document.querySelector(
      'select[name="extra.finish"]',
    ) as HTMLSelectElement | null;

    expect(group).toBeInTheDocument();
    expect(none.closest("[aria-hidden='true']")).toBeNull();
    expect(vinyl.closest("[aria-hidden='true']")).toBeNull();
    expect(native).not.toBeNull();
    expect(native?.tabIndex).toBe(-1);
    expect(native?.getAttribute("aria-hidden")).toBe("true");

    none.focus();
    expect(none).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("extra.finish", "vinyl");

    rerender(
      <FormRenderer
        template={template}
        schema={schema}
        values={{ "extra.selected": true, "extra.finish": "vinyl" }}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("radio", { name: "Colantat" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Fără finisaj" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(document.querySelector('select[name="extra.finish"]')).toHaveValue("vinyl");

    await user.click(screen.getByRole("radio", { name: "Fără finisaj" }));
    expect(onChange).toHaveBeenCalledWith("extra.finish", "none");
  });

  it("configurator required fields stay quiet until validation ids are provided", () => {
    render(
      <FormRenderer
        template={template}
        schema={schema}
        values={{}}
        onChange={vi.fn()}
        presentation="configurator"
      />,
    );

    expect(screen.getByText("Nume față")).toBeInTheDocument();
    expect(document.querySelector('[data-required][data-visual="Nume"]')).not.toBeNull();
    expect(screen.queryByText("Necesar")).not.toBeInTheDocument();
    expect(screen.queryByText("Completează acest câmp.")).not.toBeInTheDocument();
  });

  it("configurator shows compiler validation only for provided field ids", () => {
    render(
      <FormRenderer
        template={template}
        schema={schema}
        values={{}}
        onChange={vi.fn()}
        presentation="configurator"
        invalidFieldIds={["face.name"]}
      />,
    );

    expect(screen.getByText("Completează acest câmp.")).toBeInTheDocument();
    expect(screen.queryByText("Necesar")).not.toBeInTheDocument();
  });
});
