import type { KeyboardEvent } from "react";
import type { ConstructionCompositionNode } from "./constructionCompositionModel";
import { constructionBranchFor, constructionRowNodes } from "./constructionCompositionModel";

function visualOrder(
  nodes: readonly ConstructionCompositionNode[],
): ConstructionCompositionNode[] {
  return constructionRowNodes(nodes).flatMap((node) => [
    node,
    ...constructionBranchFor(nodes, node.id),
  ]);
}

export function ConstructionComposition({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: readonly ConstructionCompositionNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const row = constructionRowNodes(nodes);
  if (row.length === 0) {
    return null;
  }

  return (
    <div className="construction-composition">
      <p className="construction-composition-lead">
        Rolurile sunt construcție, nu pași.
      </p>
      <div
        className="construction-map"
        role="tablist"
        aria-label="Compoziție constructivă"
        aria-orientation="horizontal"
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          const order = visualOrder(nodes);
          const current = order.findIndex((node) => node.id === selectedId);
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            const next = order[Math.min(order.length - 1, current + 1)] ?? order[0];
            if (next) {
              onSelect(next.id);
              document.getElementById(`construction-tab-${next.id}`)?.focus();
            }
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            const previous = order[Math.max(0, current - 1)] ?? order[0];
            if (previous) {
              onSelect(previous.id);
              document.getElementById(`construction-tab-${previous.id}`)?.focus();
            }
          }
        }}
      >
        {row.map((node, index) => {
          const branch = constructionBranchFor(nodes, node.id);
          return (
            <div key={node.id} className="construction-cluster">
              {index > 0 ? <span className="construction-link" aria-hidden="true" /> : null}
              <div className="construction-cluster-stack">
                <CompositionNodeButton
                  node={node}
                  selected={node.id === selectedId}
                  onSelect={onSelect}
                />
                {branch.map((child) => (
                  <div key={child.id} className="construction-branch">
                    <span className="construction-stem" aria-hidden="true" />
                    <CompositionNodeButton
                      node={child}
                      selected={child.id === selectedId}
                      onSelect={onSelect}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompositionNodeButton({
  node,
  selected,
  onSelect,
}: {
  node: ConstructionCompositionNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const name = node.roleLabel ? `${node.label}, ${node.roleLabel}` : node.label;
  return (
    <button
      type="button"
      role="tab"
      id={`construction-tab-${node.id}`}
      aria-selected={selected}
      aria-controls="context-lens"
      tabIndex={selected ? 0 : -1}
      className={selected ? "construction-node is-selected" : "construction-node"}
      aria-label={name}
      onClick={() => onSelect(node.id)}
    >
      <span className="construction-node-label">{node.label}</span>
      {node.typeLabel ? (
        <span className="construction-node-type">{node.typeLabel}</span>
      ) : node.kind === "product" ? (
        <span className="construction-node-type">Identitate produs</span>
      ) : null}
    </button>
  );
}
