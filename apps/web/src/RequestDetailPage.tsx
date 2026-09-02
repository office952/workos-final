import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  COMMERCIAL_REQUEST_STATUSES,
  SITE_INSTALLATION_SCOPE_ID,
  commercialRequestStatusLabel,
  operationalServiceProviderModeLabel,
  type CommercialRequestStatus,
  type OperationalServiceProviderMode,
  type RequestDetailProjection,
  type SiteInstallationFactsPatch,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { pageErrorKind } from "./fetchAccess";
import { usePathIdAfter } from "./navigation/usePathIdAfter";
import {
  requestEditareValue,
  requestFilesValue,
  requestInstallationHeadline,
  requestMontajValue,
  requestObjectMeta,
  requestObjectPrimaryAction,
  requestOperatorIncompleteReasons,
  requestOwnerIncompleteReasons,
  requestRelatedItems,
  requestSavedModeLabel,
} from "./requestObjectView";
import { formatRequestDate } from "./requestsRegistryView";
import {
  consumeRequestsWorkspaceSession,
  originFromLocationState,
  readRequestsWorkspaceOrigin,
  requestObjectBack,
  resolveRequestsWorkspaceOrigin,
  type RequestsWorkspaceOrigin,
} from "./requestsWorkspaceOrigin";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { RequestInstallationFactsForm } from "./RequestInstallationFactsForm";
import {
  readRequestDetail,
  requestAttachmentErrorMessage,
  requestServiceErrorMessage,
  updateCommercialRequest,
  updateInstallationFacts,
  updateInstallationManualPrice,
  uploadRequestAttachment,
} from "./requestsApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";
import { PageStatus } from "./ui/PageStatus";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "missing" }
  | { kind: "ready"; detail: RequestDetailProjection };

function useRequestObjectOrigin(requestId: string): RequestsWorkspaceOrigin | null {
  const location = useLocation();
  const navigate = useNavigate();
  const adoptedRequestIdRef = useRef<string | null>(null);
  const origin = resolveRequestsWorkspaceOrigin(requestId, location.state);

  useLayoutEffect(() => {
    if (!requestId) {
      return;
    }
    if (originFromLocationState(requestId, location.state)) {
      consumeRequestsWorkspaceSession(requestId);
      adoptedRequestIdRef.current = requestId;
    }
  }, [location.state, requestId]);

  useEffect(() => {
    if (!requestId || originFromLocationState(requestId, location.state)) {
      return;
    }
    if (adoptedRequestIdRef.current === requestId) {
      return;
    }
    const sessionOrigin = readRequestsWorkspaceOrigin(requestId);
    if (!sessionOrigin) {
      return;
    }
    const currentState =
      location.state && typeof location.state === "object"
        ? (location.state as Record<string, unknown>)
        : {};
    adoptedRequestIdRef.current = requestId;
    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      {
        replace: true,
        state: {
          ...currentState,
          requestsWorkspaceOrigin: sessionOrigin,
        },
      },
    );
  }, [location.hash, location.pathname, location.search, location.state, navigate, requestId]);

  return origin;
}

export function RequestDetailPage() {
  const requestId = usePathIdAfter("/requests/");
  const origin = useRequestObjectOrigin(requestId);
  const canAdminister = useCanAdministerOrganization();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CommercialRequestStatus>("NEW");
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [installationSelected, setInstallationSelected] = useState(false);
  const [installationMode, setInstallationMode] =
    useState<OperationalServiceProviderMode | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [factsNotice, setFactsNotice] = useState<{ tone: "ok" | "warn"; text: string } | null>(
    null,
  );
  const [confirmDeselect, setConfirmDeselect] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [priceNotice, setPriceNotice] = useState<{ tone: "ok" | "warn"; text: string } | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void readRequestDetail(requestId)
      .then((detail) => {
        if (cancelled) {
          return;
        }
        if (!detail) {
          setPage({ kind: "missing" });
          return;
        }
        applyDetail(detail);
        setPage({ kind: "ready", detail });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPage({ kind: pageErrorKind(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  function applyDetail(detail: RequestDetailProjection) {
    setTitle(detail.request.title);
    setDescription(detail.request.description);
    setStatus(detail.request.status);
    setInstallationSelected(detail.installationOffer.selected);
    setInstallationMode(detail.installationOffer.mode);
    setPriceDraft(
      detail.request.installationManualNetEur != null
        ? String(detail.request.installationManualNetEur)
        : "",
    );
  }

  async function handleSave() {
    if (page.kind !== "ready") {
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const detail = await updateCommercialRequest(page.detail.request.requestId, {
        title,
        description,
        status: page.detail.canUpdateStatus ? status : undefined,
      });
      applyDetail(detail);
      setPage({ kind: "ready", detail });
      setEditing(false);
    } catch {
      setNotice("Cererea nu a putut fi actualizată.");
    } finally {
      setBusy(false);
    }
  }

  async function handleInstallationToggle(selected: boolean) {
    if (page.kind !== "ready") {
      return;
    }
    const offer = page.detail.installationOffer;
    if (selected && offer.availableModes.length > 1 && !installationMode) {
      setNotice(requestServiceErrorMessage("service_mode_required"));
      return;
    }
    if (!selected && page.detail.installationFacts) {
      setConfirmDeselect(true);
      return;
    }
    await persistInstallationSelection(selected);
  }

  async function persistInstallationSelection(
    selected: boolean,
    confirmDeleteInstallationFacts = false,
  ) {
    if (page.kind !== "ready") {
      return;
    }
    const offer = page.detail.installationOffer;
    const previous = installationSelected;
    setInstallationSelected(selected);
    setBusy(true);
    setNotice(null);
    try {
      const detail = await updateCommercialRequest(page.detail.request.requestId, {
        optionalScopeIds: selected ? [SITE_INSTALLATION_SCOPE_ID] : [],
        ...(selected && offer.availableModes.length > 1
          ? { siteInstallationMode: installationMode }
          : {}),
        ...(confirmDeleteInstallationFacts
          ? { confirmDeleteInstallationFacts: true }
          : {}),
      });
      applyDetail(detail);
      setPage({ kind: "ready", detail });
      setConfirmDeselect(false);
      setFactsNotice(null);
    } catch (error) {
      setInstallationSelected(previous);
      const code = error instanceof Error ? error.message : "request_unavailable";
      setNotice(requestServiceErrorMessage(code));
    } finally {
      setBusy(false);
    }
  }

  async function handleInstallationMode(mode: OperationalServiceProviderMode) {
    if (page.kind !== "ready") {
      return;
    }
    setInstallationMode(mode);
    if (!page.detail.installationOffer.selected) {
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const detail = await updateCommercialRequest(page.detail.request.requestId, {
        siteInstallationMode: mode,
      });
      applyDetail(detail);
      setPage({ kind: "ready", detail });
    } catch (error) {
      setInstallationMode(page.detail.installationOffer.mode);
      const code = error instanceof Error ? error.message : "request_unavailable";
      setNotice(requestServiceErrorMessage(code));
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveFacts(patch: SiteInstallationFactsPatch) {
    if (page.kind !== "ready") {
      return;
    }
    setBusy(true);
    setFactsNotice(null);
    try {
      const detail = await updateInstallationFacts(
        page.detail.request.requestId,
        patch,
        page.detail.installationFacts?.version ?? 0,
      );
      applyDetail(detail);
      setPage({ kind: "ready", detail });
      setFactsNotice({ tone: "ok", text: "Datele de montaj au fost salvate." });
    } catch (error) {
      const code = error instanceof Error ? error.message : "request_unavailable";
      setFactsNotice({ tone: "warn", text: requestServiceErrorMessage(code) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSavePrice() {
    if (page.kind !== "ready") {
      return;
    }
    const parsed = Number(priceDraft.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setPriceNotice({
        tone: "warn",
        text: "Prețul de montaj trebuie să fie un număr mai mare decât zero.",
      });
      return;
    }
    setBusy(true);
    setPriceNotice(null);
    try {
      const detail = await updateInstallationManualPrice(
        page.detail.request.requestId,
        parsed,
      );
      applyDetail(detail);
      setPage({ kind: "ready", detail });
      setPriceNotice({ tone: "ok", text: "Prețul de montaj a fost confirmat." });
    } catch (error) {
      const code = error instanceof Error ? error.message : "request_unavailable";
      setPriceNotice({ tone: "warn", text: requestServiceErrorMessage(code) });
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File | undefined) {
    if (page.kind !== "ready" || !file || !page.detail.canUploadAttachments) {
      return;
    }
    setUploadBusy(true);
    setUploadNotice(null);
    try {
      const detail = await uploadRequestAttachment(page.detail.request.requestId, file);
      applyDetail(detail);
      setPage({ kind: "ready", detail });
      setUploadNotice("Fișierul a fost atașat.");
    } catch (error) {
      const code = error instanceof Error ? error.message : "attachment_unavailable";
      setUploadNotice(requestAttachmentErrorMessage(code));
    } finally {
      setUploadBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (page.kind === "loading") {
    return <PageStatus kind="loading">Se încarcă cererea…</PageStatus>;
  }
  if (page.kind === "missing") {
    return <PageStatus kind="missing">Cererea cerută nu este disponibilă.</PageStatus>;
  }
  if (page.kind === "forbidden") {
    return <PageStatus kind="forbidden">Nu ai acces la această cerere.</PageStatus>;
  }
  if (page.kind === "error") {
    return <PageStatus kind="error">Cererea nu a putut fi încărcată.</PageStatus>;
  }

  const { detail } = page;
  const { request } = detail;
  const back = requestObjectBack(origin);
  const primary = requestObjectPrimaryAction(detail);
  const related = requestRelatedItems(detail);
  const headline = requestInstallationHeadline(detail);
  const incompleteReasons = detail.installationScope?.incompleteReasons ?? [];
  const operatorReasons = requestOperatorIncompleteReasons(incompleteReasons);
  const formReasons = requestOwnerIncompleteReasons(incompleteReasons);
  const showInstallation =
    detail.installationOffer.selected || detail.installationOffer.canSelectNew;

  function focusTarget(id: string) {
    const section = document.getElementById(id);
    section?.scrollIntoView({ block: "start" });
    section?.querySelector<HTMLElement>("select, textarea, input, button")?.focus();
  }

  return (
    <section className="request-object">
      <Link
        className="client-object-back"
        to={back.href}
        state={back.state}
        aria-label={back.ariaLabel}
      >
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        {back.label}
      </Link>

      <header className="client-object-header">
        <div className="client-object-titles">
          <h1>{request.title}</h1>
          <p className="client-object-identity">{requestObjectMeta(detail)}</p>
        </div>
        <div className="client-object-actions">
          <button
            type="button"
            className="button-quiet"
            disabled={busy}
            onClick={() => setEditing(true)}
          >
            Editează cererea
          </button>
          {primary?.kind === "href" ? (
            <Link className="button-link" to={primary.href}>
              {primary.label}
            </Link>
          ) : null}
          {primary?.kind === "focus" ? (
            <button type="button" onClick={() => focusTarget(primary.targetId)}>
              {primary.label}
            </button>
          ) : null}
        </div>
      </header>

      {notice ? (
        <Notice tone="warn" compact>
          <p>{notice}</p>
        </Notice>
      ) : null}

      <section className="request-section">
        <h2>Ce a cerut</h2>
        <RequestDescription text={request.description} />
        <dl className="request-facts">
          <div>
            <dt>Client</dt>
            <dd>
              <ClientLink
                customerId={request.customerId}
                displayName={detail.customerDisplayName}
                prefix=""
              />
            </dd>
          </div>
          <div>
            <dt>Stare</dt>
            <dd>{detail.statusLabel}</dd>
          </div>
          <div>
            <dt>Progres</dt>
            <dd>{detail.commercialProgressLabel ?? "—"}</dd>
          </div>
          <div>
            <dt>Montaj</dt>
            <dd>{requestMontajValue(detail)}</dd>
          </div>
          <div>
            <dt>Fișiere</dt>
            <dd>{requestFilesValue(detail)}</dd>
          </div>
        </dl>
      </section>

      {showInstallation ? (
        <section className="request-section" id="request-installation">
          <h2>Montaj la locație</h2>
          {headline ? <p className="request-installation-headline">{headline}</p> : null}
          {detail.installationOffer.persistedModeIncompatible ? (
            <ul className="request-installation-reasons">
              <li>Modul salvat nu mai este oferit de organizație.</li>
              <li>Modul salvat rămâne pe cerere. Oferta rămâne incompletă.</li>
            </ul>
          ) : null}
          {operatorReasons.length > 0 ? (
            <div>
              <p className="request-installation-missing">Lipsesc</p>
              <ul className="request-installation-reasons">
                {operatorReasons.map((reason) => (
                  <li key={reason.id}>{reason.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <dl className="request-facts">
            {requestSavedModeLabel(detail) ? (
              <div>
                <dt>Mod salvat</dt>
                <dd>
                  {requestSavedModeLabel(detail)}
                  {detail.installationOffer.persistedModeIncompatible
                    ? " — nu mai este oferit"
                    : ""}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Editare</dt>
              <dd>{requestEditareValue(detail)}</dd>
            </div>
          </dl>
          <Field label="Montaj la locație" hint={installationHint(detail)}>
            <input
              type="checkbox"
              checked={installationSelected}
              disabled={busy || !detail.installationOffer.canChangeSelection}
              onChange={(event) => {
                void handleInstallationToggle(event.target.checked);
              }}
            />
          </Field>
          {detail.installationOffer.showModeControl ? (
            <Field label="Mod montaj" hint="Obligatoriu când organizația oferă ambele căi.">
              <select
                value={
                  installationMode &&
                  detail.installationOffer.availableModes.includes(installationMode)
                    ? installationMode
                    : ""
                }
                disabled={
                  busy ||
                  (detail.installationOffer.selected && !detail.installationOffer.canChangeMode)
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "INTERNAL" || value === "SUBCONTRACTED") {
                    void handleInstallationMode(value);
                  }
                }}
              >
                <option value="">Alege modul</option>
                {detail.installationOffer.availableModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {operationalServiceProviderModeLabel(mode)}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          {detail.installationOffer.selected && canAdminister ? (
            <Field
              label="Preț montaj (EUR fără TVA)"
              hint="Prețul client pentru această cerere. Nu este cost intern."
            >
              <input
                inputMode="decimal"
                value={priceDraft}
                disabled={busy || !detail.canWriteInstallationFacts}
                onChange={(event) => setPriceDraft(event.target.value)}
              />
            </Field>
          ) : null}
          {detail.installationOffer.selected && canAdminister ? (
            <p>
              {priceNotice ? (
                <Notice tone={priceNotice.tone} compact>
                  <p>{priceNotice.text}</p>
                </Notice>
              ) : null}
              <button
                type="button"
                disabled={busy || !detail.canWriteInstallationFacts}
                onClick={() => {
                  void handleSavePrice();
                }}
              >
                Confirmă prețul de montaj
              </button>
            </p>
          ) : null}
          {detail.installationOffer.selected ? (
            <RequestInstallationFactsForm
              facts={detail.installationFacts}
              reasons={formReasons}
              locked={!detail.canWriteInstallationFacts}
              busy={busy}
              notice={factsNotice}
              providerMode={detail.installationOffer.mode}
              onSave={(patch) => {
                void handleSaveFacts(patch);
              }}
            />
          ) : null}
        </section>
      ) : null}

      <section className="request-section request-attachments">
        <h2>Fișiere client</h2>
        <p className="request-attachments-lead">
          Fișierele primite de la client rămân atașate acestei cereri.
        </p>
        {detail.canUploadAttachments ? (
          <Field label="Adaugă fișier" hint="Maxim 50 MB. Fișierul rămâne atașat cererii.">
            <input
              ref={fileInputRef}
              type="file"
              disabled={uploadBusy}
              onChange={(event) => {
                void handleUpload(event.target.files?.[0]);
              }}
            />
          </Field>
        ) : (
          <p className="request-attachments-readonly">
            Cererea anulată păstrează fișierele existente, dar nu mai acceptă încărcări noi.
          </p>
        )}
        {uploadNotice ? (
          <Notice
            tone={uploadNotice === "Fișierul a fost atașat." ? "ok" : "warn"}
            compact
          >
            <p>{uploadNotice}</p>
          </Notice>
        ) : null}
        {uploadBusy ? <p>Se încarcă fișierul…</p> : null}
        {detail.attachments.length === 0 ? (
          <EmptyState title="Nu există încă fișiere atașate acestei cereri." />
        ) : (
          <ul className="request-related-list">
            {detail.attachments.map((attachment) => (
              <li key={attachment.attachmentId}>
                <a className="request-related-row" href={attachment.downloadHref}>
                  <span className="request-attachment-name">{attachment.originalFileName}</span>
                  <span>
                    {attachment.sizeLabel}
                    {" · "}
                    {formatRequestDate(attachment.createdAt)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="request-section">
        <h2>Oferte și lucrări legate</h2>
        {related.length === 0 ? (
          <p className="client-activity-empty">Nicio ofertă sau lucrare legată.</p>
        ) : (
          <ul className="request-related-list">
            {related.map((item) => (
              <li key={item.key}>
                <Link className="request-related-row" to={item.href}>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.meta}</span>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ActionDrawer
        title="Editează cererea"
        open={editing}
        onClose={() => {
          applyDetail(detail);
          setEditing(false);
        }}
      >
        <form
          className="people-create"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <Field label="Titlu">
            <input
              value={title}
              disabled={busy}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field label="Descriere">
            <textarea
              value={description}
              disabled={busy}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
          {detail.canUpdateStatus ? (
            <Field label="Stare">
              <select
                value={status}
                disabled={busy}
                onChange={(event) =>
                  setStatus(event.target.value as CommercialRequestStatus)
                }
              >
                {COMMERCIAL_REQUEST_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {commercialRequestStatusLabel(item)}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <p>Stare: {detail.statusLabel}</p>
          )}
          <div className="action-drawer-actions">
            <button
              type="button"
              className="button-quiet"
              disabled={busy}
              onClick={() => {
                applyDetail(detail);
                setEditing(false);
              }}
            >
              Anulează
            </button>
            <button type="submit" disabled={busy}>
              Salvează
            </button>
          </div>
        </form>
      </ActionDrawer>

      <ActionDrawer
        title="Renunți la montaj?"
        open={confirmDeselect}
        onClose={() => setConfirmDeselect(false)}
      >
        <p>
          Datele de montaj salvate vor fi șterse. Anularea păstrează selecția și
          datele.
        </p>
        <p className="action-row">
          <button type="button" className="button-quiet" onClick={() => setConfirmDeselect(false)}>
            Anulează
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void persistInstallationSelection(false, true);
            }}
          >
            Șterge datele de montaj
          </button>
        </p>
      </ActionDrawer>
    </section>
  );
}

function RequestDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    setOverflows(node.scrollHeight > node.clientHeight + 1);
  }, [text]);

  return (
    <div className="request-description">
      <p
        ref={ref}
        className={expanded ? "request-description-text is-expanded" : "request-description-text"}
      >
        {text}
      </p>
      {overflows ? (
        <button
          type="button"
          className="button-quiet"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Restrânge" : "Arată tot"}
        </button>
      ) : null}
    </div>
  );
}

function installationHint(detail: RequestDetailProjection): string {
  if (detail.installationOffer.selectionLocked) {
    return "Selecția și modul sunt blocate după prima ofertă legată.";
  }
  if (detail.installationOffer.persistedModeIncompatible) {
    return "Modul salvat rămâne pe cerere. Organizația nu îl mai oferă; oferta rămâne incompletă.";
  }
  if (detail.installationOffer.persistedSelectionPreserved) {
    return "Montajul rămâne selectat pe această cerere. Nu poate fi adăugat pe cereri noi până ownerul configurează serviciul.";
  }
  return "Dacă este selectat, montajul rămâne separat și blochează oferta până există un cost complet.";
}
