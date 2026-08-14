import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export type AppNavItem = {
  to: string;
  label: string;
};

type AppShellProps = {
  children: ReactNode;
  navItems: readonly AppNavItem[];
};

export function AppShell({ children, navItems }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <p className="app-brand">WorkOS Final</p>
          <nav className="app-nav" aria-label="Navigare principală">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
