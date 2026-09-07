import {
  siteInstallationIsPrequoteReady,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { installationCostEvidenceHref } from "./installationPresentation";
import {
  requestFilesValue,
  requestMontajValue,
  requestObjectPrimaryAction,
  requestOperatorIncompleteReasons,
  type RequestObjectPrimaryAction,
} from "./requestObjectView";

export type ResolutionFact = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

export type UnresolvedItem = {
  id: string;
  title: string;
  cause: string | null;
  consequence: string | null;
  energy: "blocked" | "open";
  action: RequestObjectPrimaryAction | null;
};

export function requestKnownFacts(detail: RequestDetailProjection): ResolutionFact[] {
  const facts: ResolutionFact[] = [
    {
      id: "client",
      label: "Client",
      value: detail.customerDisplayName ?? detail.request.customerId,
      href: `/clients/${encodeURIComponent(detail.request.customerId)}`,
    },
    {
      id: "status",
      label: "Stare",
      value: detail.statusLabel,
    },
  ];
  if (detail.commercialProgressLabel) {
    facts.push({
      id: "progress",
      label: "Progres",
      value: detail.commercialProgressLabel,
    });
  }
  facts.push(
    {
      id: "install",
      label: "Montaj",
      value: requestMontajValue(detail),
    },
    {
      id: "files",
      label: "Fișiere",
      value: requestFilesValue(detail),
    },
  );
  for (const offer of detail.linkedOffers) {
    facts.push({
      id: `quote-${offer.quoteSnapshotId}`,
      label: "Ofertă legată",
      value: `${offer.reference} · ${offer.stageLabel}`,
      href: offer.href,
    });
  }
  return facts;
}

export function requestUnresolvedItems(
  detail: RequestDetailProjection,
): UnresolvedItem[] {
  const items: UnresolvedItem[] = [];
  const primary = requestObjectPrimaryAction(detail);
  const operatorReasons = requestOperatorIncompleteReasons(
    detail.installationScope?.incompleteReasons ?? [],
  );

  if (detail.installationOffer.persistedModeIncompatible) {
    items.push({
      id: "install-mode",
      title: "Modul de montaj nu mai este oferit",
      cause: "Organizația nu mai oferă modul salvat pe această cerere.",
      consequence: "Oferta de montaj rămâne incompletă până alegi un mod oferit.",
      energy: "blocked",
      action: primary?.kind === "focus" ? primary : null,
    });
  }

  if (
    detail.installationOffer.selected &&
    detail.canWriteInstallationFacts &&
    operatorReasons.length > 0
  ) {
    items.push({
      id: "install-facts",
      title: "Datele de montaj sunt incomplete",
      cause: operatorReasons.map((reason) => reason.label).join(" "),
      consequence: "Montajul selectat blochează oferta până datele sunt complete.",
      energy: "blocked",
      action: primary?.kind === "focus" ? primary : null,
    });
  }

  const scope = detail.installationScope;
  if (detail.installationOffer.selected && scope && !siteInstallationIsPrequoteReady(scope)) {
    const ownerLabels = scope.incompleteReasons
      .filter((reason) => !operatorReasons.some((item) => item.id === reason.id))
      .map((reason) => reason.label);
    const costHref = installationCostEvidenceHref({
      providerMode: detail.installationOffer.mode,
      incompleteReasons: scope.incompleteReasons,
    });
    if (ownerLabels.length > 0) {
      items.push({
        id: "install-readiness",
        title: "Montajul nu este pregătit pentru ofertă",
        cause: null,
        consequence: costHref
          ? "Actualizează dovada de cost ca montajul să poată intra în ofertă."
          : "Montajul selectat rămâne incomplet pe această cerere.",
        energy: "blocked",
        action: costHref
          ? { kind: "href", label: "Actualizează dovada de cost", href: costHref }
          : null,
      });
    }
  }

  if (detail.request.status !== "CANCELLED" && detail.linkedOffers.length === 0) {
    items.push({
      id: "linked-offer",
      title: "Nu există încă o ofertă legată",
      cause: "Cererea nu are o ofertă legată.",
      consequence:
        "Continuă produsul sau configurarea înainte să poată exista oferta.",
      energy: "open",
      action:
        primary?.kind === "href" && primary.label === "Alege produs"
          ? primary
          : {
              kind: "href",
              label: "Alege produs",
              href: `/products?request=${encodeURIComponent(detail.request.requestId)}`,
            },
    });
  }

  return items;
}

export function requestResolutionPrimaryAction(
  detail: RequestDetailProjection,
): RequestObjectPrimaryAction | null {
  return requestObjectPrimaryAction(detail);
}
