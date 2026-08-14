import { useEffect, useState } from "react";
import { HealthStatus } from "./HealthStatus";
import { fetchHealth, type HealthState } from "./health";

export function SystemStatusPage() {
  const [state, setState] = useState<HealthState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    void fetchHealth().then((nextState) => {
      if (!cancelled) {
        setState(nextState);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="system-status-heading">
      <h1 id="system-status-heading">Stare sistem</h1>
      <p className="page-lead">Verificarea conexiunii cu sistemul.</p>
      <div aria-live="polite">
        <HealthStatus state={state} />
      </div>
    </section>
  );
}
