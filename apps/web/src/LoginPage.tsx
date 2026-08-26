import { useEffect, useId, useState, type FormEvent, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  consumeCloudSessionExpiredMark,
  intendedReturnPath,
  loginErrorLabel,
  type CloudAuthGateKind,
} from "./cloudAuth";
import { useCloudSession } from "./CloudSessionContext";
import type { CloudSessionMembership } from "./cloudSessionApi";
import { ThemeSwitcher } from "./theme/ThemeSwitcher";
import { Field } from "./ui/Field";

export function LoginPage({
  gate = "unauthenticated",
}: {
  gate?: CloudAuthGateKind;
}) {
  const location = useLocation();
  const returnPath = intendedReturnPath(location.pathname, location.search);
  const { login, sessionExpired } = useCloudSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choices, setChoices] = useState<CloudSessionMembership[] | null>(null);
  const [organizationId, setOrganizationId] = useState("");
  const [expiredNotice, setExpiredNotice] = useState(
    gate === "session_expired" || sessionExpired,
  );
  const errorId = useId();

  useEffect(() => {
    if (gate === "session_expired" || sessionExpired || consumeCloudSessionExpiredMark()) {
      setExpiredNotice(true);
    }
  }, [gate, sessionExpired]);

  useEffect(() => {
    if (location.hash !== "#autentificare") {
      return;
    }
    document.getElementById("autentificare")?.focus();
  }, [location.hash]);

  function skipToLogin(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) {
      return;
    }
    document.getElementById("autentificare")?.focus();
  }

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
        setExpiredNotice(false);
        return;
      }
      if (result.error === "cloud_disabled" || result.error === "auth_config_missing") {
        setError(loginErrorLabel(result.error));
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
      <a className="skip-link" href="#autentificare" onClick={skipToLogin}>
        Sari la autentificare
      </a>
      <header className="login-utilities">
        <ThemeSwitcher />
      </header>
      <main id="autentificare" className="login-main" tabIndex={-1}>
        {gate === "boot" ? (
          <section className="login-card" aria-busy="true">
            <h1>Se încarcă</h1>
            <p className="client-current-hint">Pregătim accesul.</p>
          </section>
        ) : null}
        {gate === "auth_config_missing" ? (
          <section className="login-card">
            <h1>Autentificare indisponibilă</h1>
            <p className="client-current-hint">
              Autentificarea Cloud nu este configurată. Nu este o problemă de email sau parolă.
            </p>
          </section>
        ) : null}
        {gate === "network" ? (
          <section className="login-card">
            <h1>Sistemul nu răspunde</h1>
            <p className="client-current-hint">Reîncearcă. Conexiunea s-a întrerupt.</p>
          </section>
        ) : null}
        {gate === "unauthenticated" || gate === "session_expired" ? (
          <form className="login-card" onSubmit={submit}>
            <h1>Autentificare</h1>
            <p className="client-current-hint">
              Intră cu email-ul și parola organizației. Identificarea operatorului se face separat, din
              Atelier, cu PIN.
            </p>
            {expiredNotice ? (
              <p className="notice notice-compact" role="status">
                Sesiunea a expirat. Autentifică-te din nou.
              </p>
            ) : null}
            {returnPath !== "/" ? (
              <p className="visually-hidden">După autentificare revii la pagina cerută.</p>
            ) : null}
            <Field label="Email">
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={busy}
                required
              />
            </Field>
            <Field label="Parolă">
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={busy}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                required
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
            {error ? (
              <p id={errorId} className="status-bad" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy || email.trim().length === 0 || password.length === 0}
            >
              {busy ? "Se autentifică…" : "Intră"}
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}
