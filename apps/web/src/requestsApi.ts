import type {
  CommercialRequest,
  CommercialRequestStatus,
  RequestDetailProjection,
  RequestOverviewProjection,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchRequestOverview(): Promise<RequestOverviewProjection> {
  const response = await fetch(`${baseUrl}/api/requests`);
  const body = await readJson<{ overview?: RequestOverviewProjection }>(response);
  if (!response.ok || !body.overview) {
    throw new Error("requests_unavailable");
  }
  return body.overview;
}

export async function readRequestDetail(
  requestId: string,
): Promise<RequestDetailProjection | null> {
  const response = await fetch(
    `${baseUrl}/api/requests/${encodeURIComponent(requestId)}`,
  );
  if (response.status === 404) {
    return null;
  }
  const body = await readJson<{ detail?: RequestDetailProjection }>(response);
  if (!response.ok || !body.detail) {
    throw new Error("request_unavailable");
  }
  return body.detail;
}

export async function createCommercialRequest(input: {
  customerId: string;
  title: string;
  description: string;
}): Promise<RequestDetailProjection> {
  const response = await fetch(`${baseUrl}/api/requests`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await readJson<{
    detail?: RequestDetailProjection;
    request?: CommercialRequest;
    error?: string;
  }>(response);
  if (!response.ok || !body.detail) {
    throw new Error(body.error ?? "request_unavailable");
  }
  return body.detail;
}

export async function updateCommercialRequest(
  requestId: string,
  patch: {
    title?: string;
    description?: string;
    status?: CommercialRequestStatus;
    customerId?: string;
  },
): Promise<RequestDetailProjection> {
  const response = await fetch(
    `${baseUrl}/api/requests/${encodeURIComponent(requestId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    },
  );
  const body = await readJson<{
    detail?: RequestDetailProjection;
    error?: string;
  }>(response);
  if (!response.ok || !body.detail) {
    throw new Error(body.error ?? "request_unavailable");
  }
  return body.detail;
}
