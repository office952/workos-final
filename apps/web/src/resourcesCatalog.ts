import type { ResourcesAdminProjection } from "@workos-final/domain";
import { formatDateTime } from "./formatDisplay";
import type {
  CatalogChip,
  CatalogDetailSection,
  CatalogFact,
  OwnerCatalog,
} from "./ownerCatalog";

export type ResourcesAdminSummary = {
  materials: number;
  services: number;
  labor: number;
  costEvidence: number;
};

export function resourcesAdminSummary(
  admin: ResourcesAdminProjection,
): ResourcesAdminSummary {
  return {
    materials: admin.materials.length,
    services: admin.serviceRecipes.length + admin.missingServiceRecipes.length,
    labor: admin.laborRecipes.length + admin.missingLaborRecipes.length,
    costEvidence: admin.costEvidence.length,
  };
}

export function formatResourcesAdminSummary(summary: ResourcesAdminSummary): string {
  return [
    `Materiale ${summary.materials}`,
    `Servicii ${summary.services}`,
    `Manoperă ${summary.labor}`,
    `Dovezi de cost ${summary.costEvidence}`,
  ].join(" · ");
}

export function buildResourcesCatalog(
  admin: ResourcesAdminProjection,
): OwnerCatalog {
  return {
    categories: [
      {
        id: "materials",
        label: "Materiale",
        kindLabel: "Categorie",
        items: admin.families.map((family) => ({
          id: `family:${family.id}`,
          label: family.label,
          kindLabel: "Familie",
          summary: family.description,
          groups: family.specifications.map((spec) => ({
            id: spec.id,
            kindLabel: "Specificație",
            title: spec.label,
            chips: costChips(spec.cost),
            sections: specificationSections(spec),
          })),
        })),
      },
      {
        id: "services",
        label: "Servicii",
        kindLabel: "Categorie",
        items: [
          ...admin.serviceRecipes.map(recipeItem),
          ...admin.missingServiceRecipes.map(missingRecipeItem),
        ],
      },
      {
        id: "labor",
        label: "Manoperă",
        kindLabel: "Categorie",
        items: [
          ...admin.laborRecipes.map(recipeItem),
          ...admin.missingLaborRecipes.map(missingRecipeItem),
        ],
      },
      {
        id: "uncosted-resources",
        label: "Resurse fără evidență",
        kindLabel: "Categorie",
        items: [...admin.services, ...admin.labor]
          .filter((item) => item.cost === null)
          .map((item) => ({
            id: `resource:${item.id}`,
            label: item.label,
            kindLabel: item.kindLabel,
            summary: "Fără dovadă de cost confirmată",
            listHint: "fără dovadă",
            chips: [{ id: "missing", label: "Fără evidență", tone: "warn" as const }],
            groups: [
              {
                id: item.id,
                kindLabel: item.kindLabel,
                title: item.label,
                sections: [
                  {
                    id: "cost",
                    title: "Cost intern",
                    facts: [
                      { label: "Tarif", value: "fără dovadă activă" },
                      { label: "Unitate", value: item.unitLabel },
                    ],
                  },
                ],
              },
            ],
          })),
      },
      {
        id: "cost-evidence",
        label: "Dovezi de cost",
        kindLabel: "Categorie",
        items: admin.costEvidence.map((item) => ({
          id: costEvidenceItemId(item),
          label: item.resourceLabel,
          kindLabel: "Dovadă de cost intern",
          summary: item.amountDisplay,
          listHint: item.amountDisplay,
          chips: costChips(item),
          groups: [
            {
              id: costEvidenceItemId(item),
              kindLabel: "Dovadă de cost intern",
              title: item.resourceLabel,
              sections: costEvidenceSections(item),
            },
          ],
        })),
      },
    ].filter((category) => category.items.length > 0),
  };
}

export function costEvidenceItemId(
  item: Pick<
    ResourcesAdminProjection["costEvidence"][number],
    "resourceId" | "qualifierIdentity"
  >,
): string {
  return `cost:${item.resourceId}:${item.qualifierIdentity}`;
}

function recipeItem(
  recipe: ResourcesAdminProjection["serviceRecipes"][number],
): OwnerCatalog["categories"][number]["items"][number] {
  const chips = [
    ...completenessChips(recipe.completenessLabel),
    ...costChips(recipe.cost),
  ];
  return {
    id: `recipe:${recipe.id}`,
    label: recipe.label,
    kindLabel: recipe.kindLabel,
    summary: recipe.cost
      ? `${recipe.cost.amountDisplay} · ${recipe.quantityBasisLabel}`
      : recipe.completenessLabel,
    listHint: recipe.cost?.amountDisplay ?? recipe.completenessLabel,
    chips,
    groups: [
      {
        id: recipe.id,
        kindLabel: recipe.kindLabel,
        title: recipe.label,
        sections: [
          {
            id: "cost",
            title: "Cost intern",
            facts: [
              {
                label: "Tarif",
                value: recipe.cost?.amountDisplay ?? "fără dovadă activă",
                emphasize: Boolean(recipe.cost),
              },
              { label: "Bază cantitate", value: recipe.quantityBasisLabel },
              { label: "Unitate", value: recipe.unitLabel },
              {
                label: "Se aplică la",
                value:
                  recipe.processLabels.length === 0
                    ? "niciun proces"
                    : recipe.processLabels.join("; "),
              },
              { label: "Evidență", value: recipe.costEvidenceLabel },
              { label: "Completitudine", value: recipe.completenessLabel },
              ...(recipe.cost
                ? [{ label: "Sursă", value: recipe.cost.sourceLabel }]
                : []),
            ],
            lines: [
              "Regulă reutilizabilă de cost intern. Nu inventează geometria.",
            ],
          },
          {
            id: "details",
            title: "Detalii",
            technical: true,
            facts: [
              { label: "Identitate rețetă", value: recipe.id },
              { label: "Identitate evidență", value: recipe.costEvidenceId },
              { label: "Stare", value: recipe.lifecycleLabel },
              { label: "Completitudine", value: recipe.completenessLabel },
            ],
          },
        ],
      },
    ],
  };
}

function missingRecipeItem(
  item: ResourcesAdminProjection["missingServiceRecipes"][number],
): OwnerCatalog["categories"][number]["items"][number] {
  return {
    id: `missing-recipe:${item.processId}`,
    label: item.processLabel,
    kindLabel: item.kindLabel,
    summary: "Rețetă neconfigurată. Furnizorul, dacă există, rămâne separat.",
    listHint: item.completenessLabel,
    chips: completenessChips(item.completenessLabel),
    groups: [
      {
        id: item.processId,
        kindLabel: item.kindLabel,
        title: item.processLabel,
        sections: [
          {
            id: "gap",
            title: "Gol de rețetă",
            facts: [
              { label: "Fel", value: item.kindLabel },
              { label: "Completitudine", value: item.completenessLabel },
            ],
            lines: [
              "Nu există rețetă canonică pentru acest proces. Nu inventăm tarif pe oră sau pe utilaj.",
              "Acoperirea de furnizor se inspectează separat, în Utilaje și zone.",
            ],
          },
          {
            id: "details",
            title: "Detalii",
            technical: true,
            facts: [{ label: "Identitate proces", value: item.processId }],
          },
        ],
      },
    ],
  };
}

function specificationSections(
  resource: ResourcesAdminProjection["materials"][number],
): CatalogDetailSection[] {
  const specificationFacts = specificationFactsFor(resource);
  return [
    {
      id: "cost",
      title: "Cost intern",
      facts: resource.cost
        ? [
            {
              label: "Tarif",
              value: resource.cost.amountDisplay,
              emphasize: true,
            },
            { label: "Unitate", value: resource.unitLabel },
            { label: "Sursă", value: resource.cost.sourceLabel },
          ]
        : [{ label: "Tarif", value: "fără dovadă activă" }],
    },
    ...(specificationFacts.length > 0
      ? [
          {
            id: "specification",
            title: "Specificație",
            facts: specificationFacts,
          },
        ]
      : []),
    usedBySection(resource.usedBy),
    {
      id: "details",
      title: "Detalii",
      technical: true,
      facts: [
        { label: "Identitate", value: resource.id },
        { label: "Fel", value: resource.kindLabel },
        ...(resource.familyLabel
          ? [{ label: "Familie", value: resource.familyLabel }]
          : []),
      ],
    },
  ];
}

function specificationFactsFor(
  resource: ResourcesAdminProjection["materials"][number],
): CatalogFact[] {
  if (resource.kind !== "MATERIAL") {
    return [];
  }
  return [
    ...(resource.formLabel ? [{ label: "Formă", value: resource.formLabel }] : []),
    ...(resource.thicknessLabel
      ? [{ label: "Grosime", value: resource.thicknessLabel }]
      : []),
    ...(resource.opticalLabel
      ? [{ label: "Proprietate optică", value: resource.opticalLabel }]
      : []),
    ...(resource.voltageLabel
      ? [{ label: "Tensiune", value: resource.voltageLabel }]
      : []),
    ...(resource.capacityLabel
      ? [{ label: "Capacitate", value: resource.capacityLabel }]
      : []),
  ];
}

function costEvidenceSections(
  item: ResourcesAdminProjection["costEvidence"][number],
): CatalogDetailSection[] {
  return [
    {
      id: "evidence",
      title: "Dovadă activă",
      facts: [
        {
          label: "Tarif",
          value: item.amountDisplay,
          emphasize: true,
        },
        { label: "Resursă", value: item.resourceLabel },
        { label: "Fel", value: item.kindLabel },
        { label: "Sursă", value: item.sourceLabel },
        ...(item.lastChangedAt
          ? [
              {
                label: "Ultima modificare",
                value: formatDateTime(item.lastChangedAt),
              },
            ]
          : []),
      ],
    },
    usedBySection(item.usedBy),
    {
      id: "details",
      title: "Detalii",
      technical: true,
      facts: [
        { label: "Identitate", value: item.resourceId },
        { label: "Clasificare", value: item.classificationLabel },
        ...(item.note ? [{ label: "Notă", value: item.note }] : []),
      ],
    },
  ];
}

function usedBySection(
  usedBy: ResourcesAdminProjection["materials"][number]["usedBy"],
): CatalogDetailSection {
  return {
    id: "used-by",
    title: "Folosit de",
    lines:
      usedBy.length === 0
        ? ["nicio utilizare derivată încă"]
        : usedBy.map((item) => item.displayLine),
  };
}

function costChips(
  cost: ResourcesAdminProjection["materials"][number]["cost"],
): CatalogChip[] {
  if (!cost) {
    return [];
  }
  const chips: CatalogChip[] = [];
  if (cost.classificationLabel === "Confirmat de owner") {
    chips.push({ label: cost.classificationLabel, tone: "ok" });
  } else if (cost.classificationLabel === "Default de dezvoltare") {
    chips.push({ label: cost.classificationLabel, tone: "warn" });
  } else if (cost.classificationLabel === "Decizie AI / pilot") {
    chips.push({ label: cost.classificationLabel, tone: "neutral" });
  }
  if (cost.sourceLabel === "Valoare implicită de platformă") {
    chips.push({ label: cost.sourceLabel, tone: "warn" });
  } else if (cost.sourceLabel === "Evidență legacy" && chips.length === 0) {
    chips.push({ label: cost.sourceLabel, tone: "neutral" });
  }
  return chips;
}

function completenessChips(label: string): CatalogChip[] {
  if (label === "Lipsă") {
    return [{ label, tone: "warn" }];
  }
  if (label === "Parțială") {
    return [{ label, tone: "warn" }];
  }
  return [];
}
