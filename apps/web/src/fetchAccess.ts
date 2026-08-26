import { notifyCloudUnauthorized } from "./sessionExpiryBridge";

export class FetchAccessError extends Error {
  readonly status: number;

  constructor(status: number, code = "forbidden") {
    super(code);
    this.name = "FetchAccessError";
    this.status = status;
  }
}

export function throwIfListFailed(response: Response, fallback: string): void {
  if (response.status === 401) {
    notifyCloudUnauthorized();
    throw new FetchAccessError(response.status, "forbidden");
  }
  if (response.status === 403) {
    throw new FetchAccessError(response.status, "forbidden");
  }
  if (!response.ok) {
    throw new Error(fallback);
  }
}

export function pageErrorKind(error: unknown): "forbidden" | "error" {
  if (error instanceof FetchAccessError) {
    return "forbidden";
  }
  if (error instanceof Error && error.message === "forbidden") {
    return "forbidden";
  }
  return "error";
}
