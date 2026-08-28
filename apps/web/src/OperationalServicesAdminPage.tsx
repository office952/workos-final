import { useEffect, useState } from "react";
import {
  ORGANIZATION_SERVICE_OFFER_MODES,
  SITE_INSTALLATION_SCOPE_ID,
  organizationServiceOfferModeLabel,
  type OperationalServiceCapabilityAdminView,
  type OperationalServicesAdminProjection,
  type OrganizationServiceOfferMode,
} from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import {
  fetchOperationalServices,
  updateOperationalServiceOffer,
} from "./operationalServicesApi";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; services: OperationalServicesAdminProjection };

export function OperationalServicesAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [draftMode, setDraftMode] = useState<OrganizationServiceOfferMode>("SERVICE_DISABLED");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchOperationalServices()
      .then((services) => {
        if (cancelled) {
          return;
        }
        setDraftMode(readDraftMode(services));
        setPage({ kind: "ready", services });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă serviciile operaționale…</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Serviciile operaționale nu au putut fi încărcate.</PageStatus>;
  }

  const installation = page.services.capabilities.find(
    (item) => item.capabilityId === SITE_INSTALLATION_SCOPE_ID,
  );
  const reserved = page.services.capabilities.filter((item) => item.reserved);

  return (
    <section>
      <PageHeader
        title="Servicii operaționale"
        lead="Ce poate oferi organizația pe o cerere: montaj la locație, separat de produs. Nu este preț, nu este EIC și nu este Settings general."
      />
      <p className="page-lead">
        Dezactivarea oprește doar selecțiile noi. Cererile deja selectate rămân vizibile și
        blochează oferta până există un cost complet. Ofertele și comenzile nu se rescriu.
      </p>
      {!canAdminister ? <OwnerWriteHint /> : null}
      {notice ? <p>{notice}</p> : null}
      {installation ? (
        <form
          className="seller-form"
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            setNotice(null);
            void updateOperationalServiceOffer(installation.capabilityId, draftMode)
              .then((result) => {
                setPage({ kind: "ready", services: result.services });
                setDraftMode(readDraftMode(result.services));
              })
              .catch(() => {
                setNotice("Oferta organizației nu a putut fi salvată.");
              })
              .finally(() => {
                setBusy(false);
              });
          }}
        >
          <Field
            label={installation.label}
            hint={installationHint(installation)}
          >
            <select
              value={draftMode}
              disabled={busy || !canAdminister}
              onChange={(event) =>
                setDraftMode(event.target.value as OrganizationServiceOfferMode)
              }
            >
              {ORGANIZATION_SERVICE_OFFER_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {organizationServiceOfferModeLabel(mode)}
                </option>
              ))}
            </select>
          </Field>
          {canAdminister ? (
            <button type="submit" disabled={busy}>
              Salvează oferta organizației
            </button>
          ) : null}
        </form>
      ) : null}
      {reserved.map((item) => (
        <p key={item.capabilityId} className="page-lead">
          {item.label}: rezervat. Nu poate fi activat în această etapă.
        </p>
      ))}
    </section>
  );
}

function readDraftMode(
  services: OperationalServicesAdminProjection,
): OrganizationServiceOfferMode {
  const installation = services.capabilities.find(
    (item) => item.capabilityId === SITE_INSTALLATION_SCOPE_ID,
  );
  return installation?.offerMode ?? "SERVICE_DISABLED";
}

function installationHint(item: OperationalServiceCapabilityAdminView): string {
  if (!item.configured) {
    return "Organizația nu are încă o ofertă salvată. Selecțiile noi rămân oprite.";
  }
  return `Ofertă curentă: ${organizationServiceOfferModeLabel(item.offerMode ?? "SERVICE_DISABLED")}. Versiunea ${item.version ?? 0}.`;
}
