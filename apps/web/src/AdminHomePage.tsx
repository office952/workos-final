import { Link } from "react-router-dom";

export function AdminHomePage() {
  return (
    <section>
      <h1>Administrare</h1>
      <p className="page-lead">
        Sistemul de produs poate edita eticheta afișată. Resursele și costul
        intern sunt deocamdată doar inspecție.
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
      <article className="catalog-family">
        <p className="catalog-kind">Sistem</p>
        <h2>
          <Link className="catalog-product-link" to="/admin/resources">
            Resurse și cost intern
          </Link>
        </h2>
        <p className="catalog-product-desc">
          Familii de material, specificații, servicii și dovezi de cost intern.
          Fără stoc, fără preț client, fără write.
        </p>
      </article>
    </section>
  );
}
