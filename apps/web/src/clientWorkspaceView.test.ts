import { describe, expect, it } from "vitest";
import { emptyCustomerProfile, type CustomerWorkspaceProjection } from "@workos-final/domain";
import {
  customerIdentityLine,
  customerWorkspaceAttentionAction,
  customerWorkspaceHasAttention,
  displayOrUnset,
  sectionFromQuery,
} from "./clientWorkspaceView";

const baseWorkspace: CustomerWorkspaceProjection = {
  customer: {
    customerId: "cus:alpha",
    displayName: "Client Alpha",
    status: "ACTIVE",
    createdAt: "2026-08-17T08:00:00.000Z",
    updatedAt: "2026-08-17T08:00:00.000Z",
    retiredAt: null,
    ...emptyCustomerProfile(),
    cui: "RO111",
    contactName: "Ana",
    city: "București",
  },
  statusLabel: "Activ",
  canCreateRequest: true,
  summary: {
    requestCount: 0,
    openRequestCount: 0,
    requestNeedsAction: 0,
    quoteCount: 0,
    quoteNeedsAction: 0,
    jobCount: 0,
    jobNeedsAction: 0,
  },
  nextActions: [{ label: "Creează o cerere de ofertă", href: "/requests?customer=cus%3Aalpha" }],
  recentActivity: [],
  requests: [],
  quotes: [],
  jobs: [],
};

describe("clientWorkspaceView", () => {
  it("does not treat the create-request fallback as attention", () => {
    expect(customerWorkspaceHasAttention(baseWorkspace.summary)).toBe(false);
    expect(customerWorkspaceAttentionAction(baseWorkspace)).toBeNull();
  });

  it("derives attention only from summary needs-action counts", () => {
    const workspace: CustomerWorkspaceProjection = {
      ...baseWorkspace,
      summary: { ...baseWorkspace.summary, quoteCount: 1, quoteNeedsAction: 1 },
      nextActions: [{ label: "1 ofertă așteaptă acceptarea", href: "/quotes/qts:alpha" }],
    };
    expect(customerWorkspaceHasAttention(workspace.summary)).toBe(true);
    expect(customerWorkspaceAttentionAction(workspace)).toEqual({
      label: "1 ofertă așteaptă acceptarea",
      href: "/quotes/qts:alpha",
    });
  });

  it("keeps identity facts and unset display honest", () => {
    expect(customerIdentityLine(baseWorkspace.customer)).toBe("RO111 · Ana · București");
    expect(displayOrUnset(null)).toBe("Nesetat");
    expect(displayOrUnset("  ")).toBe("Nesetat");
    expect(sectionFromQuery("oferte")).toBe("QUOTES");
    expect(sectionFromQuery(null)).toBe("OVERVIEW");
  });
});
