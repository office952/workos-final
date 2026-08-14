import {
  implementationStateLabel,
  type ImplementationState,
} from "@workos-final/domain";

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

export function StatePill({ state }: { state: ImplementationState }) {
  return <span className={stateClass(state)}>{implementationStateLabel(state)}</span>;
}
