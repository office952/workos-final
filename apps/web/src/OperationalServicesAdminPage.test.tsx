import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SITE_INSTALLATION_SCOPE_ID, TRANSPORT_CAPABILITY_ID } from "@workos-final/domain";
import { CloudSessionTestProvider } from "./CloudSessionContext";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { OperationalServicesAdminPage } from "./OperationalServicesAdminPage";
import { fetchOperationalServices } from "./operationalServicesApi";
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
    memberships: [],
  };
}

vi.mock("./operationalServicesApi", () => ({
  fetchOperationalServices: vi.fn(),
  updateOperationalServiceOffer: vi.fn(),
}));

describe("OperationalServicesAdminPage", () => {
  it("projects unconfigured installation and reserved transport", async () => {
    vi.mocked(fetchOperationalServices).mockResolvedValue({
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
    });
    render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
        <OperationalServicesAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByRole("heading", { name: "Servicii operaționale" })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("SERVICE_DISABLED");
    expect(screen.getByRole("button", { name: "Salvează oferta organizației" })).toBeInTheDocument();
    expect(screen.getByText(/Transport: rezervat/)).toBeInTheDocument();
    expect(screen.queryByText(/200 EUR/i)).not.toBeInTheDocument();
  });

  it("keeps write for a Cloud owner and presents a member as read-only", async () => {
    vi.mocked(fetchOperationalServices).mockResolvedValue({
      capabilities: [
        {
          capabilityId: SITE_INSTALLATION_SCOPE_ID,
          label: "Montaj la locație",
          selectable: true,
          reserved: false,
          configured: true,
          offerMode: "INTERNAL",
          version: 1,
          updatedAt: "2026-08-28T20:00:00.000Z",
        },
      ],
    });
    const { unmount } = render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
        <OperationalServicesAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByRole("button", { name: "Salvează oferta organizației" })).toBeInTheDocument();
    unmount();

    render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("member")}>
        <OperationalServicesAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Salvează oferta organizației" })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
