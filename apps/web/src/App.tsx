import { useEffect, useState } from "react";
import { HealthStatus } from "./HealthStatus";
import { fetchHealth, type HealthState } from "./health";

export function App() {
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
    <main>
      <h1>WorkOS Final</h1>
      <section aria-live="polite">
        <h2>Stare sistem</h2>
        <HealthStatus state={state} />
      </section>
    </main>
  );
}
