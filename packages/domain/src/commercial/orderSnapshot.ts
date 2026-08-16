import { sha256Hex } from "../production/digest.js";
import type { FrozenEicReference, FrozenQuantity } from "../production/snapshot.js";
import {
  QUOTE_ACCEPTANCE_SCHEMA_VERSION,
  type QuoteAcceptanceDecision,
} from "./quoteAcceptance.js";
import {
  QUOTE_SNAPSHOT_SCHEMA_VERSION,
  type FrozenCommercialOffer,
  type QuoteSnapshot,
} from "./quoteSnapshot.js";

export const ORDER_SNAPSHOT_SCHEMA_VERSION = 1 as const;
export const ORDER_SNAPSHOT_STATUSES = ["FROZEN"] as const;
export type OrderSnapshotStatus = (typeof ORDER_SNAPSHOT_STATUSES)[number];

export const ORDER_SNAPSHOT_ERRORS = [
  "quote_not_accepted",
  "acceptance_mismatch",
  "incompatible_order_source",
] as const;
export type OrderSnapshotError = (typeof ORDER_SNAPSHOT_ERRORS)[number];

export type OrderSnapshot = {
  orderSnapshotId: string;
  schemaVersion: typeof ORDER_SNAPSHOT_SCHEMA_VERSION;
  status: OrderSnapshotStatus;
  createdAt: string;
  sourceQuoteSnapshotId: string;
  sourceQuoteContentHash: string;
  sourceAcceptanceId: string;
  sourceAcceptedAt: string;
  productCode: string;
  productLabel: string;
  inscription: string;
  sourceReviewId: string;
  contentHash: string;
  truth: QuoteSnapshot["truth"];
  quantities: readonly FrozenQuantity[];
  eic: FrozenEicReference;
  commercial: FrozenCommercialOffer;
};

export type OrderSnapshotResult =
  | { ok: true; snapshot: OrderSnapshot }
  | { ok: false; error: OrderSnapshotError; reasons: readonly string[] };

const NOT_ACCEPTED_REASON = "Comanda poate fi creată doar dintr-o ofertă acceptată.";
const MISMATCH_REASON = "Decizia de acceptare nu corespunde ofertei înghețate.";
const INCOMPATIBLE_REASON = "Oferta acceptată nu poate fi transformată în comandă.";

export function freezeOrderSnapshot(
  quote: QuoteSnapshot,
  acceptance: QuoteAcceptanceDecision,
  options?: { createdAt?: string },
): OrderSnapshotResult {
  if (
    quote.schemaVersion !== QUOTE_SNAPSHOT_SCHEMA_VERSION ||
    quote.status !== "FROZEN" ||
    quote.quoteSnapshotId.trim() === "" ||
    quote.contentHash.trim() === "" ||
    quote.eic.completeness !== "COMPLETE" ||
    quote.commercial.completeness !== "COMPLETE"
  ) {
    return {
      ok: false,
      error: "incompatible_order_source",
      reasons: [INCOMPATIBLE_REASON],
    };
  }
  if (
    acceptance.schemaVersion !== QUOTE_ACCEPTANCE_SCHEMA_VERSION ||
    acceptance.acceptanceId.trim() === "" ||
    acceptance.quoteSnapshotId !== quote.quoteSnapshotId
  ) {
    return {
      ok: false,
      error: "quote_not_accepted",
      reasons: [NOT_ACCEPTED_REASON],
    };
  }
  if (acceptance.quoteContentHash !== quote.contentHash) {
    return {
      ok: false,
      error: "acceptance_mismatch",
      reasons: [MISMATCH_REASON],
    };
  }

  const hashedContent = {
    schemaVersion: ORDER_SNAPSHOT_SCHEMA_VERSION,
    status: "FROZEN" as const,
    sourceQuoteSnapshotId: quote.quoteSnapshotId,
    sourceQuoteContentHash: quote.contentHash,
    sourceAcceptanceId: acceptance.acceptanceId,
    sourceAcceptedAt: acceptance.acceptedAt,
    productCode: quote.productCode,
    productLabel: quote.productLabel,
    inscription: quote.inscription,
    sourceReviewId: quote.sourceReviewId,
    truth: {
      templateCode: quote.truth.templateCode,
      templateVersion: quote.truth.templateVersion,
      familyId: quote.truth.familyId,
      selectedComponentIds: [...quote.truth.selectedComponentIds],
      values: { ...quote.truth.values },
      measurements: quote.truth.measurements.map((item) => ({ ...item })),
    },
    quantities: quote.quantities.map((item) => ({ ...item })),
    eic: {
      total: quote.eic.total,
      currency: quote.eic.currency,
      completeness: quote.eic.completeness,
      lines: quote.eic.lines.map((line) => ({ ...line })),
    },
    commercial: { ...quote.commercial },
  };
  const contentHash = sha256Hex(stableStringify(hashedContent));
  return {
    ok: true,
    snapshot: deepFreeze({
      orderSnapshotId: `ord:${acceptance.acceptanceId}:${contentHash}`,
      ...hashedContent,
      createdAt: options?.createdAt ?? new Date().toISOString(),
      contentHash,
    }),
  };
}

export function orderSnapshotErrorLabel(error: OrderSnapshotError): string {
  switch (error) {
    case "quote_not_accepted":
      return NOT_ACCEPTED_REASON;
    case "acceptance_mismatch":
      return MISMATCH_REASON;
    case "incompatible_order_source":
      return INCOMPATIBLE_REASON;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
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
