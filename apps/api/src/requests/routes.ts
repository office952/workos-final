import {
  isCommercialRequestStatus,
  MAX_REQUEST_ATTACHMENT_HTTP_BODY_BYTES,
  safeAttachmentDownloadAsciiName,
  type CommercialRequestLinkError,
  type CommercialRequestMutationError,
  type CommercialRequestStatus,
  type RequestAttachmentError,
} from "@workos-final/domain";
import type { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { getProductSystem, type ApiEnv } from "../cloud/context.js";

export function registerRequestRoutes(app: Hono<ApiEnv>): void {
  app.get("/api/requests", (c) => {
    const runtime = getProductSystem(c);
    return c.json({ overview: runtime.listRequestOverview() });
  });

  app.post("/api/requests", async (c) => {
    const runtime = getProductSystem(c);
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
    const runtime = getProductSystem(c);
    const detail = runtime.readRequestDetail(c.req.param("requestId"));
    if (!detail) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ detail });
  });

  app.patch("/api/requests/:requestId", async (c) => {
    const runtime = getProductSystem(c);
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
    const runtime = getProductSystem(c);
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

  app.get("/api/requests/:requestId/attachments", (c) => {
    const runtime = getProductSystem(c);
    const attachments = runtime.listRequestAttachments(c.req.param("requestId"));
    if (!attachments) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({ attachments });
  });

  app.post(
    "/api/requests/:requestId/attachments",
    bodyLimit({
      maxSize: MAX_REQUEST_ATTACHMENT_HTTP_BODY_BYTES,
      onError: (c) => c.json({ error: "file_too_large" }, 413),
    }),
    async (c) => {
      const runtime = getProductSystem(c);
      const body = await c.req.parseBody();
      const file = body["file"];
      if (!(file instanceof File) || file.size === 0) {
        return c.json({ error: "invalid_file" }, 400);
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = runtime.createRequestAttachment(c.req.param("requestId"), {
        originalFileName: file.name || "fisier",
        mimeType: file.type || null,
        bytes,
      });
      if (!result.ok) {
        return c.json(
          { error: result.error },
          requestAttachmentStatus(result.error),
        );
      }
      return c.json(
        {
          attachment: result.attachment,
          detail: runtime.readRequestDetail(c.req.param("requestId")),
        },
        201,
      );
    },
  );

  app.get("/api/requests/:requestId/attachments/:attachmentId/download", (c) => {
    const runtime = getProductSystem(c);
    const result = runtime.readRequestAttachmentDownload(
      c.req.param("requestId"),
      c.req.param("attachmentId"),
    );
    if (!result.ok) {
      return c.json(
        { error: result.error },
        requestAttachmentStatus(result.error),
      );
    }
    const ascii = safeAttachmentDownloadAsciiName(result.attachment.originalFileName);
    const utf8 = encodeURIComponent(result.attachment.originalFileName);
    return c.body(Buffer.from(result.bytes), 200, {
      "Content-Type": result.attachment.mimeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`,
      "Content-Length": String(result.bytes.byteLength),
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
  optionalScopeIds?: readonly string[];
} | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const payload = body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
    customerId?: unknown;
    optionalScopeIds?: unknown;
  };
  const patch: {
    title?: string;
    description?: string;
    status?: CommercialRequestStatus;
    customerId?: string;
    optionalScopeIds?: readonly string[];
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
  if (payload.optionalScopeIds !== undefined) {
    if (!Array.isArray(payload.optionalScopeIds)) {
      return null;
    }
    const optionalScopeIds: string[] = [];
    for (const value of payload.optionalScopeIds) {
      if (typeof value !== "string" || value.trim().length === 0) {
        return null;
      }
      optionalScopeIds.push(value.trim());
    }
    patch.optionalScopeIds = optionalScopeIds;
  }
  if (
    patch.title === undefined &&
    patch.description === undefined &&
    patch.status === undefined &&
    patch.customerId === undefined &&
    patch.optionalScopeIds === undefined
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
    case "reference_unavailable":
    case "unknown_optional_scope":
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

function requestAttachmentStatus(
  error: RequestAttachmentError,
): 400 | 404 | 409 | 413 | 503 {
  switch (error) {
    case "invalid_file":
    case "request_cancelled":
      return 400;
    case "file_too_large":
      return 413;
    case "not_found":
    case "file_missing":
      return 404;
    case "file_corrupt":
      return 409;
    case "storage_unavailable":
      return 503;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
