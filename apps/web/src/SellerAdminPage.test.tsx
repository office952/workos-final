import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OWNER_CONFIRMED_SELLER } from "@workos-final/domain";
import { SellerAdminPage } from "./SellerAdminPage";
import { fetchSellerProfile } from "./sellerApi";

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
});
