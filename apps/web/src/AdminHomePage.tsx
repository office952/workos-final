import { Link } from "react-router-dom";

export function AdminHomePage() {
  return (
    <section>
      <h1>Administrare</h1>
      <p className="page-lead">
        Acțiuni de owner asupra adevărului de sistem. Acum se poate edita doar
        eticheta afișată.
      </p>
      <article className="catalog-family">
        <p className="catalog-kind">Sistem</p>
        <h2>
          <Link className="catalog-product-link" to="/admin/product-system">
            Sistem produs
          </Link>
        </h2>
        <p className="catalog-product-desc">
          Familii, categorii, produse și tipuri constructive. Identitatea
          tehnică rămâne neschimbată.
        </p>
      </article>
    </section>
  );
}
