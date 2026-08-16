import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { InventoryItemDetail, InventoryStockProjection } from "@workos-final/domain";
import { formatQuantity } from "./formatDisplay";
import {
  fetchInventory,
  fetchInventoryItem,
  recordInventoryAdjustment,
} from "./inventoryApi";
import { EmptyState } from "./ui/EmptyState";
import { Field } from "./ui/Field";
import { Notice } from "./ui/Notice";
import { PageHeader } from "./ui/PageHeader";
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
      <section>
        <PageHeader title="Stoc" lead={stockLead} />
        <p>Se încarcă stocul…</p>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader title="Stoc" lead={stockLead} />
        <p>Nu s-a putut încărca stocul.</p>
      </section>
    );
  }

  return (
    <section>
      <PageHeader title="Stoc" lead={stockLead} />
      <p className="page-summary">
        {page.inventory.materialCount} materiale urmărite
        {page.inventory.negativeCount > 0
          ? ` · ${page.inventory.negativeCount} cu sold negativ`
          : ""}
      </p>
      <Notice compact>
        <p>
          Identitatea materialului rămâne la Resurse. Aici se văd doar soldul și
          mișcările. Fără rezervări, achiziții sau preț.
        </p>
      </Notice>
      <h2>Materiale în stoc</h2>
      <ul className="stock-list">
        {page.inventory.items.map((item) => (
          <li key={item.resourceId}>
            <Link className="catalog-product-link" to={`/admin/stock/${item.resourceId}`}>
              {item.label}
            </Link>
            <p>
              Sold curent: {formatQuantity(item.balance)} {item.unitLabel}
            </p>
            <StatusChip label={item.statusLabel} tone={stockTone(item.status)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StockItemPage({ resourceId }: { resourceId: string }) {
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
      <section>
        <PageHeader title="Stoc" lead={stockLead} />
        <p>Se încarcă materialul…</p>
      </section>
    );
  }
  if (page.kind === "error") {
    return (
      <section>
        <PageHeader title="Stoc" lead={stockLead} />
        <p>Materialul nu este urmărit în stoc.</p>
        <p>
          <Link to="/admin/stock">Înapoi la stoc</Link>
        </p>
      </section>
    );
  }

  const { item, movements } = page.detail;
  const hasMovements = movements.length > 0;

  return (
    <section>
      <p>
        <Link to="/admin/stock">Înapoi la stoc</Link>
      </p>
      <PageHeader title={item.label} lead={stockLead} />
      <p className="page-summary">
        Sold curent: {formatQuantity(item.balance)} {item.unitLabel}
      </p>
      <StatusChip label={item.statusLabel} tone={stockTone(item.status)} />
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
      {notice ? <p className="status-bad">{notice}</p> : null}
      <h2>Mișcări</h2>
      {movements.length === 0 ? (
        <EmptyState title="Nu există mișcări de stoc pentru acest material." />
      ) : (
        <ul className="stock-movements">
          {movements.map((movement) => (
            <li key={movement.movementId}>
              <p>
                {movement.movementTypeLabel} {movement.quantityLabel}
              </p>
              {movement.sourceLabel ? <p>Task: {movement.sourceLabel}</p> : null}
              <p>{new Date(movement.recordedAt).toLocaleString("ro-RO")}</p>
              {movement.note ? <p>Notă: {movement.note}</p> : null}
              <details>
                <summary>Detalii</summary>
                <p>Referință: {movement.movementId}</p>
                <p>Sursă: {movement.sourceId}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
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
