import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { projectResourcesAdministration } from "@workos-final/domain";
import { ResourcesAdminPage } from "./ResourcesAdminPage";

vi.mock("./systemApi", () => ({
  fetchResourcesAdministration: () => Promise.resolve(projectResourcesAdministration()),
}));

describe("ResourcesAdminPage", () => {
  it("shows owner hierarchy materials services labor and provenance without writes", async () => {
    const user = userEvent.setup();
    render(<ResourcesAdminPage />);

    expect(await screen.findByRole("button", { name: "Materiale" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resurse și cost intern" })).toBeInTheDocument();
    expect(screen.getByText(/Materiale \d+ · Servicii \d+ · Manoperă \d+ · Dovezi de cost \d+/)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Valorile sunt folosite pentru cost intern. Editarea tarifelor nu este disponibilă în această etapă.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Materiale" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Servicii" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manoperă" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dovezi de cost" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Servicii / cost operațional" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rețete servicii" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează tarife" })).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /^Plexiglas$/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plexiglas 3 mm opal" })).toBeInTheDocument();
    expect(screen.getByText("16,00 EUR / m²")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmat de owner").length).toBeGreaterThan(0);
    expect(screen.getByText("Achiziție confirmată de owner")).toBeInTheDocument();
    expect(screen.getByText("plexiglas_3mm_opal").closest("details")).toBeTruthy();
    expect(screen.queryByText("PLEXIGLAS")).not.toBeInTheDocument();

    await user.click(screen.getByText("Detalii"));
    expect(screen.getByText("plexiglas_3mm_opal").closest("details")).toHaveAttribute(
      "open",
    );

    await user.click(screen.getByRole("button", { name: "Servicii" }));
    expect(screen.getByRole("heading", { name: "Formare profil aluminiu" })).toBeInTheDocument();
    expect(screen.getByText("Rețetă serviciu")).toBeInTheDocument();
    expect(screen.getAllByText("5,00 EUR / m").length).toBeGreaterThan(0);
    expect(screen.getByText("Perimetru volum (m)")).toBeInTheDocument();
    expect(screen.getByText("RCP_PROFILE_FORMING").closest("details")).toBeTruthy();
    expect(screen.getByText("return_cant_forming").closest("details")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Îmbinare sudură oțel/ }));
    expect(screen.getAllByText("Lipsă").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Manoperă" }));
    expect(screen.getByRole("heading", { name: "Aplicare folie față" })).toBeInTheDocument();
    expect(screen.getByText("Rețetă manoperă")).toBeInTheDocument();
    expect(screen.getAllByText("5,00 EUR / m²").length).toBeGreaterThan(0);
    expect(screen.getByText("Default de dezvoltare")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Lipire față-volum/ }));
    expect(screen.getByRole("heading", { name: "Lipire față-volum" })).toBeInTheDocument();
    expect(screen.getAllByText("5,00 EUR / m").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Dovezi de cost" }));
    const evidence = screen.getByRole("article");
    expect(within(evidence).getByText("Dovadă de cost intern")).toBeInTheDocument();
    expect(within(evidence).getAllByText("3,00 EUR / m · adâncime 60 mm").length).toBeGreaterThan(0);
    expect(screen.queryByText("Preț client")).not.toBeInTheDocument();
    expect(screen.queryByText("ofertă")).not.toBeInTheDocument();
  });
});
