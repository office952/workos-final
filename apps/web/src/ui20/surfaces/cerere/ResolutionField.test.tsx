import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UNCONFIGURED_SITE_INSTALLATION_OFFER,
  projectSiteInstallationRequestOffer,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { ResolutionField } from "./ResolutionField";

vi.mock("../../../requestsApi", () => ({
  readRequestDetail: vi.fn(),
}));

import { readRequestDetail } from "../../../requestsApi";

const detail: RequestDetailProjection = {
  request: {
    requestId: "crq:11111111-2222-3333-4444-555555555555",
    reference: "CER-11111111",
    customerId: "cus:1",
    title: "Litere exterior",
    description: "Pe fațadă, text HUB MEDIA.",
    status: "IN_REVIEW",
    optionalScopeIds: [],
    siteInstallationMode: null,
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:00.000Z",
  },
  customerDisplayName: "HUB MEDIA",
  statusLabel: "În lucru",
  commercialProgress: null,
  commercialProgressLabel: null,
  canChangeCustomer: true,
  canUpdateStatus: true,
  canUploadAttachments: true,
  attachments: [],
  installationScope: null,
  installationFacts: null,
  canWriteInstallationFacts: false,
  installationOffer: projectSiteInstallationRequestOffer({
    selected: false,
    mode: null,
    offer: UNCONFIGURED_SITE_INSTALLATION_OFFER,
    hasLinkedQuotes: false,
  }),
  linkedOffers: [],
};

describe("ResolutionField", () => {
  beforeEach(() => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
  });

  it("splits known and unresolved planes without inventing product state", async () => {
    render(
      <MemoryRouter initialEntries={[`/requests/${detail.request.requestId}`]}>
        <Routes>
          <Route path="/requests/*" element={<ResolutionField />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Litere exterior" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cunoscut" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nerezolvat" })).toBeInTheDocument();
    expect(document.querySelector('[data-plane="known"]')).toBeTruthy();
    expect(document.querySelector('[data-plane="unresolved"]')).toBeTruthy();
    expect(screen.getByText("Nu există încă o ofertă legată")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Alege produs" }).length).toBeGreaterThan(0);
    expect(screen.queryByText("Produsul nu este ales")).not.toBeInTheDocument();
  });
});
