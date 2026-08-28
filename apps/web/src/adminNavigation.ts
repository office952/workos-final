export type AdminSectionId =
  | "seller"
  | "customers"
  | "people"
  | "operational-services"
  | "resources"
  | "stock"
  | "processes"
  | "workcenters"
  | "product-system"
  | "components"
  | "governance"
  | "system";

export type AdminDestination = {
  id: AdminSectionId;
  to: string;
  label: string;
  shortLabel?: string;
  groupTitle: string;
  description: string;
};

export type AdminGroup = {
  title: string;
  items: readonly AdminDestination[];
};

export const ADMIN_GROUPS: readonly AdminGroup[] = [
  {
    title: "Comercial",
    items: [
      {
        id: "seller",
        to: "/admin/seller",
        label: "Date firmă",
        groupTitle: "Comercial",
        description:
          "Identitatea vânzătorului pe oferte noi. Nu este catalogul de clienți și nu este Settings general.",
      },
      {
        id: "customers",
        to: "/admin/customers",
        label: "Clienți",
        groupTitle: "Comercial",
        description:
          "Ciclu de viață: adăugare, redenumire, retragere. Lucrul zilnic este în Clienți, sub Comercial.",
      },
    ],
  },
  {
    title: "Operațiuni",
    items: [
      {
        id: "people",
        to: "/admin/people",
        label: "Oameni",
        groupTitle: "Operațiuni",
        description:
          "Catalog operațional: oameni, calificări și disponibilitate. Fără HR, pontaj sau salariu.",
      },
      {
        id: "operational-services",
        to: "/admin/operational-services",
        label: "Servicii operaționale",
        groupTitle: "Operațiuni",
        description:
          "Ce poate oferi organizația pe o cerere: montaj la locație. Dezactivarea oprește doar selecțiile noi.",
      },
    ],
  },
  {
    title: "Atelier",
    items: [
      {
        id: "resources",
        to: "/admin/resources",
        label: "Resurse și cost intern",
        groupTitle: "Atelier",
        description:
          "Materiale, servicii, manoperă și dovezi de cost intern. Fără preț client. Soldul este la Stoc.",
      },
      {
        id: "stock",
        to: "/admin/stock",
        label: "Stoc",
        groupTitle: "Atelier",
        description:
          "Sold curent și mișcări din consum real. Fără rezervări, achiziții sau evaluare.",
      },
      {
        id: "processes",
        to: "/admin/processes",
        label: "Procese operaționale",
        shortLabel: "Procese",
        groupTitle: "Atelier",
        description:
          "Cum se lucrează. Cere o capabilitate, nu un utilaj. Fără programare, fără write.",
      },
      {
        id: "workcenters",
        to: "/admin/workcenters",
        label: "Utilaje și zone",
        groupTitle: "Atelier",
        description:
          "Unde și cu ce se poate lucra. Zone, utilaje și acoperire de capabilitate. Fără programare, fără write.",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        id: "product-system",
        to: "/admin/product-system",
        label: "Sistem produs",
        groupTitle: "Sistem",
        description:
          "Familii, categorii, produse și tipuri constructive. Identitatea tehnică rămâne neschimbată.",
      },
      {
        id: "components",
        to: "/components",
        label: "Module și componente",
        groupTitle: "Sistem",
        description: "Inspecție a rolurilor și tipurilor de componentă.",
      },
      {
        id: "governance",
        to: "/governance",
        label: "Guvernanța sistemului",
        shortLabel: "Guvernanță",
        groupTitle: "Sistem",
        description: "Autoritate, limite și maturitate. Fără write de business.",
      },
      {
        id: "system",
        to: "/system",
        label: "Stare sistem",
        groupTitle: "Sistem",
        description: "Verificare de sănătate a platformei.",
      },
    ],
  },
];

export const ADMIN_L2_WAVE1_SECTION_IDS: readonly AdminSectionId[] = [
  "resources",
  "workcenters",
  "people",
  "operational-services",
  "processes",
  "governance",
];

export function flattenAdminDestinations(
  groups: readonly AdminGroup[] = ADMIN_GROUPS,
): AdminDestination[] {
  return groups.flatMap((group) => [...group.items]);
}

export function visibleAdminDestinations(
  availableSectionIds: readonly string[] = ADMIN_L2_WAVE1_SECTION_IDS,
): AdminDestination[] {
  const allowed = new Set(availableSectionIds);
  const byId = new Map<string, AdminDestination>(
    flattenAdminDestinations().map((item) => [item.id, item]),
  );
  return availableSectionIds.flatMap((id) => {
    const item = byId.get(id);
    return item && allowed.has(item.id) ? [item] : [];
  });
}
