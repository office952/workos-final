import type {
  OperationalServicesAdminProjection,
  OrganizationServiceOfferMode,
  OrganizationServiceOfferRecord,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchOperationalServices(): Promise<OperationalServicesAdminProjection> {
  const response = await fetch(`${baseUrl}/api/operational-services`);
  const body = await readJson<{ services?: OperationalServicesAdminProjection }>(response);
  if (!response.ok || !body.services) {
    throw new Error("operational_services_unavailable");
  }
  return body.services;
}

export async function updateOperationalServiceOffer(
  capabilityId: string,
  offerMode: OrganizationServiceOfferMode,
): Promise<{
  record: OrganizationServiceOfferRecord;
  services: OperationalServicesAdminProjection;
}> {
  const response = await fetch(
    `${baseUrl}/api/operational-services/${encodeURIComponent(capabilityId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offerMode }),
    },
  );
  const body = await readJson<{
    record?: OrganizationServiceOfferRecord;
    services?: OperationalServicesAdminProjection;
    error?: string;
  }>(response);
  if (!response.ok || !body.record || !body.services) {
    throw new Error(body.error ?? "operational_services_update_failed");
  }
  return { record: body.record, services: body.services };
}
