import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCloudSessionOptional } from "./CloudSessionContext";
import {
  createDevOperatorSession,
  fetchOperatorSession,
  identifyOperator,
  logoutOperator,
  type OperatorSessionInfo,
  type OperatorSessionOperator,
} from "./operatorSessionApi";

type OperatorSessionState = {
  ready: boolean;
  operator: OperatorSessionOperator | null;
  session: OperatorSessionInfo | null;
  expired: boolean;
  identify: (
    personId: string,
    pin: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const OperatorSessionContext = createContext<OperatorSessionState | null>(null);

function isDevAutoOperatorEnabled(): boolean {
  return (
    import.meta.env.DEV === true && import.meta.env.VITE_WORKOS_DEV_AUTO_OPERATOR === "1"
  );
}

export function OperatorSessionProvider({ children }: { children: ReactNode }) {
  const cloud = useCloudSessionOptional();
  const organizationId = cloud?.organization?.organizationId ?? null;
  const [ready, setReady] = useState(false);
  const [operator, setOperator] = useState<OperatorSessionOperator | null>(null);
  const [session, setSession] = useState<OperatorSessionInfo | null>(null);
  const [expired, setExpired] = useState(false);
  const hadOperator = useRef(false);
  const devAutoAttempted = useRef(false);

  const applyOperator = useCallback(
    (
      current: {
        operator: OperatorSessionOperator | null;
        session: OperatorSessionInfo | null;
      },
    ) => {
      const expiredSession =
        current.session !== null && Date.parse(current.session.expiresAt) <= Date.now();
      if (expiredSession) {
        setExpired(true);
        setOperator(null);
        setSession(null);
        hadOperator.current = false;
        return;
      }
      setExpired(false);
      setOperator(current.operator);
      setSession(current.session);
      hadOperator.current = Boolean(current.operator);
    },
    [],
  );

  const refresh = useCallback(async () => {
    const current = await fetchOperatorSession();
    applyOperator(current);
    setReady(true);
  }, [applyOperator]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const current = await fetchOperatorSession();
        if (cancelled) {
          return;
        }
        if (current.operator) {
          applyOperator(current);
          setReady(true);
          return;
        }
        if (isDevAutoOperatorEnabled() && !devAutoAttempted.current) {
          devAutoAttempted.current = true;
          const created = await createDevOperatorSession();
          if (cancelled) {
            return;
          }
          if (!created.ok) {
            console.warn(
              "[workos] DEV auto-operator unavailable:",
              created.error,
              `(HTTP ${created.status})`,
            );
            setOperator(null);
            setSession(null);
            setReady(true);
            return;
          }
          const again = await fetchOperatorSession();
          if (cancelled) {
            return;
          }
          setOperator(again.operator);
          setSession(again.session);
          setReady(true);
          return;
        }
        setOperator(null);
        setSession(null);
        setReady(true);
      } catch {
        if (!cancelled) {
          setOperator(null);
          setSession(null);
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyOperator]);

  useEffect(() => {
    if (!session?.expiresAt) {
      return;
    }
    const remainingMs = Date.parse(session.expiresAt) - Date.now();
    if (!Number.isFinite(remainingMs)) {
      return;
    }
    if (remainingMs <= 0) {
      applyOperator({ operator, session });
      return;
    }
    const timer = window.setTimeout(() => {
      applyOperator({ operator: null, session });
    }, remainingMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [applyOperator, operator, session]);

  useEffect(() => {
    if (!organizationId) {
      return;
    }
    hadOperator.current = false;
    setExpired(false);
    setOperator(null);
    setSession(null);
    void refresh();
  }, [organizationId, refresh]);

  const identify = useCallback(async (personId: string, pin: string) => {
    const result = await identifyOperator(personId, pin);
    if (!result.ok) {
      return result;
    }
    setExpired(false);
    setOperator(result.operator);
    setSession(result.session);
    hadOperator.current = true;
    return { ok: true as const };
  }, []);

  const logout = useCallback(async () => {
    await logoutOperator();
    hadOperator.current = false;
    setExpired(false);
    setOperator(null);
    setSession(null);
  }, []);

  return (
    <OperatorSessionContext.Provider
      value={{ ready, operator, session, expired, identify, logout, refresh }}
    >
      {children}
    </OperatorSessionContext.Provider>
  );
}

export function useOperatorSession(): OperatorSessionState {
  const value = useContext(OperatorSessionContext);
  if (!value) {
    throw new Error("OperatorSessionProvider missing");
  }
  return value;
}

export function isDevOperatorUiEnabled(): boolean {
  return isDevAutoOperatorEnabled();
}
