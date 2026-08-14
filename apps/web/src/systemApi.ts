import type {
  ComponentRoleProjection,
  GovernanceProjection,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchComponentArchitecture(): Promise<
  ComponentRoleProjection[]
> {
  const response = await fetch(`${baseUrl}/api/components`);
  if (!response.ok) {
    throw new Error("components_unavailable");
  }
  const body = await readJson<{ roles: ComponentRoleProjection[] }>(response);
  return body.roles;
}

export async function fetchSystemGovernance(): Promise<GovernanceProjection> {
  const response = await fetch(`${baseUrl}/api/governance`);
  if (!response.ok) {
    throw new Error("governance_unavailable");
  }
  return readJson<GovernanceProjection>(response);
}
