import type { ResourcesAdminProjection } from "@workos-final/domain";
import type { CatalogDetailSection, OwnerCatalog } from "./ownerCatalog";

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
          kindLabel: "Familie material",
          summary: family.description,
          groups: family.specifications.map((spec) => ({
            id: spec.id,
            kindLabel: "Specificație resursă",
            title: spec.label,
            sections: specificationSections(spec),
          })),
        })),
      },
      {
        id: "services",
        label: "Servicii / cost operațional",
        kindLabel: "Categorie",
        items: admin.services.map((service) => ({
          id: `service:${service.id}`,
          label: service.label,
          kindLabel: service.kindLabel,
          summary: "Cost operațional consumat, nu material fizic.",
          groups: [
            {
              id: service.id,
              kindLabel: service.kindLabel,
              title: service.label,
              sections: specificationSections(service),
            },
          ],
        })),
      },
      {
        id: "service-recipes",
        label: "Rețete servicii",
        kindLabel: "Categorie",
        items: [
          ...admin.serviceRecipes.map(recipeItem),
          ...admin.missingServiceRecipes.map(missingRecipeItem),
        ],
      },
      {
        id: "labor-recipes",
        label: "Rețete manoperă",
        kindLabel: "Categorie",
        items:
          admin.laborRecipes.length === 0 && admin.missingLaborRecipes.length === 0
            ? []
            : [
                ...admin.laborRecipes.map(recipeItem),
                ...admin.missingLaborRecipes.map(missingRecipeItem),
              ],
      },
      {
        id: "cost-evidence",
        label: "Dovezi de cost",
        kindLabel: "Categorie",
        items: admin.costEvidence.map((item) => ({
          id: `cost:${item.resourceId}`,
          label: item.resourceLabel,
          kindLabel: "Dovadă de cost intern",
          summary: item.amountDisplay,
          groups: [
            {
              id: item.resourceId,
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

function recipeItem(
  recipe: ResourcesAdminProjection["serviceRecipes"][number],
): OwnerCatalog["categories"][number]["items"][number] {
  return {
    id: `recipe:${recipe.id}`,
    label: recipe.label,
    kindLabel: recipe.kindLabel,
    summary: recipe.description,
    groups: [
      {
        id: recipe.id,
        kindLabel: recipe.kindLabel,
        title: recipe.label,
        sections: [
          {
            id: "identity",
            title: "Identitate",
            facts: [
              { label: "Fel", value: recipe.kindLabel },
              { label: "Stare", value: recipe.lifecycleLabel },
              { label: "Completitudine", value: recipe.completenessLabel },
              { label: "Bază cantitate", value: recipe.quantityBasisLabel },
              { label: "Unitate", value: recipe.unitLabel },
              {
                label: "Procese",
                value:
                  recipe.processLabels.length === 0
                    ? "niciun proces"
                    : recipe.processLabels.join("; "),
              },
              { label: "Evidență de cost", value: recipe.costEvidenceLabel },
              {
                label: "Valoare internă",
                value: recipe.cost?.amountDisplay ?? "fără dovadă activă",
              },
            ],
            lines: [
              recipe.description,
              "Rețeta spune CUM se formează costul intern. Nu inventează geometria.",
            ],
          },
          {
            id: "technical",
            title: "Tehnic",
            technical: true,
            facts: [
              { label: "Identitate rețetă", value: recipe.id },
              { label: "Identitate evidență", value: recipe.costEvidenceId },
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
              { label: "Fel așteptat", value: item.kindLabel },
              { label: "Completitudine", value: item.completenessLabel },
            ],
            lines: [
              "Nu există rețetă canonică pentru acest proces. Nu inventăm tarif pe oră sau pe utilaj.",
              "Acoperirea de furnizor se inspectează separat, în Utilaje și capacitate.",
            ],
          },
        ],
      },
    ],
  };
}

function specificationSections(
  resource: ResourcesAdminProjection["materials"][number],
): CatalogDetailSection[] {
  return [
    {
      id: "identity",
      title: "Identitate",
      facts: [
        { label: "Fel", value: resource.kindLabel },
        ...(resource.familyLabel
          ? [{ label: "Familie material", value: resource.familyLabel }]
          : []),
        { label: "Unitate", value: resource.unitLabel },
      ],
    },
    ...(resource.kind === "MATERIAL"
      ? [
          {
            id: "specification",
            title: "Specificație",
            facts: [
              ...(resource.formLabel
                ? [{ label: "Formă", value: resource.formLabel }]
                : []),
              ...(resource.thicknessLabel
                ? [{ label: "Grosime", value: resource.thicknessLabel }]
                : []),
              ...(resource.opticalLabel
                ? [{ label: "Proprietate optică", value: resource.opticalLabel }]
                : []),
            ],
          },
        ]
      : []),
    {
      id: "cost",
      title: "Dovadă de cost intern",
      facts: resource.cost
        ? [
            { label: "Valoare", value: resource.cost.amountDisplay },
            { label: "Sursă", value: resource.cost.sourceLabel },
            { label: "Clasificare", value: resource.cost.classificationLabel },
          ]
        : [{ label: "Valoare", value: "fără dovadă activă" }],
      lines: resource.cost ? [resource.cost.note] : undefined,
    },
    usedBySection(resource.usedBy),
    {
      id: "gaps",
      title: "Lipsă",
      lines: [
        "Write-ul de administrare nu este deschis.",
        "Stocul și disponibilitatea nu aparțin acestui catalog.",
      ],
    },
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Identitate resursă", value: resource.id }],
    },
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
        { label: "Resursă", value: item.resourceLabel },
        { label: "Fel", value: item.kindLabel },
        { label: "Valoare", value: item.amountDisplay },
        { label: "Sursă", value: item.sourceLabel },
        { label: "Clasificare", value: item.classificationLabel },
      ],
      lines: [item.note],
    },
    usedBySection(item.usedBy),
    {
      id: "gaps",
      title: "Lipsă",
      lines: [
        "Nu există istoric de cost, dată efectivă sau furnizor.",
        "Write-ul de cost nu este deschis.",
      ],
    },
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Identitate resursă", value: item.resourceId }],
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

