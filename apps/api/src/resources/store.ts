import { randomUUID } from "node:crypto";
import {
  costEvidence,
  getResource,
  isValidCostAmount,
  ownerConfirmedCostSource,
  type CostEvidence,
  type ResourceUnit,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";
import type { BootstrapPolicy } from "../cloud/controlPlane.js";

export const PLATFORM_DEFAULT_COST_NOTE =
  "Valoare implicită de platformă. Trebuie confirmată de owner.";
export const SYNTHETIC_COST_NOTE =
  "Evidență sintetică de test. Nu este cost HUB MEDIA confirmat.";

export const RESOURCE_COST_EVIDENCE_MARKER = "RESOURCE_COST_EVIDENCE_V1_APPLIED";

const COST_SOURCES = [
  "PILOT_INTERNAL_EVIDENCE",
  "OWNER_CONFIRMED_PURCHASE",
  "OWNER_CONFIRMED_WORKSHOP",
  "LEGACY_EVIDENCE",
  "AI_DECISION",
  "PLATFORM_DEFAULT",
] as const;

const COST_CLASSIFICATIONS = [
  "AI_DECISION",
  "OWNER_CONFIRMED",
  "DEVELOPMENT_DEFAULT",
] as const;

const RESOURCE_UNITS = ["m", "m2", "buc"] as const;

const NOTE_MAX_LENGTH = 2000;

type CostEvidenceRow = {
  evidence_row_id: string;
  resource_id: string;
  volume_depth_mm: number | null;
  amount: number;
  currency: string;
  per_unit: string;
  source: string;
  classification: string;
  note: string;
  created_at: string;
  superseded_at: string | null;
};

export type CostEvidenceWriteError =
  | "not_found"
  | "stale_cost_evidence"
  | "invalid_amount"
  | "invalid_note"
  | "unknown_resource";

export type CostEvidenceWriteResult =
  | { ok: true; evidence: CostEvidence }
  | { ok: false; error: CostEvidenceWriteError };

export function isCostEvidenceApplied(db: SqliteDatabase): boolean {
  const row = db
    .prepare("SELECT marker_id FROM runtime_bootstrap_markers WHERE marker_id = ?")
    .get(RESOURCE_COST_EVIDENCE_MARKER) as { marker_id: string } | undefined;
  return Boolean(row);
}

export function ensureCostEvidence(
  db: SqliteDatabase,
  policy: BootstrapPolicy | "SINGLE_PLANE" = "SINGLE_PLANE",
): void {
  if (policy === "ADOPT_EXISTING") {
    return;
  }
  if (isCostEvidenceApplied(db)) {
    return;
  }
  const seeds = costSeedsForPolicy(policy);
  const apply = db.transaction(() => {
    if (isCostEvidenceApplied(db)) {
      return;
    }
    const createdAt = new Date().toISOString();
    const insert = db.prepare(
      `
      INSERT INTO resource_cost_evidence (
        evidence_row_id,
        resource_id,
        volume_depth_mm,
        amount,
        currency,
        per_unit,
        source,
        classification,
        note,
        created_at,
        superseded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
    `,
    );
    for (const seed of seeds) {
      insert.run(
        `cev:${randomUUID()}`,
        seed.resourceId,
        seed.when?.volumeDepthMm ?? null,
        seed.amount,
        seed.currency,
        seed.perUnit,
        seed.source,
        seed.classification,
        seed.note,
        createdAt,
      );
    }
    db.prepare(
      `
      INSERT INTO runtime_bootstrap_markers (marker_id, applied_at)
      VALUES (?, ?)
    `,
    ).run(RESOURCE_COST_EVIDENCE_MARKER, createdAt);
  });
  apply();
}

function costSeedsForPolicy(
  policy: Exclude<BootstrapPolicy | "SINGLE_PLANE", "ADOPT_EXISTING">,
): readonly CostEvidence[] {
  if (policy === "SINGLE_PLANE") {
    return costEvidence;
  }
  const note =
    policy === "SYNTHETIC_TEST" ? SYNTHETIC_COST_NOTE : PLATFORM_DEFAULT_COST_NOTE;
  return costEvidence.map((row) => ({
    ...row,
    source: "PLATFORM_DEFAULT",
    classification: "DEVELOPMENT_DEFAULT",
    note,
  }));
}

export function listActiveCostEvidence(db: SqliteDatabase): CostEvidence[] {
  const rows = db
    .prepare(
      `
      SELECT evidence_row_id, resource_id, volume_depth_mm, amount, currency,
             per_unit, source, classification, note, created_at, superseded_at
      FROM resource_cost_evidence
      WHERE superseded_at IS NULL
    `,
    )
    .all() as CostEvidenceRow[];
  const mapped = rows.flatMap((row) => {
    const evidence = toCostEvidence(row);
    return evidence ? [evidence] : [];
  });
  const rank = new Map(
    costEvidence.map((item, index) => [evidenceSortKey(item), index]),
  );
  return mapped.sort((left, right) => {
    const leftRank = rank.get(evidenceSortKey(left)) ?? Number.MAX_SAFE_INTEGER;
    const rightRank = rank.get(evidenceSortKey(right)) ?? Number.MAX_SAFE_INTEGER;
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return (left.createdAt ?? "").localeCompare(right.createdAt ?? "");
  });
}

export function supersedeCostEvidence(
  db: SqliteDatabase,
  evidenceRowId: string,
  amount: unknown,
  note: unknown,
): CostEvidenceWriteResult {
  if (!isValidCostAmount(typeof amount === "number" ? amount : Number.NaN)) {
    return { ok: false, error: "invalid_amount" };
  }
  const parsedNote = parseNote(note);
  if (!parsedNote.ok) {
    return parsedNote;
  }

  const write = db.transaction((): CostEvidenceWriteResult => {
    const active = db
      .prepare(
        `
        SELECT evidence_row_id, resource_id, volume_depth_mm, amount, currency,
               per_unit, source, classification, note, created_at, superseded_at
        FROM resource_cost_evidence
        WHERE evidence_row_id = ? AND superseded_at IS NULL
      `,
      )
      .get(evidenceRowId) as CostEvidenceRow | undefined;
    if (!active) {
      const existing = db
        .prepare(
          "SELECT evidence_row_id FROM resource_cost_evidence WHERE evidence_row_id = ?",
        )
        .get(evidenceRowId) as { evidence_row_id: string } | undefined;
      return {
        ok: false,
        error: existing ? "stale_cost_evidence" : "not_found",
      };
    }

    const resource = getResource(active.resource_id);
    if (!resource) {
      return { ok: false, error: "unknown_resource" };
    }

    const createdAt = new Date().toISOString();
    db.prepare(
      `
      UPDATE resource_cost_evidence
      SET superseded_at = ?
      WHERE evidence_row_id = ? AND superseded_at IS NULL
    `,
    ).run(createdAt, evidenceRowId);

    const nextId = `cev:${randomUUID()}`;
    db.prepare(
      `
      INSERT INTO resource_cost_evidence (
        evidence_row_id,
        resource_id,
        volume_depth_mm,
        amount,
        currency,
        per_unit,
        source,
        classification,
        note,
        created_at,
        superseded_at
      ) VALUES (?, ?, ?, ?, 'EUR', ?, ?, 'OWNER_CONFIRMED', ?, ?, NULL)
    `,
    ).run(
      nextId,
      active.resource_id,
      active.volume_depth_mm,
      amount,
      active.per_unit,
      ownerConfirmedCostSource(resource.kind),
      parsedNote.note === "" ? active.note : parsedNote.note,
      createdAt,
    );

    const inserted = db
      .prepare(
        `
        SELECT evidence_row_id, resource_id, volume_depth_mm, amount, currency,
               per_unit, source, classification, note, created_at, superseded_at
        FROM resource_cost_evidence
        WHERE evidence_row_id = ?
      `,
      )
      .get(nextId) as CostEvidenceRow;
    const evidence = toCostEvidence(inserted);
    if (!evidence) {
      return { ok: false, error: "unknown_resource" };
    }
    return { ok: true, evidence };
  });

  return write();
}

function parseNote(note: unknown): { ok: true; note: string } | { ok: false; error: "invalid_note" } {
  if (note === undefined || note === null) {
    return { ok: true, note: "" };
  }
  if (typeof note !== "string") {
    return { ok: false, error: "invalid_note" };
  }
  if (note.length > NOTE_MAX_LENGTH) {
    return { ok: false, error: "invalid_note" };
  }
  return { ok: true, note: note.trim() };
}

function evidenceSortKey(evidence: CostEvidence): string {
  return `${evidence.resourceId}:${evidence.when?.volumeDepthMm ?? ""}`;
}

function toCostEvidence(row: CostEvidenceRow): CostEvidence | null {
  if (row.currency !== "EUR") {
    return null;
  }
  if (!isResourceUnit(row.per_unit)) {
    return null;
  }
  if (!isCostSource(row.source) || !isCostClassification(row.classification)) {
    return null;
  }
  if (!isValidCostAmount(row.amount)) {
    return null;
  }
  return {
    resourceId: row.resource_id,
    amount: row.amount,
    currency: "EUR",
    perUnit: row.per_unit,
    source: row.source,
    classification: row.classification,
    note: row.note,
    when:
      row.volume_depth_mm === null
        ? undefined
        : { volumeDepthMm: row.volume_depth_mm },
    evidenceRowId: row.evidence_row_id,
    createdAt: row.created_at,
  };
}

function isResourceUnit(value: string): value is ResourceUnit {
  return (RESOURCE_UNITS as readonly string[]).includes(value);
}

function isCostSource(value: string): value is CostEvidence["source"] {
  return (COST_SOURCES as readonly string[]).includes(value);
}

function isCostClassification(
  value: string,
): value is CostEvidence["classification"] {
  return (COST_CLASSIFICATIONS as readonly string[]).includes(value);
}
