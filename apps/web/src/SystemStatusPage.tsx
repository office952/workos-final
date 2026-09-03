import { useEffect, useState } from "react";
import { HealthStatus } from "./HealthStatus";
import { fetchHealth, type HealthState } from "./health";
import { PageHeader } from "./ui/PageHeader";

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
    <section>
      <PageHeader
        title="Stare sistem"
        lead="Verificarea conexiunii cu sistemul."
      />
      <div aria-live="polite">
        <HealthStatus state={state} />
      </div>
    </section>
  );
}
