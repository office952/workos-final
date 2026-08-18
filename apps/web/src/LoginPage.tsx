import { useState, type FormEvent } from "react";
import { useCloudSession } from "./CloudSessionContext";
import type { CloudSessionMembership } from "./cloudSessionApi";
import { Field } from "./ui/Field";

export function LoginPage() {
  const { login } = useCloudSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choices, setChoices] = useState<CloudSessionMembership[] | null>(null);
  const [organizationId, setOrganizationId] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await login(
        email,
        password,
        choices ? organizationId : undefined,
      );
      if (result.ok) {
        setPassword("");
        setChoices(null);
        return;
      }
      if (result.error === "organization_selection_required" && result.memberships) {
        setChoices(result.memberships);
        setOrganizationId(result.memberships[0]?.organizationId ?? "");
        setError("Alege organizația pentru acest cont.");
        return;
      }
      setError(loginErrorLabel(result.error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Autentificare</h1>
        <p className="client-current-hint">
          Intră cu email-ul și parola. Apoi poți identifica operatorul din atelier cu PIN.
        </p>
        <Field label="Email">
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
          />
        </Field>
        <Field label="Parolă">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={busy}
          />
        </Field>
        {choices ? (
          <Field label="Organizație">
            <select
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              disabled={busy}
            >
              {choices.map((item) => (
                <option key={item.organizationId} value={item.organizationId}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        {error ? <p className="status-bad">{error}</p> : null}
        <button type="submit" disabled={busy || email.trim().length === 0 || password.length === 0}>
          Intră
        </button>
      </form>
    </div>
  );
}

export function loginErrorLabel(error: string): string {
  switch (error) {
    case "invalid_credentials":
      return "Email sau parolă greșită.";
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
