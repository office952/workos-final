import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { RequestDetailProjection } from "@workos-final/domain";
import { RequestDetailPage } from "./RequestDetailPage";
import { fetchProductCatalog } from "./productApi";
import { readRequestDetail, updateCommercialRequest } from "./requestsApi";

const detail: RequestDetailProjection = {
  request: {
    requestId: "crq:11111111-2222-3333-4444-555555555555",
    reference: "CER-11111111",
    customerId: "cus:1",
    title: "Litere exterior",
    description: "Pe fațadă, text HUB MEDIA.",
    status: "IN_REVIEW",
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:00.000Z",
  },
  customerDisplayName: "HUB MEDIA",
  statusLabel: "În lucru",
  commercialProgress: "QUOTE_CREATED",
  commercialProgressLabel: "Ofertă creată",
  canChangeCustomer: false,
  canUpdateStatus: true,
  canUploadAttachments: true,
  attachments: [],
  linkedOffers: [
    {
      quoteSnapshotId: "qts:1",
      reference: "OF-ABCDEF01",
      productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
      productLabel: "Litere volumetrice",
      inscription: "HUB",
      customerId: "cus:1",
      customerDisplayName: "HUB MEDIA",
      createdAt: "2026-08-17T12:00:00.000Z",
      grossDisplay: "624,82",
      currency: "EUR",
      stage: "QUOTE_CREATED",
      stageLabel: "Creată",
      nextAction: "ACCEPT_QUOTE",
      nextActionLabel: "Marchează acceptată",
      href: "/quotes/qts%3A1",
      needsAttention: true,
      attentionLabel: "Urmează acceptarea",
      acceptanceId: null,
      orderSnapshotId: null,
      requestId: null,
      requestReference: null,
    },
  ],
};

vi.mock("./requestsApi", () => ({
  readRequestDetail: vi.fn(),
  updateCommercialRequest: vi.fn(),
  uploadRequestAttachment: vi.fn(),
  requestAttachmentErrorMessage: (error: string) => error,
}));

vi.mock("./productApi", () => ({
  fetchProductCatalog: vi.fn(),
}));

describe("RequestDetailPage", () => {
  it("shows request truth, linked offer and catalog product action", async () => {
    vi.mocked(readRequestDetail).mockResolvedValue(detail);
    vi.mocked(updateCommercialRequest).mockResolvedValue({
      ...detail,
      request: { ...detail.request, status: "READY_FOR_QUOTE" },
      statusLabel: "Gata de ofertă",
    });
    vi.mocked(fetchProductCatalog).mockResolvedValue([
      {
        kind: "family",
        id: "fam",
        label: "Familie",
        description: "",
        children: [
          {
            kind: "product",
            code: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
            label: "Litere volumetrice luminoase",
            description: "",
          },
        ],
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/requests/crq:11111111-2222-3333-4444-555555555555"]}>
        <Routes>
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Litere exterior" })).toBeInTheDocument();
    expect(screen.getByText(/CER-11111111/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Client: HUB MEDIA" })).toHaveAttribute(
      "href",
      "/clients/cus%3A1",
    );
    expect(screen.getByLabelText("Descriere")).toHaveValue("Pe fațadă, text HUB MEDIA.");
    expect(screen.getByRole("heading", { name: "Fișiere client" })).toBeInTheDocument();
    expect(
      screen.getByText("Nu există încă fișiere atașate acestei cereri."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Oferte legate" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "OF-ABCDEF01" })).toHaveAttribute(
      "href",
      "/quotes/qts%3A1",
    );
    expect(screen.getByRole("link", { name: "Configurează" })).toHaveAttribute(
      "href",
      "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?request=crq%3A11111111-2222-3333-4444-555555555555",
    );
    expect(screen.queryByText("contentHash")).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText("Stare"), "READY_FOR_QUOTE");
    await userEvent.click(screen.getByRole("button", { name: "Salvează" }));
    expect(updateCommercialRequest).toHaveBeenCalledWith(
      "crq:11111111-2222-3333-4444-555555555555",
      expect.objectContaining({ status: "READY_FOR_QUOTE" }),
    );
  });
});
