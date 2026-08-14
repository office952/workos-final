import { useEffect, useState } from "react";
import {
  implementationStateLabel,
  type GovernanceProjection,
  type ImplementationState,
} from "@workos-final/domain";
import { fetchSystemGovernance } from "./systemApi";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; governance: GovernanceProjection };

function stateClass(state: ImplementationState): string {
  switch (state) {
    case "IMPLEMENTED":
      return "state-pill state-implemented";
    case "POLICY_CONFIRMED":
      return "state-pill state-policy";
    case "PLANNED":
      return "state-pill state-planned";
    case "NOT_IMPLEMENTED":
      return "state-pill state-missing";
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

function StatePill({ state }: { state: ImplementationState }) {
  return <span className={stateClass(state)}>{implementationStateLabel(state)}</span>;
}

export function GovernancePage() {
  const [page, setPage] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void fetchSystemGovernance()
      .then((governance) => {
        if (!cancelled) {
          setPage({ kind: "ready", governance });
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
    return <p>Se încarcă guvernanța…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-a putut încărca guvernanța sistemului.</p>;
  }

  const { governance } = page;

  return (
    <section>
      <h1>Guvernanța sistemului</h1>
      <p className="page-lead">
        Limitele de autoritate ale sistemului actual. Pagina proiectează regulile din
        domeniu; nu le rescrie.
      </p>

      <article className="info-card">
        <h2>Cine deține adevărul</h2>
        <ul className="authority-list">
          {governance.authorities.map((item) => (
            <li key={item.id}>
              <div className="authority-head">
                <strong>{item.label}</strong>
                <StatePill state={item.state} />
              </div>
              <p>Deține: {item.owns.join("; ")}.</p>
            </li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h2>Limitele sistemelor</h2>
        <ul>
          {governance.boundaries.map((item) => (
            <li key={item.id}>
              <div className="authority-head">
                <strong>{item.label}</strong>
                <StatePill state={item.state} />
              </div>
              <p>{item.statement}</p>
            </li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h2>Surse de adevăr</h2>
        <ul>
          {governance.sources.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h2>Owner gates</h2>
        <ul>
          {governance.ownerGates.map((item) => (
            <li key={item.id}>{item.statement}</li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h2>Reguli de protecție</h2>
        <ul>
          {governance.protectionRules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="info-card">
        <h2>Starea roadmap-ului</h2>
        <ul className="authority-list">
          {governance.roadmap.map((item) => (
            <li key={item.id}>
              <div className="authority-head">
                <span>{item.label}</span>
                <StatePill state={item.state} />
              </div>
            </li>
          ))}
        </ul>
        <div className="authority-head">
          <strong>{governance.freeze.label}</strong>
          <StatePill state={governance.freeze.state} />
        </div>
        <p>{governance.freeze.note}</p>
      </article>

      <article className="info-card">
        <h2>Reguli UI / proiecție</h2>
        <ul>
          {governance.uiRules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{governance.terminology.moduleNote}</p>
        <details>
          <summary>Detalii nucleu de capabilități</summary>
          <p>{governance.capabilityKernelNote}</p>
          <ul>
            {governance.capabilityKernelStatuses.map((item) => (
              <li key={item.id}>
                {item.id}: {item.status}
              </li>
            ))}
          </ul>
        </details>
      </article>
    </section>
  );
}
