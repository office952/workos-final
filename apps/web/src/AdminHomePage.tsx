import { Link } from "react-router-dom";
import { PageHeader } from "./ui/PageHeader";

const GROUPS = [
  {
    title: "Comercial",
    items: [
      {
        to: "/admin/seller",
        label: "Date firmă",
        description:
          "Identitatea vânzătorului pe oferte noi. Nu este catalogul de clienți și nu este Settings general.",
      },
      {
        to: "/admin/customers",
        label: "Clienți",
        description:
          "Ciclu de viață: adăugare, redenumire, retragere. Lucrul zilnic este în Clienți, sub Comercial.",
      },
    ],
  },
  {
    title: "Operațiuni",
    items: [
      {
        to: "/admin/people",
        label: "Oameni",
        description:
          "Catalog operațional: oameni, calificări și disponibilitate. Fără HR, pontaj sau salariu.",
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
          "Materiale, servicii, manoperă și dovezi de cost intern. Fără preț client. Soldul este la Stoc.",
      },
      {
        to: "/admin/stock",
        label: "Stoc",
        description:
          "Sold curent și mișcări din consum real. Fără rezervări, achiziții sau evaluare.",
      },
      {
        to: "/admin/processes",
        label: "Procese operaționale",
        description:
          "Cum se lucrează. Cere o capabilitate, nu un utilaj. Fără programare, fără write.",
      },
      {
        to: "/admin/workcenters",
        label: "Utilaje și zone",
        description:
          "Unde și cu ce se poate lucra. Zone, utilaje și acoperire de capabilitate. Fără programare, fără write.",
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
        to: "/system",
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
