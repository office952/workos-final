import type {
  GovernanceProjection,
  ProductSystemAdminProjection,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchProductSystemAdministration(): Promise<ProductSystemAdminProjection> {
  const response = await fetch(`${baseUrl}/api/product-system-admin`);
  if (!response.ok) {
    throw new Error("product_system_admin_unavailable");
  }
  return readJson<ProductSystemAdminProjection>(response);
}

export async function fetchSystemGovernance(): Promise<GovernanceProjection> {
  const response = await fetch(`${baseUrl}/api/governance`);
  if (!response.ok) {
    throw new Error("governance_unavailable");
  }
  return readJson<GovernanceProjection>(response);
}
