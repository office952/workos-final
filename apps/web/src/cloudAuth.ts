export type CloudAuthGateKind =
  | "boot"
  | "auth_config_missing"
  | "network"
  | "unauthenticated"
  | "session_expired";

const WAS_AUTHENTICATED_KEY = "workos.cloud.wasAuthenticated";

export function safeAppPath(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  if (trimmed.startsWith("//")) {
    return null;
  }
  if (trimmed.includes("\\")) {
    return null;
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function intendedReturnPath(pathname: string, search = ""): string {
  const combined = `${pathname}${search}`;
  return safeAppPath(combined) ?? "/";
}

export function rememberCloudAuthenticated(): void {
  try {
    sessionStorage.setItem(WAS_AUTHENTICATED_KEY, "1");
  } catch {
    // Private mode or blocked storage must not break login.
  }
}

export function clearCloudAuthenticatedMark(): void {
  try {
    sessionStorage.removeItem(WAS_AUTHENTICATED_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function consumeCloudSessionExpiredMark(): boolean {
  try {
    const marked = sessionStorage.getItem(WAS_AUTHENTICATED_KEY) === "1";
    if (marked) {
      sessionStorage.removeItem(WAS_AUTHENTICATED_KEY);
    }
    return marked;
  } catch {
    return false;
  }
}

export function loginErrorLabel(error: string): string {
  switch (error) {
    case "invalid_credentials":
      return "Email sau parolă greșită.";
    case "cloud_disabled":
    case "auth_config_missing":
      return "Autentificarea Cloud nu este configurată.";
    case "rate_limited":
      return "Prea multe încercări. Așteaptă un minut.";
    case "disabled":
      return "Contul este dezactivat.";
    case "no_membership":
      return "Acest cont nu are o organizație activă.";
    case "organization_disabled":
      return "Organizația este dezactivată.";
    case "forbidden":
      return "Nu ai acces la organizația aleasă.";
    default:
      return "Autentificarea nu a reușit.";
  }
}

export function identifyErrorLabel(error: string): string {
  switch (error) {
    case "invalid_pin":
      return "PIN greșit.";
    case "not_configured":
      return "Această persoană nu are PIN configurat.";
    case "retired_person":
      return "Persoana nu mai este activă.";
    case "rate_limited":
      return "Prea multe încercări. Așteaptă puțin.";
    case "unknown_person":
      return "Persoana nu a fost găsită.";
    default:
      return "Identificarea nu a reușit.";
  }
}
