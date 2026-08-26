import { Link } from "react-router-dom";
import { ADMIN_GROUPS } from "./adminNavigation";
import { PageHeader } from "./ui/PageHeader";

export function AdminHomePage() {
  return (
    <section>
      <PageHeader
        title="Administrare"
        lead="Domeniile reale ale sistemului, grupate după rol. Nu există pagini goale pentru viitor."
      />
      <div className="admin-groups">
        {ADMIN_GROUPS.map((group) => (
          <section key={group.title} className="admin-group">
            <h2>{group.title}</h2>
            {group.items.map((item) => (
              <article key={item.to} className="catalog-family">
                <p className="catalog-kind">{group.title}</p>
                <h3>
                  <Link className="catalog-product-link" to={item.to}>
                    {item.label}
                  </Link>
                </h3>
                <p className="catalog-product-desc">{item.description}</p>
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}
