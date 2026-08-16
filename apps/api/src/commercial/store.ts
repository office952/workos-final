import type {
  QuoteAcceptanceDecision,
  QuoteSnapshot,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type StoredRow = {
  quote_snapshot_id: string;
  payload: string;
};

export function insertQuoteSnapshot(
  db: SqliteDatabase,
  snapshot: QuoteSnapshot,
): { created: boolean; snapshot: QuoteSnapshot } {
  const existing = getQuoteSnapshotByHash(db, snapshot.contentHash);
  if (existing) {
    return { created: false, snapshot: existing };
  }

  db.prepare(
    `
    INSERT INTO quote_snapshots (
      quote_snapshot_id,
      product_code,
      source_review_id,
      content_hash,
      schema_version,
      created_at,
      payload
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    snapshot.quoteSnapshotId,
    snapshot.productCode,
    snapshot.sourceReviewId,
    snapshot.contentHash,
    snapshot.schemaVersion,
    snapshot.createdAt,
    JSON.stringify(snapshot),
  );

  return { created: true, snapshot };
}

export function getQuoteSnapshot(
  db: SqliteDatabase,
  quoteSnapshotId: string,
): QuoteSnapshot | null {
  const row = db
    .prepare(
      `
      SELECT quote_snapshot_id, payload
      FROM quote_snapshots
      WHERE quote_snapshot_id = ?
    `,
    )
    .get(quoteSnapshotId) as StoredRow | undefined;
  return row ? parseSnapshot(row.payload) : null;
}

export function getQuoteSnapshotByHash(
  db: SqliteDatabase,
  contentHash: string,
): QuoteSnapshot | null {
  const row = db
    .prepare(
      `
      SELECT quote_snapshot_id, payload
      FROM quote_snapshots
      WHERE content_hash = ?
    `,
    )
    .get(contentHash) as StoredRow | undefined;
  return row ? parseSnapshot(row.payload) : null;
}

function parseSnapshot(payload: string): QuoteSnapshot {
  return JSON.parse(payload) as QuoteSnapshot;
}

type AcceptanceRow = {
  acceptance_id: string;
  quote_snapshot_id: string;
  quote_content_hash: string;
  schema_version: number;
  accepted_at: string;
};

export function insertQuoteAcceptance(
  db: SqliteDatabase,
  decision: QuoteAcceptanceDecision,
): { created: boolean; decision: QuoteAcceptanceDecision } {
  const existing = getQuoteAcceptanceBySnapshotId(db, decision.quoteSnapshotId);
  if (existing) {
    return { created: false, decision: existing };
  }

  db.prepare(
    `
    INSERT INTO quote_acceptance_decisions (
      acceptance_id,
      quote_snapshot_id,
      quote_content_hash,
      schema_version,
      accepted_at
    ) VALUES (?, ?, ?, ?, ?)
  `,
  ).run(
    decision.acceptanceId,
    decision.quoteSnapshotId,
    decision.quoteContentHash,
    decision.schemaVersion,
    decision.acceptedAt,
  );

  return { created: true, decision };
}

export function getQuoteAcceptanceBySnapshotId(
  db: SqliteDatabase,
  quoteSnapshotId: string,
): QuoteAcceptanceDecision | null {
  const row = db
    .prepare(
      `
      SELECT
        acceptance_id,
        quote_snapshot_id,
        quote_content_hash,
        schema_version,
        accepted_at
      FROM quote_acceptance_decisions
      WHERE quote_snapshot_id = ?
    `,
    )
    .get(quoteSnapshotId) as AcceptanceRow | undefined;
  return row ? decisionFromRow(row) : null;
}

function decisionFromRow(row: AcceptanceRow): QuoteAcceptanceDecision {
  return {
    acceptanceId: row.acceptance_id,
    schemaVersion: 1,
    quoteSnapshotId: row.quote_snapshot_id,
    quoteContentHash: row.quote_content_hash,
    acceptedAt: row.accepted_at,
  };
}
