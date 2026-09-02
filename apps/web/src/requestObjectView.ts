import {
  jobHref,
  operationalServiceProviderModeLabel,
  type RequestDetailProjection,
  type SiteInstallationIncompleteReason,
} from "@workos-final/domain";
import { formatRequestDate } from "./requestsRegistryView";

export type RequestRelatedItem = {
  key: string;
  kind: "quote" | "job";
  title: string;
  meta: string;
  href: string;
};

export type RequestObjectPrimaryAction =
  | { kind: "href"; label: string; href: string }
  | { kind: "focus"; label: string; targetId: string };

export function requestCatalogHref(requestId: string): string {
  return `/products?request=${encodeURIComponent(requestId)}`;
}

export function requestEditareValue(detail: RequestDetailProjection): string {
  return detail.installationOffer.selectionLocked
    ? "Blocată după ofertă"
    : "Disponibilă — fără ofertă";
}

export function requestMontajValue(detail: RequestDetailProjection): string {
  return detail.installationOffer.selected ? "Selectat" : "Neselectat";
}

export function requestFilesValue(detail: RequestDetailProjection): string {
  const count = detail.attachments.length;
  if (count === 0) {
    return "Niciun fișier";
  }
  return count === 1 ? "1 fișier" : `${count} fișiere`;
}

const OWNER_INSTALLATION_REASON_IDS = new Set([
  "MISSING_COST_EVIDENCE",
  "MISSING_INTERNAL_LABOR_EVIDENCE",
  "MISSING_SUBCONTRACT_EVIDENCE",
  "SUBCONTRACT_EVIDENCE_INVALID",
  "SITE_ELECTRICAL_COST_REQUIRED",
]);

export function requestOperatorIncompleteReasons(
  reasons: readonly SiteInstallationIncompleteReason[],
): readonly SiteInstallationIncompleteReason[] {
  return reasons.filter((reason) => !OWNER_INSTALLATION_REASON_IDS.has(reason.id));
}

export function requestOwnerIncompleteReasons(
  reasons: readonly SiteInstallationIncompleteReason[],
): readonly SiteInstallationIncompleteReason[] {
  return reasons.filter((reason) => OWNER_INSTALLATION_REASON_IDS.has(reason.id));
}

export function requestInstallationHeadline(detail: RequestDetailProjection): string | null {
  if (!detail.installationOffer.selected) {
    return null;
  }
  if (detail.installationOffer.persistedModeIncompatible) {
    return "Selectat · Mod incompatibil";
  }
  if (detail.installationOffer.selectionLocked) {
    return "Selectat · Blocat după ofertă";
  }
  if (requestOperatorIncompleteReasons(detail.installationScope?.incompleteReasons ?? []).length > 0) {
    return "Selectat · Incomplet";
  }
  return "Selectat";
}

export function requestObjectPrimaryAction(
  detail: RequestDetailProjection,
): RequestObjectPrimaryAction | null {
  if (detail.installationOffer.persistedModeIncompatible) {
    return { kind: "focus", label: "Alege un mod oferit", targetId: "request-installation" };
  }
  if (
    detail.installationOffer.selected &&
    detail.canWriteInstallationFacts &&
    requestOperatorIncompleteReasons(detail.installationScope?.incompleteReasons ?? []).length > 0
  ) {
    return { kind: "focus", label: "Completează montajul", targetId: "request-installation" };
  }
  const quote = detail.linkedOffers[0];
  if (quote) {
    return { kind: "href", label: "Deschide oferta", href: quote.href };
  }
  if (detail.request.status === "CANCELLED") {
    return null;
  }
  return {
    kind: "href",
    label: "Alege produs",
    href: requestCatalogHref(detail.request.requestId),
  };
}

export function requestRelatedItems(detail: RequestDetailProjection): RequestRelatedItem[] {
  const items: RequestRelatedItem[] = [];
  for (const offer of detail.linkedOffers) {
    items.push({
      key: offer.quoteSnapshotId,
      kind: "quote",
      title: `Ofertă ${offer.reference}`,
      meta: `${offer.stageLabel} · ${formatRequestDate(offer.createdAt)}`,
      href: offer.href,
    });
    if (offer.orderSnapshotId) {
      items.push({
        key: offer.orderSnapshotId,
        kind: "job",
        title: `Lucrare ${offer.inscription}`,
        meta: offer.productLabel,
        href: jobHref({ orderSnapshotId: offer.orderSnapshotId }),
      });
    }
  }
  return items;
}

export function requestSavedModeLabel(detail: RequestDetailProjection): string | null {
  return detail.installationOffer.mode
    ? operationalServiceProviderModeLabel(detail.installationOffer.mode)
    : null;
}

export function requestObjectMeta(detail: RequestDetailProjection): string {
  return [
    detail.request.reference,
    detail.customerDisplayName,
    formatRequestDate(detail.request.createdAt),
    detail.statusLabel,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}
