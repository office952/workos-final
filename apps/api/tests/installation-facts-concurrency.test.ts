import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_PRODUCT_CODE,
  SITE_INSTALLATION_SCOPE_ID,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";
import { openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";
import { getInstallationFacts } from "../src/requests/installationFacts.js";

type JsonObject = Record<string, unknown>;

async function readBody(response: Response): Promise<JsonObject> {
  return (await response.json()) as JsonObject;
}

const lettersValues = {
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

function completeFacts() {
  return {
    street: "Strada Fabricii 10",
    city: "București",
    measurementStatus: "OFFICE_MEASURED",
    facadeType: "CONCRETE",
    fixingMethod: "MECHANICAL_ANCHOR",
    siteElectrical: "NOT_APPLICABLE",
  };
}

function factsPayload(patch: Record<string, unknown>, expectedVersion: number) {
  return JSON.stringify({ ...patch, expectedVersion });
}

async function enableSiteInstallation(app: ReturnType<typeof createApp>) {
  const response = await app.request("/api/operational-services/SITE_INSTALLATION", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ offerMode: "INTERNAL" }),
  });
  expect(response.status).toBe(200);
}

async function createCustomer(app: ReturnType<typeof createApp>, displayName: string) {
  const created = await app.request("/api/customers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  return (await readBody(created)).customer as JsonObject;
}

async function createRequest(
  app: ReturnType<typeof createApp>,
  customerId: string,
  title: string,
) {
  return app.request("/api/requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customerId,
      title,
      description: "Clientul a cerut o ofertă.",
    }),
  });
}

function orphanFactsCount(sqlitePath: string): number {
  const db = openSqliteDatabase(sqlitePath);
  const row = db
    .prepare(
      `
      SELECT COUNT(*) AS count
      FROM commercial_request_installation_facts facts
      WHERE NOT EXISTS (
        SELECT 1
        FROM commercial_request_optional_scopes scopes
        WHERE scopes.request_id = facts.request_id
          AND scopes.scope_id = ?
      )
    `,
    )
    .get(SITE_INSTALLATION_SCOPE_ID) as { count: number };
  db.close();
  return row.count;
}

function quoteCount(sqlitePath: string): number {
  const db = openSqliteDatabase(sqlitePath);
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM quote_snapshots")
    .get() as { count: number };
  const orders = db
    .prepare("SELECT COUNT(*) AS count FROM order_snapshots")
    .get() as { count: number };
  db.close();
  return row.count + orders.count;
}

async function seedPairedRuntimes(label: string) {
  const sqlitePath = join(mkdtempSync(join(tmpdir(), "os-s2-txn-")), "db.sqlite");
  const left = createProductSystemRuntime(sqlitePath);
  const right = createProductSystemRuntime(sqlitePath);
  const app = createApp({ productSystem: left });
  await enableSiteInstallation(app);
  const quotesBefore = quoteCount(sqlitePath);
  const customer = await createCustomer(app, `Client ${label}`);
  const created = await readBody(
    await createRequest(app, customer.customerId as string, `Cerere ${label}`),
  );
  const requestId = (created.request as JsonObject).requestId as string;
  await app.request(`/api/requests/${requestId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
  });
  const saved = await app.request(`/api/requests/${requestId}/installation-facts`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: factsPayload(completeFacts(), 0),
  });
  expect(saved.status).toBe(200);
  return {
    sqlitePath,
    left,
    right,
    app,
    requestId,
    customerId: customer.customerId as string,
    quotesBefore,
    close() {
      left.close();
      right.close();
    },
  };
}

async function createOrphanQuote(
  app: ReturnType<typeof createApp>,
  customerId: string,
  inscription: string,
) {
  const compile = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      values: { ...lettersValues, "root.inscription": inscription },
    }),
  });
  const compiled = await readBody(compile);
  const orphan = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      definition: compiled.definition,
      reviewId: compiled.reviewId,
      customerId,
    }),
  });
  expect(orphan.status).toBe(200);
  return ((await readBody(orphan)).quoteSnapshot as JsonObject).quoteSnapshotId as string;
}

function insertQuoteLink(sqlitePath: string, requestId: string, quoteSnapshotId: string) {
  const db = openSqliteDatabase(sqlitePath);
  db.prepare(
    `
    INSERT INTO commercial_request_quote_links (request_id, quote_snapshot_id, linked_at)
    VALUES (?, ?, ?)
  `,
  ).run(requestId, quoteSnapshotId, "2026-08-30T07:00:00.000Z");
  db.close();
}

describe("installation facts request-state transaction boundary", () => {
  it("refuses a missing request from inside the facts transaction", async () => {
    const seeded = await seedPairedRuntimes("Missing");
    const missing = seeded.right.updateInstallationFacts(
      "crq:00000000-0000-0000-0000-000000000000",
      { city: "Cluj" },
      0,
    );
    expect(missing).toEqual({ ok: false, error: "not_found" });
    expect(quoteCount(seeded.sqlitePath)).toBe(seeded.quotesBefore);
    seeded.close();
  });

  it("lets a facts write finish first, then deselect deletes selection and facts", async () => {
    const seeded = await seedPairedRuntimes("FactsFirst");
    const written = seeded.left.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "Curte A" },
      1,
    );
    expect(written.ok).toBe(true);
    if (written.ok) {
      expect(written.facts.version).toBe(2);
      expect(written.facts.accessNotes).toBe("Curte A");
    }
    const deselected = seeded.right.updateCommercialRequest(seeded.requestId, {
      optionalScopeIds: [],
      confirmDeleteInstallationFacts: true,
    });
    expect(deselected.ok).toBe(true);
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationOffer.selected).toBe(false);
    expect(detail?.installationFacts).toBeNull();
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    expect(quoteCount(seeded.sqlitePath)).toBe(seeded.quotesBefore);
    seeded.close();
  });

  it("refuses a facts write after deselect and leaves facts null", async () => {
    const seeded = await seedPairedRuntimes("DeselectFirst");
    const deselected = seeded.right.updateCommercialRequest(seeded.requestId, {
      optionalScopeIds: [],
      confirmDeleteInstallationFacts: true,
    });
    expect(deselected.ok).toBe(true);
    const written = seeded.left.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "Nu trebuie" },
      1,
    );
    expect(written).toEqual({ ok: false, error: "installation_not_selected" });
    const db = openSqliteDatabase(seeded.sqlitePath);
    expect(getInstallationFacts(db, seeded.requestId)).toBeNull();
    db.close();
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationOffer.selected).toBe(false);
    expect(detail?.installationFacts).toBeNull();
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    expect(quoteCount(seeded.sqlitePath)).toBe(seeded.quotesBefore);
    seeded.close();
  });

  it("keeps concurrent deselect versus facts on two connections unselected and without orphans", async () => {
    const seeded = await seedPairedRuntimes("ConcurrentDeselect");
    const rightApp = createApp({ productSystem: seeded.right });
    const [factsResponse, deselectResponse] = await Promise.all([
      seeded.app.request(`/api/requests/${seeded.requestId}/installation-facts`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: factsPayload({ accessNotes: "Concurent" }, 1),
      }),
      rightApp.request(`/api/requests/${seeded.requestId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          optionalScopeIds: [],
          confirmDeleteInstallationFacts: true,
        }),
      }),
    ]);
    expect([200, 400].includes(factsResponse.status)).toBe(true);
    expect(deselectResponse.status).toBe(200);
    if (factsResponse.status === 400) {
      expect((await readBody(factsResponse)).error).toBe("installation_not_selected");
    }
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationOffer.selected).toBe(false);
    expect(detail?.installationFacts).toBeNull();
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    expect(quoteCount(seeded.sqlitePath)).toBe(seeded.quotesBefore);
    seeded.close();
  });

  it("allows a facts write that finishes before a later quote link", async () => {
    const seeded = await seedPairedRuntimes("FactsBeforeLink");
    const written = seeded.left.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "Înainte de link" },
      1,
    );
    expect(written.ok).toBe(true);
    if (written.ok) {
      expect(written.facts.version).toBe(2);
    }
    const quoteSnapshotId = await createOrphanQuote(
      seeded.app,
      seeded.customerId,
      "FST1",
    );
    insertQuoteLink(seeded.sqlitePath, seeded.requestId, quoteSnapshotId);
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationFacts?.accessNotes).toBe("Înainte de link");
    expect(detail?.installationFacts?.version).toBe(2);
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    seeded.close();
  });

  it("refuses a facts write after another connection links a quote", async () => {
    const seeded = await seedPairedRuntimes("LinkFirst");
    const quoteSnapshotId = await createOrphanQuote(
      seeded.app,
      seeded.customerId,
      "LNK1",
    );
    insertQuoteLink(seeded.sqlitePath, seeded.requestId, quoteSnapshotId);
    const written = seeded.right.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "După link" },
      1,
    );
    expect(written).toEqual({ ok: false, error: "installation_facts_locked" });
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationFacts?.accessNotes).toBeNull();
    expect(detail?.installationFacts?.version).toBe(1);
    expect(detail?.installationFacts?.street).toBe("Strada Fabricii 10");
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    seeded.close();
  });

  it("keeps compare-and-swap on two connections: one success and one version_conflict", async () => {
    const seeded = await seedPairedRuntimes("CasTwoConn");
    const first = seeded.left.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "A" },
      1,
    );
    const second = seeded.right.updateInstallationFacts(
      seeded.requestId,
      { accessNotes: "B" },
      1,
    );
    const results = [first, second];
    const winner = results.find((result) => result.ok);
    const loser = results.find((result) => !result.ok);
    expect(winner?.ok).toBe(true);
    expect(loser).toEqual({ ok: false, error: "version_conflict" });
    if (winner && winner.ok) {
      expect(winner.facts.version).toBe(2);
      expect(["A", "B"]).toContain(winner.facts.accessNotes);
    }
    const detail = seeded.left.readRequestDetail(seeded.requestId);
    expect(detail?.installationFacts?.version).toBe(2);
    expect(detail?.installationFacts?.street).toBe("Strada Fabricii 10");
    expect(orphanFactsCount(seeded.sqlitePath)).toBe(0);
    expect(quoteCount(seeded.sqlitePath)).toBe(seeded.quotesBefore);
    seeded.close();
  });
});
