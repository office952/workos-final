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

export async function uploadRequestAttachment(
  requestId: string,
  file: File,
): Promise<RequestDetailProjection> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${baseUrl}/api/requests/${encodeURIComponent(requestId)}/attachments`,
    {
      method: "POST",
      body: form,
    },
  );
  const body = await readJson<{
    detail?: RequestDetailProjection;
    error?: string;
  }>(response);
  if (!response.ok || !body.detail) {
    throw new Error(body.error ?? "attachment_unavailable");
  }
  return body.detail;
}

export function requestAttachmentErrorMessage(error: string): string {
  switch (error) {
    case "file_too_large":
      return "Fișierul depășește limita permisă.";
    case "request_cancelled":
      return "Cererea anulată nu mai acceptă fișiere noi.";
    case "invalid_file":
      return "Fișierul nu este valid.";
    case "not_found":
      return "Cererea sau fișierul nu este disponibil.";
    case "file_missing":
      return "Fișierul nu este disponibil în stocarea aplicației.";
    case "file_corrupt":
      return "Fișierul salvat nu mai corespunde înregistrării din WorkOS.";
    case "storage_unavailable":
      return "Fișierul nu a putut fi salvat.";
    default:
      return "Fișierul nu a putut fi încărcat.";
  }
}
