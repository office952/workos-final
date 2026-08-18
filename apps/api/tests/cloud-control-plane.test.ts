import { afterEach, describe, expect, it } from "vitest";
import {
  createControlPlane,
  resetCloudLoginAttemptGuard,
} from "../src/cloud/controlPlane.js";
import { validateCloudPassword } from "../src/cloud/password.js";
import { openControlPlaneDatabase } from "../src/persistence/controlPlaneSqlite.js";
import { OWNER_PASSWORD, trackTempDir, cleanupCloudTemps } from "./cloud-harness.js";

afterEach(() => {
  resetCloudLoginAttemptGuard();
  cleanupCloudTemps();
});

describe("Cloud Control Plane", () => {
  it("creates organization, user, membership and plane identities", async () => {
    const db = openControlPlaneDatabase(":memory:");
    const plane = createControlPlane(db, trackTempDir());
    const organization = plane.createOrganization({ displayName: "Atelier Alpha" });
    expect(organization.organizationId.startsWith("org:")).toBe(true);
    expect(organization.slug).toMatch(/^[a-z0-9-]{3,48}$/);

    const user = await plane.createUser({
      email: "Owner@Example.TEST",
      password: OWNER_PASSWORD,
    });
    expect(user.email).toBe("owner@example.test");
    expect(user.userId.startsWith("usr:")).toBe(true);

    const membership = plane.addMembership({
      userId: user.userId,
      organizationId: organization.organizationId,
      role: "owner",
    });
    expect(membership.membershipId.startsWith("mem:")).toBe(true);
    expect(plane.getActiveMembership(user.userId, organization.organizationId)?.role).toBe(
      "owner",
    );

    const descriptor = plane.createPlane({
      organizationId: organization.organizationId,
      bootstrapPolicy: "SYNTHETIC_TEST",
    });
    expect(descriptor.planeId.startsWith("pln:")).toBe(true);
    expect(descriptor.planeKey).toMatch(/^[a-z0-9]{24}$/);
    expect(plane.getPlaneByOrganization(organization.organizationId)?.planeId).toBe(
      descriptor.planeId,
    );
    plane.close();
  });

  it("rejects weak passwords before hashing", async () => {
    expect(validateCloudPassword("short")).toBe("too_short");
    expect(validateCloudPassword("1234567890")).toBe("pin_like");
    expect(validateCloudPassword("abcdefghij")).toBe("too_simple");
    expect(validateCloudPassword(OWNER_PASSWORD)).toBeNull();

    const db = openControlPlaneDatabase(":memory:");
    const plane = createControlPlane(db, trackTempDir());
    await expect(
      plane.createUser({ email: "weak@example.test", password: "1234567890" }),
    ).rejects.toThrow(/invalid_password/);
    plane.close();
  });

  it("rate-limits repeated failed logins", async () => {
    const db = openControlPlaneDatabase(":memory:");
    const plane = createControlPlane(db, trackTempDir());
    for (let index = 0; index < 5; index += 1) {
      const result = await plane.verifyLogin("missing@example.test", "wrong-password");
      expect(result).toEqual({ ok: false, error: "invalid_credentials" });
    }
    await expect(plane.verifyLogin("missing@example.test", "wrong-password")).resolves.toEqual({
      ok: false,
      error: "rate_limited",
    });
    plane.close();
  });
});
