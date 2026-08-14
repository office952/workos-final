import { useEffect, useState } from "react";
import type { ComponentRoleProjection } from "@workos-final/domain";
import { fetchComponentArchitecture } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; roles: ComponentRoleProjection[] };

export function ComponentsPage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchComponentArchitecture()
      .then((roles) => {
        if (!cancelled) {
          setPage({ kind: "ready", roles });
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
    return <p>Se încarcă componentele…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca componentele.</p>;
  }

  return (
    <section>
      <h1>Module și componente</h1>
      <p className="page-lead">
        Componentele de produs reutilizabile. Titlul păstrează și «module» pentru
        modulele de sistem viitoare. Această pagină proiectează contractele existente;
        nu le editează.
      </p>
      <div className="card-grid">
        {page.roles.map((role) => (
          <article key={role.role} className="info-card">
            <p className="catalog-kind">Componentă</p>
            <h2>{role.label}</h2>
            <p>Deține: {role.owns.join("; ")}.</p>
            {role.variants.map((variant) => (
              <div key={variant.variantId} className="variant-block">
                <h3>Variantă: {variant.label}</h3>
                <ul>
                  <li>Calcul independent: {variant.independentCalculation ? "Da" : "Nu"}</li>
                  <li>Măsurare: {variant.measurement}</li>
                  <li>Cantitate: {variant.quantity}</li>
                  <li>Cost intern: {variant.eic}</li>
                  {variant.usedBy.length > 0 ? (
                    <li>
                      Folosită de:{" "}
                      {variant.usedBy
                        .map((item) =>
                          item.inputNote
                            ? `${item.productLabel} (${item.inputNote})`
                            : item.productLabel,
                        )
                        .join("; ")}
                    </li>
                  ) : (
                    <li>Folosită de: niciun produs încă</li>
                  )}
                  {variant.gaps.length > 0 ? (
                    <li>Lipsă: {variant.gaps.join("; ")}</li>
                  ) : null}
                </ul>
                <details>
                  <summary>Detalii tehnice</summary>
                  <p>
                    Rol: {role.role}. Variantă internă: {variant.variantId}.
                  </p>
                </details>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
