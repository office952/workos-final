import { capabilities } from "../capabilities.js";

export const IMPLEMENTATION_STATES = [
  "IMPLEMENTED",
  "POLICY_CONFIRMED",
  "PLANNED",
  "NOT_IMPLEMENTED",
] as const;

export type ImplementationState = (typeof IMPLEMENTATION_STATES)[number];

export type AuthorityRecord = {
  id: string;
  label: string;
  owns: readonly string[];
  state: ImplementationState;
};

export type SystemBoundary = {
  id: string;
  label: string;
  statement: string;
  state: ImplementationState;
};

export type OwnerGate = {
  id: string;
  statement: string;
};

export type RoadmapItem = {
  id: string;
  label: string;
  state: ImplementationState;
};

export type GovernanceProjection = {
  terminology: {
    componentTerm: string;
    moduleNote: string;
  };
  authorities: readonly AuthorityRecord[];
  boundaries: readonly SystemBoundary[];
  sources: readonly string[];
  ownerGates: readonly OwnerGate[];
  protectionRules: readonly string[];
  roadmap: readonly RoadmapItem[];
  uiRules: readonly string[];
  freeze: {
    label: string;
    state: ImplementationState;
    note: string;
  };
  capabilityKernelNote: string;
  capabilityKernelStatuses: readonly {
    id: string;
    status: string;
  }[];
};

export function projectSystemGovernance(): GovernanceProjection {
  return {
    terminology: {
      componentTerm: "componentă",
      moduleNote:
        "Față, Volum, Spate și Iluminare sunt componente de produs. Titlul «Module și componente» păstrează «module» pentru modulele de sistem viitoare.",
    },
    authorities: [
      {
        id: "PRODUCT",
        label: "Produs",
        owns: [
          "familia și categoria",
          "ProductTemplate",
          "compoziția de componente",
          "configurația permisă",
          "identitatea fixă a produsului",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "FORM",
        label: "Formular",
        owns: ["schema", "câmpuri", "vizibilitate", "prezentarea validării"],
        state: "IMPLEMENTED",
      },
      {
        id: "TRUTH_COMPILER",
        label: "Adevăr / compilator",
        owns: [
          "ProductDefinition",
          "confirmarea definiției verificate",
          "ProductTruth",
          "orchestrarea ProductAggregate",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "COMPONENT_CONTRACTS",
        label: "Contracte de componentă",
        owns: [
          "măsurătorile componentei",
          "calculul cantității",
          "cererea de resurse",
          "starea de disponibilitate",
          "consumul setărilor tehnice, nu valorile ajustabile",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "COMPONENT_TECHNICAL_SETTINGS",
        label: "Setări tehnice de componentă",
        owns: [
          "parametrii tehnici reutilizabili activi pentru variantele de componentă",
          "metadatele parametrilor",
          "valorile tehnice configurate",
          "starea rezolvat / nerezolvat",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "PRODUCT_SYSTEM_PERSISTENCE",
        label: "Persistență Product System",
        owns: [
          "metadatele de afișare persistate",
          "bootstrap-ul determinist",
          "autoritatea runtime a etichetei",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "AUTHORIZATION",
        label: "Autorizare",
        owns: ["enforcement-ul pe write-uri de administrare"],
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "RESOURCES_COST",
        label: "Resurse / cost intern",
        owns: [
          "identitatea resursei",
          "familia și specificația de material",
          "evidența de cost intern / tarife",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "EIC",
        label: "EIC",
        owns: ["proiecția de cost intern din cereri de resurse"],
        state: "IMPLEMENTED",
      },
      {
        id: "OPERATIONAL_PROCESSES",
        label: "Procese operaționale",
        owns: [
          "definiția reutilizabilă a procesului",
          "clasa de capabilitate cerută",
          "aplicabilitatea pe tip constructiv",
          "compunerea tehnologică de procese pentru produs / componentă",
        ],
        state: "IMPLEMENTED",
      },
      {
        id: "COMMERCIAL",
        label: "Commercial",
        owns: ["preț client", "ofertă", "comandă comercială"],
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "EXECUTION",
        label: "Execuție",
        owns: ["plan operațional", "actuale de execuție"],
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "ANALYZER",
        label: "Analyzer",
        owns: ["propuneri geometrice, după confirmare de operator"],
        state: "NOT_IMPLEMENTED",
      },
    ],
    boundaries: [
      {
        id: "analyzer",
        label: "Analyzer",
        statement:
          "Aplicație separată. Ieșirea este evidență sau propunere, nu Product Truth, până la confirmarea operatorului.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "commercial",
        label: "Commercial",
        statement: "Nu există preț client, ofertă sau reguli comerciale în runtime.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "execution",
        label: "Execuție",
        statement: "Nu există plan de execuție, sarcini sau actuale.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "business-db",
        label: "Persistență Product System",
        statement:
          "SQLite local deține etichetele de afișare Product System. Nu este o bază universală de business și nu persistă setări tehnice.",
        state: "IMPLEMENTED",
      },
      {
        id: "authorization",
        label: "Autorizare",
        statement:
          "Write-urile de administrare sunt acțiuni de owner. Enforcement-ul de autorizare nu este implementat.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "inventory",
        label: "Stoc",
        statement:
          "Nu există stoc, lot, rezervare sau mișcare. Catalogul de resurse este consumabil ulterior de Inventory.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "machines",
        label: "Utilaje / workcenter",
        statement:
          "Nu există catalog de utilaje sau workcenter. Procesul cere o clasă de capabilitate, nu un utilaj concret.",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "intake-settings",
        label: "Intake",
        statement:
          "Intake nu deține setările tehnice de sistem. Nu administrează pasul LED sau rezerva PSU.",
        state: "IMPLEMENTED",
      },
      {
        id: "documentation-values",
        label: "Documentație",
        statement:
          "Documentația explică setările. Nu este autoritatea valorii active.",
        state: "IMPLEMENTED",
      },
    ],
    sources: [
      "Contractele de componentă din domeniu",
      "Setările tehnice canonice ale variantelor de componentă",
      "ProductTemplate și catalogul de produse",
      "Catalogul canonic de resurse și cost intern",
      "Catalogul canonic de procese operaționale",
      "Compilatorul de definiție / adevăr / agregat",
      "EIC generic din cereri de resurse",
      "Harta canonică de domenii și administrare",
      "Metadatele de afișare persistate ale Product System",
      "Proiecția de administrare Product System",
    ],
    ownerGates: [
      { id: "scope", statement: "Doar ownerul autorizează domeniul de implementare." },
      { id: "commercial", statement: "Fără Commercial silent." },
      { id: "second-product", statement: "Fără al doilea produs fără GO." },
      {
        id: "analyzer",
        statement: "Fără integrare runtime Analyzer fără GO.",
      },
      {
        id: "db",
        statement: "Fără bază de date de business sau migrări fără GO.",
      },
      {
        id: "invented",
        statement: "Fără valori tehnice inventate acolo unde adevărul lipsește.",
      },
    ],
    protectionRules: [
      "O faptă de business are un singur proprietar.",
      "UI poate codifica experiența, nu adevărul de business.",
      "Tarifele trăiesc doar în Resurse / Cost.",
      "Valorile tehnice ajustabile trăiesc în setările canonice ale variantei, nu în documentație, Intake sau literali ascunși.",
      "Documentația explică; calculul consumă; Intake nu administrează setările de sistem.",
      "Fiecare domeniu deține setările sale. Nu există un Settings global care deține tot adevărul.",
      "Eticheta de afișare persistată este autoritatea runtime după bootstrap. Codul rămâne default de inițializare, nu a doua valoare activă.",
      "Setările tehnice, lifecycle-ul și resursele nu au write persistat.",
      "Identitatea resursei, specificația, dovada de cost, cererea de componentă și prețul client rămân separate.",
      "Procesul operațional este HOW. Resursa este WHAT. Task-ul de execuție este instanța. Utilajul este WHO/WHERE ulterior.",
      "Se confirmă definiția verificată, nu un draft ulterior.",
      "Componenta neselectată este tăcută; cea selectată este calculabilă independent.",
    ],
    roadmap: [
      { id: "repo", label: "Fundație repository", state: "IMPLEMENTED" },
      { id: "shell", label: "Platformă și stare sistem", state: "IMPLEMENTED" },
      { id: "catalog", label: "Ierarhie de catalog", state: "IMPLEMENTED" },
      { id: "first-product", label: "Primul produs canonic", state: "IMPLEMENTED" },
      {
        id: "component-first",
        label: "Calcule pe contracte de componentă",
        state: "IMPLEMENTED",
      },
      {
        id: "partial-eic",
        label: "EIC parțial față / volum / spate",
        state: "IMPLEMENTED",
      },
      {
        id: "component-settings",
        label: "Setări tehnice de componentă",
        state: "IMPLEMENTED",
      },
      {
        id: "admin-map",
        label: "Hartă de administrare cross-sistem",
        state: "IMPLEMENTED",
      },
      {
        id: "product-system-admin",
        label: "Fundație administrare Product System",
        state: "IMPLEMENTED",
      },
      {
        id: "product-system-persistence",
        label: "Persistență Product System",
        state: "IMPLEMENTED",
      },
      {
        id: "display-label-write",
        label: "Write etichetă afișată",
        state: "IMPLEMENTED",
      },
      {
        id: "resources-catalog-foundation",
        label: "Fundație catalog resurse / cost",
        state: "IMPLEMENTED",
      },
      {
        id: "resource-admin-write",
        label: "Write administrare resurse",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "inventory",
        label: "Stoc / disponibilitate",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "operational-processes",
        label: "Fundație procese operaționale",
        state: "IMPLEMENTED",
      },
      {
        id: "letters-process-composition",
        label: "Compunere procese Letters",
        state: "IMPLEMENTED",
      },
      {
        id: "letters-critical-process-completion",
        label: "Traseu tehnologic Letters V1",
        state: "IMPLEMENTED",
      },
      {
        id: "process-admin-write",
        label: "Write administrare procese",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "execution-plan",
        label: "ExecutionPlan",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "workcenters",
        label: "Workcenters",
        state: "PLANNED",
      },
      {
        id: "machines",
        label: "Catalog utilaje",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "labor-recipes",
        label: "Rețete labor / serviciu",
        state: "PLANNED",
      },
      {
        id: "cnc-pricing",
        label: "Preț CNC",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "administrare-nav",
        label: "Administrare globală",
        state: "IMPLEMENTED",
      },
      {
        id: "technical-settings-write",
        label: "Write setări tehnice",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "lifecycle-write",
        label: "Write lifecycle",
        state: "NOT_IMPLEMENTED",
      },
      {
        id: "lighting-foundation",
        label: "Fundație calcul iluminare",
        state: "IMPLEMENTED",
      },
      { id: "lighting", label: "Calcul complet iluminare", state: "PLANNED" },
      { id: "commercial", label: "Commercial", state: "NOT_IMPLEMENTED" },
      { id: "execution", label: "Execuție", state: "NOT_IMPLEMENTED" },
    ],
    uiRules: [
      "Interfața operator este în română.",
      "Codurile interne nu sunt conținut principal.",
      "Proiecția nu devine o a doua autoritate.",
      "Starea planificată nu se afișează ca activă.",
    ],
    freeze: {
      label: "Politică de freeze",
      state: "PLANNED",
      note: "Nu există infrastructură de freeze în runtime. Nu este activă.",
    },
    capabilityKernelNote:
      "Nucleul de capabilități păstrează identificatorii înghețați. Statusul kernel PLANNED nu înseamnă că primul produs nu există; înseamnă că nucleul nu a fost promovat la ACTIVE.",
    capabilityKernelStatuses: capabilities.map((item) => ({
      id: item.id,
      status: item.status,
    })),
  };
}

export function implementationStateLabel(state: ImplementationState): string {
  switch (state) {
    case "IMPLEMENTED":
      return "Implementat";
    case "POLICY_CONFIRMED":
      return "Politică confirmată";
    case "PLANNED":
      return "Planificat";
    case "NOT_IMPLEMENTED":
      return "Neimplementat";
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
