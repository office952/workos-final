import { describe, expect, it } from "vitest";
import type { QuoteOverviewItem } from "../quotes/overview.js";
import type { CommercialRequest } from "./commercialRequest.js";
import {
  deriveRequestCommercialProgress,
  filterRequestOverview,
  projectRequestDetail,
  projectRequestOverview,
  projectRequestOverviewItem,
} from "./overview.js";

function request(overrides: Partial<CommercialRequest> = {}): CommercialRequest {
  return {
    requestId: "crq:11111111-2222-3333-4444-555555555555",
    reference: "CER-11111111",
    customerId: "cus:active",
    title: "Litere exterior",
    description: "Pe fațadă, text HUB MEDIA.",
    status: "NEW",
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:00.000Z",
    ...overrides,
  };
}

function quote(stage: QuoteOverviewItem["stage"], inscription = "HUB"): QuoteOverviewItem {
  return {
    quoteSnapshotId: `qts:${inscription}`,
    reference: "OF-ABCDEF01",
    productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
    productLabel: "Litere",
    inscription,
    customerId: "cus:active",
    customerDisplayName: "HUB MEDIA",
    createdAt: "2026-08-17T12:00:00.000Z",
    grossDisplay: "624,82",
    currency: "EUR",
    stage,
    stageLabel: stage === "ORDER_CREATED" ? "Cu comandă" : "Creată",
    nextAction:
      stage === "ORDER_CREATED"
        ? "OPEN_ORDER"
        : stage === "QUOTE_ACCEPTED"
          ? "CREATE_ORDER"
          : "ACCEPT_QUOTE",
    nextActionLabel: "Deschide",
    href:
      stage === "ORDER_CREATED"
        ? "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?order=ord:1"
        : "/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=qts:1",
    needsAttention: stage !== "ORDER_CREATED",
    attentionLabel: null,
    acceptanceId: stage === "QUOTE_CREATED" ? null : "qad:1",
    orderSnapshotId: stage === "ORDER_CREATED" ? "ord:1" : null,
    requestId: null,
    requestReference: null,
  };
}

describe("request overview projection", () => {
  it("keeps request status separate from derived offer progress", () => {
    const item = projectRequestOverviewItem({
      request: request({ status: "READY_FOR_QUOTE" }),
      customerDisplayName: "HUB MEDIA",
      quotes: [quote("QUOTE_ACCEPTED")],
    });
    expect(item.status).toBe("READY_FOR_QUOTE");
    expect(item.statusLabel).toBe("Gata de ofertă");
    expect(item.commercialProgress).toBe("QUOTE_ACCEPTED");
    expect(item.commercialProgressLabel).toBe("Ofertă acceptată");
    expect(item.nextAction).toBe("OPEN_QUOTE");
    expect(item.nextActionLabel).toBe("Deschide oferta");
    expect(item.href).toBe("/requests/crq%3A11111111-2222-3333-4444-555555555555");
    expect(item.nextActionHref).toContain("/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06?quote=");
    expect(item.nextActionHref).not.toContain("/requests/");
    expect(JSON.stringify(item)).not.toMatch(/contentHash|schemaVersion|SENT|draft|Intake/);
  });

  it("derives the furthest linked commercial stage", () => {
    expect(deriveRequestCommercialProgress([])).toBeNull();
    expect(deriveRequestCommercialProgress([quote("QUOTE_CREATED")])).toBe("QUOTE_CREATED");
    expect(
      deriveRequestCommercialProgress([
        quote("QUOTE_CREATED", "A"),
        quote("ORDER_CREATED", "B"),
      ]),
    ).toBe("ORDER_CREATED");
  });

  it("orders useful work first and filters by request status", () => {
    const overview = projectRequestOverview([
      projectRequestOverviewItem({
        request: request({
          requestId: "crq:old",
          status: "CANCELLED",
          createdAt: "2026-08-17T12:00:00.000Z",
        }),
        customerDisplayName: "A",
        quotes: [],
      }),
      projectRequestOverviewItem({
        request: request({
          requestId: "crq:new",
          status: "NEW",
          createdAt: "2026-08-17T11:00:00.000Z",
        }),
        customerDisplayName: "B",
        quotes: [],
      }),
    ]);
    expect(overview.requests.map((item) => item.requestId)).toEqual(["crq:new", "crq:old"]);
    expect(overview.summary.needsAttention).toBe(1);
    expect(filterRequestOverview(overview, "NEW")).toHaveLength(1);
    expect(filterRequestOverview(overview, "CANCELLED")[0]?.requestId).toBe("crq:old");
    expect(filterRequestOverview(overview, "ALL", "CER-11111111")).toHaveLength(2);
    expect(filterRequestOverview(overview, "CANCELLED", "A")[0]?.requestId).toBe("crq:old");
    expect(filterRequestOverview(overview, "NEW", "B")).toHaveLength(1);
    expect(filterRequestOverview(overview, "NEW", "zz-missing")).toHaveLength(0);
  });

  it("projects detail with linked offers and customer lock after a quote", () => {
    const detail = projectRequestDetail({
      request: request({ status: "IN_REVIEW" }),
      customerDisplayName: "HUB MEDIA",
      quotes: [quote("QUOTE_CREATED")],
    });
    expect(detail.canChangeCustomer).toBe(false);
    expect(detail.canUpdateStatus).toBe(true);
    expect(detail.canUploadAttachments).toBe(true);
    expect(detail.attachments).toEqual([]);
    expect(detail.linkedOffers).toHaveLength(1);
    expect(detail.request.description).toContain("fațadă");
    expect(detail.request).not.toHaveProperty("eic");
  });

  it("blocks uploads on cancelled requests while keeping attachment projection", () => {
    const detail = projectRequestDetail({
      request: request({ status: "CANCELLED" }),
      customerDisplayName: "HUB MEDIA",
      quotes: [],
      attachments: [
        {
          attachmentId: "att:1",
          requestId: "crq:11111111-2222-3333-4444-555555555555",
          originalFileName: "brief.pdf",
          mimeType: "application/pdf",
          sizeBytes: 2048,
          storageKey: "abc",
          sha256: "deadbeef",
          createdAt: "2026-08-17T12:00:00.000Z",
        },
      ],
    });
    expect(detail.canUploadAttachments).toBe(false);
    expect(detail.attachments).toHaveLength(1);
    expect(detail.attachments[0]?.sizeLabel).toBe("2.0 KB");
  });
});
