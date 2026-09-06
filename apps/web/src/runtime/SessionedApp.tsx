import type { ReactNode } from "react";
import { CloudSessionProvider, useCloudSession } from "../CloudSessionContext";
import { LoginPage } from "../LoginPage";
import { OperatorSessionProvider } from "../OperatorSessionContext";

type SessionedAppProps = {
  children: ReactNode;
};

export function SessionedApp({ children }: SessionedAppProps) {
  return (
    <CloudSessionProvider>
      <AppSessionGate>{children}</AppSessionGate>
    </CloudSessionProvider>
  );
}

function AppSessionGate({ children }: SessionedAppProps) {
  const {
    ready,
    unavailable,
    mode,
    user,
    organization,
    authConfigured,
    sessionExpired,
  } = useCloudSession();
  if (!ready) {
    return <LoginPage gate="boot" />;
  }
  if (unavailable) {
    return <LoginPage gate="network" />;
  }
  if (mode === "cloud" && authConfigured === false) {
    return <LoginPage gate="auth_config_missing" />;
  }
  if (mode === "cloud" && (!user || !organization)) {
    return <LoginPage gate={sessionExpired ? "session_expired" : "unauthenticated"} />;
  }
  return (
    <OperatorSessionProvider key={organization?.organizationId ?? "single-plane"}>
      {children}
    </OperatorSessionProvider>
  );
}
