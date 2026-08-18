import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  ALUMINIUM_RETURN_PROFILE_ID,
  CANONICAL_PRODUCT_CODE,
  PLEXIGLAS_3MM_OPAL_ID,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";
import { openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";
import {
  RESOURCE_COST_EVIDENCE_MARKER,
  ensureCostEvidence,
} from "../src/resources/store.js";

type JsonObject = Record<string, unknown>;

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempSqlitePath(): string {
  const dir = mkdtempSync(join(tmpdir(), "workos-cost-evidence-"));
  temps.push(dir);
  return join(dir, "product-system.sqlite");
}

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const lettersValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

const acmValues = {
  "root.inscription": "QTD",
  "root.mountingSystem": "steel_angle",
  "face.widthMm": 1000,
  "face.heightMm": 500,
  "face.cassetteDepthMm": "40",
  "face.foldCount": "2",
};

async function compileReady(
  app: ReturnType<typeof createApp>,
  productCode: string,
  values: Record<string, string | number>,
) {
  const response = await app.request(`/api/products/${productCode}/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ values }),
  });
  const body = await readBody(response);
  return {
    definition: body.definition as JsonObject,
    reviewId: body.reviewId as string,
  };
}

async function confirmProduct(
  app: ReturnType<typeof createApp>,
  productCode: string,
  values: Record<string, string | number>,
) {
  const reviewed = await compileReady(app, productCode, values);
  const response = await app.request(`/api/products/${productCode}/confirm`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(reviewed),
  });
  return { status: response.status, body: await readBody(response) };
}

async function freezeQuote(
  app: ReturnType<typeof createApp>,
  productCode: string,
  values: Record<string, string | number>,
  displayName: string,
) {
  const reviewed = await compileReady(app, productCode, values);
  const created = await app.request("/api/customers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  const customerId = ((await readBody(created)).customer as JsonObject).customerId as string;
  const response = await app.request(`/api/products/${productCode}/quote-snapshots`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...reviewed,
      customerId,
    }),
  });
  return { status: response.status, body: await readBody(response) };
}

describe("resource cost evidence persistence", () => {
  it("bootstraps seed rows once and keeps owner edits after restart", async () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    const app = createApp({ productSystem: first });
    const admin = await readBody(await app.request("/api/resources-admin"));
    expect(admin.writeState).toBe("READY");
    expect((admin.costEvidence as JsonObject[]).length).toBe(26);
    const plexi = (admin.costEvidence as JsonObject[]).find(
      (item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID,
    );
    expect(plexi?.amount).toBe(16);
    const patch = await app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 18, note: "Achiziție curentă" }),
      },
    );
    expect(patch.status).toBe(200);
    first.close();

    const db = openSqliteDatabase(sqlitePath);
    expect(
      (
        db
          .prepare("SELECT COUNT(*) AS count FROM runtime_bootstrap_markers WHERE marker_id = ?")
          .get(RESOURCE_COST_EVIDENCE_MARKER) as { count: number }
      ).count,
    ).toBe(1);
    const history = (
      db
        .prepare(
          "SELECT COUNT(*) AS count FROM resource_cost_evidence WHERE resource_id = ?",
        )
        .get(PLEXIGLAS_3MM_OPAL_ID) as { count: number }
    ).count;
    expect(history).toBe(2);
    db.close();

    const second = createProductSystemRuntime(sqlitePath);
    const plexiAfter = second
      .listActiveCostEvidence()
      .find((item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID);
    expect(plexiAfter?.amount).toBe(18);
    expect(plexiAfter?.source).toBe("OWNER_CONFIRMED_PURCHASE");
    expect(plexiAfter?.classification).toBe("OWNER_CONFIRMED");
    second.close();
  });

  it("rejects a second active unqualified row for the same resource", () => {
    const sqlitePath = tempSqlitePath();
    const db = openSqliteDatabase(sqlitePath);
    ensureCostEvidence(db);
    expect(() =>
      db
        .prepare(
          `
          INSERT INTO resource_cost_evidence (
            evidence_row_id, resource_id, volume_depth_mm, amount, currency,
            per_unit, source, classification, note, created_at, superseded_at
          ) VALUES (?, ?, NULL, 99, 'EUR', 'm2', 'OWNER_CONFIRMED_PURCHASE',
                    'OWNER_CONFIRMED', 'dup', ?, NULL)
        `,
        )
        .run("cev:dup-plexi", PLEXIGLAS_3MM_OPAL_ID, new Date().toISOString()),
    ).toThrow(/UNIQUE/);
    expect(() =>
      db
        .prepare(
          `
          INSERT INTO resource_cost_evidence (
            evidence_row_id, resource_id, volume_depth_mm, amount, currency,
            per_unit, source, classification, note, created_at, superseded_at
          ) VALUES (?, ?, 60, 9, 'EUR', 'm', 'OWNER_CONFIRMED_PURCHASE',
                    'OWNER_CONFIRMED', 'dup', ?, NULL)
        `,
        )
        .run("cev:dup-al", ALUMINIUM_RETURN_PROFILE_ID, new Date().toISOString()),
    ).toThrow(/UNIQUE/);
    db.close();
  });
});

describe("resource cost evidence live compile and freeze", () => {
  it("keeps frozen quotes at 16 and uses 18 for new LETTERS calculations", async () => {
    const runtime = createProductSystemRuntime(":memory:");
    const app = createApp({ productSystem: runtime });
    const virgin = await confirmProduct(app, CANONICAL_PRODUCT_CODE, lettersValues);
    expect(virgin.status).toBe(200);
    expect((virgin.body.eic as JsonObject).total).toBe(382.5);
    const firstQuote = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "Client vechi",
    );
    expect(firstQuote.status).toBe(200);
    const frozen = firstQuote.body.quoteSnapshot as JsonObject;
    expect((frozen.eic as JsonObject).total).toBe(382.5);

    const admin = await readBody(await app.request("/api/resources-admin"));
    const plexi = (admin.costEvidence as JsonObject[]).find(
      (item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID,
    );
    const saved = await app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 18, note: "Plexiglas 18" }),
      },
    );
    expect(saved.status).toBe(200);

    const next = await confirmProduct(app, CANONICAL_PRODUCT_CODE, lettersValues);
    expect((next.body.eic as JsonObject).total).toBe(383);
    const plexiLine = ((next.body.eic as JsonObject).lines as JsonObject[]).find(
      (item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID,
    );
    expect(plexiLine?.rate).toBe(18);
    const secondQuote = await freezeQuote(
      app,
      CANONICAL_PRODUCT_CODE,
      lettersValues,
      "Client nou",
    );
    const nextFrozen = secondQuote.body.quoteSnapshot as JsonObject;
    expect((nextFrozen.eic as JsonObject).total).toBe(383);
    const recipeRates = (
      (nextFrozen.productionInput as JsonObject).usedRecipes as JsonObject[]
    ).map((item) => ({
      resourceId: item.resourceId,
      rate: item.rate,
    }));
    const eicRates = ((nextFrozen.eic as JsonObject).lines as JsonObject[])
      .filter((item) => recipeRates.some((recipe) => recipe.resourceId === item.resourceId))
      .map((item) => ({ resourceId: item.resourceId, rate: item.rate }));
    for (const recipe of recipeRates) {
      expect(eicRates).toContainEqual(recipe);
    }
    expect((frozen.eic as JsonObject).total).toBe(382.5);
    expect(
      runtime.readQuoteSnapshot(frozen.quoteSnapshotId as string)?.eic.total,
    ).toBe(382.5);
    runtime.close();
  });

  it("keeps canonical ACM complete at 72.644 on virgin bootstrap", async () => {
    const app = createApp();
    const confirmed = await confirmProduct(app, ACM_CASSETTE_NONE_PRODUCT_CODE, acmValues);
    expect(confirmed.status).toBe(200);
    expect((confirmed.body.eic as JsonObject).total).toBe(72.644);
    expect((confirmed.body.eic as JsonObject).completeness).toBe("COMPLETE");
  });

  it("does not let 30 mm inherit the 60 mm aluminium rate after an owner edit", async () => {
    const runtime = createProductSystemRuntime(":memory:");
    const app = createApp({ productSystem: runtime });
    const admin = await readBody(await app.request("/api/resources-admin"));
    const aluminium = (admin.costEvidence as JsonObject[]).find(
      (item) =>
        item.resourceId === ALUMINIUM_RETURN_PROFILE_ID &&
        item.qualifierLabel === "adâncime 60 mm",
    );
    expect(aluminium?.amount).toBe(3);
    const saved = await app.request(
      `/api/resources-admin/cost-evidence/${aluminium?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 4, note: "Doar 60 mm" }),
      },
    );
    expect(saved.status).toBe(200);
    const thirty = await confirmProduct(app, CANONICAL_PRODUCT_CODE, {
      ...lettersValues,
      "volume.depthMm": "30",
    });
    expect((thirty.body.eic as JsonObject).completeness).toBe("PARTIAL");
    const reasons = (thirty.body.eic as JsonObject).completenessReasons as string[];
    expect(reasons.join(" ")).toMatch(/30 mm/);
    const sixty = await confirmProduct(app, CANONICAL_PRODUCT_CODE, lettersValues);
    const aluminiumLine = ((sixty.body.eic as JsonObject).lines as JsonObject[]).find(
      (item) => item.resourceId === ALUMINIUM_RETURN_PROFILE_ID,
    );
    expect(aluminiumLine?.rate).toBe(4);
    runtime.close();
  });

  it("returns 409 when the active row id is stale", async () => {
    const runtime = createProductSystemRuntime(":memory:");
    const app = createApp({ productSystem: runtime });
    const admin = await readBody(await app.request("/api/resources-admin"));
    const plexi = (admin.costEvidence as JsonObject[]).find(
      (item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID,
    );
    const first = await app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 18, note: "prima" }),
      },
    );
    const second = await app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 19, note: "a doua" }),
      },
    );
    expect(first.status).toBe(200);
    expect(second.status).toBe(409);
    expect((await readBody(second)).error).toBe("stale_cost_evidence");
    const zero = await app.request(
      `/api/resources-admin/cost-evidence/${((await readBody(first)).evidence as JsonObject).evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: 0, note: "invalid" }),
      },
    );
    expect(zero.status).toBe(400);
    runtime.close();
  });
});
