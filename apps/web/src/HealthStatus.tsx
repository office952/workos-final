import type { HealthState } from "./health";

type HealthStatusProps = {
  state: HealthState;
};

export function HealthStatus({ state }: HealthStatusProps) {
  switch (state.kind) {
    case "loading":
      return <p className="status-loading">Se verifică conexiunea cu backend-ul…</p>;
    case "connected":
      return <p className="status-ok">Backend conectat</p>;
    case "unavailable":
      return <p className="status-bad">Backend indisponibil</p>;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
