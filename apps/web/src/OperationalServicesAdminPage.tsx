import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ORGANIZATION_SERVICE_OFFER_MODES,
  SITE_INSTALLATION_SCOPE_ID,
  isOrganizationServiceOfferMode,
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
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; services: OperationalServicesAdminProjection };

type DraftMode = OrganizationServiceOfferMode | "";

type NoticeState =
  | { tone: "ok"; text: string }
  | { tone: "warn"; text: string }
  | null;

export function OperationalServicesAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [draftMode, setDraftMode] = useState<DraftMode>("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);

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

  const chrome = (
    <>
      <nav className="admin-breadcrumb" aria-label="Context">
        <Link to="/admin">Administrare</Link>
        <span aria-hidden="true"> › </span>
        <span>Servicii operaționale</span>
      </nav>
      <PageHeader
        title="Servicii operaționale"
        lead="Ce poate oferi organizația pe o cerere: montaj la locație, separat de produs. Nu este preț și nu este Settings general."
      />
    </>
  );

  if (page.kind === "loading") {
    return (
      <section>
        {chrome}
        <PageStatus kind="loading">Se încarcă serviciile operaționale…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        {chrome}
        <PageStatus kind="error">Serviciile operaționale nu au putut fi încărcate.</PageStatus>
      </section>
    );
  }

  const installation = page.services.capabilities.find(
    (item) => item.capabilityId === SITE_INSTALLATION_SCOPE_ID,
  );
  const reserved = page.services.capabilities.filter((item) => item.reserved);
  const state = installationState(installation);
  const canSave =
    canAdminister && !busy && isOrganizationServiceOfferMode(draftMode);

  return (
    <section>
      {chrome}
      <p className="page-summary">
        <StatusChip label={state.label} tone={state.tone} /> {state.detail}
      </p>
      {installation?.configured && installation.version != null ? (
        <p className="page-lead">Versiunea salvată: {installation.version}</p>
      ) : null}
      <p className="page-lead">
        Dezactivarea oprește doar selecțiile noi. Cererile deja selectate rămân vizibile și
        blochează oferta până există un cost complet. Ofertele și comenzile nu se rescriu.
      </p>
      {!canAdminister ? <OwnerWriteHint /> : null}
      {notice ? (
        <Notice tone={notice.tone} compact>
          <p>{notice.text}</p>
        </Notice>
      ) : null}
      {installation ? (
        <form
          className="seller-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!isOrganizationServiceOfferMode(draftMode)) {
              return;
            }
            setBusy(true);
            setNotice(null);
            void updateOperationalServiceOffer(installation.capabilityId, draftMode)
              .then((result) => {
                setPage({ kind: "ready", services: result.services });
                setDraftMode(readDraftMode(result.services));
                setNotice({
                  tone: "ok",
                  text: "Configurația serviciului a fost salvată.",
                });
              })
              .catch(() => {
                setNotice({
                  tone: "warn",
                  text: "Configurația serviciului nu a putut fi salvată.",
                });
              })
              .finally(() => {
                setBusy(false);
              });
          }}
        >
          <Field label={installation.label} hint={installationHint(installation)}>
            <select
              value={draftMode}
              disabled={busy || !canAdminister}
              onChange={(event) => {
                const value = event.target.value;
                setDraftMode(isOrganizationServiceOfferMode(value) ? value : "");
              }}
            >
              {!installation.configured ? (
                <option value="">Alege configurația</option>
              ) : null}
              {ORGANIZATION_SERVICE_OFFER_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {organizationServiceOfferModeLabel(mode)}
                </option>
              ))}
            </select>
          </Field>
          {canAdminister ? (
            <button type="submit" disabled={!canSave}>
              Salvează configurația serviciului
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

function readDraftMode(services: OperationalServicesAdminProjection): DraftMode {
  const installation = services.capabilities.find(
    (item) => item.capabilityId === SITE_INSTALLATION_SCOPE_ID,
  );
  return installation?.offerMode ?? "";
}

function installationState(item: OperationalServiceCapabilityAdminView | undefined): {
  label: string;
  detail: string;
  tone: "neutral" | "warn" | "ok" | "progress";
} {
  if (!item || !item.configured || item.offerMode === null) {
    return {
      label: "Neconfigurat",
      detail: "Nu există o configurație salvată. Selecțiile noi sunt oprite.",
      tone: "warn",
    };
  }
  switch (item.offerMode) {
    case "SERVICE_DISABLED":
      return {
        label: "Dezactivat",
        detail: "Configurația este salvată. Selecțiile noi sunt oprite.",
        tone: "warn",
      };
    case "INTERNAL":
      return {
        label: "Intern",
        detail: "Organizația oferă montaj cu echipă internă.",
        tone: "ok",
      };
    case "SUBCONTRACTED":
      return {
        label: "Subcontractat",
        detail: "Organizația oferă montaj subcontractat.",
        tone: "ok",
      };
    case "BOTH":
      return {
        label: "Intern și subcontractat",
        detail: "Cererea alege o cale: echipă internă sau subcontractat.",
        tone: "ok",
      };
    default: {
      const _exhaustive: never = item.offerMode;
      return _exhaustive;
    }
  }
}

function installationHint(item: OperationalServiceCapabilityAdminView): string {
  if (!item.configured) {
    return "Alege o configurație și salvează. Până atunci selecțiile noi rămân oprite.";
  }
  return "Schimbarea se aplică doar selecțiilor noi. Cererile existente nu se rescriu.";
}
