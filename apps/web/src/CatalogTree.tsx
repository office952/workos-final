import { Link } from "react-router-dom";
import type { CatalogTreeNode } from "@workos-final/domain";

type CatalogTreeProps = {
  nodes: readonly CatalogTreeNode[];
};

export function CatalogTree({ nodes }: CatalogTreeProps) {
  return (
    <ul className="catalog-tree">
      {nodes.map((node) => (
        <CatalogNode key={nodeKey(node)} node={node} />
      ))}
    </ul>
  );
}

function CatalogNode({ node }: { node: CatalogTreeNode }) {
  switch (node.kind) {
    case "family":
      return (
        <li>
          <h2>{node.label}</h2>
          {node.description ? <p className="page-lead">{node.description}</p> : null}
          <CatalogTree nodes={node.children} />
        </li>
      );
    case "category":
      return (
        <li>
          <h3>{node.label}</h3>
          {node.children.length === 0 ? (
            <p>Nu există încă produse în această categorie.</p>
          ) : (
            <CatalogTree nodes={node.children} />
          )}
        </li>
      );
    case "product":
      return (
        <li>
          <Link to={`/products/${node.code}`}>{node.label}</Link>
          {node.description ? <p className="page-lead">{node.description}</p> : null}
        </li>
      );
    default: {
      const _exhaustive: never = node;
      return _exhaustive;
    }
  }
}

function nodeKey(node: CatalogTreeNode): string {
  switch (node.kind) {
    case "family":
    case "category":
      return `${node.kind}:${node.id}`;
    case "product":
      return `${node.kind}:${node.code}`;
    default: {
      const _exhaustive: never = node;
      return _exhaustive;
    }
  }
}
