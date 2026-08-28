import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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

function renderResources(path = "/admin/resources?selected=family:PLEXIGLAS") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ResourcesAdminPage />
    </MemoryRouter>,
  );
}

describe("ResourcesAdminPage", () => {
  beforeEach(() => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(seedAdmin);
  });

  it("shows owner hierarchy materials services labor and provenance without writes", async () => {
    const user = userEvent.setup();
    renderResources();

    expect(await screen.findByRole("button", { name: "Materiale" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resurse și cost intern" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Secțiuni administrative" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resurse și cost intern" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Utilaje și zone" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guvernanță" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Atelier — execuție" })).not.toBeInTheDocument();
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
    expect(screen.queryByRole("button", { name: "Editează" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirmă tarif" })).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /^Plexiglas$/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plexiglas 3 mm opal" })).toBeInTheDocument();
    expect(screen.getByText("16,00 EUR / m²")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmat de owner").length).toBeGreaterThan(0);
    expect(screen.getByText("Achiziție confirmată de owner")).toBeInTheDocument();
    expect(screen.getByText("plexiglas_3mm_opal").closest("details")).toBeTruthy();
    expect(screen.queryByText("PLEXIGLAS")).not.toBeInTheDocument();
    expect(screen.queryByText("4,25 EUR/m")).not.toBeInTheDocument();

    await user.click(screen.getByText("Detalii"));
    expect(screen.getByText("plexiglas_3mm_opal").closest("details")).toHaveAttribute(
      "open",
    );

    await user.click(screen.getByRole("button", { name: "Servicii" }));
    await user.click(screen.getByRole("button", { name: /Formare profil aluminiu/ }));
    expect(screen.getByRole("heading", { name: "Formare profil aluminiu" })).toBeInTheDocument();
    expect(screen.getAllByText("Rețetă serviciu").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5,00 EUR / m").length).toBeGreaterThan(0);
    expect(screen.getByText("Perimetru volum (m)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Îmbinare sudură oțel/ }));
    expect(screen.getAllByText("Lipsă").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Manoperă" }));
    await user.click(screen.getByRole("button", { name: /Aplicare folie față/ }));
    expect(screen.getByRole("heading", { name: "Aplicare folie față" })).toBeInTheDocument();
    expect(screen.getAllByText("Rețetă manoperă").length).toBeGreaterThan(0);
    expect(screen.getAllByText("5,00 EUR / m²").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /Lipire față-volum/ }));
    expect(screen.getByRole("heading", { name: "Lipire față-volum" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    const evidence = screen.getByRole("article");
    expect(within(evidence).getByText("Dovadă de cost intern")).toBeInTheDocument();
    expect(screen.queryByText("Preț client")).not.toBeInTheDocument();
    expect(screen.queryByText("ofertă")).not.toBeInTheDocument();
  });

  it("asks the owner to choose an item when selected is missing", async () => {
    renderResources("/admin/resources");
    expect(await screen.findByText("Alege un element")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^Plexiglas$/ })).not.toBeInTheDocument();
  });

  it("shows a missing status for an unknown selected id", async () => {
    renderResources("/admin/resources?selected=nu-exista");
    expect(await screen.findByText("Element inexistent")).toBeInTheDocument();
  });

  it("opens only one contextual drawer at a time", async () => {
    const user = userEvent.setup();
    renderResources("/admin/resources");
    expect(await screen.findByRole("button", { name: "Secțiuni" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Secțiuni" }));
    expect(screen.getByRole("dialog", { name: "Secțiuni" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Alege elementul" })).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Secțiuni" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Alege elementul" }));
    expect(screen.getByRole("dialog", { name: "Alege elementul" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Secțiuni" })).not.toBeInTheDocument();
  });

  it("ignores nav=basic and keeps the canonical Admin L2", async () => {
    renderResources("/admin/resources?nav=basic");
    expect(await screen.findByRole("link", { name: "Resurse și cost intern" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Utilaje și zone" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oameni" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Servicii operaționale" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Procese" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guvernanță" })).toBeInTheDocument();
  });

  it("announces loading with a polite live status", async () => {
    let release: ((admin: typeof seedAdmin) => void) | undefined;
    vi.mocked(fetchResourcesAdministration).mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    renderResources("/admin/resources");
    const loading = await screen.findByRole("status");
    expect(loading).toHaveAttribute("aria-live", "polite");
    expect(loading).toHaveTextContent("Se încarcă catalogul de resurse…");
    expect(screen.queryByRole("button", { name: "Reîncearcă" })).not.toBeInTheDocument();
    release?.(seedAdmin);
    expect(await screen.findByText("Alege un element")).toBeInTheDocument();
  });

  it("announces catalog errors and retries the same GET without losing selected", async () => {
    let releaseRetry: ((admin: typeof seedAdmin) => void) | undefined;
    vi.mocked(fetchResourcesAdministration).mockReset();
    vi.mocked(fetchResourcesAdministration)
      .mockRejectedValueOnce(new Error("resources_admin_unavailable"))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            releaseRetry = resolve;
          }),
      );
    const user = userEvent.setup();
    renderResources("/admin/resources?selected=family:PLEXIGLAS");
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Nu s-a putut încărca catalogul de resurse.");
    expect(error).not.toHaveAttribute("aria-live");
    await user.click(screen.getByRole("button", { name: "Reîncearcă" }));
    expect(await screen.findByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByRole("button", { name: "Confirmă tarif" })).not.toBeInTheDocument();
    expect(vi.mocked(patchCostEvidence)).not.toHaveBeenCalled();
    releaseRetry?.(seedAdmin);
    expect(await screen.findByRole("heading", { name: /^Plexiglas$/ })).toBeInTheDocument();
    expect(vi.mocked(fetchResourcesAdministration)).toHaveBeenCalledTimes(2);
  });

  it("offers owner write on persisted cost evidence", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const user = userEvent.setup();
    renderResources("/admin/resources");
    expect(
      await screen.findByText(
        /Valorile implicite de platformă nu sunt cost confirmat/,
      ),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    expect(screen.getByRole("button", { name: "Confirmă tarif" })).toBeInTheDocument();
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
    renderResources("/admin/resources");
    await user.click(await screen.findByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    expect(
      screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }),
    ).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: "Confirmă tarif" }));
    const amount = screen.getByLabelText("Tarif");
    await user.clear(amount);
    await user.type(amount, "18");
    const fetchesBeforeSave = vi.mocked(fetchResourcesAdministration).mock.calls.length;
    await user.click(screen.getAllByRole("button", { name: "Confirmă tarif" })[0]);
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

  it("shows platform-default cost provenance as not owner-confirmed", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(
      projectResourcesAdministration(
        costEvidence.map((item, index) => ({
          ...item,
          source: "PLATFORM_DEFAULT",
          classification: "DEVELOPMENT_DEFAULT",
          evidenceRowId: `cev:default:${index}`,
          createdAt: "2026-08-19T00:00:00.000Z",
        })),
      ),
    );
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/resources"]}>
        <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
          <ResourcesAdminPage />
        </CloudSessionTestProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/Valorile implicite de platformă nu sunt cost confirmat/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    expect(screen.getAllByText("Valoare implicită de platformă").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Default de dezvoltare").length).toBeGreaterThan(0);
    expect(screen.queryByText("Confirmat de owner")).not.toBeInTheDocument();
  });

  it("shows cost-evidence edit for a Cloud owner and hides it for a Cloud member", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const user = userEvent.setup();
    const ownerView = render(
      <MemoryRouter initialEntries={["/admin/resources"]}>
        <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
          <ResourcesAdminPage />
        </CloudSessionTestProvider>
      </MemoryRouter>,
    );
    await user.click(await screen.findByRole("button", { name: "Dovezi de cost" }));
    await user.click(screen.getByRole("button", { name: /Plexiglas 3 mm opal/ }));
    expect(screen.getByRole("button", { name: "Confirmă tarif" })).toBeInTheDocument();
    ownerView.unmount();

    render(
      <MemoryRouter initialEntries={["/admin/resources"]}>
        <CloudSessionTestProvider snapshot={cloudSnapshot("member")}>
          <ResourcesAdminPage />
        </CloudSessionTestProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirmă tarif" })).not.toBeInTheDocument();
  });
});
