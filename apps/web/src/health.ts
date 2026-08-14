export type HealthState =
  | { kind: "loading" }
  | { kind: "connected" }
  | { kind: "unavailable" };

type HealthPayload = {
  status: string;
  service: string;
};

function isConnectedPayload(value: unknown): value is HealthPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as HealthPayload;
  return payload.status === "ok" && payload.service === "workos-final-api";
}

export async function fetchHealth(): Promise<HealthState> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  try {
    const response = await fetch(`${baseUrl}/api/health`);
    if (!response.ok) {
      return { kind: "unavailable" };
    }

    const payload: unknown = await response.json();
    return isConnectedPayload(payload)
      ? { kind: "connected" }
      : { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}
