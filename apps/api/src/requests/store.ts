import {
  createCommercialRequest,
  linkCommercialRequestQuote,
  updateCommercialRequest,
  type CommercialRequest,
  type CommercialRequestAttachment,
  type CommercialRequestLinkResult,
  type CommercialRequestMutationResult,
  type CommercialRequestQuoteLink,
  type CommercialRequestStatus,
  type Customer,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type RequestRow = {
  request_id: string;
  reference: string;
  customer_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type LinkRow = {
  request_id: string;
  quote_snapshot_id: string;
  linked_at: string;
};

function requestFromRow(row: RequestRow): CommercialRequest {
  return {
    requestId: row.request_id,
    reference: row.reference,
    customerId: row.customer_id,
    title: row.title,
    description: row.description,
    status: row.status as CommercialRequestStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function linkFromRow(row: LinkRow): CommercialRequestQuoteLink {
  return {
    requestId: row.request_id,
    quoteSnapshotId: row.quote_snapshot_id,
    linkedAt: row.linked_at,
  };
}

export function listCommercialRequests(db: SqliteDatabase): CommercialRequest[] {
  const rows = db
    .prepare(
      `
      SELECT request_id, reference, customer_id, title, description, status, created_at, updated_at
      FROM commercial_requests
      ORDER BY created_at DESC
    `,
    )
    .all() as RequestRow[];
  return rows.map(requestFromRow);
}

export function getCommercialRequest(
  db: SqliteDatabase,
  requestId: string,
): CommercialRequest | null {
  const row = db
    .prepare(
      `
      SELECT request_id, reference, customer_id, title, description, status, created_at, updated_at
      FROM commercial_requests
      WHERE request_id = ?
    `,
    )
    .get(requestId) as RequestRow | undefined;
  return row ? requestFromRow(row) : null;
}

const REQUEST_CREATE_ATTEMPTS = 8;

export function persistCreatedCommercialRequest(
  db: SqliteDatabase,
  customer: Customer,
  title: string,
  description: string,
  options?: { requestId?: string },
): CommercialRequestMutationResult {
  const insert = db.prepare(
    `
    INSERT INTO commercial_requests (
      request_id, reference, customer_id, title, description, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  );
  for (let attempt = 0; attempt < REQUEST_CREATE_ATTEMPTS; attempt += 1) {
    const created = createCommercialRequest({
      customer,
      title,
      description,
      requestId: attempt === 0 ? options?.requestId : undefined,
    });
    if (!created.ok) {
      return created;
    }
    try {
      insert.run(
        created.request.requestId,
        created.request.reference,
        created.request.customerId,
        created.request.title,
        created.request.description,
        created.request.status,
        created.request.createdAt,
        created.request.updatedAt,
      );
      return created;
    } catch (error) {
      if (!isRequestIdentityCollision(error)) {
        throw error;
      }
    }
  }
  return { ok: false, error: "reference_unavailable" };
}

function isRequestIdentityCollision(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  return (
    code.includes("CONSTRAINT") &&
    (message.includes("commercial_requests.reference") ||
      message.includes("commercial_requests.request_id") ||
      message.includes("UNIQUE constraint failed"))
  );
}

export function persistUpdatedCommercialRequest(
  db: SqliteDatabase,
  requestId: string,
  patch: {
    title?: string;
    description?: string;
    status?: CommercialRequestStatus;
    customerId?: string;
  },
  context: {
    hasLinkedQuotes: boolean;
    nextCustomer?: Customer | null;
  },
): CommercialRequestMutationResult {
  const current = getCommercialRequest(db, requestId);
  if (!current) {
    return { ok: false, error: "not_found" };
  }
  const updated = updateCommercialRequest(current, patch, context);
  if (!updated.ok || updated.alreadyApplied) {
    return updated;
  }
  db.prepare(
    `
    UPDATE commercial_requests
    SET customer_id = ?, title = ?, description = ?, status = ?, updated_at = ?
    WHERE request_id = ?
  `,
  ).run(
    updated.request.customerId,
    updated.request.title,
    updated.request.description,
    updated.request.status,
    updated.request.updatedAt,
    requestId,
  );
  return updated;
}

export function listCommercialRequestQuoteLinks(
  db: SqliteDatabase,
  requestId: string,
): CommercialRequestQuoteLink[] {
  const rows = db
    .prepare(
      `
      SELECT request_id, quote_snapshot_id, linked_at
      FROM commercial_request_quote_links
      WHERE request_id = ?
      ORDER BY linked_at DESC
    `,
    )
    .all(requestId) as LinkRow[];
  return rows.map(linkFromRow);
}

export function getCommercialRequestQuoteLinkByQuote(
  db: SqliteDatabase,
  quoteSnapshotId: string,
): CommercialRequestQuoteLink | null {
  const row = db
    .prepare(
      `
      SELECT request_id, quote_snapshot_id, linked_at
      FROM commercial_request_quote_links
      WHERE quote_snapshot_id = ?
    `,
    )
    .get(quoteSnapshotId) as LinkRow | undefined;
  return row ? linkFromRow(row) : null;
}

export function persistCommercialRequestQuoteLink(
  db: SqliteDatabase,
  request: CommercialRequest,
  quoteSnapshotId: string,
  quoteCustomerId: string | null | undefined,
): CommercialRequestLinkResult {
  const existing = getCommercialRequestQuoteLinkByQuote(db, quoteSnapshotId);
  const linked = linkCommercialRequestQuote({
    request,
    quoteSnapshotId,
    quoteCustomerId,
    existingLink: existing,
  });
  if (!linked.ok || linked.alreadyApplied) {
    return linked;
  }
  db.prepare(
    `
    INSERT INTO commercial_request_quote_links (request_id, quote_snapshot_id, linked_at)
    VALUES (?, ?, ?)
  `,
  ).run(linked.link.requestId, linked.link.quoteSnapshotId, linked.link.linkedAt);
  return linked;
}

type AttachmentRow = {
  attachment_id: string;
  request_id: string;
  original_file_name: string;
  mime_type: string | null;
  size_bytes: number;
  storage_key: string;
  sha256: string;
  created_at: string;
};

function attachmentFromRow(row: AttachmentRow): CommercialRequestAttachment {
  return {
    attachmentId: row.attachment_id,
    requestId: row.request_id,
    originalFileName: row.original_file_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    storageKey: row.storage_key,
    sha256: row.sha256,
    createdAt: row.created_at,
  };
}

export function listCommercialRequestAttachments(
  db: SqliteDatabase,
  requestId: string,
): CommercialRequestAttachment[] {
  const rows = db
    .prepare(
      `
      SELECT attachment_id, request_id, original_file_name, mime_type, size_bytes,
             storage_key, sha256, created_at
      FROM commercial_request_attachments
      WHERE request_id = ?
      ORDER BY created_at DESC, attachment_id DESC
    `,
    )
    .all(requestId) as AttachmentRow[];
  return rows.map(attachmentFromRow);
}

export function getCommercialRequestAttachment(
  db: SqliteDatabase,
  attachmentId: string,
): CommercialRequestAttachment | null {
  const row = db
    .prepare(
      `
      SELECT attachment_id, request_id, original_file_name, mime_type, size_bytes,
             storage_key, sha256, created_at
      FROM commercial_request_attachments
      WHERE attachment_id = ?
    `,
    )
    .get(attachmentId) as AttachmentRow | undefined;
  return row ? attachmentFromRow(row) : null;
}

export function insertCommercialRequestAttachment(
  db: SqliteDatabase,
  attachment: CommercialRequestAttachment,
): void {
  db.prepare(
    `
    INSERT INTO commercial_request_attachments (
      attachment_id, request_id, original_file_name, mime_type, size_bytes,
      storage_key, sha256, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    attachment.attachmentId,
    attachment.requestId,
    attachment.originalFileName,
    attachment.mimeType,
    attachment.sizeBytes,
    attachment.storageKey,
    attachment.sha256,
    attachment.createdAt,
  );
}
