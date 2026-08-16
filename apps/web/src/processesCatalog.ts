import type { OperationalProcessesAdminProjection } from "@workos-final/domain";
import type {
  CatalogChip,
  CatalogDetailSection,
  CatalogGroup,
  OwnerCatalog,
} from "./ownerCatalog";

export type ProcessesAdminSummary = {
  processes: number;
  capabilities: number;
  covered: number;
  withoutProvider: number;
};

export function processesAdminSummary(
  admin: OperationalProcessesAdminProjection,
): ProcessesAdminSummary {
  return {
    processes: admin.processes.length,
    capabilities: admin.capabilities.length,
    covered: admin.processes.filter((item) => item.providerCoverage === "COVERED").length,
    withoutProvider: admin.processes.filter((item) => item.providerCoverage === "NO_PROVIDER")
      .length,
  };
}

export function formatProcessesAdminSummary(summary: ProcessesAdminSummary): string {
  return [
    `Procese ${summary.processes}`,
    `Capabilități ${summary.capabilities}`,
    `Cu furnizor ${summary.covered}`,
    `Fără furnizor ${summary.withoutProvider}`,
  ].join(" · ");
}

export function buildProcessesCatalog(
  admin: OperationalProcessesAdminProjection,
): OwnerCatalog {
  return {
    categories: [
      ...admin.categories.map((category) => ({
        id: category.id,
        label: category.label,
        kindLabel: "Categorie",
        items: category.processes.map((process) =>
          processItem(process, conditionLinesFor(process.id, admin)),
        ),
      })),
      {
        id: "compositions",
        label: "Compoziții produse",
        kindLabel: "Categorie",
        items: admin.compositions.map((inspection) => ({
          id: `composition:${inspection.id}`,
          label: inspection.label,
          kindLabel: "Traseu de produs",
          summary: `${inspection.composition.productLabel}. ${inspection.summary}`,
          groups: compositionGroups(inspection.composition),
        })),
      },
    ].filter((category) => category.items.length > 0),
  };
}

function processItem(
  process: OperationalProcessesAdminProjection["processes"][number],
  conditionLines: readonly string[],
): OwnerCatalog["categories"][number]["items"][number] {
  return {
    id: `process:${process.id}`,
    label: process.label,
    kindLabel: "Proces",
    summary: process.description,
    listHint: process.providerCoverageLabel,
    chips: coverageChips(process),
    groups: [
      {
        id: process.id,
        kindLabel: "Proces",
        title: process.label,
        sections: processSections(process, conditionLines),
      },
    ],
  };
}

function processSections(
  process: OperationalProcessesAdminProjection["processes"][number],
  conditionLines: readonly string[],
): CatalogDetailSection[] {
  const providers =
    process.providers.length === 0
      ? "Fără furnizor configurat"
      : process.providers.map((item) => item.label).join("; ");
  return [
    {
      id: "capability",
      title: "Operație",
      facts: [
        { label: "Necesită", value: process.requiredCapabilityLabel, emphasize: true },
        { label: "Fel", value: process.requiredCapabilityKindLabel },
        { label: "Acoperire furnizor", value: process.providerCoverageLabel },
        { label: "Furnizori actuali", value: providers },
        { label: "Rezultat", value: process.outcome },
      ],
      lines: [
        "Procesul spune ce operație trebuie făcută. Capabilitatea spune ce trebuie să poată furnizorul. Furnizorul arată unde se poate face acum.",
        "Furnizorii se inspectează în Utilaje și zone.",
      ],
    },
    ...(conditionLines.length > 0
      ? [
          {
            id: "condition",
            title: "Când apare",
            lines: conditionLines,
          },
        ]
      : []),
    {
      id: "recipe",
      title: "Rețetă de cost",
      facts: [
        { label: "Rețetă", value: process.recipeLabel ?? "neconfigurată" },
        { label: "Fel", value: process.recipeKindLabel ?? "fără rețetă" },
        { label: "Stare rețetă", value: process.recipeStateLabel },
      ],
    },
    {
      id: "resources",
      title: "Resurse",
      facts: [
        {
          label: "Referințe",
          value:
            process.resourceLinks.length === 0
              ? "nicio referință de cost"
              : process.resourceLinks.map((item) => item.label).join("; "),
        },
      ],
      lines: ["Resurse / Cost rămâne autoritatea monetară. Procesul nu deține prețul."],
    },
    {
      id: "used-by",
      title: "Folosit de",
      lines:
        process.usedBy.length === 0
          ? ["nicio utilizare derivată încă"]
          : process.usedBy.map((item) => item.displayLine),
    },
    {
      id: "details",
      title: "Detalii",
      technical: true,
      facts: [
        { label: "Identitate proces", value: process.id },
        { label: "Identitate capabilitate", value: process.requiredCapabilityId },
        { label: "Categorie", value: process.categoryLabel },
        { label: "Stare", value: process.lifecycleLabel },
        { label: "Pregătire", value: process.readinessLabel },
        ...(process.recipeId ? [{ label: "Identitate rețetă", value: process.recipeId }] : []),
      ],
      lines: process.readinessNote ? [process.readinessNote] : undefined,
    },
  ];
}

function compositionGroups(
  composition: OperationalProcessesAdminProjection["compositions"][number]["composition"],
): CatalogGroup[] {
  const byScope = (scope: string) =>
    [...composition.nodes.filter((item) => item.scope === scope)].sort(
      (left, right) =>
        composition.derivedOrder.indexOf(left.id) -
        composition.derivedOrder.indexOf(right.id),
    );
  const readiness: CatalogGroup = {
    id: "readiness",
    kindLabel: "Stare",
    title: "Pregătire",
    sections: [
      {
        id: "readiness",
        title: "Stare",
        facts: [
          { label: "Pregătire", value: composition.completenessLabel },
          {
            label: "Traseu tehnologic",
            value: composition.technologicalProcessCompletenessLabel,
          },
          {
            label: "Calcul iluminare",
            value: composition.lightingCalculationReadinessLabel,
          },
          { label: "Costuri interne", value: composition.costCompletenessLabel },
          { label: "Execuție", value: composition.executionReadinessLabel },
        ],
        lines: [...composition.completenessReasons],
      },
      {
        id: "order",
        title: "Succesiune",
        lines: composition.derivedOrder.map((id) => {
          const node = composition.nodes.find((item) => item.id === id);
          if (!node) {
            return id;
          }
          const deps =
            node.dependsOn.length === 0
              ? "fără dependență"
              : `depinde de ${node.dependsOn
                  .map(
                    (dep) =>
                      composition.nodes.find((item) => item.id === dep)?.processLabel ??
                      dep,
                  )
                  .join(", ")}`;
          return `${node.scopeLabel} — ${node.processLabel} (${deps})`;
        }),
      },
      ...(composition.missingProcesses.length > 0
        ? [
            {
              id: "gaps",
              title: "Procese lipsă",
              lines: composition.missingProcesses.map(
                (item) => `${item.label} — ${item.classificationLabel}. ${item.note}`,
              ),
            },
          ]
        : []),
      {
        id: "details",
        title: "Detalii",
        technical: true,
        facts: [{ label: "Produs", value: composition.productCode }],
      },
    ],
  };
  const scopes = ["FACE", "VOLUME", "BACK", "LIGHTING", "BODY", "PRODUCT"] as const;
  return [
    readiness,
    ...scopes.flatMap((scope) => {
      const nodes = byScope(scope);
      if (nodes.length === 0) {
        return [];
      }
      return [
        {
          id: `scope:${scope}`,
          kindLabel: "Etapă",
          title: nodes[0]?.scopeLabel ?? scope,
          sections: nodes.map((node) => ({
            id: node.id,
            title: node.processLabel,
            facts: [
              { label: "Proces", value: node.processLabel },
              { label: "Stare", value: node.nodeReadinessLabel },
              ...(node.conditionLabel
                ? [{ label: "Condiție", value: node.conditionLabel }]
                : []),
              ...(node.dependsOn.length > 0
                ? [
                    {
                      label: "Depinde de",
                      value: node.dependsOn
                        .map(
                          (dep) =>
                            composition.nodes.find((item) => item.id === dep)
                              ?.processLabel ?? dep,
                        )
                        .join("; "),
                    },
                  ]
                : []),
            ],
            lines: [node.reason, ...node.blockers],
          })),
        },
      ];
    }),
  ];
}

function conditionLinesFor(
  processId: string,
  admin: OperationalProcessesAdminProjection,
): readonly string[] {
  const labels = new Set<string>();
  for (const inspection of admin.compositions) {
    for (const node of inspection.composition.nodes) {
      if (node.processId === processId && node.conditionLabel) {
        labels.add(node.conditionLabel);
      }
    }
  }
  return [...labels].map((label) => `Apare când ${label}.`);
}

function coverageChips(
  process: OperationalProcessesAdminProjection["processes"][number],
): CatalogChip[] {
  switch (process.providerCoverage) {
    case "COVERED":
      return [{ label: process.providerCoverageLabel, tone: "ok" }];
    case "NO_PROVIDER":
      return [{ label: process.providerCoverageLabel, tone: "warn" }];
    case "PROVIDER_PLANNED":
      return [{ label: process.providerCoverageLabel, tone: "neutral" }];
    default: {
      const _exhaustive: never = process.providerCoverage;
      return _exhaustive;
    }
  }
}
