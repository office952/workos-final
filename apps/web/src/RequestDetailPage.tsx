import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  COMMERCIAL_REQUEST_STATUSES,
  commercialRequestStatusLabel,
  type CatalogTreeNode,
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
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { StatusChip } from "./ui/StatusChip";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
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
        setProducts(catalogProducts(catalog));
        setPage({ kind: "ready", detail });
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
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
    return <p>Se încarcă cererea…</p>;
  }
  if (page.kind === "missing") {
    return <p>Cererea cerută nu este disponibilă.</p>;
  }
  if (page.kind === "error") {
    return <p>Cererea nu a putut fi încărcată.</p>;
  }

  const { detail } = page;
  const { request } = detail;

  return (
    <section className="jobs-overview">
      <PageHeader
        title={request.title}
        lead={`${request.reference}${
          detail.customerDisplayName ? ` · ${detail.customerDisplayName}` : ""
        }`}
        meta={
          <p className="page-summary">
            Creată {formatRequestDate(request.createdAt)}
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

      {request.status !== "CANCELLED" ? (
        <section className="result-section">
          <h3>Alege produs</h3>
          <p>Deschide configurația existentă cu clientul acestei cereri.</p>
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

function catalogProducts(
  nodes: readonly CatalogTreeNode[],
): Array<{ code: string; label: string }> {
  return nodes.flatMap((node) => {
    switch (node.kind) {
      case "product":
        return [{ code: node.code, label: node.label }];
      case "family":
      case "category":
        return catalogProducts(node.children);
      default: {
        const _exhaustive: never = node;
        return _exhaustive;
      }
    }
  });
}

function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
