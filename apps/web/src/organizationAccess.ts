import type { CloudAccessMode, CloudMembershipRole } from "./cloudSessionApi";

export const OWNER_WRITE_HINT =
  "Doar ownerul organizației poate modifica această zonă.";

export function canAdministerOrganization(input: {
  mode?: CloudAccessMode;
  role?: CloudMembershipRole | null;
}): boolean {
  if (input.mode !== "cloud") {
    return true;
  }
  return input.role === "owner";
}
