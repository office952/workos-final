import { NavLink } from "react-router-dom";

export function PeopleAdminNav() {
  return (
    <nav className="app-subnav" aria-label="Administrare oameni">
      <NavLink to="/admin/people" end>
        Angajați
      </NavLink>
      <NavLink to="/admin/people/skills">Skill-uri</NavLink>
    </nav>
  );
}
