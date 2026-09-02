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
import type { CostEvidence } from "../resources/catalog.js";
import type { CommercialPriceProjection } from "./price.js";
import { projectLiveJobCommercial } from "./servicePrice.js";

export const QUOTE_SNAPSHOT_SCHEMA_VERSION = 1 as const;
export const QUOTE_SNAPSHOT_SCHEMA_VERSION_V2 = 2 as const;
export type QuoteSnapshotSchemaVersion =
  | typeof QUOTE_SNAPSHOT_SCHEMA_VERSION
  | typeof QUOTE_SNAPSHOT_SCHEMA_VERSION_V2;
export const QUOTE_SNAPSHOT_STATUSES = ["FROZEN"] as const;
export type QuoteSnapshotStatus = (typeof QUOTE_SNAPSHOT_STATUSES)[number];
export const FROZEN_QUOTE_LINE_KINDS = ["PRODUCT", "SITE_INSTALLATION"] as const;
export type FrozenQuoteLineKind = (typeof FROZEN_QUOTE_LINE_KINDS)[number];

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

export type FrozenQuoteLine = {
  kind: FrozenQuoteLineKind;
  label: string;
  eic: FrozenEicReference;
  commercial: FrozenCommercialOffer;
};

export type FrozenJobCommercial = {
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  currency: "EUR";
  completeness: "COMPLETE";
};

export type QuoteSnapshot = {
  quoteSnapshotId: string;
  schemaVersion: QuoteSnapshotSchemaVersion;
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
  lines?: readonly FrozenQuoteLine[];
  jobCommercial?: FrozenJobCommercial;
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
    costEvidenceRows?: readonly CostEvidence[];
    installation?: {
      label: string;
      eic: EicResult;
      commercial: CommercialPriceProjection;
    };
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

  const installation = options?.installation;
  if (installation) {
    if (
      installation.eic.completeness !== "COMPLETE" ||
      installation.commercial.completeness !== "COMPLETE"
    ) {
      return {
        ok: false,
        error: "incomplete_offer",
        reasons: [INCOMPLETE_REASON],
      };
    }
    if (
      installation.eic.currency !== "EUR" ||
      installation.commercial.currency !== "EUR" ||
      installation.commercial.markupAmount === null ||
      installation.commercial.discountAmount === null ||
      installation.commercial.adjustmentAmount === null ||
      installation.commercial.netPrice === null ||
      installation.commercial.vatAmount === null ||
      installation.commercial.grossPrice === null
    ) {
      return {
        ok: false,
        error: "unavailable_offer",
        reasons: [UNAVAILABLE_REASON],
      };
    }
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

  const frozenProductCommercial = {
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
  };
  const frozenProductEic = freezeEic(eic);
  const v2Fields = installation
    ? freezeJobQuoteFields({
        productLabel: aggregate.productLabel,
        productEic: frozenProductEic,
        productCommercial: frozenProductCommercial,
        installation,
      })
    : null;
  const hashedContent = {
    schemaVersion: v2Fields
      ? QUOTE_SNAPSHOT_SCHEMA_VERSION_V2
      : QUOTE_SNAPSHOT_SCHEMA_VERSION,
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
    eic: frozenProductEic,
    productionInput: freezeProductionInput(aggregate, composition, {
      costEvidenceRows: options?.costEvidenceRows,
    }),
    commercial: frozenProductCommercial,
    ...(v2Fields ?? {}),
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

export function isSupportedQuoteSnapshot(snapshot: QuoteSnapshot): boolean {
  if (snapshot.status !== "FROZEN") {
    return false;
  }
  if (snapshot.schemaVersion === QUOTE_SNAPSHOT_SCHEMA_VERSION) {
    return snapshot.lines === undefined && snapshot.jobCommercial === undefined;
  }
  if (snapshot.schemaVersion === QUOTE_SNAPSHOT_SCHEMA_VERSION_V2) {
    return (
      (snapshot.lines?.length ?? 0) >= 2 &&
      snapshot.jobCommercial?.completeness === "COMPLETE" &&
      snapshot.jobCommercial.currency === "EUR"
    );
  }
  return false;
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

function freezeJobQuoteFields(input: {
  productLabel: string;
  productEic: FrozenEicReference;
  productCommercial: FrozenCommercialOffer;
  installation: {
    label: string;
    eic: EicResult;
    commercial: CommercialPriceProjection;
  };
}): {
  lines: readonly FrozenQuoteLine[];
  jobCommercial: FrozenJobCommercial;
} {
  const installCommercial = input.installation.commercial;
  const installLineCommercial: FrozenCommercialOffer = {
    policyId: installCommercial.policyId,
    policyVersion: installCommercial.policyVersion,
    markupPercent: installCommercial.markupPercent,
    markupAmount: installCommercial.markupAmount ?? 0,
    discountPercent: installCommercial.discountPercent,
    discountAmount: installCommercial.discountAmount ?? 0,
    adjustmentAmount: installCommercial.adjustmentAmount ?? 0,
    netPrice: installCommercial.netPrice ?? 0,
    vatPercent: installCommercial.vatPercent,
    vatAmount: installCommercial.vatAmount ?? 0,
    grossPrice: installCommercial.grossPrice ?? 0,
    currency: "EUR",
    completeness: "COMPLETE",
  };
  return {
    lines: [
      {
        kind: "PRODUCT",
        label: input.productLabel,
        eic: input.productEic,
        commercial: input.productCommercial,
      },
      {
        kind: "SITE_INSTALLATION",
        label: input.installation.label,
        eic: freezeEic(input.installation.eic),
        commercial: installLineCommercial,
      },
    ],
    jobCommercial: projectLiveJobCommercial(input.productCommercial, installLineCommercial) ?? {
      netPrice: input.productCommercial.netPrice + installLineCommercial.netPrice,
      vatAmount: input.productCommercial.vatAmount + installLineCommercial.vatAmount,
      grossPrice: input.productCommercial.grossPrice + installLineCommercial.grossPrice,
      currency: "EUR",
      completeness: "COMPLETE",
    },
  };
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
