import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  COMMERCIAL_REQUEST_STATUSES,
  SITE_INSTALLATION_SCOPE_ID,
  commercialRequestStatusLabel,
  jobHref,
  type CommercialRequestStatus,
  type RequestDetailProjection,
} from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import { fetchProductCatalog } from "./productApi";
import {
  readRequestDetail,
  requestAttachmentErrorMessage,
  updateCommercialRequest,
  uploadRequestAttachment,
} from "./requestsApi";
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
  const [notice, setNotice] = useState<string | null>(null);
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
        setInstallationSelected(
          detail.request.optionalScopeIds.includes(SITE_INSTALLATION_SCOPE_ID),
        );
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
    const previous = installationSelected;
    setInstallationSelected(selected);
    setBusy(true);
    setNotice(null);
    try {
      const detail = await updateCommercialRequest(page.detail.request.requestId, {
        optionalScopeIds: selected ? [SITE_INSTALLATION_SCOPE_ID] : [],
      });
      setPage({ kind: "ready", detail });
      setInstallationSelected(
        detail.request.optionalScopeIds.includes(SITE_INSTALLATION_SCOPE_ID),
      );
    } catch {
      setInstallationSelected(previous);
      setNotice("Cererea nu a putut fi actualizată.");
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
        <Field
          label="Montaj la locație"
          hint="Dacă este selectat, montajul rămâne separat și blochează oferta până există un cost complet."
        >
          <input
            type="checkbox"
            checked={installationSelected}
            disabled={busy}
            onChange={(event) => {
              void handleInstallationToggle(event.target.checked);
            }}
          />
        </Field>
        <button type="submit" disabled={busy}>
          Salvează
        </button>
      </form>

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

function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
