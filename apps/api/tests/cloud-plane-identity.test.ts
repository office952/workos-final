import { afterEach, describe, expect, it } from "vitest";
import { resetCloudLoginAttemptGuard } from "../src/cloud/controlPlane.js";
import { derivePlanePaths } from "../src/cloud/paths.js";
import { openSqliteDatabase } from "../src/persistence/sqlite.js";
import {
  addOrganization,
  addUser,
  cleanupCloudTemps,
  createCloudFixture,
  loginCloud,
  OWNER_PASSWORD,
} from "./cloud-harness.js";

afterEach(() => {
  resetCloudLoginAttemptGuard();
  cleanupCloudTemps();
});

describe("operational plane identity", () => {
  it("fails closed when the bound organization does not match", async () => {
    const fixture = createCloudFixture();
    const alpha = await addOrganization(fixture, "Atelier Alpha");
    await addUser(fixture, {
      email: "owner@example.test",
      password: OWNER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "owner",
    });
    const paths = derivePlanePaths(fixture.cloudRoot, alpha.plane.planeKey);
    const db = openSqliteDatabase(paths.sqlitePath);
    db.prepare(
      `UPDATE operational_plane_identity
       SET organization_id = ?
       WHERE id = 'current'`,
    ).run("org:other");
    db.close();

    const login = await loginCloud(fixture.app, "owner@example.test", OWNER_PASSWORD);
    expect(login.response.status).toBe(200);
    const response = await fixture.app.request("/api/resources-admin", {
      headers: { cookie: login.cookie ?? "" },
    });
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "plane_identity_mismatch" });
    fixture.close();
  });

  it("fails closed when plane identity is missing", async () => {
    const fixture = createCloudFixture();
    const alpha = await addOrganization(fixture, "Atelier Alpha");
    await addUser(fixture, {
      email: "owner@example.test",
      password: OWNER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "owner",
    });
    const paths = derivePlanePaths(fixture.cloudRoot, alpha.plane.planeKey);
    const db = openSqliteDatabase(paths.sqlitePath);
    db.prepare(`DELETE FROM operational_plane_identity WHERE id = 'current'`).run();
    db.close();

    const login = await loginCloud(fixture.app, "owner@example.test", OWNER_PASSWORD);
    const response = await fixture.app.request("/api/resources-admin", {
      headers: { cookie: login.cookie ?? "" },
    });
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "plane_identity_missing" });
    fixture.close();
  });
});
