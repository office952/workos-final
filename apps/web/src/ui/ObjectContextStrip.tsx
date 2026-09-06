import type { ReactNode } from "react";

export type ObjectContextStripProps = {
  objectType?: string | null;
  displayId?: string | null;
  displayName?: string | null;
  returnTarget?: { label: string; href: string } | null;
  explicitParent?: { label: string; href?: string | null } | null;
};

/**
 * Quiet orientation strip. Formats truthful props only.
 * Does not derive lineage, readiness, commercial/execution state, or eligibility.
 */
export function ObjectContextStrip({
  objectType,
  displayId,
  displayName,
  returnTarget,
  explicitParent,
}: ObjectContextStripProps): ReactNode {
  const hasPrimary = Boolean(objectType || displayId || displayName);
  const hasParent = Boolean(explicitParent?.label);
  const hasReturn = Boolean(returnTarget?.label && returnTarget.href);
  if (!hasPrimary && !hasParent && !hasReturn) {
    return null;
  }

  return (
    <div className="object-context-strip" role="navigation" aria-label="Context obiect">
      {hasReturn ? (
        <a className="object-context-return" href={returnTarget!.href}>
          {returnTarget!.label}
        </a>
      ) : null}
      {hasParent ? (
        explicitParent?.href ? (
          <a className="object-context-parent" href={explicitParent.href}>
            {explicitParent.label}
          </a>
        ) : (
          <span className="object-context-parent">{explicitParent!.label}</span>
        )
      ) : null}
      {hasPrimary ? (
        <p className="object-context-primary">
          {objectType ? <span className="object-context-type">{objectType}</span> : null}
          {displayId ? <span className="object-context-id">{displayId}</span> : null}
          {displayName ? <strong className="object-context-name">{displayName}</strong> : null}
        </p>
      ) : null}
    </div>
  );
}
