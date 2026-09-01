import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { WorkosBrandMark } from "../icons/WorkosBrandMark";
import {
  findActiveDestination,
  type NavigationDestination,
} from "../navigation/navigationRegistry";
import { groupVisibleDestinations } from "../navigation/visibleNavigation";
import { NavigationGroup } from "./NavigationGroup";

export function StableSidebar({
  destinations,
  collapsed,
  onToggleCollapsed,
  variant,
  onNavigate,
}: {
  destinations: readonly NavigationDestination[];
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  variant: "rail" | "drawer";
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const active = findActiveDestination(location, destinations);
  const groups = groupVisibleDestinations(destinations);
  const railCollapsed = variant === "rail" && collapsed;

  return (
    <div
      className={
        railCollapsed ? "app-sidebar-shell is-collapsed" : "app-sidebar-shell"
      }
    >
      <p className="app-sidebar-brand">
        <Link to="/" className="app-sidebar-brand-link">
          <WorkosBrandMark />
          {railCollapsed ? <span className="visually-hidden">WorkOS</span> : <span>WorkOS</span>}
        </Link>
      </p>
      <nav className="app-sidebar-nav" aria-label="Navigare principală">
        <div className="app-sidebar-rail">
          {groups.map((group) => (
            <NavigationGroup
              key={group.category}
              category={group.category}
              destinations={group.destinations}
              collapsed={railCollapsed}
              activeId={active?.id ?? null}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>
      {variant === "rail" && onToggleCollapsed ? (
        <div className="app-sidebar-footer">
          <button
            type="button"
            className="app-sidebar-collapse"
            onClick={onToggleCollapsed}
            aria-pressed={collapsed}
            aria-label={collapsed ? "Extinde meniul" : "Restrânge meniul"}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" className="app-nav-icon" />
            ) : (
              <PanelLeftClose aria-hidden="true" className="app-nav-icon" />
            )}
            {collapsed ? null : <span>Restrânge</span>}
          </button>
        </div>
      ) : null}
    </div>
  );
}
