import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  COMMERCIAL_REQUEST_STATUSES,
  SITE_INSTALLATION_SCOPE_ID,
  commercialRequestStatusLabel,
  jobHref,
  operationalServiceProviderModeLabel,
  type CommercialRequestStatus,
  type OperationalServiceProviderMode,
  type RequestDetailProjection,
  type SiteInstallationFactsPatch,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { fetchProductCatalog } from "./productApi";
import {
  readRequestDetail,
  requestAttachmentErrorMessage,
  requestServiceErrorMessage,
  updateCommercialRequest,
  updateInstallationFacts,
  uploadRequestAttachment,
} from "./requestsApi";
import { RequestInstallationFactsForm } from "./RequestInstallationFactsForm";
import { ActionDrawer } from "./ui/ActionDrawer";
import { flattenCatalogProducts } from "./catalogProducts";
import { pageErrorKind } from "./fetchAccess";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "forbidden" }
  | { kind: "missing" }
  | { kind: "ready"; detail: RequestDetailProjection };

export function RequestDetailPage() {
  const { requestId = "" } = useParams();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [products, setProducts] = useState<Array<{ code: string; label: string }>>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CommercialRequestStatus>("NEW");
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [installationSelected, setInstallationSelected] = useState(false);
  const [installationMode, setInstallationMode] =
    useState<OperationalServiceProviderMode | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [factsNotice, setFactsNotice] = useState<{ tone: "ok" | "warn"; text: string } | null>(
    null,
  );
  const [confirmDeselect, setConfirmDeselect] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPage({ kind: "loading" });
    void Promise.all([readRequestDetail(requestId), fetchProductCatalog()])
      .then(([detail, catalog]) => {
        if (cancelled) {
          return;
        }
        if (!detail) {
          setPage({ kind: "missing" });
          return;
        }
        setTitle(detail.request.title);
        setDescription(detail.request.description);
        setStatus(detail.request.status);
        setInstallationSelected(detail.installationOffer.selected);
        setInstallationMode(detail.installationOffer.mode);
        setProducts(flattenCatalogProducts(catalog).map((item) => ({
          code: item.code,
          label: item.label,
        })));
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
      setPage({ kind: "ready", detail });
      setTitle(detail.request.title);
      setDescription(detail.request.description);
      setStatus(detail.request.status);
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
      setPage({ kind: "ready", detail });
      setInstallationSelected(detail.installationOffer.selected);
      setInstallationMode(detail.installationOffer.mode);
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
      setPage({ kind: "ready", detail });
      setInstallationSelected(detail.installationOffer.selected);
      setInstallationMode(detail.installationOffer.mode);
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
        page.detail.installationFacts?.version,
      );
      setPage({ kind: "ready", detail });
      setInstallationSelected(detail.installationOffer.selected);
      setInstallationMode(detail.installationOffer.mode);
      setFactsNotice({ tone: "ok", text: "Datele de montaj au fost salvate." });
    } catch (error) {
      const code = error instanceof Error ? error.message : "request_unavailable";
      setFactsNotice({ tone: "warn", text: requestServiceErrorMessage(code) });
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

  const firstProduct = products[0];
  const linkedQuote = detail.linkedOffers[0];
  const linkedJobs = detail.linkedOffers.flatMap((offer) =>
    offer.orderSnapshotId
      ? [{ ...offer, orderSnapshotId: offer.orderSnapshotId }]
      : [],
  );
  const catalogHref = `/products?request=${encodeURIComponent(request.requestId)}`;

  return (
    <section className="jobs-overview decision-workspace">
      <PageHeader
        title={request.title}
        lead={`${request.reference}${
          detail.customerDisplayName ? ` · ${detail.customerDisplayName}` : ""
        }`}
        actions={
          <>
            <Link className="button-link" to={catalogHref}>
              Deschide catalogul
            </Link>
            {linkedQuote ? (
              <Link className="button-quiet" to={linkedQuote.href}>
                Deschide oferta
              </Link>
            ) : null}
          </>
        }
        meta={
          <p className="page-summary">
            Client {detail.customerDisplayName ?? "—"}
            {firstProduct ? ` · Produs ${firstProduct.label}` : ""}
            {` · stare ${detail.statusLabel}`}
            {detail.commercialProgressLabel
              ? ` · ${detail.commercialProgressLabel}`
              : ""}
          </p>
        }
      />

      <p>
        <StatusChip label={detail.statusLabel} tone="progress" />
      </p>
      <p>
        <ClientLink
          customerId={request.customerId}
          displayName={detail.customerDisplayName}
        />
      </p>
      {notice ? (
        <Notice tone="warn" compact>
          <p>{notice}</p>
        </Notice>
      ) : null}

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
        {detail.installationOffer.selected || detail.installationOffer.canSelectNew ? (
          <Field
            label="Montaj la locație"
            hint={installationHint(detail)}
          >
            <input
              type="checkbox"
              checked={installationSelected}
              disabled={busy || !detail.installationOffer.canChangeSelection}
              onChange={(event) => {
                void handleInstallationToggle(event.target.checked);
              }}
            />
          </Field>
        ) : null}
        {detail.installationOffer.selected && detail.installationOffer.mode ? (
          <p>
            Mod salvat: {operationalServiceProviderModeLabel(detail.installationOffer.mode)}
            {detail.installationOffer.persistedModeIncompatible
              ? " — nu mai este oferit de organizație."
              : ""}
          </p>
        ) : null}
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
        <button type="submit" disabled={busy}>
          Salvează
        </button>
      </form>

      {detail.installationOffer.selected ? (
        <RequestInstallationFactsForm
          facts={detail.installationFacts}
          reasons={detail.installationScope?.incompleteReasons ?? []}
          locked={!detail.canWriteInstallationFacts}
          busy={busy}
          notice={factsNotice}
          onSave={(patch) => {
            void handleSaveFacts(patch);
          }}
        />
      ) : null}

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

      <section className="result-section request-attachments">
        <h3>Fișiere client</h3>
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
          <ul className="jobs-list request-attachments-list">
            {detail.attachments.map((attachment) => (
              <li key={attachment.attachmentId}>
                <div className="jobs-identity">
                  <span className="request-attachment-name">
                    {attachment.originalFileName}
                  </span>
                  <span>
                    {attachment.sizeLabel}
                    {" · "}
                    {formatRequestDate(attachment.createdAt)}
                  </span>
                </div>
                <a className="button-link" href={attachment.downloadHref}>
                  Descarcă
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {detail.linkedOffers.length > 0 ? (
        <section className="result-section">
          <h3>Oferte legate</h3>
          <ul className="jobs-list">
            {detail.linkedOffers.map((offer) => (
              <li key={offer.quoteSnapshotId}>
                <div className="jobs-identity">
                  <Link to={offer.href}>{offer.reference}</Link>
                  <span>{offer.productLabel}</span>
                  <span>
                    {offer.grossDisplay} {offer.currency}
                  </span>
                </div>
                <div className="jobs-status">
                  <StatusChip label={offer.stageLabel} tone="progress" />
                  {offer.needsAttention && offer.attentionLabel ? (
                    <p className="jobs-attention">{offer.attentionLabel}</p>
                  ) : null}
                </div>
                <Link className="button-link" to={offer.href}>
                  {offer.nextActionLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {linkedJobs.length > 0 ? (
        <section className="result-section">
          <h3>Lucrări legate</h3>
          <ul className="jobs-list">
            {linkedJobs.map((offer) => (
              <li key={offer.orderSnapshotId}>
                <div className="jobs-identity">
                  <Link
                    to={jobHref({ orderSnapshotId: offer.orderSnapshotId })}
                  >
                    {offer.inscription}
                  </Link>
                  <span>{offer.productLabel}</span>
                </div>
                <Link
                  className="button-link"
                  to={jobHref({ orderSnapshotId: offer.orderSnapshotId })}
                >
                  Deschide lucrarea
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {request.status !== "CANCELLED" ? (
        <section className="result-section">
          <h3>Alege produs</h3>
          <p>Deschide catalogul, apoi configurează pentru această cerere.</p>
          <p>
            <Link className="button-quiet" to={catalogHref}>
              Deschide catalogul
            </Link>
          </p>
          <ul className="jobs-list">
            {products.map((product) => (
              <li key={product.code}>
                <div className="jobs-identity">
                  <span>{product.label}</span>
                </div>
                <Link
                  className="button-link"
                  to={`/products/${encodeURIComponent(product.code)}?request=${encodeURIComponent(
                    request.requestId,
                  )}`}
                >
                  Configurează
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
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

function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
