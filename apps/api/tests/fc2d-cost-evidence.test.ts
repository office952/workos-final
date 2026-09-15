import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  FC2D_PROVISIONAL_RESOURCE_IDS,
  MAT_VINYL_ORACAL_641_ID,
  MAT_VINYL_ORACAL_8500_ID,
  MAT_VINYL_PRINT_ID,
  countMissingRatesForPlannedFc2FinishResources,
  costEvidence,
  isFc2dProvisionalResourceId,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";
import { openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";
import {
  RESOURCE_COST_EVIDENCE_FC2D_MARKER,
  RESOURCE_COST_EVIDENCE_MARKER,
  createInitialCostEvidence,
  ensureCostEvidence,
  isFc2dCostEvidenceApplied,
  listActiveCostEvidence,
  supersedeCostEvidence,
} from "../src/resources/store.js";

type JsonObject = Record<string, unknown>;

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempSqlitePath(): string {
  const dir = mkdtempSync(join(tmpdir(), "workos-fc2d-cost-"));
  temps.push(dir);
  return join(dir, "product-system.sqlite");
}

function v1OnlySeeds() {
  return costEvidence.filter((row) => !isFc2dProvisionalResourceId(row.resourceId));
}

function seedV1OnlyDatabase(sqlitePath: string): void {
  const db = openSqliteDatabase(sqlitePath);
  const createdAt = new Date().toISOString();
  const insert = db.prepare(
    `
    INSERT INTO resource_cost_evidence (
      evidence_row_id, resource_id, volume_depth_mm, amount, currency,
      per_unit, source, classification, note, supplier_label, valid_from,
      valid_until, created_at, superseded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
  `,
  );
  for (const [index, seed] of v1OnlySeeds().entries()) {
    insert.run(
      `cev:v1:${index}`,
      seed.resourceId,
      seed.when?.volumeDepthMm ?? null,
      seed.amount,
      seed.currency,
      seed.perUnit,
      seed.source,
      seed.classification,
      seed.note,
      seed.supplierLabel ?? null,
      seed.validFrom ?? null,
      seed.validUntil ?? null,
      createdAt,
    );
  }
  db.prepare(
    `
    INSERT INTO runtime_bootstrap_markers (marker_id, applied_at)
    VALUES (?, ?)
  `,
  ).run(RESOURCE_COST_EVIDENCE_MARKER, createdAt);
  db.close();
}

function markerCount(sqlitePath: string, marker: string): number {
  const db = openSqliteDatabase(sqlitePath);
  const count = (
    db
      .prepare("SELECT COUNT(*) AS count FROM runtime_bootstrap_markers WHERE marker_id = ?")
      .get(marker) as { count: number }
  ).count;
  db.close();
  return count;
}

function activeAmount(rows: ReturnType<typeof listActiveCostEvidence>, resourceId: string) {
  return rows.find((row) => row.resourceId === resourceId)?.amount;
}

function activeRowId(rows: ReturnType<typeof listActiveCostEvidence>, resourceId: string) {
  return rows.find((row) => row.resourceId === resourceId)?.evidenceRowId;
}

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

describe("FC2D additive cost-evidence backfill", () => {
  it("gives a fresh database V1 bootstrap plus FC2D provisional rates", () => {
    const sqlitePath = tempSqlitePath();
    const db = openSqliteDatabase(sqlitePath);
    ensureCostEvidence(db);
    const rows = listActiveCostEvidence(db);
    expect(isFc2dCostEvidenceApplied(db)).toBe(true);
    expect(countMissingRatesForPlannedFc2FinishResources(rows)).toBe(0);
    for (const resourceId of FC2D_PROVISIONAL_RESOURCE_IDS) {
      const row = rows.find((item) => item.resourceId === resourceId);
      expect(row).toBeDefined();
      expect(row?.amount).toBeGreaterThan(0);
      expect(row?.classification).not.toBe("OWNER_CONFIRMED");
    }
    db.close();
    expect(markerCount(sqlitePath, RESOURCE_COST_EVIDENCE_MARKER)).toBe(1);
    expect(markerCount(sqlitePath, RESOURCE_COST_EVIDENCE_FC2D_MARKER)).toBe(1);
  });

  it("inserts only missing FC2D rows into an existing V1-marked database", () => {
    const sqlitePath = tempSqlitePath();
    seedV1OnlyDatabase(sqlitePath);
    const before = openSqliteDatabase(sqlitePath);
    expect(isFc2dCostEvidenceApplied(before)).toBe(false);
    expect(
      listActiveCostEvidence(before).some((row) =>
        isFc2dProvisionalResourceId(row.resourceId),
      ),
    ).toBe(false);
    expect(listActiveCostEvidence(before)).toHaveLength(v1OnlySeeds().length);
    ensureCostEvidence(before);
    const after = listActiveCostEvidence(before);
    expect(isFc2dCostEvidenceApplied(before)).toBe(true);
    expect(after).toHaveLength(costEvidence.length);
    expect(countMissingRatesForPlannedFc2FinishResources(after)).toBe(0);
    expect(activeAmount(after, MAT_VINYL_ORACAL_641_ID)).toBe(
      costEvidence.find((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID)?.amount,
    );
    before.close();
  });

  it("leaves an Owner-created FC2D rate untouched", () => {
    const sqlitePath = tempSqlitePath();
    seedV1OnlyDatabase(sqlitePath);
    const db = openSqliteDatabase(sqlitePath);
    const created = createInitialCostEvidence(db, {
      resourceId: MAT_VINYL_ORACAL_641_ID,
      amount: 21,
      note: "Owner 641 before backfill",
    });
    expect(created.ok).toBe(true);
    ensureCostEvidence(db);
    const rows = listActiveCostEvidence(db);
    expect(activeAmount(rows, MAT_VINYL_ORACAL_641_ID)).toBe(21);
    expect(rows.find((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID)?.classification).toBe(
      "OWNER_CONFIRMED",
    );
    expect(activeAmount(rows, MAT_VINYL_ORACAL_8500_ID)).toBe(
      costEvidence.find((row) => row.resourceId === MAT_VINYL_ORACAL_8500_ID)?.amount,
    );
    expect(countMissingRatesForPlannedFc2FinishResources(rows)).toBe(0);
    db.close();
  });

  it("is idempotent and does not duplicate or overwrite on a second run", () => {
    const sqlitePath = tempSqlitePath();
    seedV1OnlyDatabase(sqlitePath);
    const db = openSqliteDatabase(sqlitePath);
    ensureCostEvidence(db);
    const first = listActiveCostEvidence(db);
    const firstIds = first.map((row) => row.evidenceRowId).sort();
    const first641 = activeRowId(first, MAT_VINYL_ORACAL_641_ID);
    ensureCostEvidence(db);
    ensureCostEvidence(db);
    const second = listActiveCostEvidence(db);
    expect(second.map((row) => row.evidenceRowId).sort()).toEqual(firstIds);
    expect(activeRowId(second, MAT_VINYL_ORACAL_641_ID)).toBe(first641);
    expect(second).toHaveLength(first.length);
    expect(
      second.filter((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID),
    ).toHaveLength(1);
    db.close();
  });

  it("never restores a provisional amount after an Owner edit and restart", () => {
    const sqlitePath = tempSqlitePath();
    const firstRuntime = createProductSystemRuntime(sqlitePath);
    const seed641 = firstRuntime
      .listActiveCostEvidence()
      .find((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID);
    expect(seed641?.evidenceRowId).toBeDefined();
    firstRuntime.close();

    const writable = openSqliteDatabase(sqlitePath);
    const edited = supersedeCostEvidence(writable, seed641!.evidenceRowId!, 33, "Owner 641");
    expect(edited.ok).toBe(true);
    writable.close();

    const restarted = createProductSystemRuntime(sqlitePath);
    expect(activeAmount(restarted.listActiveCostEvidence(), MAT_VINYL_ORACAL_641_ID)).toBe(33);
    restarted.close();

    const db = openSqliteDatabase(sqlitePath);
    db.prepare("DELETE FROM runtime_bootstrap_markers WHERE marker_id = ?").run(
      RESOURCE_COST_EVIDENCE_FC2D_MARKER,
    );
    ensureCostEvidence(db);
    const afterReplay = listActiveCostEvidence(db);
    expect(activeAmount(afterReplay, MAT_VINYL_ORACAL_641_ID)).toBe(33);
    expect(
      afterReplay.filter((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID),
    ).toHaveLength(1);
    expect(isFc2dCostEvidenceApplied(db)).toBe(true);
    db.close();
  });

  it("keeps organization/plane rates isolated across synthetic databases", () => {
    const alphaPath = tempSqlitePath();
    const betaPath = tempSqlitePath();
    const alpha = openSqliteDatabase(alphaPath);
    const beta = openSqliteDatabase(betaPath);
    ensureCostEvidence(alpha);
    ensureCostEvidence(beta);
    const alpha641 = listActiveCostEvidence(alpha).find(
      (row) => row.resourceId === MAT_VINYL_ORACAL_641_ID,
    );
    expect(alpha641?.evidenceRowId).toBeDefined();
    const edited = supersedeCostEvidence(alpha, alpha641!.evidenceRowId!, 44, "Alpha 641");
    expect(edited.ok).toBe(true);
    expect(activeAmount(listActiveCostEvidence(alpha), MAT_VINYL_ORACAL_641_ID)).toBe(44);
    expect(activeAmount(listActiveCostEvidence(beta), MAT_VINYL_ORACAL_641_ID)).toBe(
      costEvidence.find((row) => row.resourceId === MAT_VINYL_ORACAL_641_ID)?.amount,
    );
    alpha.close();
    beta.close();
  });

  it("lets Owner edit a new FC2D resource through the current CostEvidence write contract", async () => {
    const sqlitePath = tempSqlitePath();
    const runtime = createProductSystemRuntime(sqlitePath);
    const app = createApp({ productSystem: runtime });
    const admin = await readBody(await app.request("/api/resources-admin"));
    const print = ((admin.costEvidence as JsonObject[]) ?? []).find(
      (item) => item.resourceId === MAT_VINYL_PRINT_ID,
    );
    expect(print?.amount).toBe(
      costEvidence.find((row) => row.resourceId === MAT_VINYL_PRINT_ID)?.amount,
    );
    const patched = await app.request(
      `/api/resources-admin/cost-evidence/${print?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 19, note: "Owner print media" }),
      },
    );
    expect(patched.status).toBe(200);
    const after = await readBody(await app.request("/api/resources-admin"));
    const printAfter = ((after.costEvidence as JsonObject[]) ?? []).find(
      (item) => item.resourceId === MAT_VINYL_PRINT_ID,
    );
    expect(printAfter?.amount).toBe(19);
    expect(printAfter?.classificationLabel).toBe("Confirmat de owner");
    runtime.close();
  });
});
