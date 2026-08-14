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
    { id: "FACE", label: "Față", required: true },
    {
      id: "LIGHTING",
      label: "Iluminare",
      required: false,
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
});
