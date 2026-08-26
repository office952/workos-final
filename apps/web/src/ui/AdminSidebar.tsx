import { Link } from "react-router-dom";
import {
  visibleAdminDestinations,
  type AdminSectionId,
} from "../adminNavigation";

export function AdminSidebar({
  current,
  availableSectionIds,
  onNavigate,
}: {
  current: AdminSectionId;
  availableSectionIds?: readonly string[];
  onNavigate?: () => void;
}) {
  const destinations = visibleAdminDestinations(availableSectionIds);
  return (
    <nav className="admin-sidebar" aria-label="Secțiuni administrative">
      <p className="catalog-kind">Secțiuni</p>
      {destinations.map((item) => (
        <Link
          key={item.id}
          to={item.to}
          aria-current={item.id === current ? "page" : undefined}
          onClick={onNavigate}
        >
          {item.shortLabel ?? item.label}
        </Link>
      ))}
    </nav>
  );
}
