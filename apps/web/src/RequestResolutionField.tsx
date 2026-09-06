import { Link } from "react-router-dom";
import type { RequestDetailProjection } from "@workos-final/domain";
import { ClientLink } from "./ClientLink";
import {
  requestKnownFacts,
  requestResolutionPrimaryAction,
  requestUnresolvedItems,
} from "./requestResolutionView";
import type { RequestObjectPrimaryAction } from "./requestObjectView";

function sameResolutionAction(
  left: RequestObjectPrimaryAction | null,
  right: RequestObjectPrimaryAction | null,
): boolean {
  if (!left || !right || left.kind !== right.kind) {
    return false;
  }
  if (left.kind === "href" && right.kind === "href") {
    return left.href === right.href && left.label === right.label;
  }
  return left.kind === "focus" && right.kind === "focus" && left.targetId === right.targetId;
}

export function RequestResolutionField({
  detail,
  onFocusTarget,
}: {
  detail: RequestDetailProjection;
  onFocusTarget: (id: string) => void;
}) {
  const known = requestKnownFacts(detail);
  const unresolved = requestUnresolvedItems(detail);
  const primary = requestResolutionPrimaryAction(detail);

  return (
    <div className="request-resolution-field">
      <section className="request-known" aria-labelledby="request-known-heading">
        <h2 id="request-known-heading">Cunoscut</h2>
        <dl className="request-resolution-facts">
          {known.map((fact) => (
            <div key={fact.id}>
              <dt>{fact.label}</dt>
              <dd>
                {fact.id === "client" ? (
                  <ClientLink
                    customerId={detail.request.customerId}
                    displayName={detail.customerDisplayName}
                    prefix=""
                  />
                ) : fact.href ? (
                  <Link to={fact.href}>{fact.value}</Link>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="request-unresolved" aria-labelledby="request-unresolved-heading">
        <h2 id="request-unresolved-heading">Nerezolvat</h2>
        {unresolved.length === 0 ? (
          <p className="request-unresolved-empty">Nimic de rezolvat pe această cerere.</p>
        ) : (
          <ul className="request-unresolved-list">
            {unresolved.map((item) => (
              <li
                key={item.id}
                className={
                  item.energy === "blocked"
                    ? "request-unresolved-item request-attention-edge"
                    : "request-unresolved-item"
                }
              >
                <p className="request-unresolved-title">{item.title}</p>
                {item.cause ? <p className="request-unresolved-cause">{item.cause}</p> : null}
                {item.consequence ? (
                  <p className="request-unresolved-consequence">{item.consequence}</p>
                ) : null}
                {item.action && !sameResolutionAction(item.action, primary) ? (
                  <ResolutionAction action={item.action} onFocusTarget={onFocusTarget} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {primary ? (
          <div className="request-resolution-next">
            <ResolutionAction action={primary} onFocusTarget={onFocusTarget} dominant />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ResolutionAction({
  action,
  onFocusTarget,
  dominant = false,
}: {
  action: NonNullable<ReturnType<typeof requestResolutionPrimaryAction>>;
  onFocusTarget: (id: string) => void;
  dominant?: boolean;
}) {
  if (action.kind === "href") {
    return (
      <Link className={dominant ? "button-link" : "button-quiet"} to={action.href}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" className={dominant ? undefined : "button-quiet"} onClick={() => onFocusTarget(action.targetId)}>
      {action.label}
    </button>
  );
}
