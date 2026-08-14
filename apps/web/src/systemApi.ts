import type {
  GovernanceProjection,
  OperationalProcessesAdminProjection,
  ProductSystemAdminProjection,
  ProductSystemEntityKind,
  ResourcesAdminProjection,
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

export async function patchDisplayLabel(input: {
  entityKind: ProductSystemEntityKind;
  entityId: string;
  displayLabel: string;
  revision: number;
}): Promise<{ displayLabel: string; revision: number }> {
  const response = await fetch(
    `${baseUrl}/api/admin/product-system/entities/${input.entityKind}/${input.entityId}/display-label`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        displayLabel: input.displayLabel,
        revision: input.revision,
      }),
    },
  );
  const body = (await response.json()) as {
    error?: string;
    displayLabel?: string;
    revision?: number;
  };
  if (!response.ok) {
    throw new Error(body.error ?? "display_label_write_failed");
  }
  if (!body.displayLabel || typeof body.revision !== "number") {
    throw new Error("display_label_write_failed");
  }
  return { displayLabel: body.displayLabel, revision: body.revision };
}

export async function fetchOperationalProcessesAdministration(): Promise<OperationalProcessesAdminProjection> {
  const response = await fetch(`${baseUrl}/api/operational-processes`);
  if (!response.ok) {
    throw new Error("operational_processes_unavailable");
  }
  return readJson<OperationalProcessesAdminProjection>(response);
}

export async function fetchResourcesAdministration(): Promise<ResourcesAdminProjection> {
  const response = await fetch(`${baseUrl}/api/resources-admin`);
  if (!response.ok) {
    throw new Error("resources_admin_unavailable");
  }
  return readJson<ResourcesAdminProjection>(response);
}

export async function fetchSystemGovernance(): Promise<GovernanceProjection> {
  const response = await fetch(`${baseUrl}/api/governance`);
  if (!response.ok) {
    throw new Error("governance_unavailable");
  }
  return readJson<GovernanceProjection>(response);
}
