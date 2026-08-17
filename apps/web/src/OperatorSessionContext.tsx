import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
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

export function OperatorSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [operator, setOperator] = useState<OperatorSessionOperator | null>(null);
  const [session, setSession] = useState<OperatorSessionInfo | null>(null);

  const refresh = useCallback(async () => {
    const current = await fetchOperatorSession();
    setOperator(current.operator);
    setSession(current.session);
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchOperatorSession()
      .then((current) => {
        if (cancelled) {
          return;
        }
        setOperator(current.operator);
        setSession(current.session);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setOperator(null);
          setSession(null);
          setReady(true);
        }
      });
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
