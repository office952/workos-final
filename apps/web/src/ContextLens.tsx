import type { ReactNode } from "react";
import type { ConstructionCompositionNode } from "./constructionCompositionModel";

export function ContextLens({
  node,
  children,
}: {
  node: ConstructionCompositionNode | null;
  children: ReactNode;
}) {
  if (!node) {
    return (
      <section className="context-lens" id="context-lens">
        <h2>Context</h2>
        <p>Selectează un rol din compoziție.</p>
      </section>
    );
  }

  return (
    <section
      className="context-lens"
      id="context-lens"
      role="tabpanel"
      aria-labelledby={`construction-tab-${node.id}`}
    >
      <header className="context-lens-header">
        <h2>{node.kind === "product" ? "Produs" : node.label}</h2>
        <p className="context-lens-meta">
          {[node.roleLabel ? `Rol: ${node.roleLabel}` : null, node.typeLabel ? `Tip: ${node.typeLabel}` : null]
            .filter((part): part is string => Boolean(part))
            .join(" · ")}
        </p>
        {node.identityFacts.length > 0 ? (
          <dl className="context-lens-facts">
            {node.identityFacts.map((fact) => (
              <div key={fact.id}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>
      {children}
    </section>
  );
}
