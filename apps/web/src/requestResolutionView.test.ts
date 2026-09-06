import { describe, expect, it } from "vitest";
import {
  UNCONFIGURED_SITE_INSTALLATION_OFFER,
  projectSiteInstallationRequestOffer,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { requestKnownFacts, requestUnresolvedItems } from "./requestResolutionView";

const base: RequestDetailProjection = {
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

describe("requestResolutionView", () => {
  it("projects known request facts without inventing product truth", () => {
    const known = requestKnownFacts(base);
    expect(known.map((item) => item.id)).toEqual(["client", "status", "install", "files"]);
    expect(known.find((item) => item.id === "client")?.value).toBe("HUB MEDIA");
    expect(JSON.stringify(known)).not.toContain("Product Truth");
    expect(JSON.stringify(known)).not.toContain("16,00");
  });

  it("marks a missing product as unresolved only when no linked quote exists", () => {
    const open = requestUnresolvedItems(base);
    expect(open.some((item) => item.id === "product")).toBe(true);
    expect(open.find((item) => item.id === "product")?.action).toEqual({
      kind: "href",
      label: "Alege produs",
      href: "/products?request=crq%3A11111111-2222-3333-4444-555555555555",
    });

    const withQuote = requestUnresolvedItems({
      ...base,
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
    });
    expect(withQuote.some((item) => item.id === "product")).toBe(false);
  });
});
