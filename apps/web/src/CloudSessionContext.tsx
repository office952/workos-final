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
import {
  clearCloudAuthenticatedMark,
  rememberCloudAuthenticated,
} from "./cloudAuth";
import { canAdministerOrganization } from "./organizationAccess";
import { setCloudUnauthorizedHandler } from "./sessionExpiryBridge";

type CloudSessionState = CloudSessionSnapshot & {
  ready: boolean;
  unavailable: boolean;
  sessionExpired: boolean;
  canAdministerOrganization: boolean;
  login: (
    email: string,
    password: string,
    organizationId?: string,
  ) => Promise<CloudLoginResult>;
  logout: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<CloudLoginResult>;
  refresh: () => Promise<void>;
  markSessionExpired: () => void;
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
  const [sessionExpired, setSessionExpired] = useState(false);
  const [session, setSession] = useState<CloudSessionSnapshot>(emptySession);

  const applySession = useCallback((current: CloudSessionSnapshot) => {
    setSession(current);
    if (current.user && current.organization) {
      rememberCloudAuthenticated();
      setSessionExpired(false);
    }
  }, []);

  const markSessionExpired = useCallback(() => {
    setSessionExpired(true);
    setSession((current) => ({
      ...current,
      user: null,
      organization: null,
    }));
  }, []);

  const refresh = useCallback(async () => {
    const current = await fetchCloudSession();
    applySession(current);
    setUnavailable(false);
    setReady(true);
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;
    void fetchCloudSession()
      .then((current) => {
        if (cancelled) {
          return;
        }
        applySession(current);
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
  }, [applySession]);

  useEffect(() => {
    setCloudUnauthorizedHandler(() => {
      markSessionExpired();
    });
    return () => {
      setCloudUnauthorizedHandler(null);
    };
  }, [markSessionExpired]);

  const login = useCallback(
    async (email: string, password: string, organizationId?: string) => {
      const result = await loginCloud(email, password, organizationId);
      if (result.ok) {
        applySession(result.session);
        setUnavailable(false);
        setSessionExpired(false);
      }
      return result;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    await logoutCloud();
    clearCloudAuthenticatedMark();
    setSessionExpired(false);
    const current = await fetchCloudSession().catch(() => emptySession);
    setSession(current);
  }, []);

  const switchOrganization = useCallback(async (organizationId: string) => {
    const result = await switchCloudOrganization(organizationId);
    if (result.ok) {
      applySession(result.session);
    }
    return result;
  }, [applySession]);

  const value = useMemo(
    () => ({
      ...session,
      ready,
      unavailable,
      sessionExpired,
      canAdministerOrganization: canAdministerOrganization({
        mode: session.mode,
        role: session.organization?.role ?? null,
      }),
      login,
      logout,
      switchOrganization,
      refresh,
      markSessionExpired,
    }),
    [
      session,
      ready,
      unavailable,
      sessionExpired,
      login,
      logout,
      switchOrganization,
      refresh,
      markSessionExpired,
    ],
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
      sessionExpired: false,
      canAdministerOrganization: canAdministerOrganization({
        mode: snapshot.mode,
        role: snapshot.organization?.role ?? null,
      }),
      login: async () => ({ ok: false as const, error: "test" }),
      logout: async () => undefined,
      switchOrganization: async () => ({ ok: false as const, error: "test" }),
      refresh: async () => undefined,
      markSessionExpired: () => undefined,
    }),
    [snapshot],
  );
  return (
    <CloudSessionContext.Provider value={value}>{children}</CloudSessionContext.Provider>
  );
}
