import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DisplayLabelEditor } from "./DisplayLabelEditor";

const target = {
  entityKind: "PRODUCT_FAMILY" as const,
  entityId: "LIGHTED_VOLUMETRIC_SIGNS",
  displayLabel: "Familie curentă",
  revision: 1,
  identityLabel: "LIGHTED_VOLUMETRIC_SIGNS",
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DisplayLabelEditor", () => {
  it("saves server truth and keeps identity read-only", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn(async () => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          displayLabel: "Familie salvată",
          revision: 2,
        }),
      }),
    );
    render(<DisplayLabelEditor target={target} onSaved={onSaved} />);
    expect(screen.getByText("LIGHTED_VOLUMETRIC_SIGNS")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Editează" }));
    await user.clear(screen.getByLabelText("Etichetă afișată"));
    await user.type(screen.getByLabelText("Etichetă afișată"), "Familie salvată");
    await user.click(screen.getByRole("button", { name: "Salvează" }));
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "/api/admin/product-system/entities/PRODUCT_FAMILY/LIGHTED_VOLUMETRIC_SIGNS/display-label",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("keeps the draft and shows an error when save fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "invalid_label" }),
      }),
    );
    render(<DisplayLabelEditor target={target} onSaved={vi.fn(async () => undefined)} />);
    await user.click(screen.getByRole("button", { name: "Editează" }));
    await user.clear(screen.getByLabelText("Etichetă afișată"));
    await user.click(screen.getByRole("button", { name: "Salvează" }));
    expect(screen.getByText("Eticheta nu poate fi goală.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Etichetă afișată"), "Altă etichetă");
    await user.click(screen.getByRole("button", { name: "Salvează" }));
    expect(screen.getByText("Eticheta nu este validă.")).toBeInTheDocument();
    expect(screen.getByLabelText("Etichetă afișată")).toHaveValue("Altă etichetă");
    await user.click(screen.getByRole("button", { name: "Renunță" }));
    expect(screen.getByText("Familie curentă")).toBeInTheDocument();
  });
});
