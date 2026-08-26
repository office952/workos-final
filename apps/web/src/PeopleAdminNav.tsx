import { NavLink } from "react-router-dom";

export function PeopleAdminNav() {
  return (
    <nav className="app-subnav" aria-label="Administrare oameni">
      <NavLink to="/admin/people" end>
        Listă
      </NavLink>
      <NavLink to="/admin/people/skills">Calificări</NavLink>
    </nav>
  );
}
