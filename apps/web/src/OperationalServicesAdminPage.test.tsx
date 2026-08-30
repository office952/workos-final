import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  SITE_INSTALLATION_SCOPE_ID,
  TRANSPORT_CAPABILITY_ID,
  type OperationalServicesAdminProjection,
} from "@workos-final/domain";
import { CloudSessionTestProvider } from "./CloudSessionContext";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { OperationalServicesAdminPage } from "./OperationalServicesAdminPage";
import {
  fetchOperationalServices,
  updateOperationalServiceOffer,
} from "./operationalServicesApi";
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

const unconfigured: OperationalServicesAdminProjection = {
  capabilities: [
    {
      capabilityId: SITE_INSTALLATION_SCOPE_ID,
      label: "Montaj la locație",
      selectable: true,
      reserved: false,
      configured: false,
      offerMode: null,
      version: null,
      updatedAt: null,
    },
    {
      capabilityId: TRANSPORT_CAPABILITY_ID,
      label: "Transport",
      selectable: false,
      reserved: true,
      configured: false,
      offerMode: null,
      version: null,
      updatedAt: null,
    },
  ],
};

const internalConfigured: OperationalServicesAdminProjection = {
  capabilities: [
    {
      capabilityId: SITE_INSTALLATION_SCOPE_ID,
      label: "Montaj la locație",
      selectable: true,
      reserved: false,
      configured: true,
      offerMode: "INTERNAL" as const,
      version: 1,
      updatedAt: "2026-08-28T20:00:00.000Z",
    },
  ],
};

const disabledConfigured: OperationalServicesAdminProjection = {
  capabilities: [
    {
      capabilityId: SITE_INSTALLATION_SCOPE_ID,
      label: "Montaj la locație",
      selectable: true,
      reserved: false,
      configured: true,
      offerMode: "SERVICE_DISABLED" as const,
      version: 2,
      updatedAt: "2026-08-28T21:00:00.000Z",
    },
  ],
};

vi.mock("./operationalServicesApi", () => ({
  fetchOperationalServices: vi.fn(),
  updateOperationalServiceOffer: vi.fn(),
}));

function renderPage(role: "owner" | "member") {
  return render(
    <MemoryRouter>
      <CloudSessionTestProvider snapshot={cloudSnapshot(role)}>
        <OperationalServicesAdminPage />
      </CloudSessionTestProvider>
    </MemoryRouter>,
  );
}

describe("OperationalServicesAdminPage", () => {
  beforeEach(() => {
    vi.mocked(fetchOperationalServices).mockReset();
    vi.mocked(updateOperationalServiceOffer).mockReset();
  });

  it("sits as an admin page without a duplicated L2 or catalog selector", async () => {
    vi.mocked(fetchOperationalServices).mockResolvedValue(unconfigured);
    renderPage("owner");
    expect(await screen.findByRole("heading", { name: "Servicii operaționale" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Context" })).toHaveTextContent("Administrare");
    expect(screen.queryByRole("navigation", { name: "Secțiuni administrative" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Alege elementul" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Caută")).not.toBeInTheDocument();
    expect(screen.queryByText("Alege un element")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Secțiuni" })).not.toBeInTheDocument();
  });

  it("distinguishes unconfigured from an explicitly saved disabled state", async () => {
    vi.mocked(fetchOperationalServices).mockResolvedValue(unconfigured);
    const { unmount } = renderPage("owner");
    const unconfiguredSummary = await screen.findByText(/Nu există o configurație salvată/);
    expect(unconfiguredSummary).toBeInTheDocument();
    expect(unconfiguredSummary.closest(".page-summary")).toHaveTextContent("Neconfigurat");
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.queryByText(/Configurația este salvată/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Versiunea salvată/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvează configurația serviciului" })).toBeDisabled();
    unmount();

    vi.mocked(fetchOperationalServices).mockResolvedValue(disabledConfigured);
    renderPage("owner");
    const disabledSummary = await screen.findByText(/Configurația este salvată/);
    expect(disabledSummary.closest(".page-summary")).toHaveTextContent("Dezactivat");
    expect(screen.getByRole("combobox")).toHaveValue("SERVICE_DISABLED");
    expect(screen.getByText("Versiunea salvată: 2")).toBeInTheDocument();
    expect(screen.queryByText(/Nu există o configurație salvată/)).not.toBeInTheDocument();
    expect(screen.queryByText("Neconfigurat")).not.toBeInTheDocument();
  });

  it("lets an owner save and shows success or error", async () => {
    const user = userEvent.setup();
    vi.mocked(fetchOperationalServices).mockResolvedValue(unconfigured);
    vi.mocked(updateOperationalServiceOffer).mockResolvedValue({
      record: {
        capabilityId: SITE_INSTALLATION_SCOPE_ID,
        offerMode: "INTERNAL",
        version: 1,
        updatedAt: "2026-08-28T22:00:00.000Z",
      },
      services: internalConfigured,
    });
    renderPage("owner");
    await screen.findByRole("combobox");
    await user.selectOptions(screen.getByRole("combobox"), "INTERNAL");
    await user.click(screen.getByRole("button", { name: "Salvează configurația serviciului" }));
    expect(updateOperationalServiceOffer).toHaveBeenCalledWith(
      SITE_INSTALLATION_SCOPE_ID,
      "INTERNAL",
    );
    expect(await screen.findByText("Configurația serviciului a fost salvată.")).toBeInTheDocument();
    expect(screen.getByText(/Organizația oferă montaj cu echipă internă/)).toBeInTheDocument();

    vi.mocked(updateOperationalServiceOffer).mockRejectedValueOnce(new Error("failed"));
    await user.click(screen.getByRole("button", { name: "Salvează configurația serviciului" }));
    expect(
      await screen.findByText("Configurația serviciului nu a putut fi salvată."),
    ).toBeInTheDocument();
  });

  it("keeps a member read-only without a duplicated admin menu", async () => {
    vi.mocked(fetchOperationalServices).mockResolvedValue(internalConfigured);
    renderPage("member");
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Salvează configurația serviciului" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByText(/Organizația oferă montaj cu echipă internă/)).toBeInTheDocument();
    expect(screen.queryByText(/200 EUR/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Secțiuni" })).not.toBeInTheDocument();
  });
});
