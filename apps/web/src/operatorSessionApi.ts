import type { OperatorCandidate } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type OperatorSessionOperator = {
  personId: string;
  displayName: string;
  availability: "AVAILABLE" | "TEMPORARILY_UNAVAILABLE";
};

export type OperatorSessionInfo = {
  sessionId: string;
  expiresAt: string;
};

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchOperatorCandidates(): Promise<OperatorCandidate[]> {
  const response = await fetch(`${baseUrl}/api/operator-candidates`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("operator_candidates_unavailable");
  }
  const body = await readJson<{ candidates?: OperatorCandidate[] }>(response);
  return body.candidates ?? [];
}

export async function fetchOperatorSession(): Promise<{
  operator: OperatorSessionOperator | null;
  session: OperatorSessionInfo | null;
}> {
  const response = await fetch(`${baseUrl}/api/operator-session`, {
    credentials: "include",
  });
  if (response.status === 401) {
    return { operator: null, session: null };
  }
  if (!response.ok) {
    throw new Error("operator_session_unavailable");
  }
  const body = await readJson<{
    operator?: OperatorSessionOperator | null;
    session?: OperatorSessionInfo | null;
  }>(response);
  return {
    operator: body.operator ?? null,
    session: body.session ?? null,
  };
}

export async function identifyOperator(
  personId: string,
  pin: string,
): Promise<
  | { ok: true; operator: OperatorSessionOperator; session: OperatorSessionInfo }
  | { ok: false; error: string }
> {
  const response = await fetch(`${baseUrl}/api/operator-session`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ personId, pin }),
  });
  const body = await readJson<{
    operator?: OperatorSessionOperator;
    session?: OperatorSessionInfo;
    error?: string;
  }>(response);
  if (!response.ok || !body.operator || !body.session) {
    return { ok: false, error: body.error ?? "identify_failed" };
  }
  return { ok: true, operator: body.operator, session: body.session };
}

export async function logoutOperator(): Promise<void> {
  await fetch(`${baseUrl}/api/operator-session`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function setOperatorPin(
  personId: string,
  pin: string,
  confirmPin: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(
    `${baseUrl}/api/people/${encodeURIComponent(personId)}/operator-pin`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin, confirmPin }),
    },
  );
  const body = await readJson<{ error?: string }>(response);
  if (!response.ok) {
    return { ok: false, error: body.error ?? "pin_save_failed" };
  }
  return { ok: true };
}
