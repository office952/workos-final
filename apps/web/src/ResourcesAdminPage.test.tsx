import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PLEXIGLAS_3MM_OPAL_ID,
  costEvidence,
  projectResourcesAdministration,
} from "@workos-final/domain";
import { CloudSessionTestProvider } from "./CloudSessionContext";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { ResourcesAdminPage } from "./ResourcesAdminPage";
import { fetchResourcesAdministration, patchCostEvidence } from "./systemApi";
import type { CloudSessionSnapshot } from "./cloudSessionApi";

function cloudSnapshot(role: "owner" | "member"): CloudSessionSnapshot {
  return {
    mode: "cloud",
    user: { userId: "usr:test", email: "user@example.test" },
    organization: {
      organizationId: "org:test",
      displayName: "Atelier Alpha",
      slug: "atelier-alpha",
      role,
    },
    memberships: [
      {
        organizationId: "org:test",
        displayName: "Atelier Alpha",
        slug: "atelier-alpha",
        role,
        status: "ACTIVE",
      },
    ],
  };
}

vi.mock("./systemApi", () => ({
  fetchResourcesAdministration: vi.fn(),
  patchCostEvidence: vi.fn(),
}));

const seedAdmin = projectResourcesAdministration();
const writableAdmin = projectResourcesAdministration(
  costEvidence.map((item, index) => ({
    ...item,
    evidenceRowId: `cev:test:${index}`,
    createdAt: "2026-08-18T00:00:00.000Z",
  })),
);

describe("ResourcesAdminPage", () => {
  beforeEach(() => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(seedAdmin);
  });

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

  it("offers owner write on persisted cost evidence", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const user = userEvent.setup();
    render(<ResourcesAdminPage />);
    expect(
      await screen.findByText(
        "Tariful salvat este confirmat de owner pentru calcule noi. Ofertele și lucrările înghețate nu se schimbă.",
      ),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dovezi de cost" }));
    expect(screen.getByRole("button", { name: "Editează" })).toBeInTheDocument();
    expect(screen.queryByText("Editarea tarifelor nu este disponibilă în această etapă.")).not.toBeInTheDocument();
    expect(screen.getByText("Ultima modificare")).toBeInTheDocument();
  });

  it("keeps Plexiglas selected after save even when the version token changes", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const savedAdmin = projectResourcesAdministration(
      costEvidence.map((item, index) => ({
        ...item,
        amount: item.resourceId === PLEXIGLAS_3MM_OPAL_ID ? 18 : item.amount,
        evidenceRowId:
          item.resourceId === PLEXIGLAS_3MM_OPAL_ID
            ? "cev:plexi-after-save"
            : `cev:test:${index}`,
        createdAt: "2026-08-18T12:00:00.000Z",
      })),
    );
    vi.mocked(patchCostEvidence).mockResolvedValue(savedAdmin);
    const user = userEvent.setup();
    render(<ResourcesAdminPage />);
    await user.click(await screen.findByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    expect(
      screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }),
    ).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: "Editează" }));
    const amount = screen.getByLabelText("Tarif");
    await user.clear(amount);
    await user.type(amount, "18");
    const fetchesBeforeSave = vi.mocked(fetchResourcesAdministration).mock.calls.length;
    await user.click(screen.getByRole("button", { name: "Salvează" }));
    expect(patchCostEvidence).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetchResourcesAdministration).mock.calls.length).toBe(
      fetchesBeforeSave,
    );
    const selected = screen.getByRole("article");
    expect(
      screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(selected).getByRole("heading", { name: "Plexiglas 3 mm opal" }),
    ).toBeInTheDocument();
    expect(within(selected).getAllByText("18,00 EUR / m²").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /Profil aluminiu/ }),
    ).not.toHaveAttribute("aria-current");
  });

  it("shows cost-evidence edit for a Cloud owner and hides it for a Cloud member", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const user = userEvent.setup();
    const ownerView = render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
        <ResourcesAdminPage />
      </CloudSessionTestProvider>,
    );
    await user.click(await screen.findByRole("button", { name: "Dovezi de cost" }));
    expect(screen.getByRole("button", { name: "Editează" })).toBeInTheDocument();
    ownerView.unmount();

    render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("member")}>
        <ResourcesAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează" })).not.toBeInTheDocument();
  });
});
