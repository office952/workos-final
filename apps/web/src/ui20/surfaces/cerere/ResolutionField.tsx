import type { RequestDetailProjection } from "@workos-final/domain";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePathIdAfter } from "../../../navigation/usePathIdAfter";
import type { RequestObjectPrimaryAction } from "../../../requestObjectView";
import { readRequestDetail } from "../../../requestsApi";
import {
  requestKnownFacts,
  requestResolutionPrimaryAction,
  requestUnresolvedItems,
} from "../../../requestResolutionView";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type PageState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error" }
  | { kind: "ready"; detail: RequestDetailProjection };

function samePrimaryAction(
  left: RequestObjectPrimaryAction,
  right: RequestObjectPrimaryAction,
): boolean {
  if (left.kind !== right.kind || left.label !== right.label) {
    return false;
  }
  switch (left.kind) {
    case "href":
      if (right.kind !== "href") {
        return false;
      }
      return left.href === right.href;
    case "focus":
      if (right.kind !== "focus") {
        return false;
      }
      return left.targetId === right.targetId;
    default: {
      const _never: never = left;
      return _never;
    }
  }
}

function northStarHref(href: string | undefined): string | null {
  if (!href) {
    return null;
  }
  if (
    href.startsWith("/requests/") ||
    href.startsWith("/quotes/") ||
    href.startsWith("/jobs/") ||
    href.startsWith("/products") ||
    href.startsWith("/atelier") ||
    href.startsWith("/execution/")
  ) {
    return href;
  }
  return null;
}

function ActionControl({
  action,
}: {
  action: NonNullable<ReturnType<typeof requestResolutionPrimaryAction>>;
}) {
  if (action.kind === "href") {
    return (
      <Link to={action.href} data-next-action={action.label}>
        {action.label}
      </Link>
    );
  }
  return (
    <a href={`#${action.targetId}`} data-next-action={action.label}>
      {action.label}
    </a>
  );
}

export function ResolutionField() {
  const requestId = usePathIdAfter("/requests/");
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    if (!requestId) {
      setPage({ kind: "missing" });
      return;
    }
    setPage({ kind: "loading" });
    void readRequestDetail(requestId)
      .then((detail) => {
        if (!cancelled) {
          setPage(detail ? { kind: "ready", detail } : { kind: "missing" });
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
  }, [requestId]);

  const detail = page.kind === "ready" ? page.detail : null;
  useContinuityFacts({
    requestId: detail?.request.requestId,
    requestReference: detail?.request.reference,
    customerName: detail?.customerDisplayName,
    quoteId: detail?.linkedOffers[0]?.quoteSnapshotId,
    quoteReference: detail?.linkedOffers[0]?.reference,
  });

  if (page.kind === "loading") {
    return <p className="ui20-status">Se încarcă cererea…</p>;
  }
  if (page.kind === "missing") {
    return <p className="ui20-error">Cererea nu a fost găsită.</p>;
  }
  if (page.kind === "error") {
    return <p className="ui20-error">Cererea nu a putut fi încărcată.</p>;
  }

  const known = requestKnownFacts(page.detail);
  const unresolved = requestUnresolvedItems(page.detail);
  const primary = requestResolutionPrimaryAction(page.detail);
  const primaryShownInUnresolved = Boolean(
    primary &&
      unresolved.some((item) => item.action && samePrimaryAction(item.action, primary)),
  );

  return (
    <article className="ui20-surface" data-surface="cerere" data-instrument="resolution">
      <h1>{page.detail.request.title}</h1>
      <p className="ui20-kicker">{page.detail.request.reference}</p>
      <div className="ui20-resolution">
        <section className="ui20-plane" data-plane="known" aria-labelledby="known-heading">
          <h2 id="known-heading">Cunoscut</h2>
          <dl className="ui20-fact-list">
            {known.map((fact) => {
              const href = northStarHref(fact.href);
              return (
                <div key={fact.id} className="ui20-fact">
                  <dt>{fact.label}</dt>
                  <dd>{href ? <Link to={href}>{fact.value}</Link> : fact.value}</dd>
                </div>
              );
            })}
          </dl>
        </section>
        <section
          className="ui20-plane"
          data-plane="unresolved"
          aria-labelledby="unresolved-heading"
        >
          <h2 id="unresolved-heading">Nerezolvat</h2>
          {unresolved.length === 0 ? (
            <p>Nimic deschis pe această cerere.</p>
          ) : (
            unresolved.map((item) => (
              <div
                key={item.id}
                className={item.energy === "blocked" ? "ui20-blocked-item" : "ui20-open-item"}
                data-energy={item.energy}
              >
                <strong>{item.title}</strong>
                {item.cause ? <p className="ui20-meta">{item.cause}</p> : null}
                {item.consequence ? <p>{item.consequence}</p> : null}
                {item.action ? (
                  <p className="ui20-actions">
                    <ActionControl action={item.action} />
                  </p>
                ) : null}
              </div>
            ))
          )}
          <section id="request-installation" aria-labelledby="next-heading">
            <h2 id="next-heading">Următoarea acțiune</h2>
            {primary && !primaryShownInUnresolved ? (
              <p className="ui20-actions">
                <ActionControl action={primary} />
              </p>
            ) : null}
            {!primary ? <p>Nu există o acțiune operator pe această cerere.</p> : null}
          </section>
        </section>
      </div>
    </article>
  );
}
