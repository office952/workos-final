import type { AcceptedProductionSnapshot } from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type StoredRow = {
  snapshot_id: string;
  payload: string;
};

export function insertAcceptedProductionSnapshot(
  db: SqliteDatabase,
  snapshot: AcceptedProductionSnapshot,
): { created: boolean; snapshot: AcceptedProductionSnapshot } {
  const existing = getAcceptedProductionSnapshotByHash(db, snapshot.contentHash);
  if (existing) {
    return { created: false, snapshot: existing };
  }

  db.prepare(
    `
    INSERT INTO accepted_production_snapshots (
      snapshot_id,
      product_code,
      source_review_id,
      content_hash,
      schema_version,
      created_at,
      payload
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    snapshot.snapshotId,
    snapshot.productCode,
    snapshot.sourceReviewId,
    snapshot.contentHash,
    snapshot.schemaVersion,
    snapshot.createdAt,
    JSON.stringify(snapshot),
  );

  return { created: true, snapshot };
}

export function getAcceptedProductionSnapshot(
  db: SqliteDatabase,
  snapshotId: string,
): AcceptedProductionSnapshot | null {
  const row = db
    .prepare(
      `
      SELECT snapshot_id, payload
      FROM accepted_production_snapshots
      WHERE snapshot_id = ?
    `,
    )
    .get(snapshotId) as StoredRow | undefined;
  return row ? parseSnapshot(row.payload) : null;
}

export function getAcceptedProductionSnapshotByHash(
  db: SqliteDatabase,
  contentHash: string,
): AcceptedProductionSnapshot | null {
  const row = db
    .prepare(
      `
      SELECT snapshot_id, payload
      FROM accepted_production_snapshots
      WHERE content_hash = ?
    `,
    )
    .get(contentHash) as StoredRow | undefined;
  return row ? parseSnapshot(row.payload) : null;
}

function parseSnapshot(payload: string): AcceptedProductionSnapshot {
  return JSON.parse(payload) as AcceptedProductionSnapshot;
}
