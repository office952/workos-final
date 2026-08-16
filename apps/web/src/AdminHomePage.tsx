import { Link } from "react-router-dom";

export function AdminHomePage() {
  return (
    <section>
      <h1>Administrare</h1>
      <p className="page-lead">
        Sistemul de produs poate edita eticheta afișată. Persoanele sunt
        identitate operațională. Resursele, procesele operaționale și utilajele
        sunt deocamdată doar inspecție.
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
          Familii de material, specificații, rețete de serviciu / manoperă și
          dovezi de cost intern. Fără stoc, fără preț client, fără write.
        </p>
      </article>
      <article className="catalog-family">
        <p className="catalog-kind">Sistem</p>
        <h2>
          <Link className="catalog-product-link" to="/admin/processes">
            Procese operaționale
          </Link>
        </h2>
        <p className="catalog-product-desc">
          Cum se lucrează: debitare, formare, finisare, asamblare. Cere o
          capabilitate, nu un utilaj. Fără execuție, fără write.
        </p>
      </article>
      <article className="catalog-family">
        <p className="catalog-kind">Sistem</p>
        <h2>
          <Link className="catalog-product-link" to="/admin/workcenters">
            Utilaje și capacitate
          </Link>
        </h2>
        <p className="catalog-product-desc">
          Cine / unde poate furniza o capabilitate. Hartă reală de atelier:
          zone, utilaje și acoperire. Fără programare, fără write.
        </p>
      </article>
      <article className="catalog-family">
        <p className="catalog-kind">Sistem</p>
        <h2>
          <Link className="catalog-product-link" to="/admin/people">
            Persoane
          </Link>
        </h2>
        <p className="catalog-product-desc">
          Identitate operațională pentru executantul de task. Fără HR, pontaj,
          salariu sau programare.
        </p>
      </article>
    </section>
  );
}
