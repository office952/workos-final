import type { QuoteSnapshot } from "@workos-final/domain";
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
