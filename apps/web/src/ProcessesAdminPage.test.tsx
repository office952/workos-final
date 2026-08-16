import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { projectOperationalProcessesAdministration } from "@workos-final/domain";
import { ProcessesAdminPage } from "./ProcessesAdminPage";

vi.mock("./systemApi", () => ({
  fetchOperationalProcessesAdministration: () =>
    Promise.resolve(projectOperationalProcessesAdministration()),
}));

describe("ProcessesAdminPage", () => {
  it("shows process categories capability coverage and gaps without writes", async () => {
    const user = userEvent.setup();
    render(<ProcessesAdminPage />);

    expect(await screen.findByRole("button", { name: /^Debitare$/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Procese operaționale" })).toBeInTheDocument();
    expect(
      screen.getByText(/Procese \d+ · Capabilități \d+ · Cu furnizor \d+ · Fără furnizor \d+/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Procesele descriu cum se lucrează. Editarea lor nu este disponibilă în această etapă.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Debitare$/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Formare" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Asamblare" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Electric" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Control calitate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ambalare" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compoziții produse" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Categorii" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Capabilități necesare" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează" })).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Debitare foaie CNC" })).toBeInTheDocument();
    expect(screen.getByText("Necesită")).toBeInTheDocument();
    expect(screen.getAllByText("Debitare CNC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Acoperită").length).toBeGreaterThan(0);
    expect(screen.getByText("CUT_SHEET_CNC").closest("details")).toBeTruthy();
    expect(screen.getByText("CNC_ROUTING").closest("details")).toBeTruthy();

    await user.click(screen.getByText("Detalii"));
    expect(screen.getByText("CUT_SHEET_CNC").closest("details")).toHaveAttribute("open");

    await user.click(screen.getByRole("button", { name: "Formare" }));
    expect(screen.getByRole("heading", { name: "Formare profil aluminiu" })).toBeInTheDocument();
    expect(screen.getAllByText("Formare profil").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Control calitate" }));
    expect(screen.getByRole("heading", { name: "Probă uniformitate" })).toBeInTheDocument();
    expect(screen.getAllByText("Fără furnizor").length).toBeGreaterThan(0);
    expect(screen.getByText("Fără furnizor configurat")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ambalare" }));
    expect(screen.getByRole("heading", { name: /^Ambalare$/ })).toBeInTheDocument();
    expect(screen.getByText("Fără furnizor configurat")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Finisare" }));
    expect(screen.getByRole("heading", { name: "Aplicare folie" })).toBeInTheDocument();
    expect(screen.getByText("Apare când Finisaj față: Colantat.")).toBeInTheDocument();
    expect(screen.getByText("Apare când Finisaj volum: Colantat.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Vopsire RAL/ }));
    expect(screen.getByRole("heading", { name: "Vopsire RAL" })).toBeInTheDocument();
    expect(screen.getByText("Apare când Finisaj volum: Vopsit.")).toBeInTheDocument();
    expect(screen.queryByText("process node")).not.toBeInTheDocument();
    expect(screen.queryByText("Preț client")).not.toBeInTheDocument();
  });
});
