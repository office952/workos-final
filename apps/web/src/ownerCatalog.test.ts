import { describe, expect, it } from "vitest";
import {
  costEvidence,
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
import {
  buildProcessesCatalog,
  formatProcessesAdminSummary,
  processesAdminSummary,
} from "./processesCatalog";
import {
  buildResourcesCatalog,
  formatResourcesAdminSummary,
  resourcesAdminSummary,
} from "./resourcesCatalog";
import {
  buildWorkcentersCatalog,
  formatWorkcentersAdminSummary,
  workcentersAdminSummary,
} from "./workcentersCatalog";

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
    ).toBe("Disponibil: material");
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
          label: "Putere modul LED",
          valueDisplay: "0.75 W",
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
    expect(catalog.categories[0]?.items.map((item) => item.label)).toEqual([
      "Litere și semne volumetrice luminoase",
      "Panouri și casete",
    ]);
    expect(catalog.categories[1]?.items.map((item) => item.label)).toEqual([
      "Litere volumetrice luminoase cu iluminare față",
      "Litere volumetrice luminoase cu iluminare halou",
      "Litere volumetrice luminoase integral aluminiu",
      "Panouri ACM casetate",
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
      "labor",
      "uncosted-resources",
      "cost-evidence",
    ]);
    expect(catalog.categories.map((item) => item.label)).toEqual([
      "Materiale",
      "Servicii",
      "Manoperă",
      "Resurse fără evidență",
      "Dovezi de cost",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.label)).toEqual([
      "Plexiglas",
      "Forex",
      "Aluminiu",
      "Iluminare LED",
      "Folie / colant",
      "ACM",
      "Oțel",
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
    expect(
      catalog.categories[0]?.items[0]?.groups[0]?.sections.find(
        (item) => item.id === "cost",
      )?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Tarif", value: "16,00 EUR / m²" }),
      ]),
    );
    expect(catalog.categories[0]?.items[0]?.groups[0]?.chips).toEqual([
      { label: "Confirmat de owner", tone: "ok" },
    ]);
    expect(catalog.categories[1]?.items[0]?.label).toBe("Formare profil aluminiu");
    expect(catalog.categories[1]?.items[0]?.kindLabel).toBe("Rețetă serviciu");
    expect(catalog.categories[1]?.items[0]?.listHint).toBe("5,00 EUR / m");
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Debitare CNC față",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Îmbinare sudură oțel",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Printare format mare",
    );
    expect(catalog.categories[2]?.items.map((item) => item.label)).toContain(
      "Lipire față-volum",
    );
    expect(catalog.categories[2]?.items[0]?.kindLabel).toBe("Rețetă manoperă");
    expect(catalog.categories[2]?.items[0]?.listHint).toBe("5,00 EUR / m²");
    expect(catalog.categories[4]?.items[0]?.kindLabel).toBe("Dovadă de cost intern");
    expect(catalog.categories[4]?.items[0]?.id).toBe(
      "cost:aluminium_return_profile:volumeDepthMm=60",
    );
    expect(catalog.categories[4]?.items.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        "cost:aluminium_return_profile:volumeDepthMm=30",
        "cost:aluminium_return_profile:volumeDepthMm=60",
        "cost:aluminium_return_profile:volumeDepthMm=80",
        "cost:aluminium_return_profile:volumeDepthMm=100",
      ]),
    );
    expect(catalog.categories[4]?.items.map((item) => item.id)).toContain(
      "cost:plexiglas_3mm_opal:unqualified",
    );
    expect(catalog.categories[4]?.items.map((item) => item.label)).toContain(
      "Plexiglas 3 mm opal",
    );
    expect(JSON.stringify(catalog.categories[4])).not.toMatch(/cev:/);
    expect(JSON.stringify(catalog.categories[4])).not.toMatch(/Ultima modificare/);
    expect(formatResourcesAdminSummary(resourcesAdminSummary(projectResourcesAdministration()))).toMatch(
      /^Materiale \d+ · Servicii \d+ · Manoperă \d+ · Dovezi de cost \d+$/,
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

  it("keeps cost evidence catalog ids stable across a new version token", () => {
    const first = buildResourcesCatalog(
      projectResourcesAdministration(
        costEvidence.map((item, index) => ({
          ...item,
          evidenceRowId: `cev:before:${index}`,
          createdAt: "2026-08-18T00:00:00.000Z",
        })),
      ),
    );
    const second = buildResourcesCatalog(
      projectResourcesAdministration(
        costEvidence.map((item, index) => ({
          ...item,
          amount: item.resourceId === "plexiglas_3mm_opal" ? 18 : item.amount,
          evidenceRowId: `cev:after:${index}`,
          createdAt: "2026-08-18T12:00:00.000Z",
        })),
      ),
    );
    const firstIds = first.categories[4]?.items.map((item) => item.id);
    const secondIds = second.categories[4]?.items.map((item) => item.id);
    expect(firstIds).toEqual(secondIds);
    expect(firstIds).toContain("cost:plexiglas_3mm_opal:unqualified");
    expect(JSON.stringify(second.categories[4])).toMatch(/Ultima modificare/);
    expect(JSON.stringify(second.categories[4])).not.toMatch(/cev:after:/);
  });
});

describe("processes catalog presentation", () => {
  it("groups real process categories then composition without write targets", () => {
    const admin = projectOperationalProcessesAdministration();
    const catalog = buildProcessesCatalog(admin);
    const items = catalog.categories.flatMap((item) => item.items);
    const forming = items.find((item) => item.id === "process:FORM_ALUMINIUM_PROFILE");
    const vinyl = items.find((item) => item.id === "process:APPLY_SURFACE_FINISH");
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "CUTTING",
      "FORMING",
      "WELDING",
      "PRINTING",
      "FINISHING",
      "ASSEMBLY",
      "ELECTRICAL",
      "QUALITY_CONTROL",
      "PACKING",
      "compositions",
    ]);
    expect(catalog.categories.map((item) => item.label)).toEqual([
      "Debitare",
      "Formare",
      "Sudură",
      "Print / finisare",
      "Finisare",
      "Asamblare",
      "Electric",
      "Control calitate",
      "Ambalare",
      "Compoziții produse",
    ]);
    expect(catalog.categories[0]?.items.map((item) => item.label)).toContain(
      "Debitare foaie CNC",
    );
    expect(catalog.categories[1]?.items.map((item) => item.label)).toContain(
      "Formare profil aluminiu",
    );
    expect(catalog.categories[2]?.items.map((item) => item.label)).toContain(
      "Îmbinare sudură oțel",
    );
    expect(catalog.categories[3]?.items.map((item) => item.label)).toContain(
      "Printare format mare",
    );
    expect(catalog.categories[0]?.items.map((item) => item.label)).toContain(
      "Decupare contur plotter",
    );
    expect(catalog.categories.at(-1)?.items.map((item) => item.label)).toEqual([
      "Fără finisaj",
      "Colantat față și volum",
      "Volum vopsit",
    ]);
    expect(
      forming?.groups[0]?.sections.find((item) => item.id === "resources")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Referințe",
          value: "Formare profil aluminiu",
        }),
      ]),
    );
    expect(
      forming?.groups[0]?.sections.find((item) => item.id === "recipe")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Rețetă",
          value: "Formare profil aluminiu",
        }),
        expect.objectContaining({ label: "Stare rețetă", value: "Rețetă: Configurată" }),
      ]),
    );
    expect(
      forming?.groups[0]?.sections.find((item) => item.id === "capability")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Necesită", value: "Formare profil" }),
        expect.objectContaining({ label: "Acoperire furnizor", value: "Acoperită" }),
      ]),
    );
    expect(
      vinyl?.groups[0]?.sections.find((item) => item.id === "condition")?.lines,
    ).toEqual(
      expect.arrayContaining([
        "Apare când Finisaj față: Colantat.",
        "Apare când Finisaj volum: Colantat.",
      ]),
    );
    expect(items.every((item) => !item.editTarget)).toBe(true);
    expect(JSON.stringify(catalog)).not.toMatch(/machineId|ExecutionPlan|Preț client/);
    expect(formatProcessesAdminSummary(processesAdminSummary(admin))).toMatch(
      /^Procese \d+ · Capabilități \d+ · Cu furnizor \d+ · Fără furnizor \d+$/,
    );
  });
});

describe("workcenters catalog presentation", () => {
  it("groups workshop zones and machines without capability or recipe registries", () => {
    const admin = projectWorkcentersAdministration();
    const catalog = buildWorkcentersCatalog(admin);
    expect(catalog.categories.map((item) => item.id)).toEqual([
      "cnc",
      "forming",
      "welding",
      "metal-cutting",
      "assembly",
      "electrical",
      "print",
      "laminate",
      "vinyl",
      "plotter",
      "laser",
      "gaps",
    ]);
    expect(catalog.categories.map((item) => item.label)).not.toEqual(
      expect.arrayContaining([
        "Prezentare",
        "Zone / Workcenters",
        "Capabilități",
        "Acoperire procese",
        "Hartă procese / rețete",
      ]),
    );
    const cnc = catalog.categories.find((item) => item.id === "cnc");
    expect(cnc?.items.map((item) => item.label)).toEqual([
      "Zonă CNC",
      "CNC 4020",
      "Debitator polistiren",
    ]);
    expect(cnc?.items[1]?.kindLabel).toBe("Utilaj");
    expect(
      cnc?.items[1]?.groups[0]?.sections.find((item) => item.id === "provider")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Poate face", value: "Debitare CNC" }),
        expect.objectContaining({
          label: "Procese susținute",
          value: expect.stringContaining("Debitare foaie CNC"),
        }),
        expect.objectContaining({ label: "Zonă", value: "Zonă CNC" }),
      ]),
    );
    const assembly = catalog.categories.find((item) => item.id === "assembly");
    expect(assembly?.items.map((item) => item.label)).toEqual([
      "Masă asamblare 1",
      "Masă asamblare 2",
    ]);
    expect(assembly?.items[0]?.kindLabel).toBe("Zonă / post de lucru");
    expect(
      assembly?.items[0]?.groups[0]?.sections.find((item) => item.id === "provider")?.facts,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Tip", value: "Zonă / post de lucru" }),
        expect.objectContaining({ label: "Poate face", value: "Asamblare manuală" }),
        expect.objectContaining({ label: "Utilaje în zonă", value: "niciun utilaj" }),
      ]),
    );
    const electrical = catalog.categories.find((item) => item.id === "electrical");
    expect(electrical?.items[0]?.kindLabel).toBe("Zonă / post de lucru");
    expect(electrical?.items.map((item) => item.kindLabel)).not.toContain("Utilaj");
    const gaps = catalog.categories.find((item) => item.id === "gaps");
    expect(gaps?.items.map((item) => item.label)).toEqual(
      expect.arrayContaining(["Vopsire", "Control calitate", "Ambalare"]),
    );
    expect(gaps?.items.every((item) => item.listHint === "Fără furnizor")).toBe(true);
    expect(JSON.stringify(catalog)).not.toMatch(/Letters —|Hartă procese|Prezentare/);
    expect(catalog.categories.flatMap((item) => item.items).every((item) => !item.editTarget)).toBe(
      true,
    );
    expect(JSON.stringify(catalog)).not.toMatch(/CNC-01|ExecutionPlan|Preț client|machineHour/);
    expect(formatWorkcentersAdminSummary(workcentersAdminSummary(admin))).toMatch(
      /^Zone \d+ · Utilaje \d+ · Capabilități acoperite \d+ · Fără furnizor \d+$/,
    );
  });
});
