import { Link } from "react-router-dom";
import { PageHeader } from "./ui/PageHeader";

const GROUPS = [
  {
    title: "Operațiuni",
    items: [
      {
        to: "/admin/people",
        label: "Persoane",
        description:
          "Identitate operațională pentru executantul de task. Fără HR, pontaj, salariu sau programare.",
      },
    ],
  },
  {
    title: "Atelier",
    items: [
      {
        to: "/admin/resources",
        label: "Resurse și cost intern",
        description:
          "Materiale, servicii, manoperă și dovezi de cost intern. Fără stoc, fără preț client, fără write.",
      },
      {
        to: "/admin/processes",
        label: "Procese operaționale",
        description:
          "Cum se lucrează: debitare, formare, finisare, asamblare. Cere o capabilitate, nu un utilaj. Fără execuție, fără write.",
      },
      {
        to: "/admin/workcenters",
        label: "Utilaje și capacitate",
        description:
          "Cine / unde poate furniza o capabilitate. Hartă reală de atelier: zone, utilaje și acoperire. Fără programare, fără write.",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        to: "/admin/product-system",
        label: "Sistem produs",
        description:
          "Familii, categorii, produse și tipuri constructive. Identitatea tehnică rămâne neschimbată.",
      },
      {
        to: "/components",
        label: "Module și componente",
        description: "Inspecție a rolurilor și tipurilor de componentă.",
      },
      {
        to: "/governance",
        label: "Guvernanța sistemului",
        description: "Autoritate, limite și maturitate. Fără write de business.",
      },
      {
        to: "/",
        label: "Stare sistem",
        description: "Verificare de sănătate a platformei.",
      },
    ],
  },
] as const;

export function AdminHomePage() {
  return (
    <section>
      <PageHeader
        title="Administrare"
        lead="Domeniile reale ale sistemului, grupate după rol. Nu există pagini goale pentru viitor."
      />
      <div className="admin-groups">
        {GROUPS.map((group) => (
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
