const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type CloudAccessMode = "cloud" | "single_plane";
export type CloudMembershipRole = "owner" | "member";

export type CloudSessionUser = {
  userId: string;
  email: string;
};

export type CloudSessionOrganization = {
  organizationId: string;
  displayName: string;
  slug: string;
  role: CloudMembershipRole | null;
};

export type CloudSessionMembership = {
  organizationId: string;
  displayName: string;
  slug: string;
  role: CloudMembershipRole;
  status: "ACTIVE" | "DISABLED";
};

export type CloudSessionSnapshot = {
  mode: CloudAccessMode;
  authConfigured?: boolean;
  user: CloudSessionUser | null;
  organization: CloudSessionOrganization | null;
  memberships: CloudSessionMembership[];
};

export type CloudLoginResult =
  | { ok: true; session: CloudSessionSnapshot }
  | {
      ok: false;
      error: string;
      memberships?: CloudSessionMembership[];
    };

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchCloudSession(): Promise<CloudSessionSnapshot> {
  const response = await fetch(`${baseUrl}/api/cloud/session`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("cloud_session_unavailable");
  }
  const body = await readJson<CloudSessionSnapshot & { error?: string }>(response);
  return {
    mode: body.mode === "cloud" ? "cloud" : "single_plane",
    authConfigured: body.authConfigured !== false,
    user: body.user ?? null,
    organization: body.organization ?? null,
    memberships: body.memberships ?? [],
  };
}

export async function loginCloud(
  email: string,
  password: string,
  organizationId?: string,
): Promise<CloudLoginResult> {
  const response = await fetch(`${baseUrl}/api/cloud/login`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      ...(organizationId ? { organizationId } : {}),
    }),
  });
  const body = await readJson<
    CloudSessionSnapshot & { error?: string; memberships?: CloudSessionMembership[] }
  >(response);
  if (!response.ok || !body.user) {
    return {
      ok: false,
      error: body.error ?? "login_failed",
      memberships: body.memberships,
    };
  }
  return {
    ok: true,
    session: {
      mode: "cloud",
      authConfigured: true,
      user: body.user,
      organization: body.organization ?? null,
      memberships: body.memberships ?? [],
    },
  };
}

export async function logoutCloud(): Promise<void> {
  await fetch(`${baseUrl}/api/cloud/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function switchCloudOrganization(
  organizationId: string,
): Promise<CloudLoginResult> {
  const response = await fetch(`${baseUrl}/api/cloud/active-organization`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ organizationId }),
  });
  const body = await readJson<CloudSessionSnapshot & { error?: string }>(response);
  if (!response.ok || !body.user) {
    return { ok: false, error: body.error ?? "switch_failed" };
  }
  return {
    ok: true,
    session: {
      mode: "cloud",
      authConfigured: true,
      user: body.user,
      organization: body.organization ?? null,
      memberships: body.memberships ?? [],
    },
  };
}
