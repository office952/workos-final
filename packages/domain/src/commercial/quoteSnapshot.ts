import type { ProductProcessComposition } from "../processes/composition.js";
import { sha256Hex } from "../production/digest.js";
import {
  freezeProductionInput,
  type FrozenEicReference,
  type FrozenProductionInput,
  type FrozenQuantity,
} from "../production/snapshot.js";
import {
  freezeCustomerIdentity,
  type FrozenCustomerIdentity,
} from "../customers/identity.js";
import {
  freezeSellerIdentity,
  type FrozenSellerIdentity,
} from "../seller/identity.js";

export type { FrozenCustomerIdentity, FrozenSellerIdentity };
import type { ProductAggregate, ProductTruth } from "../product/types.js";
import type { EicResult } from "../resources/eic.js";
import type { CommercialPriceProjection } from "./price.js";

export const QUOTE_SNAPSHOT_SCHEMA_VERSION = 1 as const;
export const QUOTE_SNAPSHOT_STATUSES = ["FROZEN"] as const;
export type QuoteSnapshotStatus = (typeof QUOTE_SNAPSHOT_STATUSES)[number];

export const QUOTE_SNAPSHOT_ERRORS = [
  "incomplete_offer",
  "unavailable_offer",
  "invalid_customer",
  "invalid_seller",
] as const;
export type QuoteSnapshotError = (typeof QUOTE_SNAPSHOT_ERRORS)[number];

export type FrozenCommercialOffer = {
  policyId: string;
  policyVersion: number;
  markupPercent: number;
  markupAmount: number;
  discountPercent: number;
  discountAmount: number;
  adjustmentAmount: number;
  netPrice: number;
  vatPercent: number;
  vatAmount: number;
  grossPrice: number;
  currency: "EUR";
  completeness: "COMPLETE";
};

export type QuoteSnapshot = {
  quoteSnapshotId: string;
  schemaVersion: typeof QUOTE_SNAPSHOT_SCHEMA_VERSION;
  status: QuoteSnapshotStatus;
  productCode: string;
  productLabel: string;
  inscription: string;
  sourceReviewId: string;
  sourceConfirmedAt: string;
  createdAt: string;
  contentHash: string;
  truth: {
    templateCode: string;
    templateVersion: string;
    familyId: string;
    selectedComponentIds: readonly string[];
    values: ProductTruth["values"];
    measurements: ProductTruth["measurements"];
  };
  quantities: readonly FrozenQuantity[];
  eic: FrozenEicReference;
  commercial: FrozenCommercialOffer;
  productionInput: FrozenProductionInput;
  customer?: FrozenCustomerIdentity;
  seller?: FrozenSellerIdentity;
};

export type QuoteSnapshotResult =
  | { ok: true; snapshot: QuoteSnapshot }
  | { ok: false; error: QuoteSnapshotError; reasons: readonly string[] };

const INCOMPLETE_REASON =
  "Oferta nu poate fi înghețată până când costul intern și prețul client nu sunt complete.";
const UNAVAILABLE_REASON = "Prețul client nu este disponibil pentru înghețare.";
const INVALID_CUSTOMER_REASON = "Identitatea clientului nu este validă pentru înghețare.";
const INVALID_SELLER_REASON = "Identitatea vânzătorului nu este validă pentru înghețare.";

export function freezeQuoteSnapshot(
  truth: ProductTruth,
  aggregate: ProductAggregate,
  composition: ProductProcessComposition,
  eic: EicResult,
  commercial: CommercialPriceProjection,
  options?: {
    createdAt?: string;
    customer?: FrozenCustomerIdentity;
    seller?: FrozenSellerIdentity;
  },
): QuoteSnapshotResult {
  if (eic.completeness !== "COMPLETE" || commercial.completeness !== "COMPLETE") {
    return {
      ok: false,
      error: "incomplete_offer",
      reasons: [INCOMPLETE_REASON],
    };
  }
  if (
    eic.currency !== "EUR" ||
    commercial.currency !== "EUR" ||
    commercial.markupAmount === null ||
    commercial.discountAmount === null ||
    commercial.adjustmentAmount === null ||
    commercial.netPrice === null ||
    commercial.vatAmount === null ||
    commercial.grossPrice === null
  ) {
    return {
      ok: false,
      error: "unavailable_offer",
      reasons: [UNAVAILABLE_REASON],
    };
  }

  const customer = options?.customer
    ? freezeCustomerIdentity(options.customer)
    : undefined;
  if (customer === null) {
    return {
      ok: false,
      error: "invalid_customer",
      reasons: [INVALID_CUSTOMER_REASON],
    };
  }
  const seller = options?.seller ? freezeSellerIdentity(options.seller) : undefined;
  if (seller === null) {
    return {
      ok: false,
      error: "invalid_seller",
      reasons: [INVALID_SELLER_REASON],
    };
  }

  const hashedContent = {
    schemaVersion: QUOTE_SNAPSHOT_SCHEMA_VERSION,
    status: "FROZEN" as const,
    productCode: truth.templateCode,
    productLabel: aggregate.productLabel,
    inscription: aggregate.inscription,
    sourceReviewId: truth.reviewId,
    truth: {
      templateCode: truth.templateCode,
      templateVersion: truth.templateVersion,
      familyId: truth.familyId,
      selectedComponentIds: [...truth.selectedComponentIds],
      values: { ...truth.values },
      measurements: truth.measurements.map((item) => ({ ...item })),
    },
    quantities: freezeQuantities(aggregate),
    eic: freezeEic(eic),
    productionInput: freezeProductionInput(aggregate, composition),
    commercial: {
      policyId: commercial.policyId,
      policyVersion: commercial.policyVersion,
      markupPercent: commercial.markupPercent,
      markupAmount: commercial.markupAmount,
      discountPercent: commercial.discountPercent,
      discountAmount: commercial.discountAmount,
      adjustmentAmount: commercial.adjustmentAmount,
      netPrice: commercial.netPrice,
      vatPercent: commercial.vatPercent,
      vatAmount: commercial.vatAmount,
      grossPrice: commercial.grossPrice,
      currency: "EUR" as const,
      completeness: "COMPLETE" as const,
    },
    ...(customer ? { customer } : {}),
    ...(seller ? { seller } : {}),
  };
  const contentHash = sha256Hex(stableStringify(hashedContent));
  return {
    ok: true,
    snapshot: deepFreeze({
      quoteSnapshotId: `qts:${truth.templateCode}:${contentHash}`,
      ...hashedContent,
      sourceConfirmedAt: truth.confirmedAt,
      createdAt: options?.createdAt ?? new Date().toISOString(),
      contentHash,
    }),
  };
}

export function quoteSnapshotErrorLabel(error: QuoteSnapshotError): string {
  switch (error) {
    case "incomplete_offer":
      return INCOMPLETE_REASON;
    case "unavailable_offer":
      return UNAVAILABLE_REASON;
    case "invalid_customer":
      return INVALID_CUSTOMER_REASON;
    case "invalid_seller":
      return INVALID_SELLER_REASON;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}

function freezeQuantities(aggregate: ProductAggregate): FrozenQuantity[] {
  return aggregate.quantities.map((item) => ({
    id: item.id,
    componentId: item.componentId,
    label: item.label,
    value: item.value,
    unit: item.unit,
  }));
}

function freezeEic(eic: EicResult): FrozenEicReference {
  return {
    total: eic.total,
    currency: eic.currency,
    completeness: eic.completeness,
    lines: eic.lines.map((line) => ({
      resourceId: line.resourceId,
      label: line.label,
      quantity: line.quantity,
      unit: line.unit,
      rate: line.rate,
      currency: line.currency,
      cost: line.cost,
    })),
  };
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
  }
  return value;
}
