import type { Customer } from "../customers/identity.js";
import {
  normalizeOptionalScopeIds,
  sameOptionalScopeIds,
} from "../installation/scope.js";

export const COMMERCIAL_REQUEST_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "WAITING_CUSTOMER",
  "READY_FOR_QUOTE",
  "BLOCKED",
  "CANCELLED",
] as const;
export type CommercialRequestStatus = (typeof COMMERCIAL_REQUEST_STATUSES)[number];

export const COMMERCIAL_REQUEST_TITLE_MAX_LENGTH = 120;
export const COMMERCIAL_REQUEST_DESCRIPTION_MAX_LENGTH = 4000;

export type CommercialRequest = {
  requestId: string;
  reference: string;
  customerId: string;
  title: string;
  description: string;
  status: CommercialRequestStatus;
  optionalScopeIds: readonly string[];
  createdAt: string;
  updatedAt: string;
};

export type CommercialRequestQuoteLink = {
  requestId: string;
  quoteSnapshotId: string;
  linkedAt: string;
};

export const COMMERCIAL_REQUEST_MUTATION_ERRORS = [
  "invalid_title",
  "invalid_description",
  "customer_unavailable",
  "customer_locked",
  "invalid_status",
  "not_found",
  "reference_unavailable",
  "unknown_optional_scope",
] as const;
export type CommercialRequestMutationError =
  (typeof COMMERCIAL_REQUEST_MUTATION_ERRORS)[number];

export type CommercialRequestMutationResult =
  | { ok: true; request: CommercialRequest; alreadyApplied: boolean }
  | { ok: false; error: CommercialRequestMutationError };

export const COMMERCIAL_REQUEST_LINK_ERRORS = [
  "not_found",
  "quote_unavailable",
  "quote_already_linked",
  "customer_mismatch",
  "request_cancelled",
] as const;
export type CommercialRequestLinkError = (typeof COMMERCIAL_REQUEST_LINK_ERRORS)[number];

export type CommercialRequestLinkResult =
  | { ok: true; link: CommercialRequestQuoteLink; alreadyApplied: boolean }
  | { ok: false; error: CommercialRequestLinkError };

export function generateCommercialRequestId(): string {
  return `crq:${crypto.randomUUID()}`;
}

export function commercialRequestReference(requestId: string): string {
  const raw = requestId.startsWith("crq:") ? requestId.slice(4) : requestId;
  return `CER-${raw.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function isCommercialRequestStatus(
  value: string,
): value is CommercialRequestStatus {
  return (COMMERCIAL_REQUEST_STATUSES as readonly string[]).includes(value);
}

export function commercialRequestStatusLabel(status: CommercialRequestStatus): string {
  switch (status) {
    case "NEW":
      return "Nouă";
    case "IN_REVIEW":
      return "În lucru";
    case "WAITING_CUSTOMER":
      return "Așteaptă clientul";
    case "READY_FOR_QUOTE":
      return "Gata de ofertă";
    case "BLOCKED":
      return "Blocat";
    case "CANCELLED":
      return "Anulată";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function canChangeCommercialRequestStatus(
  from: CommercialRequestStatus,
  to: CommercialRequestStatus,
): boolean {
  if (from === to) {
    return true;
  }
  if (from === "CANCELLED") {
    return false;
  }
  return isCommercialRequestStatus(to);
}

export function createCommercialRequest(input: {
  customer: Customer;
  title: string;
  description: string;
  requestId?: string;
  createdAt?: string;
}): CommercialRequestMutationResult {
  if (input.customer.status !== "ACTIVE") {
    return { ok: false, error: "customer_unavailable" };
  }
  const title = readTitle(input.title);
  if (!title) {
    return { ok: false, error: "invalid_title" };
  }
  const description = readDescription(input.description);
  if (!description) {
    return { ok: false, error: "invalid_description" };
  }
  const createdAt = input.createdAt ?? new Date().toISOString();
  const requestId = input.requestId ?? generateCommercialRequestId();
  return {
    ok: true,
    alreadyApplied: false,
    request: {
      requestId,
      reference: commercialRequestReference(requestId),
      customerId: input.customer.customerId,
      title,
      description,
      status: "NEW",
      optionalScopeIds: [],
      createdAt,
      updatedAt: createdAt,
    },
  };
}

export function updateCommercialRequest(
  current: CommercialRequest,
  patch: {
    title?: string;
    description?: string;
    status?: CommercialRequestStatus;
    customerId?: string;
    optionalScopeIds?: readonly string[];
  },
  context: {
    hasLinkedQuotes: boolean;
    nextCustomer?: Customer | null;
  },
  updatedAt = new Date().toISOString(),
): CommercialRequestMutationResult {
  let next: CommercialRequest = current;

  if (patch.title !== undefined) {
    const title = readTitle(patch.title);
    if (!title) {
      return { ok: false, error: "invalid_title" };
    }
    next = { ...next, title };
  }

  if (patch.description !== undefined) {
    const description = readDescription(patch.description);
    if (!description) {
      return { ok: false, error: "invalid_description" };
    }
    next = { ...next, description };
  }

  if (patch.status !== undefined) {
    if (!canChangeCommercialRequestStatus(current.status, patch.status)) {
      return { ok: false, error: "invalid_status" };
    }
    next = { ...next, status: patch.status };
  }

  if (patch.customerId !== undefined && patch.customerId !== current.customerId) {
    if (context.hasLinkedQuotes) {
      return { ok: false, error: "customer_locked" };
    }
    if (!context.nextCustomer || context.nextCustomer.status !== "ACTIVE") {
      return { ok: false, error: "customer_unavailable" };
    }
    next = { ...next, customerId: context.nextCustomer.customerId };
  }

  if (patch.optionalScopeIds !== undefined) {
    const normalized = normalizeOptionalScopeIds(patch.optionalScopeIds);
    if (!normalized.ok) {
      return { ok: false, error: "unknown_optional_scope" };
    }
    next = { ...next, optionalScopeIds: normalized.ids };
  }

  if (
    next.title === current.title &&
    next.description === current.description &&
    next.status === current.status &&
    next.customerId === current.customerId &&
    sameOptionalScopeIds(next.optionalScopeIds, current.optionalScopeIds)
  ) {
    return { ok: true, request: current, alreadyApplied: true };
  }

  return {
    ok: true,
    alreadyApplied: false,
    request: { ...next, updatedAt },
  };
}

export function linkCommercialRequestQuote(input: {
  request: CommercialRequest;
  quoteSnapshotId: string;
  quoteCustomerId: string | null | undefined;
  existingLink: CommercialRequestQuoteLink | null;
  linkedAt?: string;
}): CommercialRequestLinkResult {
  if (input.request.status === "CANCELLED") {
    return { ok: false, error: "request_cancelled" };
  }
  if (!input.quoteSnapshotId.trim()) {
    return { ok: false, error: "quote_unavailable" };
  }
  if (!input.quoteCustomerId || input.quoteCustomerId !== input.request.customerId) {
    return { ok: false, error: "customer_mismatch" };
  }
  if (input.existingLink) {
    if (input.existingLink.requestId === input.request.requestId) {
      return { ok: true, link: input.existingLink, alreadyApplied: true };
    }
    return { ok: false, error: "quote_already_linked" };
  }
  return {
    ok: true,
    alreadyApplied: false,
    link: {
      requestId: input.request.requestId,
      quoteSnapshotId: input.quoteSnapshotId,
      linkedAt: input.linkedAt ?? new Date().toISOString(),
    },
  };
}

function readTitle(value: string): string | null {
  const title = value.trim();
  if (title.length === 0 || title.length > COMMERCIAL_REQUEST_TITLE_MAX_LENGTH) {
    return null;
  }
  return title;
}

function readDescription(value: string): string | null {
  const description = value.trim();
  if (
    description.length === 0 ||
    description.length > COMMERCIAL_REQUEST_DESCRIPTION_MAX_LENGTH
  ) {
    return null;
  }
  return description;
}
