import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <p className="app-brand">WorkOS Final</p>
          <nav className="app-nav" aria-label="Navigare principală">
            <a href="/" aria-current="page">
              Stare sistem
            </a>
          </nav>
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
