import type { OperatorTaskInboxProjection } from "@workos-final/domain";
import type { OperatorSessionOperator } from "./operatorSessionApi";
import { notifyCloudUnauthorized } from "./sessionExpiryBridge";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type OperatorTaskInboxResponse = {
  operator: OperatorSessionOperator | null;
  inbox: OperatorTaskInboxProjection | null;
};

export async function fetchOperatorTaskInbox(): Promise<OperatorTaskInboxResponse> {
  const response = await fetch(`${baseUrl}/api/operator-task-inbox`, {
    credentials: "include",
  });
  if (response.status === 401) {
    notifyCloudUnauthorized();
    throw new Error("operator_task_inbox_unavailable");
  }
  if (!response.ok) {
    throw new Error("operator_task_inbox_unavailable");
  }
  const body = (await response.json()) as OperatorTaskInboxResponse;
  return {
    operator: body.operator ?? null,
    inbox: body.inbox ?? null,
  };
}
