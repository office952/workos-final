import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OWNER_CONFIRMED_SELLER } from "@workos-final/domain";
import { CloudSessionTestProvider } from "./CloudSessionContext";
import { OWNER_WRITE_HINT } from "./organizationAccess";
import { SellerAdminPage } from "./SellerAdminPage";
import { fetchSellerProfile } from "./sellerApi";
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

vi.mock("./sellerApi", () => ({
  fetchSellerProfile: vi.fn(),
  updateSellerProfile: vi.fn(),
}));

describe("SellerAdminPage", () => {
  it("shows the current seller without customer or settings sprawl", async () => {
    vi.mocked(fetchSellerProfile).mockResolvedValue({
      profileId: "seller:current",
      ...OWNER_CONFIRMED_SELLER,
      updatedAt: "2026-08-17T00:00:00.000Z",
    });
    render(<SellerAdminPage />);
    expect(await screen.findByRole("heading", { name: "Date firmă" })).toBeInTheDocument();
    expect(screen.getByDisplayValue(OWNER_CONFIRMED_SELLER.legalName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(OWNER_CONFIRMED_SELLER.fiscalId)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvează datele firmei" })).toBeInTheDocument();
    expect(screen.queryByText(/CRM|lead|pipeline/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/telefon|email/i)).not.toBeInTheDocument();
  });

  it("keeps seller write for a Cloud owner and presents a member as read-only", async () => {
    vi.mocked(fetchSellerProfile).mockResolvedValue({
      profileId: "seller:current",
      ...OWNER_CONFIRMED_SELLER,
      updatedAt: "2026-08-17T00:00:00.000Z",
    });
    const { unmount } = render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("owner")}>
        <SellerAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByRole("button", { name: "Salvează datele firmei" })).toBeInTheDocument();
    unmount();

    render(
      <CloudSessionTestProvider snapshot={cloudSnapshot("member")}>
        <SellerAdminPage />
      </CloudSessionTestProvider>,
    );
    expect(await screen.findByText(OWNER_WRITE_HINT)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Salvează datele firmei" })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue(OWNER_CONFIRMED_SELLER.legalName)).toBeDisabled();
  });
});
