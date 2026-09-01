import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useCloudSessionOptional } from "./CloudSessionContext";
import { contextTitleForLocation } from "./navigation/navigationRegistry";
import { readSidebarCollapsed, writeSidebarCollapsed } from "./navigation/sidebarCollapse";
import {
  DEFAULT_NAVIGATION_VISIBILITY,
  resolveVisibleDestinations,
  type NavigationVisibilityContext,
} from "./navigation/visibleNavigation";
import { OperatorIdentifyForm } from "./OperatorIdentifyForm";
import { useOperatorSession, isDevOperatorUiEnabled } from "./OperatorSessionContext";
import { fetchSellerProfile } from "./sellerApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { IdentityMenu } from "./ui/IdentityMenu";
import { MobileNavigationDrawer } from "./ui/MobileNavigationDrawer";
import { StableSidebar } from "./ui/StableSidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { pathname, search, hash } = useLocation();
  const cloud = useCloudSessionOptional();
  const { ready, operator, logout } = useOperatorSession();
  const [identifyOpen, setIdentifyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed);
  const [legalName, setLegalName] = useState<string | null>(null);
  const officeRoute = isAdminOfficeRoute(pathname);
  const visibilityContext = useMemo(
    () => visibilityContextFromSession(cloud),
    [cloud],
  );
  const visibleDestinations = useMemo(
    () => resolveVisibleDestinations(visibilityContext),
    [visibilityContext],
  );
  const location = useMemo(() => ({ pathname, search }), [pathname, search]);
  const contextTitle = contextTitleForLocation(location, visibleDestinations);

  useEffect(() => {
    if (hash !== "#continut-principal") {
      return;
    }
    document.getElementById("continut-principal")?.focus();
  }, [hash]);

  useEffect(() => {
    if (cloud?.mode !== "cloud" || !cloud.organization) {
      setLegalName(null);
      return;
    }
    let cancelled = false;
    void fetchSellerProfile()
      .then((seller) => {
        if (!cancelled) {
          setLegalName(seller?.legalName?.trim() || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLegalName(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cloud?.mode, cloud?.organization]);

  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) {
      return;
    }
    document.getElementById("continut-principal")?.focus();
  }

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsed(next);
      return next;
    });
  }

  return (
    <div className={collapsed ? "app-shell is-sidebar-collapsed" : "app-shell"}>
      <a className="skip-link" href="#continut-principal" onClick={skipToContent}>
        Sari la conținut
      </a>
      <div className="app-shell-frame">
        <aside className="app-sidebar-desktop" aria-hidden={menuOpen ? true : undefined}>
          <StableSidebar
            destinations={visibleDestinations}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            variant="rail"
          />
        </aside>
        <div className="app-shell-column" inert={menuOpen || undefined}>
          <header className="app-header">
            <div className="app-header-inner">
              <div className="app-header-row">
                <div className="app-header-context">
                  <button
                    type="button"
                    className="app-meniu-trigger"
                    onClick={() => setMenuOpen(true)}
                  >
                    Meniu
                  </button>
                  <p className="app-context-title">{contextTitle}</p>
                </div>
                <div className="app-utilities" role="group" aria-label="Utilitare">
                  {cloud?.mode === "cloud" && cloud.organization ? (
                    <IdentityMenu
                      shortName={cloud.organization.displayName}
                      legalName={legalName}
                      accountLabel={cloud.user?.email ?? cloud.organization.displayName}
                      memberships={cloud.memberships}
                      currentOrganizationId={cloud.organization.organizationId}
                      onSwitchOrganization={(organizationId) => {
                        void cloud.switchOrganization(organizationId);
                      }}
                      onLogout={() => {
                        void cloud.logout();
                      }}
                    />
                  ) : (
                    <IdentityMenu shortName="Atelier Demo" />
                  )}
                  {officeRoute ? (
                    <OfficeOperatorChip
                      ready={ready}
                      operatorName={operator?.displayName ?? null}
                      dev={isDevOperatorUiEnabled()}
                    />
                  ) : (
                    <div className="operator-chip" aria-label="Operator curent">
                      {!ready ? (
                        <span className="operator-chip-muted">Se verifică operatorul…</span>
                      ) : operator ? (
                        <>
                          <span>
                            {isDevOperatorUiEnabled() ? (
                              <span className="operator-dev-badge">DEV · </span>
                            ) : null}
                            Operator: <strong>{operator.displayName}</strong>
                          </span>
                          <button
                            type="button"
                            className="button-quiet"
                            onClick={() => setIdentifyOpen(true)}
                          >
                            Schimbă
                          </button>
                          <button
                            type="button"
                            className="button-quiet"
                            onClick={() => {
                              void logout();
                            }}
                          >
                            Ieși
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setIdentifyOpen(true)}>
                          Identifică-te
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main id="continut-principal" className="app-content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
      <MobileNavigationDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        destinations={visibleDestinations}
      />
      <ActionDrawer title="Identifică operatorul" open={identifyOpen} onClose={() => setIdentifyOpen(false)}>
        <OperatorIdentifyForm onIdentified={() => setIdentifyOpen(false)} />
      </ActionDrawer>
    </div>
  );
}

function OfficeOperatorChip({
  ready,
  operatorName,
  dev,
}: {
  ready: boolean;
  operatorName: string | null;
  dev: boolean;
}) {
  if (!ready || !operatorName) {
    return null;
  }
  return (
    <p className="operator-chip operator-chip-passive" aria-label="Operator curent">
      {dev ? <span className="operator-dev-badge">DEV · </span> : null}
      Operator: <strong>{operatorName}</strong>
    </p>
  );
}

function isAdminOfficeRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function visibilityContextFromSession(
  cloud: ReturnType<typeof useCloudSessionOptional>,
): NavigationVisibilityContext {
  if (!cloud || cloud.mode !== "cloud") {
    return DEFAULT_NAVIGATION_VISIBILITY;
  }
  const role = cloud.organization?.role;
  return {
    mode: "cloud",
    role: role === "owner" || role === "member" ? role : null,
    organizationId: cloud.organization?.organizationId ?? null,
  };
}
