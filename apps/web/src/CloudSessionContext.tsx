import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCloudSession,
  loginCloud,
  logoutCloud,
  switchCloudOrganization,
  type CloudLoginResult,
  type CloudSessionSnapshot,
} from "./cloudSessionApi";
import { canAdministerOrganization } from "./organizationAccess";

type CloudSessionState = CloudSessionSnapshot & {
  ready: boolean;
  unavailable: boolean;
  canAdministerOrganization: boolean;
  login: (
    email: string,
    password: string,
    organizationId?: string,
  ) => Promise<CloudLoginResult>;
  logout: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<CloudLoginResult>;
  refresh: () => Promise<void>;
};

const emptySession: CloudSessionSnapshot = {
  mode: "single_plane",
  user: null,
  organization: null,
  memberships: [],
};

const CloudSessionContext = createContext<CloudSessionState | null>(null);

export function CloudSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [session, setSession] = useState<CloudSessionSnapshot>(emptySession);

  const refresh = useCallback(async () => {
    const current = await fetchCloudSession();
    setSession(current);
    setUnavailable(false);
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchCloudSession()
      .then((current) => {
        if (cancelled) {
          return;
        }
        setSession(current);
        setUnavailable(false);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setUnavailable(true);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string, organizationId?: string) => {
      const result = await loginCloud(email, password, organizationId);
      if (result.ok) {
        setSession(result.session);
        setUnavailable(false);
      }
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutCloud();
    const current = await fetchCloudSession().catch(() => emptySession);
    setSession(current);
  }, []);

  const switchOrganization = useCallback(async (organizationId: string) => {
    const result = await switchCloudOrganization(organizationId);
    if (result.ok) {
      setSession(result.session);
    }
    return result;
  }, []);

  const value = useMemo(
    () => ({
      ...session,
      ready,
      unavailable,
      canAdministerOrganization: canAdministerOrganization({
        mode: session.mode,
        role: session.organization?.role ?? null,
      }),
      login,
      logout,
      switchOrganization,
      refresh,
    }),
    [session, ready, unavailable, login, logout, switchOrganization, refresh],
  );

  return (
    <CloudSessionContext.Provider value={value}>
      {children}
    </CloudSessionContext.Provider>
  );
}

export function useCloudSession(): CloudSessionState {
  const value = useContext(CloudSessionContext);
  if (!value) {
    throw new Error("CloudSessionProvider missing");
  }
  return value;
}

export function useCloudSessionOptional(): CloudSessionState | null {
  return useContext(CloudSessionContext);
}

export function useCanAdministerOrganization(): boolean {
  const session = useCloudSessionOptional();
  if (!session) {
    return true;
  }
  return session.canAdministerOrganization;
}

export function CloudSessionTestProvider({
  snapshot,
  children,
}: {
  snapshot: CloudSessionSnapshot;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      ...snapshot,
      ready: true,
      unavailable: false,
      canAdministerOrganization: canAdministerOrganization({
        mode: snapshot.mode,
        role: snapshot.organization?.role ?? null,
      }),
      login: async () => ({ ok: false, error: "test" }),
      logout: async () => undefined,
      switchOrganization: async () => ({ ok: false, error: "test" }),
      refresh: async () => undefined,
    }),
    [snapshot],
  );
  return (
    <CloudSessionContext.Provider value={value}>{children}</CloudSessionContext.Provider>
  );
}
