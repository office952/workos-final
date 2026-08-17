import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  const [ready, setReady] = useState(false);
  const [operator, setOperator] = useState<OperatorSessionOperator | null>(null);
  const [session, setSession] = useState<OperatorSessionInfo | null>(null);
  const devAutoAttempted = useRef(false);

  const refresh = useCallback(async () => {
    const current = await fetchOperatorSession();
    setOperator(current.operator);
    setSession(current.session);
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const current = await fetchOperatorSession();
        if (cancelled) {
          return;
        }
        if (current.operator) {
          setOperator(current.operator);
          setSession(current.session);
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
  }, []);

  const identify = useCallback(async (personId: string, pin: string) => {
    const result = await identifyOperator(personId, pin);
    if (!result.ok) {
      return result;
    }
    setOperator(result.operator);
    setSession(result.session);
    return { ok: true as const };
  }, []);

  const logout = useCallback(async () => {
    await logoutOperator();
    setOperator(null);
    setSession(null);
  }, []);

  return (
    <OperatorSessionContext.Provider
      value={{ ready, operator, session, identify, logout, refresh }}
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
