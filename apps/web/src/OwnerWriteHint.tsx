import { OWNER_WRITE_HINT } from "./organizationAccess";

export function OwnerWriteHint() {
  return <p className="client-current-hint">{OWNER_WRITE_HINT}</p>;
}
