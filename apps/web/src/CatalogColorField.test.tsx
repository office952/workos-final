import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CatalogColorField } from "./CatalogColorField";

const colors = [
  {
    id: "oracal:651:010",
    code: "010",
    displayName: "White",
    swatch: "#E6E9EE",
    system: "ORACAL_651" as const,
    active: true,
  },
  {
    id: "oracal:651:031",
    code: "031",
    displayName: "Red",
    swatch: "#B0000D",
    system: "ORACAL_651" as const,
    active: true,
  },
];

describe("CatalogColorField", () => {
  it("opens a searchable picker and selects by code and name without rendering chips", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CatalogColorField
        fieldId="face.colorId"
        label="Culoare"
        value={null}
        colors={colors}
        required
        invalid={false}
        configurator
        onChange={onChange}
      />,
    );

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Culoare/ }));
    await user.type(screen.getByLabelText("Caută culoare după cod sau nume"), "031");
    expect(screen.getByRole("option", { name: /031/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /010/ })).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText("Caută culoare după cod sau nume"));
    await user.type(screen.getByLabelText("Caută culoare după cod sau nume"), "White");
    await user.click(screen.getByRole("option", { name: /010/ }));
    expect(onChange).toHaveBeenCalledWith("oracal:651:010");
  });

  it("supports keyboard selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CatalogColorField
        fieldId="face.colorId"
        label="Culoare"
        value={null}
        colors={colors}
        required
        invalid={false}
        configurator
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Culoare/ }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    screen.getAllByRole("option")[0]?.focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("oracal:651:010");
  });
});
