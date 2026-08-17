import {
  isCommercialRequestStatus,
  type CommercialRequestLinkError,
  type CommercialRequestMutationError,
  type CommercialRequestStatus,
} from "@workos-final/domain";
import type { Hono } from "hono";
import type { ProductSystemRuntime } from "../productSystem/runtime.js";

export function registerRequestRoutes(app: Hono, runtime: ProductSystemRuntime): void {
  app.get("/api/requests", (c) => {
    return c.json({ overview: runtime.listRequestOverview() });
  });

  app.post("/api/requests", async (c) => {
    const body = await c.req.json().catch(() => null);
    const input = readCreateInput(body);
    if (!input) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.createCommercialRequest(
      input.customerId,
      input.title,
      input.description,
    );
    if (!result.ok) {
      return c.json({ error: result.error }, requestMutationStatus(result.error));
    }
    return c.json({ request: result.request, detail: runtime.readRequestDetail(result.request.requestId) }, 201);
  });

  app.get("/api/requests/:requestId", (c) => {
    const detail = runtime.readRequestDetail(c.req.param("requestId"));
    if (!detail) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ detail });
  });

  app.patch("/api/requests/:requestId", async (c) => {
    const body = await c.req.json().catch(() => null);
    const patch = readUpdateInput(body);
    if (!patch) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.updateCommercialRequest(c.req.param("requestId"), patch);
    if (!result.ok) {
      return c.json({ error: result.error }, requestMutationStatus(result.error));
    }
    return c.json({
      alreadyApplied: result.alreadyApplied,
      request: result.request,
      detail: runtime.readRequestDetail(result.request.requestId),
    });
  });

  app.post("/api/requests/:requestId/quotes", async (c) => {
    const body = await c.req.json().catch(() => null);
    const quoteSnapshotId = readQuoteSnapshotId(body);
    if (!quoteSnapshotId) {
      return c.json({ error: "invalid_payload" }, 400);
    }
    const result = runtime.linkRequestQuote(c.req.param("requestId"), quoteSnapshotId);
    if (!result.ok) {
      return c.json({ error: result.error }, requestLinkStatus(result.error));
    }
    return c.json({
      alreadyApplied: result.alreadyApplied,
      link: result.link,
      detail: runtime.readRequestDetail(c.req.param("requestId")),
    });
  });
}

function readCreateInput(body: unknown): {
  customerId: string;
  title: string;
  description: string;
} | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const payload = body as {
    customerId?: unknown;
    title?: unknown;
    description?: unknown;
  };
  if (
    typeof payload.customerId !== "string" ||
    typeof payload.title !== "string" ||
    typeof payload.description !== "string"
  ) {
    return null;
  }
  const customerId = payload.customerId.trim();
  if (!customerId) {
    return null;
  }
  return {
    customerId,
    title: payload.title,
    description: payload.description,
  };
}

function readUpdateInput(body: unknown): {
  title?: string;
  description?: string;
  status?: CommercialRequestStatus;
  customerId?: string;
} | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const payload = body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
    customerId?: unknown;
  };
  const patch: {
    title?: string;
    description?: string;
    status?: CommercialRequestStatus;
    customerId?: string;
  } = {};
  if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      return null;
    }
    patch.title = payload.title;
  }
  if (payload.description !== undefined) {
    if (typeof payload.description !== "string") {
      return null;
    }
    patch.description = payload.description;
  }
  if (payload.status !== undefined) {
    if (typeof payload.status !== "string" || !isCommercialRequestStatus(payload.status)) {
      return null;
    }
    patch.status = payload.status;
  }
  if (payload.customerId !== undefined) {
    if (typeof payload.customerId !== "string" || payload.customerId.trim().length === 0) {
      return null;
    }
    patch.customerId = payload.customerId.trim();
  }
  if (
    patch.title === undefined &&
    patch.description === undefined &&
    patch.status === undefined &&
    patch.customerId === undefined
  ) {
    return null;
  }
  return patch;
}

function readQuoteSnapshotId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("quoteSnapshotId" in body)) {
    return null;
  }
  const value = (body as { quoteSnapshotId: unknown }).quoteSnapshotId;
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function requestMutationStatus(error: CommercialRequestMutationError): 400 | 404 | 409 {
  switch (error) {
    case "invalid_title":
    case "invalid_description":
    case "invalid_status":
    case "customer_unavailable":
      return 400;
    case "not_found":
      return 404;
    case "customer_locked":
      return 409;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}

function requestLinkStatus(error: CommercialRequestLinkError): 400 | 404 | 409 {
  switch (error) {
    case "customer_mismatch":
    case "request_cancelled":
      return 400;
    case "not_found":
    case "quote_unavailable":
      return 404;
    case "quote_already_linked":
      return 409;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
