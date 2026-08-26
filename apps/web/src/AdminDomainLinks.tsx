import { Link } from "react-router-dom";

export type AdminDomainId =
  | "resources"
  | "workcenters"
  | "people"
  | "processes"
  | "stock";

const LINKS = [
  { id: "resources", to: "/admin/resources", label: "Resurse" },
  { id: "workcenters", to: "/admin/workcenters", label: "Utilaje și zone" },
  { id: "people", to: "/admin/people", label: "Oameni" },
  { id: "processes", to: "/admin/processes", label: "Procese" },
  { id: "stock", to: "/admin/stock", label: "Stoc" },
] as const;

export function AdminDomainLinks({ current }: { current: AdminDomainId }) {
  return (
    <nav className="admin-domain-links" aria-label="Domenii administrative">
      <Link to="/admin">Administrare</Link>
      {LINKS.map((item) => (
        <Link
          key={item.id}
          to={item.to}
          aria-current={item.id === current ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
      <Link to="/atelier">Atelier — execuție</Link>
    </nav>
  );
}
