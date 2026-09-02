import { describe, expect, it } from "vitest";
import {
  UNCONFIGURED_SITE_INSTALLATION_OFFER,
  projectSiteInstallationRequestOffer,
  type RequestDetailProjection,
} from "@workos-final/domain";
import {
  requestEditareValue,
  requestInstallationHeadline,
  requestObjectPrimaryAction,
  requestOperatorIncompleteReasons,
  requestOwnerIncompleteReasons,
  requestRelatedItems,
} from "./requestObjectView";

function detail(overrides: Partial<RequestDetailProjection> = {}): RequestDetailProjection {
  return {
    request: {
      requestId: "crq:1",
      reference: "CER-11111111",
      customerId: "cus:1",
      title: "Litere exterior",
      description: "Pe fațadă.",
      status: "IN_REVIEW",
      optionalScopeIds: [],
      siteInstallationMode: null,
      createdAt: "2026-08-17T10:00:00.000Z",
      updatedAt: "2026-08-17T10:00:00.000Z",
    },
    customerDisplayName: "Hotel Vest",
    statusLabel: "În lucru",
    commercialProgress: null,
    commercialProgressLabel: null,
    canChangeCustomer: true,
    canUpdateStatus: true,
    canUploadAttachments: true,
    attachments: [],
    installationScope: null,
    installationFacts: null,
    canWriteInstallationFacts: false,
    installationOffer: projectSiteInstallationRequestOffer({
      selected: false,
      mode: null,
      offer: UNCONFIGURED_SITE_INSTALLATION_OFFER,
      hasLinkedQuotes: false,
    }),
    linkedOffers: [],
    ...overrides,
  };
}

describe("requestObjectView", () => {
  it("never uses Lock copy for installation editability", () => {
    expect(requestEditareValue(detail())).toBe("Disponibilă — fără ofertă");
    expect(
      requestEditareValue(
        detail({
          canWriteInstallationFacts: false,
          installationOffer: projectSiteInstallationRequestOffer({
            selected: true,
            mode: "INTERNAL",
            offer: {
              capabilityId: "SITE_INSTALLATION",
              configured: true,
              offerMode: "INTERNAL",
              version: 1,
              updatedAt: "2026-08-28T20:00:00.000Z",
            },
            hasLinkedQuotes: true,
          }),
        }),
      ),
    ).toBe("Blocată după ofertă");
  });

  it("prioritizes incompatible mode and incomplete installation over catalog", () => {
    const incompatible = detail({
      installationOffer: projectSiteInstallationRequestOffer({
        selected: true,
        mode: "INTERNAL",
        offer: {
          capabilityId: "SITE_INSTALLATION",
          configured: true,
          offerMode: "SUBCONTRACTED",
          version: 2,
          updatedAt: "2026-08-28T21:00:00.000Z",
        },
        hasLinkedQuotes: false,
      }),
    });
    expect(requestInstallationHeadline(incompatible)).toBe("Selectat · Mod incompatibil");
    expect(requestObjectPrimaryAction(incompatible)).toEqual({
      kind: "focus",
      label: "Alege un mod oferit",
      targetId: "request-installation",
    });
  });

  it("lists only downstream quotes and jobs", () => {
    const related = requestRelatedItems(
      detail({
        linkedOffers: [
          {
            quoteSnapshotId: "qts:1",
            reference: "OF-VEST-001",
            productCode: "PRD-LETTERS-FRONTLIT-PLEXI-AL06",
            productLabel: "Litere",
            inscription: "VEST",
            customerId: "cus:1",
            customerDisplayName: "Hotel Vest",
            createdAt: "2026-08-17T12:00:00.000Z",
            grossDisplay: "624,82",
            currency: "EUR",
            stage: "ORDER_CREATED",
            stageLabel: "Cu comandă",
            nextAction: "OPEN_ORDER",
            nextActionLabel: "Deschide comanda",
            href: "/quotes/qts%3A1",
            needsAttention: false,
            attentionLabel: null,
            acceptanceId: "qad:1",
            orderSnapshotId: "ord:1",
            requestId: "crq:1",
            requestReference: "CER-11111111",
          },
        ],
      }),
    );
    expect(related.map((item) => item.kind)).toEqual(["quote", "job"]);
    expect(related.some((item) => item.title.startsWith("Cerere"))).toBe(false);
  });

  it("keeps owner cost gaps out of the operator missing list", () => {
    const reasons = [
      { id: "SITE_ADDRESS_INCOMPLETE" as const, label: "Adresa locului de execuție este incompletă." },
      { id: "MISSING_CREW_SIZE" as const, label: "Numărul de persoane pentru montajul intern lipsește." },
      { id: "MISSING_COST_EVIDENCE" as const, label: "Evidența de cost pentru montaj lipsește." },
      {
        id: "MISSING_INTERNAL_LABOR_EVIDENCE" as const,
        label: "Tariful intern de montaj pe oră-persoană nu este confirmat.",
      },
    ];
    expect(requestOperatorIncompleteReasons(reasons).map((item) => item.id)).toEqual([
      "SITE_ADDRESS_INCOMPLETE",
      "MISSING_CREW_SIZE",
    ]);
    expect(requestOwnerIncompleteReasons(reasons).map((item) => item.id)).toEqual([
      "MISSING_COST_EVIDENCE",
      "MISSING_INTERNAL_LABOR_EVIDENCE",
    ]);
  });
});
