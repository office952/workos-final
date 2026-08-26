import { describe, expect, it } from "vitest";
import {
  collectFinancialKeys,
  resolveFinancialAccess,
  scopeCommercialPrice,
  scopeExecutionPlanView,
  scopeQuoteSnapshot,
} from "./financialAccess.js";
import { projectCommercialPrice } from "./price.js";
import type { QuoteSnapshot } from "./quoteSnapshot.js";

const price = projectCommercialPrice({
  total: 382.5,
  currency: "EUR",
  completeness: "COMPLETE",
});

describe("financial access", () => {
  it("scopes by endpoint family, not only membership role", () => {
    expect(resolveFinancialAccess({ family: "workshop", isOwner: true })).toBe("workshop");
    expect(resolveFinancialAccess({ family: "workshop", isOwner: false })).toBe("workshop");
    expect(resolveFinancialAccess({ family: "commercial", isOwner: true })).toBe("owner");
    expect(resolveFinancialAccess({ family: "commercial", isOwner: false })).toBe("commercial");
  });

  it("gives owner internal cost, markup and margin", () => {
    const scoped = scopeCommercialPrice(price, "owner");
    expect(scoped).toMatchObject({
      internalCost: 382.5,
      markupPercent: 35,
      netPrice: 516.38,
      vatPercent: 21,
      grossPrice: 624.82,
    });
    expect(scoped && "marginAmount" in scoped ? scoped.marginAmount : null).toBe(133.88);
  });

  it("omits owner-only fields for member commercial", () => {
    const scoped = scopeCommercialPrice(price, "commercial");
    const keys = collectFinancialKeys(scoped);
    expect(keys.has("netPrice")).toBe(true);
    expect(keys.has("vatPercent")).toBe(true);
    expect(keys.has("grossPrice")).toBe(true);
    expect(keys.has("internalCost")).toBe(false);
    expect(keys.has("markupPercent")).toBe(false);
    expect(keys.has("marginAmount")).toBe(false);
    expect(scoped && "internalCost" in scoped).toBe(false);
  });

  it("returns no commercial payload for workshop", () => {
    expect(scopeCommercialPrice(price, "workshop")).toBeUndefined();
  });

  it("scopes an incomplete stored quote without throwing", () => {
    const scoped = scopeQuoteSnapshot(
      {
        quoteSnapshotId: "qts:incomplete",
        schemaVersion: 1,
        status: "FROZEN",
        createdAt: "2026-01-01T00:00:00.000Z",
        productCode: "PRD",
        productLabel: "Letters",
        inscription: "TEST",
        sourceReviewId: "rev:1",
        contentHash: "hash",
        customer: { customerId: "cus:1", displayName: "Client" },
        seller: { legalName: "Seller" },
      } as QuoteSnapshot,
      "owner",
    );
    expect(scoped.quoteSnapshotId).toBe("qts:incomplete");
    expect(scoped.eic).toBeUndefined();
    expect(scoped.commercial).toBeUndefined();
  });

  it("strips recipe rate and cost from member quote snapshots", () => {
    const scoped = scopeQuoteSnapshot(
      {
        quoteSnapshotId: "qts:recipes",
        schemaVersion: 1,
        status: "FROZEN",
        createdAt: "2026-01-01T00:00:00.000Z",
        productCode: "PRD",
        productLabel: "Letters",
        inscription: "TEST",
        sourceReviewId: "rev:1",
        contentHash: "hash",
        customer: { customerId: "cus:1", displayName: "Client" },
        seller: { legalName: "Seller" },
        productionInput: {
          schemaVersion: 1,
          requirements: [],
          operations: [],
          usedTechnicalSettings: [],
          usedRecipes: [
            {
              recipeId: "rec:1",
              processId: "proc:1",
              scope: "volume",
              costEvidenceId: "ev:1",
              resourceId: "res:1",
              resourceLabel: "Aluminiu",
              quantity: 12.4,
              unit: "m",
              rate: 3,
              currency: "EUR",
              cost: 37.2,
            },
          ],
          contentHash: "input",
        },
        commercial: {
          netPrice: 516.38,
          vatPercent: 21,
          vatAmount: 108.44,
          grossPrice: 624.82,
          currency: "EUR",
          completeness: "COMPLETE",
          discountPercent: 0,
          discountAmount: 0,
          adjustmentAmount: 0,
          policyId: "policy",
          policyVersion: 1,
          markupPercent: 35,
          markupAmount: 133.88,
        },
      } as unknown as QuoteSnapshot,
      "commercial",
    );
    const keys = collectFinancialKeys(scoped);
    expect(keys.has("grossPrice")).toBe(true);
    expect(keys.has("rate")).toBe(false);
    expect(keys.has("cost")).toBe(false);
    expect(JSON.stringify(scoped)).not.toContain("\"rate\"");
    expect(JSON.stringify(scoped)).not.toContain("\"cost\":");
  });

  it("strips execution money outside owner", () => {
    const view = {
      plan: {
        planId: "exp:1",
        sourceSnapshotId: "aps:1",
        sourceSnapshotHash: "h",
        productCode: "PRD",
        productLabel: "Litere",
        inscription: "TEST",
        createdAt: "2026-01-01T00:00:00.000Z",
        status: "PLANNED" as const,
        taskCount: 1,
        schemaVersion: 1 as const,
        eicTotal: 382.5,
        eicCurrency: "EUR" as const,
        eicCompleteness: "COMPLETE" as const,
      },
      progress: {
        total: 1,
        completed: 0,
        inProgress: 0,
        planned: 1,
        waitingDependencies: 0,
        noProvider: 0,
        noExecutor: 0,
        varianceCount: 0,
        status: "PLANNED" as const,
      },
      progressStatus: "PLANNED" as const,
      statusLabel: "Planificat",
      sourceKind: "ORDER" as const,
      sourceKindLabel: "Comandă",
      jobHref: "/jobs/ord%3A1",
      tasks: [],
      actualInternalCost: {
        status: "UNAVAILABLE" as const,
        statusLabel: "Indisponibil",
        currency: "EUR" as const,
        calculableTotal: null,
        plannedComparableTotal: null,
        availableDifference: null,
        lines: [],
        calculableCount: 0,
        unavailableCount: 0,
      },
    };
    const workshop = scopeExecutionPlanView(view, "workshop");
    const keys = collectFinancialKeys(workshop);
    expect(keys.has("eicTotal")).toBe(false);
    expect(keys.has("actualInternalCost")).toBe(false);
    expect(workshop.actualInternalCost).toBeUndefined();
    expect((workshop.plan as { eicTotal?: number }).eicTotal).toBeUndefined();
  });
});
