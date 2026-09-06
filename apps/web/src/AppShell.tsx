import { useCallback, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useCloudSessionOptional } from "./CloudSessionContext";
import { isOperationalOperatorRoute } from "./navigation/navigationRegistry";
import { buildUi20PresentationModel } from "./navigation/ui20NavigationPresentation";
import {
  DEFAULT_NAVIGATION_VISIBILITY,
  resolveVisibleDestinations,
  type NavigationVisibilityContext,
} from "./navigation/visibleNavigation";
import { OperatorIdentifyForm } from "./OperatorIdentifyForm";
import { useOperatorSession, isDevOperatorUiEnabled } from "./OperatorSessionContext";
import { fetchSellerProfile } from "./sellerApi";
import { ActionDrawer } from "./ui/ActionDrawer";
import { GlobalShellTop } from "./ui/GlobalShellTop";
import { IdentityMenu } from "./ui/IdentityMenu";
import { MobileNavigationDrawer } from "./ui/MobileNavigationDrawer";
import { ObjectContextStrip } from "./ui/ObjectContextStrip";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { pathname, search, hash } = location;
  const cloud = useCloudSessionOptional();
  const { ready, operator, logout } = useOperatorSession();
  const [identifyOpen, setIdentifyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [legalName, setLegalName] = useState<string | null>(null);
  const operationalRoute = isOperationalOperatorRoute(pathname);
  const visibilityContext = useMemo(
    () => visibilityContextFromSession(cloud),
    [cloud],
  );
  const visibleDestinations = useMemo(
    () => resolveVisibleDestinations(visibilityContext),
    [visibilityContext],
  );
  const presentation = useMemo(
    () => buildUi20PresentationModel(visibleDestinations, { pathname, search }),
    [visibleDestinations, pathname, search],
  );

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

  const utilities = (
    <>
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
      {operationalRoute ? (
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
      ) : (
        <OfficeOperatorChip
          ready={ready}
          operatorName={operator?.displayName ?? null}
          dev={isDevOperatorUiEnabled()}
        />
      )}
    </>
  );

  return (
    <div className={operationalRoute ? "app-shell is-ui20-top is-reduced-chrome" : "app-shell is-ui20-top"}>
      <a className="skip-link" href="#continut-principal" onClick={skipToContent}>
        Sari la conținut
      </a>
      <div className="app-shell-frame is-top-shell" inert={menuOpen || undefined}>
        <GlobalShellTop
          model={presentation}
          reducedChrome={operationalRoute}
          onOpenMenu={() => setMenuOpen(true)}
          utilities={utilities}
        />
        {/* Presentational primitive mounted for RW2+ population; empty until truthful props. */}
        <ObjectContextStrip />
        <main id="continut-principal" className="app-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <MobileNavigationDrawer open={menuOpen} onClose={closeMenu} model={presentation} />
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
