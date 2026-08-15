import { describe, expect, it } from "vitest";
import {
  projectComponentArchitecture,
  projectProductSystemAdministration,
  projectOperationalProcessesAdministration,
  projectResourcesAdministration,
  projectSystemGovernance,
  projectWorkcentersAdministration,
  seededDisplayLabelCatalog,
} from "@workos-final/domain";
import {
  buildComponentCatalog,
  buildGovernanceCatalog,
  buildProductSystemAdminCatalog,
  buildProductSystemAdministrationCatalog,
} from "./ownerCatalog";
import { buildProcessesCatalog } from "./processesCatalog";
import { buildResourcesCatalog } from "./resourcesCatalog";
import { buildWorkcentersCatalog } from "./workcentersCatalog";

describe("component catalog presentation", () => {
  it("places FACE VOLUME BACK LIGHTING under product components", () => {
    const catalog = buildComponentCatalog(projectComponentArchitecture(seededDisplayLabelCatalog()));
    expect(catalog.categories.map((item) => item.id)).toEqual(["product-components"]);
    expect(catalog.categories[0]?.label).toBe("Componente de produs");
    expect(catalog.categories[0]?.items.map((item) => item.id)).toEqual([
      "FACE",
      "VOLUME",
      "BACK",
      "LIGHTING",
    ]);
    expect(catalog.categories[0]?.items[0]?.kindLabel).toBe("Componentă");
    expect(catalog.categories[0]?.items[0]?.groups[0]?.kindLabel).toBe("Tip constructiv");
    expect(catalog.categories[0]?.items[0]?.groups[0]?.title).toBe("Plexiglas");
    expect(
      catalog.categories[0]?.items[3]?.groups[0]?.sections.find((item) => item.id === "resources")
        ?.facts?.[0]?.value,
    ).toBe("Indisponibil");
    expect(JSON.stringify(catalog)).not.toMatch(/RETURN_CANT/);
  });

  it("keeps products-using derived and accepts extra categories without rewrite", () => {
    const catalog = buildComponentCatalog(projectComponentArchitecture(seededDisplayLabelCatalog()));
    const usedBy = catalog.categories[0]?.items[0]?.groups[0]?.sections
      .find((item) => item.id === "used-by")
      ?.lines?.[0];
    expect(usedBy).toContain("Litere volumetrice luminoase");
    const lightingSettings = catalog.categories[0]?.items[3]?.groups[0]?.sections.find(
      (item) => item.id === "technical-settings",
    )?.settingLines;
    expect(lightingSettings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Pas module LED",
          valueDisplay: "100 mm",
          statusLabel: "Setat",
          sourceLabel: "Confirmat de owner",
          administrationLabel: "Configurabil",
        }),
        expect.objectContaining({
          label: "Rezervă sursă de alimentare",
          valueDisplay: "25 %",
          statusLabel: "Setat",
          sourceLabel: "Confirmat de owner",
          administrationLabel: "Configurabil",
        }),
      ]),
    );
    expect(
      catalog.categories[0]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "technical-settings",
      ),
    ).toBeUndefined();
    const extended = {
      categories: [
        ...catalog.categories,
        { id: "future", label: "Resurse", kindLabel: "Categorie", items: [] },
      ],
    };
    expect(extended.categories.map((item) => item.id)).toEqual([
      "product-components",
      "future",
    ]);
  });
});

describe("product system admin catalog presentation", () => {
  it("groups derived families categories products settings and lifecycle", () => {
    const catalog = buildProductSystemAdminCatalog(projectProductSystemAdministration(seededDisplayLabelCatalog()));
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "families",
      "categories",
      "products",
      "product-components",
      "technical-settings",
      "compositions",
      "lifecycle",
    ]);
    expect(catalog.categories[0]?.items[0]?.label).toBe(
      "Litere și semne volumetrice luminoase",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toEqual([
      "Litere volumetrice luminoase cu iluminare față",
      "Litere volumetrice luminoase cu iluminare halou",
      "Litere volumetrice luminoase integral aluminiu",
    ]);
    const emptyCategory = catalog.categories[1]?.items[1];
    expect(
      emptyCategory?.groups[0]?.sections
        .find((item) => item.id === "general")
        ?.lines,
    ).toEqual(["Niciun produs în această categorie."]);
    expect(
      emptyCategory?.groups[0]?.sections
        .find((item) => item.id === "lifecycle")
        ?.facts?.find((item) => item.label === "Poate fi ștearsă")?.value,
    ).toBe("Da");
    expect(catalog.categories[3]?.items.map((item) => item.id)).toEqual([
      "FACE",
      "VOLUME",
      "BACK",
      "LIGHTING",
    ]);
    expect(
      catalog.categories[5]?.items[0]?.groups[0]?.sections[0]?.lines,
    ).toEqual([
      "Față → Plexiglas",
      "Volum → Aluminiu",
      "Spate → Forex",
      "Iluminare → Iluminare frontală cu module LED",
    ]);
    expect(
      catalog.categories[3]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "resources",
      )?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Referințe resursă",
          value: "Plexiglas 3 mm opal",
        }),
      ]),
    );
    expect(
      catalog.categories[3]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "processes",
      )?.lines,
    ).toEqual([
      "Debitare foaie CNC",
      "Aplicare folie (Finisaj față: Colantat)",
    ]);
    expect(
      catalog.categories[3]?.items[1]?.groups[0]?.sections.find(
        (item) => item.id === "resources",
      )?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Referințe resursă",
          value: "Profil aluminiu 0,6 mm; Formare profil aluminiu",
        }),
      ]),
    );
    const faceConfig = catalog.categories[3]?.items[0]?.groups[0]?.sections.find(
      (item) => item.id.startsWith("configuration:"),
    )?.facts;
    expect(faceConfig).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Proprietate optică (Identitate / proprietate material)",
          value: "Opal",
        }),
        expect.objectContaining({
          label: "Grosime (Fixat de produs)",
          value: "3 mm",
        }),
      ]),
    );
    const lightingSettings = catalog.categories[4]?.items[0]?.groups[0]?.sections.find(
      (item) => item.id === "technical-settings",
    )?.settingLines;
    expect(lightingSettings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Pas module LED",
          valueDisplay: "100 mm",
        }),
      ]),
    );
    expect(JSON.stringify(catalog)).not.toMatch(/RETURN_CANT/);
    expect(JSON.stringify(catalog)).not.toMatch(/adminProducts/);
  });
});

describe("governance catalog presentation", () => {
  it("groups existing governance records without duplicating truth", () => {
    const governance = projectSystemGovernance();
    const catalog = buildGovernanceCatalog(governance);
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "authority",
      "limits",
      "maturity",
      "ui",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.id)).toEqual([
      "owners",
      "sources",
    ]);
    expect(catalog.categories[1]?.items.map((item) => item.id)).toEqual([
      "boundaries",
      "protection",
      "gates",
    ]);
    expect(catalog.categories[2]?.items.map((item) => item.id)).toEqual([
      "roadmap",
      "freeze",
      "capabilities",
    ]);
    const freeze = catalog.categories[2]?.items
      .find((item) => item.id === "freeze")
      ?.groups[0]?.sections[0]?.statusLines?.[0];
    expect(freeze?.state).toBe("PLANNED");
    expect(freeze?.note).toMatch(/Nu este activă/);
    expect(
      catalog.categories[1]?.items
        .find((item) => item.id === "gates")
        ?.groups[0]?.sections[0]?.lines,
    ).toEqual(governance.ownerGates.map((item) => item.statement));
  });
});

describe("product system administration catalog", () => {
  it("exposes display-label edit targets only on writable entities", () => {
    const catalog = buildProductSystemAdministrationCatalog(
      projectProductSystemAdministration(seededDisplayLabelCatalog()),
    );
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "families",
      "categories",
      "products",
      "constructive-types",
      "technical-settings",
      "compositions",
      "lifecycle",
    ]);
    expect(catalog.categories[0]?.items[0]?.editTarget).toEqual({
      entityKind: "PRODUCT_FAMILY",
      entityId: "LIGHTED_VOLUMETRIC_SIGNS",
      displayLabel: "Litere și semne volumetrice luminoase",
      revision: 1,
      identityLabel: "LIGHTED_VOLUMETRIC_SIGNS",
    });
    expect(catalog.categories[3]?.items[0]?.editTarget?.entityId).toBe(
      "PLEXIGLAS_FACE",
    );
    expect(catalog.categories[4]?.items[0]?.editTarget).toBeUndefined();
    expect(catalog.categories[5]?.items[0]?.editTarget).toBeUndefined();
  });
});

describe("resources catalog presentation", () => {
  it("groups materials services and cost evidence without write targets", () => {
    const catalog = buildResourcesCatalog(projectResourcesAdministration());
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "materials",
      "services",
      "service-recipes",
      "labor-recipes",
      "cost-evidence",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.label)).toEqual([
      "Plexiglas",
      "Forex",
      "Aluminiu",
    ]);
    expect(catalog.categories[0]?.items[0]?.groups[0]?.title).toBe(
      "Plexiglas 3 mm opal",
    );
    expect(
      catalog.categories[0]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "specification",
      )?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Grosime", value: "3 mm" }),
        expect.objectContaining({ label: "Proprietate optică", value: "Opal" }),
      ]),
    );
    expect(catalog.categories[1]?.items[0]?.label).toBe("Formare profil aluminiu");
    expect(catalog.categories[1]?.items[0]?.kindLabel).toBe("Serviciu");
    expect(catalog.categories[2]?.items[0]?.label).toBe("Formare profil aluminiu");
    expect(catalog.categories[2]?.items[0]?.kindLabel).toBe("Rețetă serviciu");
    expect(catalog.categories[2]?.items.map((item) => item.label)).toContain(
      "Îmbinare sudură oțel",
    );
    expect(catalog.categories[2]?.items.map((item) => item.label)).toContain(
      "Printare format mare",
    );
    expect(catalog.categories[3]?.items.map((item) => item.label)).toContain(
      "Lipire față-volum",
    );
    expect(
      catalog.categories[0]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "used-by",
      )?.lines?.[0],
    ).toContain("Față / Plexiglas");
    expect(catalog.categories.flatMap((item) => item.items).every((item) => !item.editTarget)).toBe(
      true,
    );
    expect(JSON.stringify(catalog)).not.toMatch(/Preț client|ofertă|TVA/i);
  });
});

describe("processes catalog presentation", () => {
  it("groups categories processes and capabilities without write targets", () => {
    const catalog = buildProcessesCatalog(projectOperationalProcessesAdministration());
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "categories",
      "processes",
      "compositions",
      "capabilities",
    ]);
    expect(catalog.categories[2]?.items.map((item) => item.label)).toEqual([
      "Fără finisaj",
      "Colantat față și volum",
      "Volum vopsit",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.label)).toEqual([
      "Debitare",
      "Formare",
      "Sudură",
      "Print / finisare",
      "Finisare",
      "Asamblare",
      "Electric",
      "Control calitate",
      "Ambalare",
    ]);
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Formare profil aluminiu",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Îmbinare sudură oțel",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Printare format mare",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Decupare contur plotter",
    );
    expect(
      catalog.categories[1]?.items
        .find((item) => item.id === "process:FORM_ALUMINIUM_PROFILE")
        ?.groups[0]?.sections.find((item) => item.id === "resources")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Referințe",
          value: "Formare profil aluminiu",
        }),
      ]),
    );
    expect(
      catalog.categories[1]?.items
        .find((item) => item.id === "process:FORM_ALUMINIUM_PROFILE")
        ?.groups[0]?.sections.find((item) => item.id === "recipe")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Rețetă",
          value: "Formare profil aluminiu",
        }),
        expect.objectContaining({ label: "Stare rețetă", value: "Rețetă: Configurată" }),
      ]),
    );
    expect(catalog.categories[3]?.items[0]?.label).toBe("Debitare CNC");
    expect(
      catalog.categories.flatMap((item) => item.items).every((item) => !item.editTarget),
    ).toBe(true);
    expect(JSON.stringify(catalog)).not.toMatch(/machineId|ExecutionPlan|Preț client/);
    expect(
      catalog.categories[1]?.items
        .find((item) => item.id === "process:FORM_ALUMINIUM_PROFILE")
        ?.groups[0]?.sections.find((item) => item.id === "capability")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Acoperire furnizor", value: "Acoperită" }),
      ]),
    );
  });
});

describe("workcenters catalog presentation", () => {
  it("groups overview workcenters machines capabilities and coverage without write targets", () => {
    const catalog = buildWorkcentersCatalog(projectWorkcentersAdministration());
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "overview",
      "workcenters",
      "machines",
      "capabilities",
      "coverage",
      "service-map",
    ]);
    expect(catalog.categories[1]?.items.map((item) => item.label)).toEqual(
      expect.arrayContaining([
        "Masă asamblare 1",
        "Masă asamblare 2",
        "Stație sudură",
        "Stație debitare metale",
      ]),
    );
    expect(catalog.categories[1]?.items[0]?.label).toBe("Masă asamblare 1");
    expect(catalog.categories[2]?.items.map((item) => item.label)).toEqual(
      expect.arrayContaining(["CNC 4020", "Aparat sudură oțel", "Aparat sudură aluminiu"]),
    );
    expect(
      catalog.categories[3]?.items
        .find((item) => item.id === "capability:MANUAL_ASSEMBLY")
        ?.groups[0]?.sections.find((item) => item.id === "identity")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Acoperire catalog", value: "Acoperită" }),
        expect.objectContaining({
          label: "Furnizori",
          value: "Zonă / workcenter: Masă asamblare 1; Zonă / workcenter: Masă asamblare 2",
        }),
      ]),
    );
    expect(catalog.categories[3]?.items.map((item) => item.label)).toContain("Debitare CNC");
    expect(catalog.categories[4]?.items[0]?.label).toBe("Letters — acoperire capabilități");
    expect(
      catalog.categories[4]?.items[0]?.groups[0]?.sections.find((item) => item.id === "status")
        ?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Acoperite",
          value: expect.stringContaining("Asamblare manuală"),
        }),
        expect.objectContaining({
          label: "Fără furnizor",
          value: expect.stringContaining("Vopsire"),
        }),
      ]),
    );
    expect(
      catalog.categories[3]?.items
        .find((item) => item.id === "capability:CNC_ROUTING")
        ?.groups[0]?.sections.find((item) => item.id === "identity")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Acoperire catalog", value: "Acoperită" }),
      ]),
    );
    expect(catalog.categories.flatMap((item) => item.items).every((item) => !item.editTarget)).toBe(
      true,
    );
    expect(JSON.stringify(catalog)).not.toMatch(/CNC-01|ExecutionPlan|Preț client|machineHour/);
  });
});
