import { PLEXIGLAS_3MM_OPAL_ID } from "@workos-final/domain";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetCloudLoginAttemptGuard } from "../src/cloud/controlPlane.js";
import {
  addOrganization,
  addUser,
  cleanupCloudTemps,
  createCloudFixture,
  loginCloud,
  MEMBER_PASSWORD,
  OWNER_PASSWORD,
} from "./cloud-harness.js";

afterEach(() => {
  resetCloudLoginAttemptGuard();
  cleanupCloudTemps();
});

describe("Cloud auth and authorization", () => {
  it("keeps single-plane session public and login disabled", async () => {
    const app = createApp();
    const session = await app.request("/api/cloud/session");
    expect(session.status).toBe(200);
    await expect(session.json()).resolves.toMatchObject({
      mode: "single_plane",
      user: null,
    });
    const login = await app.request("/api/cloud/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "owner@example.test", password: OWNER_PASSWORD }),
    });
    expect(login.status).toBe(404);
  });

  it("rejects anonymous Cloud domain reads and owner writes", async () => {
    const fixture = createCloudFixture();
    const health = await fixture.app.request("/api/health");
    expect(health.status).toBe(200);
    const session = await fixture.app.request("/api/cloud/session");
    expect(session.status).toBe(200);
    await expect(session.json()).resolves.toMatchObject({
      mode: "cloud",
      user: null,
    });
    expect((await fixture.app.request("/api/resources-admin")).status).toBe(401);
    expect(
      (
        await fixture.app.request("/api/resources-admin/cost-evidence/cev:missing", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ amount: 18, note: "anonim" }),
        })
      ).status,
    ).toBe(401);
    fixture.close();
  });

  it("logs in an owner, ignores client org headers, and blocks a member write", async () => {
    const fixture = createCloudFixture();
    const alpha = await addOrganization(fixture, "Atelier Alpha");
    const beta = await addOrganization(fixture, "Atelier Beta");
    await addUser(fixture, {
      email: "owner@example.test",
      password: OWNER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "owner",
    });
    const member = await addUser(fixture, {
      email: "member@example.test",
      password: MEMBER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "member",
    });
    fixture.controlPlane.addMembership({
      userId: member.userId,
      organizationId: beta.organization.organizationId,
      role: "member",
    });

    const ownerLogin = await loginCloud(
      fixture.app,
      "owner@example.test",
      OWNER_PASSWORD,
    );
    expect(ownerLogin.response.status).toBe(200);
    expect(ownerLogin.body.user).toMatchObject({ email: "owner@example.test" });

    const sessionWithHeader = await fixture.app.request("/api/cloud/session", {
      headers: {
        cookie: ownerLogin.cookie ?? "",
        "X-Organization-Id": beta.organization.organizationId,
      },
    });
    const sessionBody = (await sessionWithHeader.json()) as {
      organization?: { organizationId?: string; displayName?: string };
    };
    expect(sessionBody.organization?.organizationId).toBe(alpha.organization.organizationId);
    expect(sessionBody.organization?.displayName).toBe("Atelier Alpha");

    const admin = (await (
      await fixture.app.request("/api/resources-admin", {
        headers: { cookie: ownerLogin.cookie ?? "" },
      })
    ).json()) as { costEvidence?: Array<Record<string, unknown>> };
    const plexi = admin.costEvidence?.find((item) => item.resourceId === PLEXIGLAS_3MM_OPAL_ID);
    expect(plexi?.evidenceRowId).toBeTruthy();

    const ownerWrite = await fixture.app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: {
          cookie: ownerLogin.cookie ?? "",
          "content-type": "application/json",
        },
        body: JSON.stringify({ amount: 18, note: "owner" }),
      },
    );
    expect(ownerWrite.status).toBe(200);

    const memberLogin = await loginCloud(
      fixture.app,
      "member@example.test",
      MEMBER_PASSWORD,
      alpha.organization.organizationId,
    );
    expect(memberLogin.response.status).toBe(200);
    const memberRead = await fixture.app.request("/api/resources-admin", {
      headers: { cookie: memberLogin.cookie ?? "" },
    });
    expect(memberRead.status).toBe(200);
    const memberWrite = await fixture.app.request(
      `/api/resources-admin/cost-evidence/${plexi?.evidenceRowId as string}`,
      {
        method: "PATCH",
        headers: {
          cookie: memberLogin.cookie ?? "",
          "content-type": "application/json",
        },
        body: JSON.stringify({ amount: 19, note: "member" }),
      },
    );
    expect(memberWrite.status).toBe(403);
    fixture.close();
  });

  it("requires organization selection and clears the operator cookie on switch", async () => {
    const fixture = createCloudFixture();
    const alpha = await addOrganization(fixture, "Atelier Alpha");
    const beta = await addOrganization(fixture, "Atelier Beta");
    const user = await addUser(fixture, {
      email: "owner@example.test",
      password: OWNER_PASSWORD,
      organizationId: alpha.organization.organizationId,
      role: "owner",
    });
    fixture.controlPlane.addMembership({
      userId: user.userId,
      organizationId: beta.organization.organizationId,
      role: "member",
    });

    const first = await loginCloud(fixture.app, "owner@example.test", OWNER_PASSWORD);
    expect(first.response.status).toBe(409);
    expect(first.body.error).toBe("organization_selection_required");

    const chosen = await loginCloud(
      fixture.app,
      "owner@example.test",
      OWNER_PASSWORD,
      alpha.organization.organizationId,
    );
    expect(chosen.response.status).toBe(200);

    const switched = await fixture.app.request("/api/cloud/active-organization", {
      method: "POST",
      headers: {
        cookie: chosen.cookie ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify({ organizationId: beta.organization.organizationId }),
    });
    expect(switched.status).toBe(200);
    const switchedBody = (await switched.json()) as {
      organization?: { displayName?: string; role?: string };
    };
    expect(switchedBody.organization).toMatchObject({
      displayName: "Atelier Beta",
      role: "member",
    });
    const setCookies = switched.headers.getSetCookie().join(";");
    expect(setCookies).toMatch(/workos_operator_session=/);
    fixture.close();
  });
});
