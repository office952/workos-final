import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Link } from "react-router-dom";
import { navigationIcon } from "../navigation/navigationIcons";
import {
  destinationAccessibleName,
  type NavigationDestination,
} from "../navigation/navigationRegistry";

export function NavigationPageLink({
  destination,
  collapsed,
  current,
  onNavigate,
}: {
  destination: NavigationDestination;
  collapsed: boolean;
  current: boolean;
  onNavigate?: () => void;
}) {
  const href = destination.href;
  const iconRef = useRef<HTMLAnchorElement | null>(null);
  if (href == null) {
    return null;
  }
  const Icon = navigationIcon(destination.icon);
  const accessibleName = destinationAccessibleName(destination);

  return (
    <ActiveLink
      to={href}
      current={current}
      collapsed={collapsed}
      accessibleName={accessibleName}
      label={destination.label}
      onNavigate={onNavigate}
      iconRef={iconRef}
    >
      <Icon aria-hidden="true" className="app-nav-icon" />
      {collapsed ? null : <span className="app-nav-label">{destination.label}</span>}
    </ActiveLink>
  );
}

function ActiveLink({
  to,
  current,
  collapsed,
  accessibleName,
  label,
  onNavigate,
  iconRef,
  children,
}: {
  to: string;
  current: boolean;
  collapsed: boolean;
  accessibleName: string;
  label: string;
  onNavigate?: () => void;
  iconRef: RefObject<HTMLAnchorElement | null>;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!current) {
      return;
    }
    const node = iconRef.current;
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [current, iconRef]);

  return (
    <Link
      ref={iconRef}
      to={to}
      className={current ? "app-nav-link is-current" : "app-nav-link"}
      aria-current={current ? "page" : undefined}
      aria-label={collapsed ? accessibleName : undefined}
      data-tooltip={collapsed ? accessibleName : undefined}
      title={collapsed ? accessibleName : undefined}
      onClick={onNavigate}
    >
      {children}
      {collapsed ? <span className="visually-hidden">{label}</span> : null}
    </Link>
  );
}
