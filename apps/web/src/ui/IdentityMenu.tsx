import { useEffect, useId, useRef, useState } from "react";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import type { CloudSessionMembership } from "../cloudSessionApi";

export function IdentityMenu({
  shortName,
  legalName,
  accountLabel,
  memberships = [],
  currentOrganizationId,
  onSwitchOrganization,
  onLogout,
}: {
  shortName: string;
  legalName?: string | null;
  accountLabel?: string | null;
  memberships?: readonly CloudSessionMembership[];
  currentOrganizationId?: string | null;
  onSwitchOrganization?: (organizationId: string) => void;
  onLogout?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDocumentMouseDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="identity-menu" ref={rootRef}>
      <button
        type="button"
        className="identity-menu-trigger"
        aria-label="Cont"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        Cont
      </button>
      {open ? (
        <div
          id={panelId}
          className="identity-menu-panel"
          role="dialog"
          aria-label="Datele contului"
        >
          <p className="identity-menu-name">
            <span className="catalog-kind">Nume scurt</span>
            <strong>{shortName}</strong>
          </p>
          {legalName ? (
            <p className="identity-menu-name">
              <span className="catalog-kind">Denumire legală</span>
              <strong>{legalName}</strong>
            </p>
          ) : null}
          {accountLabel ? (
            <p className="identity-menu-name">
              <span className="catalog-kind">Cont autentificat</span>
              <strong>{accountLabel}</strong>
            </p>
          ) : null}
          {memberships.length > 1 && currentOrganizationId && onSwitchOrganization ? (
            <label className="identity-menu-switch">
              Schimbă organizația
              <select
                aria-label="Schimbă organizația"
                value={currentOrganizationId}
                onChange={(event) => onSwitchOrganization(event.target.value)}
              >
                {memberships.map((item) => (
                  <option key={item.organizationId} value={item.organizationId}>
                    {item.displayName}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <ThemeSwitcher />
          {onLogout ? (
            <button type="button" className="button-quiet" onClick={onLogout}>
              Ieși din cont
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
