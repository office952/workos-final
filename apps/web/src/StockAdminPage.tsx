import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package, TriangleAlert } from "lucide-react";
import type { InventoryItemDetail, InventoryStockProjection } from "@workos-final/domain";
import { formatQuantity } from "./formatDisplay";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import {
  fetchInventory,
  fetchInventoryItem,
  recordInventoryAdjustment,
} from "./inventoryApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { MetricCard } from "./ui/MetricCard";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
import { PageStatus } from "./ui/PageStatus";
import { StatusChip } from "./ui/StatusChip";

export function StockAdminPage() {
  const { resourceId } = useParams();
  if (resourceId) {
    return <StockItemPage resourceId={resourceId} />;
  }
  return <StockOverviewPage />;
}

function StockOverviewPage() {
  const [page, setPage] = useState<
    { kind: "loading" } | { kind: "error" } | { kind: "ready"; inventory: InventoryStockProjection }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchInventory()
      .then((inventory) => {
        if (!cancelled) {
          setPage({ kind: "ready", inventory });
        }
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
    return (
      <section className="requests-overview">
        <PageHeader title="Stoc" lead={stockLead} />
        <PageStatus kind="loading">Se încarcă stocul…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="requests-overview">
        <PageHeader title="Stoc" lead={stockLead} />
        <PageStatus kind="error">Nu s-a putut încărca stocul.</PageStatus>
      </section>
    );
  }

  return (
    <section className="requests-overview">
      <PageHeader title="Stoc" lead={stockLead} />
      <div className="metric-band">
        <MetricCard
          label="Materiale"
          value={page.inventory.materialCount}
          icon={<Package size={40} strokeWidth={1.5} />}
        />
        <MetricCard
          label="Sold negativ"
          value={page.inventory.negativeCount}
          icon={<TriangleAlert size={40} strokeWidth={1.5} />}
          iconTone="warning"
        />
      </div>
      <Notice compact>
        <p>
          Identitatea materialului rămâne la Resurse. Aici se văd doar soldul și
          mișcările. Fără rezervări, achiziții sau preț.
        </p>
      </Notice>
      <h2>Materiale în stoc</h2>
      <ul className="requests-list">
        {page.inventory.items.map((item) => (
          <li key={item.resourceId}>
            <div className="registry-row">
              <div className="registry-row-identity">
                <Link
                  className="registry-row-name"
                  to={`/admin/stock/${item.resourceId}`}
                >
                  {item.label}
                </Link>
                <span className="registry-row-meta">
                  Sold curent: {formatQuantity(item.balance)} {item.unitLabel}
                </span>
              </div>
              <div className="requests-row-status">
                <span>{item.statusLabel}</span>
              </div>
              <Link
                className="registry-row-open"
                to={`/admin/stock/${item.resourceId}`}
                aria-label={`Deschide ${item.label}`}
              >
                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StockItemPage({ resourceId }: { resourceId: string }) {
  const canAdminister = useCanAdministerOrganization();
  const navigate = useNavigate();
  const [page, setPage] = useState<
    { kind: "loading" } | { kind: "error" } | { kind: "ready"; detail: InventoryItemDetail }
  >({ kind: "loading" });
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchInventoryItem(resourceId)
      .then((detail) => {
        if (!cancelled) {
          setPage({ kind: "ready", detail });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  async function submitAdjustment() {
    const parsed = Number(quantity.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed === 0) {
      setNotice("Cantitatea de ajustare nu este validă.");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      await recordInventoryAdjustment(resourceId, parsed, note.trim() || undefined);
      const detail = await fetchInventoryItem(resourceId);
      setPage({ kind: "ready", detail });
      setQuantity("");
      setNote("");
    } catch {
      setNotice("Ajustarea nu a putut fi înregistrată.");
    } finally {
      setBusy(false);
    }
  }

  if (page.kind === "loading") {
    return (
      <section className="request-object">
        <PageHeader title="Stoc" lead={stockLead} />
        <PageStatus kind="loading">Se încarcă materialul…</PageStatus>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section className="request-object">
        <Link className="client-object-back" to="/admin/stock" aria-label="Înapoi la stoc">
          <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          Înapoi la stoc
        </Link>
        <PageHeader title="Stoc" lead={stockLead} />
        <PageStatus kind="error">Materialul nu este urmărit în stoc.</PageStatus>
      </section>
    );
  }

  const { item, movements } = page.detail;
  const hasMovements = movements.length > 0;

  return (
    <section className="request-object">
      <Link className="client-object-back" to="/admin/stock" aria-label="Înapoi la stoc">
        <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Înapoi la stoc
      </Link>
      <header className="client-object-header">
        <div className="client-object-titles">
          <h1>{item.label}</h1>
          <p className="client-object-identity">{stockLead}</p>
          <StatusChip label={item.statusLabel} tone={stockTone(item.status)} />
        </div>
      </header>
      <section className="request-section">
        <h2>Sold</h2>
        <dl className="request-facts">
          <div>
            <dt>Sold curent</dt>
            <dd>
              {formatQuantity(item.balance)} {item.unitLabel}
            </dd>
          </div>
        </dl>
      </section>
      {!canAdminister ? <OwnerWriteHint /> : null}
      {canAdminister ? (
        <section className="request-section">
          <form
            className="people-create"
            onSubmit={(event) => {
              event.preventDefault();
              void submitAdjustment();
            }}
          >
            <Field
              label={hasMovements ? "Ajustare stoc" : "Înregistrează stoc inițial"}
              hint={`Unitate: ${item.unitLabel}. Plus adaugă, minus scade.`}
            >
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={busy}
              />
            </Field>
            <Field label="Notă">
              <input
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={busy}
              />
            </Field>
            <button type="submit" disabled={busy || quantity.trim().length === 0}>
              {hasMovements ? "Ajustare stoc" : "Înregistrează stoc inițial"}
            </button>
          </form>
        </section>
      ) : null}
      {notice ? <p className="status-bad">{notice}</p> : null}
      <section className="request-section">
        <h2>Mișcări</h2>
        {movements.length === 0 ? (
          <EmptyState title="Nu există mișcări de stoc pentru acest material." />
        ) : (
          <ul className="request-related-list">
            {movements.map((movement) => (
              <li key={movement.movementId}>
                <div className="request-related-row">
                  <span>
                    <span>
                      {movement.movementTypeLabel} {movement.quantityLabel}
                    </span>
                    <span>
                      {movement.sourceLabel ? `Task: ${movement.sourceLabel} · ` : ""}
                      {new Date(movement.recordedAt).toLocaleString("ro-RO")}
                      {movement.note ? ` · Notă: ${movement.note}` : ""}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p>
        <button type="button" className="button-quiet" onClick={() => navigate("/admin/resources")}>
          Vezi resursa în catalog
        </button>
      </p>
    </section>
  );
}

const stockLead =
  "Cât avem acum și ce mișcări au schimbat soldul. Nu este catalog de resurse, rezervare sau achiziție.";

function stockTone(status: InventoryItemDetail["item"]["status"]) {
  switch (status) {
    case "NEGATIVE":
      return "warn" as const;
    case "IN_STOCK":
      return "ok" as const;
    case "ZERO":
      return "progress" as const;
    case "NO_MOVEMENTS":
      return "neutral" as const;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
