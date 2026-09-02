import { describe, expect, it } from "vitest";
import type { RequestOverviewItem, RequestOverviewProjection } from "@workos-final/domain";
import {
  applyRequestsAttentionFilter,
  requestRowMeta,
  requestsResultCountLabel,
  visibleRequests,
} from "./requestsRegistryView";

function item(overrides: Partial<RequestOverviewItem> = {}): RequestOverviewItem {
  return {
    requestId: "crq:1",
    reference: "CER-11111111",
    customerId: "cus:1",
    customerDisplayName: "Hotel Vest",
    title: "Litere fațadă",
    createdAt: "2026-08-17T10:00:00.000Z",
    status: "READY_FOR_QUOTE",
    statusLabel: "Gata de ofertă",
    commercialProgress: null,
    commercialProgressLabel: null,
    nextAction: "CHOOSE_PRODUCT",
    nextActionLabel: "Alege produs",
    href: "/requests/crq:1",
    nextActionHref: "/products?request=crq%3A1",
    needsAttention: true,
    attentionLabel: "Urmează oferta",
    linkedQuoteCount: 0,
    ...overrides,
  };
}

const overview: RequestOverviewProjection = {
  summary: {
    total: 2,
    needsAttention: 1,
    newCount: 0,
    inReview: 1,
    waitingCustomer: 0,
    readyForQuote: 1,
    blocked: 0,
  },
  requests: [
    item(),
    item({
      requestId: "crq:2",
      title: "Panou ACM",
      status: "IN_REVIEW",
      statusLabel: "În lucru",
      needsAttention: false,
      attentionLabel: null,
    }),
  ],
};

describe("requestsRegistryView", () => {
  it("filters attention independently of status", () => {
    expect(applyRequestsAttentionFilter(overview.requests, true)).toHaveLength(1);
    expect(visibleRequests(overview, "ALL", "", true).map((row) => row.requestId)).toEqual(["crq:1"]);
    expect(visibleRequests(overview, "IN_REVIEW", "", false)).toHaveLength(1);
  });

  it("counts and names rows without inventing client identity", () => {
    expect(requestsResultCountLabel(1)).toBe("1 cerere");
    expect(requestsResultCountLabel(2)).toBe("2 cereri");
    expect(requestRowMeta(item())).toBe("CER-11111111 · Hotel Vest");
    expect(requestRowMeta(item({ customerDisplayName: null }))).toBe("CER-11111111");
  });
});
