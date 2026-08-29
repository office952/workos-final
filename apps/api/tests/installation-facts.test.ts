import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ACM_CASSETTE_NONE_PRODUCT_CODE,
  CANONICAL_PRODUCT_CODE,
  SITE_INSTALLATION_FREEZE_REASON,
  SITE_INSTALLATION_SCOPE_ID,
} from "@workos-final/domain";
import { createApp } from "../src/app.js";
import { openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";

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

async function enableSiteInstallation(
  app: ReturnType<typeof createApp>,
  offerMode = "INTERNAL",
) {
  const response = await app.request("/api/operational-services/SITE_INSTALLATION", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ offerMode }),
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

describe("commercial request installation facts API", () => {
  it("keeps existing requests at facts null and selected requests typed-incomplete", async () => {
    const app = createApp();
    await enableSiteInstallation(app);
    const customer = await createCustomer(app, "Client Facts Null");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere fără fapte"),
    );
    const detail = created.detail as JsonObject;
    expect(detail.installationFacts).toBeNull();
    expect(detail.installationScope).toBeNull();
    const requestId = (created.request as JsonObject).requestId as string;
    const selected = await readBody(
      await app.request(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
      }),
    );
    const selectedDetail = selected.detail as {
      installationFacts: unknown;
      installationScope: { incompleteReasons: Array<{ id: string }> };
    };
    expect(selectedDetail.installationFacts).toBeNull();
    expect(selectedDetail.installationScope.incompleteReasons.map((item) => item.id)).toEqual([
      "MISSING_COST_EVIDENCE",
      "SITE_ADDRESS_INCOMPLETE",
      "SITE_MEASUREMENTS_UNCONFIRMED",
      "FACADE_UNCONFIRMED",
      "FIXING_UNCONFIRMED",
      "SITE_ELECTRICAL_UNCONFIRMED",
    ]);
  });

  it("saves, reloads and partially patches facts without creating quote or order rows", async () => {
    const app = createApp();
    await enableSiteInstallation(app);
    const quotesBefore = ((await readBody(await app.request("/api/quotes"))).overview as {
      quotes: unknown[];
    }).quotes.length;
    const customer = await createCustomer(app, "Client Save Facts");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere cu fapte"),
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
      body: JSON.stringify(completeFacts()),
    });
    expect(saved.status).toBe(200);
    const savedBody = await readBody(saved);
    const facts = savedBody.facts as JsonObject;
    expect(facts.street).toBe("Strada Fabricii 10");
    expect(facts.countryCode).toBe("RO");
    expect(facts.version).toBe(1);
    expect(JSON.stringify(facts)).not.toMatch(/productWidth|confirmedAreaMm2|TRANSPORT/);
    const reloaded = (
      (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
        installationFacts: JsonObject;
        installationScope: { incompleteReasons: Array<{ id: string }>; eicCompleteness: string };
      }
    );
    expect(reloaded.installationFacts.city).toBe("București");
    expect(reloaded.installationScope.incompleteReasons.map((item) => item.id)).toEqual([
      "MISSING_COST_EVIDENCE",
    ]);
    expect(reloaded.installationScope.eicCompleteness).toBe("PARTIAL");
    const patched = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessNotes: "Curte" }),
    });
    expect(patched.status).toBe(200);
    const patchedFacts = ((await readBody(patched)).facts as JsonObject);
    expect(patchedFacts.street).toBe("Strada Fabricii 10");
    expect(patchedFacts.accessNotes).toBe("Curte");
    expect(
      ((await readBody(await app.request("/api/quotes"))).overview as { quotes: unknown[] }).quotes
        .length,
    ).toBe(quotesBefore);
  });

  it("refuses invalid writes and write while unselected", async () => {
    const app = createApp();
    await enableSiteInstallation(app);
    const customer = await createCustomer(app, "Client Invalid Facts");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere invalidă"),
    );
    const requestId = (created.request as JsonObject).requestId as string;
    const unselected = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ city: "Cluj" }),
    });
    expect(unselected.status).toBe(400);
    expect((await readBody(unselected)).error).toBe("installation_not_selected");
    await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    const invalidEnum = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ facadeType: "PLASTIC" }),
    });
    expect(invalidEnum.status).toBe(400);
    expect((await readBody(invalidEnum)).error).toBe("invalid_facade_type");
    const invalidDim = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mountingSurfaceWidthMm: -2 }),
    });
    expect(invalidDim.status).toBe(400);
    expect((await readBody(invalidDim)).error).toBe("invalid_dimensions");
    const invalidElevation = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ installationElevationMm: 0 }),
    });
    expect(invalidElevation.status).toBe(400);
    expect((await readBody(invalidElevation)).error).toBe("invalid_elevation");
    const other = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ facadeType: "OTHER" }),
    });
    expect(other.status).toBe(400);
    expect((await readBody(other)).error).toBe("other_note_required");
  });

  it("requires confirmation to deselect when facts exist and deletes them atomically", async () => {
    const app = createApp();
    await enableSiteInstallation(app);
    const customer = await createCustomer(app, "Client Deselect");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere deselect"),
    );
    const requestId = (created.request as JsonObject).requestId as string;
    await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(completeFacts()),
    });
    const refused = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [] }),
    });
    expect(refused.status).toBe(409);
    expect((await readBody(refused)).error).toBe(
      "installation_facts_delete_confirmation_required",
    );
    const stillThere = (
      (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
        installationFacts: JsonObject | null;
        installationOffer: { selected: boolean };
      }
    );
    expect(stillThere.installationOffer.selected).toBe(true);
    expect(stillThere.installationFacts?.street).toBe("Strada Fabricii 10");
    const confirmed = await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        optionalScopeIds: [],
        confirmDeleteInstallationFacts: true,
      }),
    });
    expect(confirmed.status).toBe(200);
    const after = (
      (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
        installationFacts: unknown;
        installationScope: unknown;
        installationOffer: { selected: boolean };
      }
    );
    expect(after.installationOffer.selected).toBe(false);
    expect(after.installationFacts).toBeNull();
    expect(after.installationScope).toBeNull();
  });

  it("refuses locked facts write and keeps freeze and orphan-link gates", async () => {
    const sqlitePath = join(mkdtempSync(join(tmpdir(), "os-s2-")), "db.sqlite");
    const runtime = createProductSystemRuntime(sqlitePath);
    const app = createApp({ productSystem: runtime });
    await enableSiteInstallation(app);
    const customer = await createCustomer(app, "Client Lock Facts");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere lock facts"),
    );
    const requestId = (created.request as JsonObject).requestId as string;
    await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(completeFacts()),
    });
    const compile = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        values: { ...lettersValues, "root.inscription": "LOCKF" },
      }),
    });
    const compiled = await readBody(compile);
    const freeze = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId: customer.customerId,
        requestId,
      }),
    });
    expect(freeze.status).toBe(422);
    expect((await readBody(freeze)).error).toBe("incomplete_offer");
    const orphan = await app.request(`/api/products/${CANONICAL_PRODUCT_CODE}/quote-snapshots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId: customer.customerId,
      }),
    });
    expect(orphan.status).toBe(200);
    const quoteSnapshotId = ((await readBody(orphan)).quoteSnapshot as JsonObject)
      .quoteSnapshotId as string;
    const linked = await app.request(`/api/requests/${requestId}/quotes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quoteSnapshotId }),
    });
    expect(linked.status).toBe(422);
    expect((await readBody(linked)).reasons).toEqual([SITE_INSTALLATION_FREEZE_REASON]);
    const db = openSqliteDatabase(sqlitePath);
    db.prepare(
      `
      INSERT INTO commercial_request_quote_links (request_id, quote_snapshot_id, linked_at)
      VALUES (?, ?, ?)
    `,
    ).run(requestId, quoteSnapshotId, "2026-08-29T12:00:00.000Z");
    db.close();
    const locked = await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessNotes: "Nu" }),
    });
    expect(locked.status).toBe(409);
    expect((await readBody(locked)).error).toBe("installation_facts_locked");
    runtime.close();
  });

  it("preserves persisted facts when the organization is later disabled", async () => {
    const app = createApp();
    await enableSiteInstallation(app);
    const customer = await createCustomer(app, "Client Disable");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere păstrată"),
    );
    const requestId = (created.request as JsonObject).requestId as string;
    await app.request(`/api/requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ optionalScopeIds: [SITE_INSTALLATION_SCOPE_ID] }),
    });
    await app.request(`/api/requests/${requestId}/installation-facts`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(completeFacts()),
    });
    await enableSiteInstallation(app, "SERVICE_DISABLED");
    const detail = (
      (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
        installationFacts: JsonObject | null;
        installationOffer: { selected: boolean; canSelectNew: boolean };
        installationScope: { eicCompleteness: string };
      }
    );
    expect(detail.installationOffer.selected).toBe(true);
    expect(detail.installationOffer.canSelectNew).toBe(false);
    expect(detail.installationFacts?.city).toBe("București");
    expect(detail.installationScope.eicCompleteness).toBe("PARTIAL");
    const fresh = await readBody(
      await createRequest(app, customer.customerId as string, "Cerere nouă dezactivată"),
    );
    expect((fresh.detail as { installationOffer: { canSelectNew: boolean } }).installationOffer
      .canSelectNew).toBe(false);
  });

  it("leaves the product-only request flow unchanged", async () => {
    const app = createApp();
    const customer = await createCustomer(app, "Client Product Only");
    const created = await readBody(
      await createRequest(app, customer.customerId as string, "Doar produs"),
    );
    const requestId = (created.request as JsonObject).requestId as string;
    const compile = await app.request(`/api/products/${ACM_CASSETTE_NONE_PRODUCT_CODE}/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        values: {
          "root.inscription": "ACM1",
          "root.mountingSystem": "steel_angle",
          "face.widthMm": 1000,
          "face.heightMm": 500,
          "face.cassetteDepthMm": "40",
          "face.foldCount": "2",
        },
      }),
    });
    const compiled = await readBody(compile);
    const freeze = await app.request(
      `/api/products/${ACM_CASSETTE_NONE_PRODUCT_CODE}/quote-snapshots`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: compiled.definition,
          reviewId: compiled.reviewId,
          customerId: customer.customerId,
          requestId,
        }),
      },
    );
    expect(freeze.status).toBe(200);
    const detail = (
      (await readBody(await app.request(`/api/requests/${requestId}`))).detail as {
        installationFacts: unknown;
        installationScope: unknown;
      }
    );
    expect(detail.installationFacts).toBeNull();
    expect(detail.installationScope).toBeNull();
  });
});
