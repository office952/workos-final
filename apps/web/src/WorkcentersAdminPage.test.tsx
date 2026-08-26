import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { projectWorkcentersAdministration } from "@workos-final/domain";
import { WorkcentersAdminPage } from "./WorkcentersAdminPage";

vi.mock("./systemApi", () => ({
  fetchWorkcentersAdministration: () => Promise.resolve(projectWorkcentersAdministration()),
}));

describe("WorkcentersAdminPage", () => {
  it("shows zone hierarchy workcenter-only providers and honest gaps without writes", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WorkcentersAdminPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("button", { name: /^CNC$/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Utilaje și zone" })).toBeInTheDocument();
    expect(
      screen.getByText(/Zone \d+ · Utilaje \d+ · Capabilități acoperite \d+ · Fără furnizor \d+/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Această pagină descrie zonele și utilajele disponibile. Programarea și capacitatea nu sunt implementate aici.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Utilaje și capacitate")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Prezentare" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Capabilități" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează" })).not.toBeInTheDocument();
    expect(screen.queryByText("Rulează")).not.toBeInTheDocument();
    expect(screen.queryByText("Mentenanță")).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Zonă CNC" })).toBeInTheDocument();
    expect(screen.getByText("Poate face")).toBeInTheDocument();
    expect(screen.getByText("WC_CNC_ROUTING").closest("details")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /CNC 4020/ }));
    expect(screen.getByRole("heading", { name: "CNC 4020" })).toBeInTheDocument();
    expect(screen.getAllByText("Utilaj").length).toBeGreaterThan(0);
    expect(screen.getByText("Obligatoriu la start")).toBeInTheDocument();
    expect(screen.getAllByText("Debitare CNC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Debitare foaie CNC").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /^Asamblare$/ }));
    expect(screen.getByRole("heading", { name: "Masă asamblare 1" })).toBeInTheDocument();
    expect(screen.getAllByText("Zonă / post de lucru").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Zonă manuală").length).toBeGreaterThan(0);
    expect(screen.getAllByText("niciun utilaj").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Zona manuală nu este poartă de start/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Electric$/ }));
    expect(screen.getByRole("heading", { name: "Montaj LED / electric" })).toBeInTheDocument();
    expect(screen.getAllByText("Asamblare electrică").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /^Fără furnizor$/ }));
    expect(screen.getByRole("heading", { name: "Vopsire" })).toBeInTheDocument();
    expect(screen.getByText("Fără furnizor configurat")).toBeInTheDocument();

    await user.click(screen.getByText("Detalii"));
    expect(screen.getByText("PAINTING").closest("details")).toHaveAttribute("open");
  });
});
