import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { flattenCatalogProducts, type CatalogProductItem } from "../../../catalogProducts";
import { fetchProductCatalog } from "../../../productApi";
import { readRequestDetail } from "../../../requestsApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "missing-request" }
  | { kind: "error" }
  | {
      kind: "ready";
      requestId: string;
      requestReference: string | null;
      customerName: string | null;
      products: CatalogProductItem[];
    };

export function ProductPickBridge() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useContinuityFacts({
    requestId: page.kind === "ready" ? page.requestId : requestId,
    requestReference: page.kind === "ready" ? page.requestReference : null,
    customerName: page.kind === "ready" ? page.customerName : null,
  });

  useEffect(() => {
    let cancelled = false;
    if (!requestId) {
      setPage({ kind: "missing-request" });
      return;
    }
    setPage({ kind: "loading" });
    void Promise.all([readRequestDetail(requestId), fetchProductCatalog()])
      .then(([detail, tree]) => {
        if (cancelled) {
          return;
        }
        if (!detail) {
          setPage({ kind: "missing-request" });
          return;
        }
        setPage({
          kind: "ready",
          requestId,
          requestReference: detail.request.reference,
          customerName: detail.customerDisplayName,
          products: flattenCatalogProducts(tree),
        });
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

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă produsele disponibile…</p>;
  }
  if (page.kind === "missing-request") {
    return <p className="ui20-status">Alegerea produsului pornește dintr-o cerere.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Catalogul nu a putut fi încărcat.</p>;
  }
  if (page.kind !== "ready") {
    return null;
  }

  return (
    <article className="ui20-surface" data-surface="product-pick">
      <h1>Alege produsul</h1>
      <p className="ui20-kicker">
        Puncte de continuitate, nu un Catalog nou. Alege un produs disponibil și deschide
        configuratorul canonic
        {requestId ? " pe această cerere." : "."}
      </p>
      {page.products.length === 0 ? (
        <p>Nu există produse disponibile.</p>
      ) : (
        <div className="ui20-pick">
          {page.products.map((product) => (
            <Link
              key={product.code}
              to={`/products/${encodeURIComponent(product.code)}?request=${encodeURIComponent(page.requestId)}`}
              data-product-code={product.code}
            >
              <strong>{product.label}</strong>
              {product.categoryLabel ? <span>{product.categoryLabel}</span> : null}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
