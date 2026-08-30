import { NavLink } from "react-router-dom";

export function PeopleAdminNav() {
  return (
    <nav className="page-object-tabs" aria-label="Instrumente Angajați">
      <p className="page-object-tabs-label">Vizualizare</p>
      <div className="page-object-tabs-list" role="group" aria-label="Vizualizare">
        <NavLink to="/admin/people" end>
          Listă
        </NavLink>
        <NavLink to="/admin/people/skills">Calificări</NavLink>
      </div>
    </nav>
  );
}
