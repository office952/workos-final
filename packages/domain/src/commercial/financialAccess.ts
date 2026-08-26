import type { CommercialPriceProjection } from "./price.js";
import type { FrozenCommercialOffer } from "./quoteSnapshot.js";
import type { OrderSnapshot } from "./orderSnapshot.js";
import type { QuoteSnapshot } from "./quoteSnapshot.js";
import type { EicResult } from "../resources/eic.js";
import type { FrozenEicReference } from "../production/snapshot.js";
import type { ExecutionPlanView } from "../execution/plan.js";
import type { ExecutionPlanPreview } from "../execution/preview.js";

export const FINANCIAL_ACCESS_SCOPES = ["owner", "commercial", "workshop"] as const;
export type FinancialAccessScope = (typeof FINANCIAL_ACCESS_SCOPES)[number];

export const FINANCIAL_ENDPOINT_FAMILIES = ["commercial", "workshop"] as const;
export type FinancialEndpointFamily = (typeof FINANCIAL_ENDPOINT_FAMILIES)[number];

export const INTERNAL_FINANCIAL_KEYS = [
  "internalCost",
  "internalCostCurrency",
  "internalCostCompleteness",
  "markupPercent",
  "markupAmount",
  "marginAmount",
  "marginValue",
  "eic",
  "eicTotal",
  "eicCurrency",
  "eicCompleteness",
  "actualInternalCost",
  "internalCostTotal",
  "rate",
  "cost",
  "plannedCost",
  "actualCost",
] as const;

export const CLIENT_PRICE_KEYS = [
  "netPrice",
  "vatPercent",
  "vatAmount",
  "grossPrice",
  "grossDisplay",
] as const;

export type ScopedClientCommercial = {
  netPrice: number | null;
  vatPercent: number;
  vatAmount: number | null;
  grossPrice: number | null;
  currency: "EUR";
  completeness: string;
  unavailableReasons: readonly string[];
  discountPercent: number;
  discountAmount: number | null;
  adjustmentAmount: number | null;
  policyId: string;
  policyVersion: number;
};

export type ScopedOwnerCommercial = ScopedClientCommercial & {
  internalCost: number;
  internalCostCurrency: string;
  internalCostCompleteness: string;
  markupPercent: number;
  markupAmount: number | null;
  marginAmount: number | null;
};

export function resolveFinancialAccess(input: {
  family: FinancialEndpointFamily;
  isOwner: boolean;
}): FinancialAccessScope {
  if (input.family === "workshop") {
    return "workshop";
  }
  return input.isOwner ? "owner" : "commercial";
}

export function scopeCommercialPrice(
  price: CommercialPriceProjection,
  access: FinancialAccessScope,
): ScopedOwnerCommercial | ScopedClientCommercial | undefined {
  if (access === "workshop") {
    return undefined;
  }
  const client: ScopedClientCommercial = {
    netPrice: price.netPrice,
    vatPercent: price.vatPercent,
    vatAmount: price.vatAmount,
    grossPrice: price.grossPrice,
    currency: price.currency,
    completeness: price.completeness,
    unavailableReasons: price.unavailableReasons,
    discountPercent: price.discountPercent,
    discountAmount: price.discountAmount,
    adjustmentAmount: price.adjustmentAmount,
    policyId: price.policyId,
    policyVersion: price.policyVersion,
  };
  if (access === "commercial") {
    return client;
  }
  const marginAmount =
    price.netPrice === null ? null : roundMoney(price.netPrice - price.internalCost);
  return {
    ...client,
    internalCost: price.internalCost,
    internalCostCurrency: price.internalCostCurrency,
    internalCostCompleteness: price.internalCostCompleteness,
    markupPercent: price.markupPercent,
    markupAmount: price.markupAmount,
    marginAmount,
  };
}

export function scopeFrozenCommercial(
  offer: FrozenCommercialOffer,
  access: FinancialAccessScope,
  internalCost?: number,
): ScopedOwnerCommercial | ScopedClientCommercial | undefined {
  if (access === "workshop") {
    return undefined;
  }
  const client: ScopedClientCommercial = {
    netPrice: offer.netPrice,
    vatPercent: offer.vatPercent,
    vatAmount: offer.vatAmount,
    grossPrice: offer.grossPrice,
    currency: offer.currency,
    completeness: offer.completeness,
    unavailableReasons: [],
    discountPercent: offer.discountPercent,
    discountAmount: offer.discountAmount,
    adjustmentAmount: offer.adjustmentAmount,
    policyId: offer.policyId,
    policyVersion: offer.policyVersion,
  };
  if (access === "commercial") {
    return client;
  }
  const cost = internalCost ?? null;
  return {
    ...client,
    internalCost: cost ?? 0,
    internalCostCurrency: "EUR",
    internalCostCompleteness: "COMPLETE",
    markupPercent: offer.markupPercent,
    markupAmount: offer.markupAmount,
    marginAmount: cost === null ? null : roundMoney(offer.netPrice - cost),
  };
}

export function scopeEic(
  eic: EicResult | FrozenEicReference,
  access: FinancialAccessScope,
): EicResult | FrozenEicReference | undefined {
  if (access !== "owner") {
    return undefined;
  }
  return eic;
}

export function omitForbiddenFinancialFields(
  value: unknown,
  access: FinancialAccessScope,
): unknown {
  if (access === "owner") {
    return value;
  }
  const forbidden = new Set<string>(
    access === "workshop"
      ? [...INTERNAL_FINANCIAL_KEYS, ...CLIENT_PRICE_KEYS]
      : INTERNAL_FINANCIAL_KEYS,
  );
  return omitKeysDeep(value, forbidden);
}

export function scopeQuoteSnapshot(
  snapshot: QuoteSnapshot,
  access: FinancialAccessScope,
): Record<string, unknown> {
  const commercial = snapshot.commercial
    ? scopeFrozenCommercial(snapshot.commercial, access, snapshot.eic?.total)
    : undefined;
  const eic = snapshot.eic ? scopeEic(snapshot.eic, access) : undefined;
  const scoped: Record<string, unknown> = {
    quoteSnapshotId: snapshot.quoteSnapshotId,
    schemaVersion: snapshot.schemaVersion,
    status: snapshot.status,
    createdAt: snapshot.createdAt,
    productCode: snapshot.productCode,
    productLabel: snapshot.productLabel,
    inscription: snapshot.inscription,
    sourceReviewId: snapshot.sourceReviewId,
    contentHash: snapshot.contentHash,
    truth: snapshot.truth,
    quantities: snapshot.quantities,
    productionInput: snapshot.productionInput,
    customer: snapshot.customer,
    seller: snapshot.seller,
  };
  if (commercial) {
    scoped.commercial = commercial;
  }
  if (eic) {
    scoped.eic = eic;
  }
  return omitForbiddenFinancialFields(scoped, access) as Record<string, unknown>;
}

export function scopeOrderSnapshot(
  snapshot: OrderSnapshot,
  access: FinancialAccessScope,
): Record<string, unknown> {
  const commercial = snapshot.commercial
    ? scopeFrozenCommercial(snapshot.commercial, access, snapshot.eic?.total)
    : undefined;
  const eic = snapshot.eic ? scopeEic(snapshot.eic, access) : undefined;
  const scoped: Record<string, unknown> = {
    orderSnapshotId: snapshot.orderSnapshotId,
    schemaVersion: snapshot.schemaVersion,
    status: snapshot.status,
    createdAt: snapshot.createdAt,
    sourceQuoteSnapshotId: snapshot.sourceQuoteSnapshotId,
    sourceQuoteContentHash: snapshot.sourceQuoteContentHash,
    sourceAcceptanceId: snapshot.sourceAcceptanceId,
    sourceAcceptedAt: snapshot.sourceAcceptedAt,
    productCode: snapshot.productCode,
    productLabel: snapshot.productLabel,
    inscription: snapshot.inscription,
    sourceReviewId: snapshot.sourceReviewId,
    contentHash: snapshot.contentHash,
    truth: snapshot.truth,
    quantities: snapshot.quantities,
    productionInput: snapshot.productionInput,
    customer: snapshot.customer,
    seller: snapshot.seller,
  };
  if (commercial) {
    scoped.commercial = commercial;
  }
  if (eic) {
    scoped.eic = eic;
  }
  return omitForbiddenFinancialFields(scoped, access) as Record<string, unknown>;
}

export function scopeExecutionPlanPreview(
  preview: ExecutionPlanPreview,
  access: FinancialAccessScope,
): Record<string, unknown> {
  if (access === "owner") {
    return { ...preview };
  }
  const {
    internalCostTotal: _cost,
    internalCostCurrency: _currency,
    internalCostCompleteness: _complete,
    ...summary
  } = preview.summary;
  return omitForbiddenFinancialFields({ ...preview, summary }, access) as Record<string, unknown>;
}

export function scopeExecutionPlanView(
  view: ExecutionPlanView,
  access: FinancialAccessScope,
): Record<string, unknown> {
  const plan = { ...view.plan };
  const scoped: Record<string, unknown> = {
    plan: plan,
    progress: view.progress,
    progressStatus: view.progressStatus,
    statusLabel: view.statusLabel,
    sourceKind: view.sourceKind,
    sourceKindLabel: view.sourceKindLabel,
    tasks: view.tasks,
  };
  if (access === "owner") {
    scoped.actualInternalCost = view.actualInternalCost;
    return scoped;
  }
  delete (scoped.plan as { eicTotal?: number }).eicTotal;
  delete (scoped.plan as { eicCurrency?: string }).eicCurrency;
  delete (scoped.plan as { eicCompleteness?: string }).eicCompleteness;
  return omitForbiddenFinancialFields(scoped, access) as Record<string, unknown>;
}

export function collectFinancialKeys(value: unknown, found = new Set<string>()): Set<string> {
  if (value === null || value === undefined) {
    return found;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFinancialKeys(item, found);
    }
    return found;
  }
  if (typeof value !== "object") {
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    if (
      (INTERNAL_FINANCIAL_KEYS as readonly string[]).includes(key) ||
      (CLIENT_PRICE_KEYS as readonly string[]).includes(key)
    ) {
      found.add(key);
    }
    collectFinancialKeys(child, found);
  }
  return found;
}

function omitKeysDeep(value: unknown, forbidden: Set<string>): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => omitKeysDeep(item, forbidden));
  }
  if (typeof value !== "object") {
    return value;
  }
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (forbidden.has(key)) {
      continue;
    }
    next[key] = omitKeysDeep(child, forbidden);
  }
  return next;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
