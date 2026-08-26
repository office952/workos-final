import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CostEvidenceEditor } from "./CostEvidenceEditor";

const evidence = {
  resourceId: "plexiglas_3mm_opal",
  resourceLabel: "Plexiglas 3 mm opal",
  kindLabel: "Material",
  evidenceRowId: "cev:plexi",
  lastChangedAt: "2026-08-18T00:00:00.000Z",
  qualifierIdentity: "unqualified",
  qualifierLabel: null,
  usedBy: [],
  amount: 16,
  currency: "EUR" as const,
  unitLabel: "m²",
  sourceLabel: "Achiziție confirmată de owner",
  classificationLabel: "Confirmat de owner",
  note: "Notă curentă",
  amountDisplay: "16,00 EUR / m²",
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CostEvidenceEditor", () => {
  it("saves amount and note without exposing identity fields as editable", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          evidence: { ...evidence, amount: 18 },
          admin: { writeState: "READY" },
        }),
      }),
    );
    render(<CostEvidenceEditor evidence={evidence} onSaved={onSaved} />);
    expect(screen.getByText("m²")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirmă tarif" }));
    const amount = screen.getByLabelText("Tarif");
    await user.clear(amount);
    await user.type(amount, "18");
    await user.click(screen.getAllByRole("button", { name: "Confirmă tarif" })[0]);
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledWith({ writeState: "READY" });
    expect(fetch).toHaveBeenCalledWith(
      "/api/resources-admin/cost-evidence/cev:plexi",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("keeps the draft and shows an error when the row is stale", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "stale_cost_evidence" }),
      }),
    );
    render(
      <CostEvidenceEditor evidence={evidence} onSaved={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Confirmă tarif" }));
    await user.clear(screen.getByLabelText("Tarif"));
    await user.type(screen.getByLabelText("Tarif"), "18");
    await user.click(screen.getAllByRole("button", { name: "Confirmă tarif" })[0]);
    expect(
      screen.getByText("Tariful a fost schimbat între timp. Reîncarcă și încearcă din nou."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Tarif")).toHaveValue("18");
  });

  it("does not report a failed save when PATCH succeeds and the follow-up update throws", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn(() => {
      throw new Error("resources_admin_unavailable");
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          evidence: { ...evidence, amount: 18 },
          admin: { writeState: "READY" },
        }),
      }),
    );
    render(<CostEvidenceEditor evidence={evidence} onSaved={onSaved} />);
    await user.click(screen.getByRole("button", { name: "Confirmă tarif" }));
    await user.clear(screen.getByLabelText("Tarif"));
    await user.type(screen.getByLabelText("Tarif"), "18");
    await user.click(screen.getAllByRole("button", { name: "Confirmă tarif" })[0]);
    expect(onSaved).toHaveBeenCalledWith({ writeState: "READY" });
    expect(
      screen.queryByText("Salvarea a eșuat. Tariful curent nu a fost schimbat."),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmă tarif" })).toBeInTheDocument();
  });
});
