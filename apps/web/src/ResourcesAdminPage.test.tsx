import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  LAB_SITE_INSTALL_ID,
  PLEXIGLAS_3MM_OPAL_ID,
  SVC_SITE_INSTALL_SUBCONTRACT_ID,
  costEvidence,
  projectResourcesAdministration,
} from "@workos-final/domain";
import { CloudSessionTestProvider } from "./CloudSessionContext";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { ResourcesAdminPage } from "./ResourcesAdminPage";
import {
  createCostEvidence,
  fetchResourcesAdministration,
  patchCostEvidence,
} from "./systemApi";
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
  createCostEvidence: vi.fn(),
}));

const seedAdmin = projectResourcesAdministration();
const writableAdmin = projectResourcesAdministration(
  costEvidence.map((item, index) => ({
    ...item,
    evidenceRowId: `cev:test:${index}`,
    createdAt: "2026-08-18T00:00:00.000Z",
  })),
);

function renderResources(path = "/admin/resources") {
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

  it("opens Costuri interne as a flat registry without catalog menus", async () => {
    renderResources();

    expect(await screen.findByRole("heading", { name: "Resurse și costuri" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Context" })).toHaveTextContent("Administrare");
    expect(screen.getByRole("button", { name: "Costuri interne" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Resurse" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rețete" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Costuri interne" })).toBeInTheDocument();
    expect(screen.getAllByText("Profil aluminiu 0,6 mm").length).toBeGreaterThan(0);
    expect(screen.getByText("30 mm")).toBeInTheDocument();
    expect(screen.getAllByText("Plexiglas 3 mm opal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("16,00 EUR / m²").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Confirmat").length).toBeGreaterThan(0);
    expect(screen.queryByText("Alege un element")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Alege elementul" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dovezi de cost" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Adaugă dovadă" })).not.toBeInTheDocument();
    expect(screen.queryByText("volumeDepthMm")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Adaugă tarif" })).not.toBeInTheDocument();
    expect(
      screen.getByText("Tarifele sunt folosite pentru cost intern. Editarea nu este disponibilă în această etapă."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Produs")).toHaveDisplayValue("Toate produsele");
  });

  it("filters the flat workspace by ProductTemplate context", async () => {
    const user = userEvent.setup();
    renderResources();
    const product = await screen.findByLabelText("Produs");
    expect(product).toHaveDisplayValue("Toate produsele");
    expect(
      screen.getByRole("option", {
        name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Panou ACM casetat" })).toBeInTheDocument();

    await user.selectOptions(product, CANONICAL_PRODUCT_CODE);
    expect(screen.getByText(/resurse relevante/)).toBeInTheDocument();
    expect(screen.getByText(/tarife confirmate/)).toBeInTheDocument();
    expect(screen.queryByText(/necesită configurare/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/EIC/i)).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Neconfirmate" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Necesită configurare" })).not.toBeInTheDocument();
    expect(screen.getByText("30 mm")).toBeInTheDocument();
    expect(screen.getByText("60 mm")).toBeInTheDocument();
    expect(screen.getByText("80 mm")).toBeInTheDocument();
    expect(screen.getByText("100 mm")).toBeInTheDocument();
    expect(screen.queryByText("ACM 3 mm")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Produs"), ACM_CASSETTE_NONE_PRODUCT_CODE);
    expect(screen.queryByText("Profil aluminiu 0,6 mm")).not.toBeInTheDocument();
    expect(screen.getByText("ACM 3 mm")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Produs"), "");
    expect(screen.getAllByText("Profil aluminiu 0,6 mm").length).toBeGreaterThan(0);
    expect(screen.getByText("ACM 3 mm")).toBeInTheDocument();
  });

  it("restores product context from the URL", async () => {
    renderResources(`/admin/resources?product=${CANONICAL_PRODUCT_CODE}`);
    expect(await screen.findByLabelText("Produs")).toHaveValue(CANONICAL_PRODUCT_CODE);
    expect(screen.getByText("30 mm")).toBeInTheDocument();
    expect(screen.queryByText("ACM 3 mm")).not.toBeInTheDocument();
  });

  it("lists resources and recipes as filters, not nested menus", async () => {
    const user = userEvent.setup();
    renderResources();
    await user.click(await screen.findByRole("button", { name: "Resurse" }));
    expect(screen.getByText("Plexiglas 3 mm opal")).toBeInTheDocument();
    expect(screen.getByText(/Material · Plexiglas/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Materiale" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rețete" }));
    expect(screen.getByText("Formare profil aluminiu")).toBeInTheDocument();
    expect(screen.getAllByText(/Rețetă serviciu/).length).toBeGreaterThan(0);
    expect(screen.getByText("Aplicare folie față")).toBeInTheDocument();
    expect(screen.getByText("Îmbinare sudură oțel")).toBeInTheDocument();
    expect(screen.getAllByText(/Lipsă/).length).toBeGreaterThan(0);
  });

  it("ignores nav=basic and keeps the workspace", async () => {
    renderResources("/admin/resources?nav=basic");
    expect(await screen.findByRole("heading", { name: "Resurse și costuri" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Costuri interne" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("navigation", { name: "Secțiuni administrative" })).not.toBeInTheDocument();
  });

  it("announces loading with a polite live status", async () => {
    let release: ((admin: typeof seedAdmin) => void) | undefined;
    vi.mocked(fetchResourcesAdministration).mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    renderResources();
    const loading = await screen.findByRole("status");
    expect(loading).toHaveAttribute("aria-live", "polite");
    expect(loading).toHaveTextContent("Se încarcă catalogul de resurse…");
    release?.(seedAdmin);
    expect(await screen.findByRole("table", { name: "Costuri interne" })).toBeInTheDocument();
  });

  it("announces catalog errors and retries the same GET", async () => {
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
    renderResources();
    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("Nu s-a putut încărca catalogul de resurse.");
    await user.click(screen.getByRole("button", { name: "Reîncearcă" }));
    expect(await screen.findByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(vi.mocked(patchCostEvidence)).not.toHaveBeenCalled();
    releaseRetry?.(seedAdmin);
    expect(await screen.findByRole("table", { name: "Costuri interne" })).toBeInTheDocument();
    expect(vi.mocked(fetchResourcesAdministration)).toHaveBeenCalledTimes(2);
  });

  it("lets the owner add a qualified tariff in one drawer", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const createdAdmin = projectResourcesAdministration([
      ...costEvidence.map((item, index) => ({
        ...item,
        evidenceRowId: `cev:test:${index}`,
        createdAt: "2026-08-18T00:00:00.000Z",
      })),
      {
        resourceId: "aluminium_return_profile",
        amount: 2.5,
        currency: "EUR" as const,
        perUnit: "m" as const,
        source: "OWNER_CONFIRMED_WORKSHOP" as const,
        classification: "OWNER_CONFIRMED" as const,
        note: "",
        when: { volumeDepthMm: 40 },
        evidenceRowId: "cev:alu-40",
        createdAt: "2026-09-04T00:00:00.000Z",
      },
    ]);
    vi.mocked(createCostEvidence).mockResolvedValue(createdAdmin);
    const user = userEvent.setup();
    renderResources();
    await user.click(await screen.findByRole("button", { name: "Adaugă tarif" }));
    expect(screen.getByRole("dialog", { name: "Adaugă tarif" })).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Resursă"),
      "aluminium_return_profile",
    );
    await user.type(screen.getByLabelText("Adâncime volum"), "40");
    await user.type(screen.getByLabelText("Tarif"), "2.50");
    expect(screen.queryByText("volumeDepthMm")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Salvează tarif" }));
    expect(createCostEvidence).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: "aluminium_return_profile",
        amount: 2.5,
        when: { volumeDepthMm: 40 },
      }),
    );
    expect(screen.getByText("2,50 EUR / m")).toBeInTheDocument();
    expect(screen.getByText("40 mm")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dovezi de cost" })).not.toBeInTheDocument();
  });

  it("prefers template resources in Adaugă tarif without hiding the catalog", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    const user = userEvent.setup();
    renderResources(`/admin/resources?product=${CANONICAL_PRODUCT_CODE}`);
    await user.click(await screen.findByRole("button", { name: "Adaugă tarif" }));
    const resource = screen.getByLabelText("Resursă");
    expect(within(resource).getByRole("group", { name: "Folosite de produs" })).toBeInTheDocument();
    expect(within(resource).getByRole("group", { name: "Toate resursele" })).toBeInTheDocument();
    expect(
      within(resource).getByRole("option", { name: "Profil aluminiu 0,6 mm" }),
    ).toBeInTheDocument();
    expect(
      within(resource).getByRole("option", { name: "Manoperă montaj la locație" }),
    ).toBeInTheDocument();
  });

  it("opens a cost row for edit and keeps the qualifier immutable", async () => {
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
    renderResources();
    await user.click(await screen.findByRole("row", { name: /Plexiglas 3 mm opal/ }));
    const detail = screen.getByRole("dialog", { name: "Plexiglas 3 mm opal" });
    expect(within(detail).getByText("Achiziție confirmată de owner")).toBeInTheDocument();
    await user.click(within(detail).getByRole("button", { name: "Editează tarif" }));
    const amount = screen.getByLabelText("Tarif");
    await user.clear(amount);
    await user.type(amount, "18");
    await user.click(screen.getByRole("button", { name: "Salvează tarif" }));
    expect(patchCostEvidence).toHaveBeenCalledTimes(1);
    expect(within(screen.getByRole("dialog")).getAllByText("18,00 EUR / m²").length).toBeGreaterThan(0);
  });

  it("hides write actions for a Cloud member", async () => {
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(writableAdmin);
    render(
      <MemoryRouter initialEntries={["/admin/resources"]}>
        <CloudSessionTestProvider snapshot={cloudSnapshot("member")}>
          <ResourcesAdminPage />
        </CloudSessionTestProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Adaugă tarif" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editează tarif" })).not.toBeInTheDocument();
  });

  it("opens the created LAB-SITE-INSTALL evidence from a resource deep link", async () => {
    const admin = projectResourcesAdministration(
      [
        ...costEvidence.map((item, index) => ({
          ...item,
          evidenceRowId: `cev:test:${index}`,
          createdAt: "2026-08-18T00:00:00.000Z",
        })),
        {
          resourceId: LAB_SITE_INSTALL_ID,
          amount: 25,
          currency: "EUR" as const,
          perUnit: "person_hour" as const,
          source: "OWNER_CONFIRMED_WORKSHOP" as const,
          classification: "OWNER_CONFIRMED" as const,
          note: "Tarif intern montaj.",
          evidenceRowId: "cev:lab-site",
          createdAt: "2026-09-03T00:00:00.000Z",
        },
      ],
      "2026-09-03T12:00:00.000Z",
    );
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(admin);
    renderResources(`/admin/resources?selected=resource:${LAB_SITE_INSTALL_ID}`);
    expect(
      await screen.findByRole("dialog", { name: "Manoperă montaj la locație" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("25,00 EUR / ore-persoană").length).toBeGreaterThan(0);
  });

  it("shows an expired badge for outdated subcontract evidence", async () => {
    const admin = projectResourcesAdministration(
      [
        {
          resourceId: SVC_SITE_INSTALL_SUBCONTRACT_ID,
          amount: 180,
          currency: "EUR",
          perUnit: "job",
          source: "OWNER_CONFIRMED_PURCHASE",
          classification: "OWNER_CONFIRMED",
          note: "Expirat.",
          supplierLabel: "Montaj Demo SRL",
          validFrom: "2020-01-01",
          validUntil: "2020-06-01",
          evidenceRowId: "cev:sub-expired",
          createdAt: "2026-09-03T00:00:00.000Z",
        },
      ],
      "2026-09-03T12:00:00.000Z",
    );
    vi.mocked(fetchResourcesAdministration).mockResolvedValue(admin);
    renderResources(
      "/admin/resources?selected=cost%3ASVC-SITE-INSTALL-SUBCONTRACT%3Aunqualified",
    );
    const detail = await screen.findByRole("dialog", { name: "Montaj la locație subcontractat" });
    expect(within(detail).getByText("Expirat · 1 iun. 2020")).toBeInTheDocument();
    expect(within(detail).getAllByText("Montaj Demo SRL").length).toBeGreaterThan(0);
  });
});
