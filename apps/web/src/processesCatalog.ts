import type { OperationalProcessesAdminProjection } from "@workos-final/domain";
import type { CatalogDetailSection, OwnerCatalog } from "./ownerCatalog";

export function buildProcessesCatalog(
  admin: OperationalProcessesAdminProjection,
): OwnerCatalog {
  return {
    categories: [
      {
        id: "categories",
        label: "Categorii",
        kindLabel: "Categorie",
        items: admin.categories.map((category) => ({
          id: `category:${category.id}`,
          label: category.label,
          kindLabel: "Categorie de proces",
          summary: `${category.processes.length} procese în această categorie.`,
          groups: category.processes.map((process) => ({
            id: process.id,
            kindLabel: "Proces operațional",
            title: process.label,
            sections: processSections(process),
          })),
        })),
      },
      {
        id: "processes",
        label: "Procese",
        kindLabel: "Categorie",
        items: admin.processes.map((process) => ({
          id: `process:${process.id}`,
          label: process.label,
          kindLabel: "Proces operațional",
          summary: process.description,
          groups: [
            {
              id: process.id,
              kindLabel: "Proces operațional",
              title: process.label,
              sections: processSections(process),
            },
          ],
        })),
      },
      {
        id: "compositions",
        label: "Compoziții produse",
        kindLabel: "Categorie",
        items: admin.compositions.map((inspection) => ({
          id: `composition:${inspection.id}`,
          label: inspection.label,
          kindLabel: "Compunere de procese",
          summary: `${inspection.composition.productLabel}. ${inspection.summary}`,
          groups: [
            {
              id: inspection.id,
              kindLabel: "Configurație inspectată",
              title: inspection.label,
              sections: compositionSections(inspection.composition),
            },
          ],
        })),
      },
      {
        id: "capabilities",
        label: "Capabilități necesare",
        kindLabel: "Categorie",
        items: admin.capabilities.map((capability) => ({
          id: `capability:${capability.id}`,
          label: capability.label,
          kindLabel: "Clasă de capabilitate",
          summary: capability.description,
          groups: [
            {
              id: capability.id,
              kindLabel: "Clasă de capabilitate",
              title: capability.label,
              sections: [
                {
                  id: "identity",
                  title: "Identitate",
                  facts: [
                    { label: "Fel", value: capability.kindLabel },
                    {
                      label: "Procese care o cer",
                      value:
                        capability.processes.length === 0
                          ? "niciun proces încă"
                          : capability.processes.map((item) => item.label).join("; "),
                    },
                  ],
                  lines: [
                    "Workcenter / utilaj vor furniza ulterior această clasă. Procesul nu conține un utilaj concret.",
                  ],
                },
                {
                  id: "technical",
                  title: "Tehnic",
                  technical: true,
                  facts: [{ label: "Identitate capabilitate", value: capability.id }],
                },
              ],
            },
          ],
        })),
      },
    ].filter((category) => category.items.length > 0),
  };
}

function processSections(
  process: OperationalProcessesAdminProjection["processes"][number],
): CatalogDetailSection[] {
  return [
    {
      id: "identity",
      title: "Identitate",
      facts: [
        { label: "Categorie", value: process.categoryLabel },
        { label: "Rezultat", value: process.outcome },
        { label: "Stare", value: process.lifecycleLabel },
        { label: "Pregătire", value: process.readinessLabel },
      ],
      lines: [process.description, process.readinessNote],
    },
    {
      id: "capability",
      title: "Capabilitate necesară",
      facts: [
        { label: "Clasă", value: process.requiredCapabilityLabel },
        { label: "Fel", value: process.requiredCapabilityKindLabel },
      ],
      lines: ["Procesul cere o clasă de capabilitate, nu un utilaj sau un angajat."],
    },
    {
      id: "resources",
      title: "Resurse / serviciu referit",
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
      id: "gaps",
      title: "Lipsă",
      lines: [
        "Write-ul de administrare nu este deschis.",
        "Nu există graf de execuție, asignări sau plan de lucru.",
        "Workcenter și utilaj nu sunt implementate.",
      ],
    },
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Identitate proces", value: process.id }],
    },
  ];
}

function compositionSections(
  composition: OperationalProcessesAdminProjection["compositions"][number]["composition"],
): CatalogDetailSection[] {
  const byScope = (scope: string) =>
    composition.nodes.filter((item) => item.scope === scope);
  return [
    {
      id: "readiness",
      title: "Stare",
      facts: [{ label: "Pregătire", value: composition.completenessLabel }],
      lines: [...composition.completenessReasons],
    },
    {
      id: "order",
      title: "Ordine derivată",
      lines: composition.derivedOrder.map((id) => {
        const node = composition.nodes.find((item) => item.id === id);
        if (!node) {
          return id;
        }
        const deps =
          node.dependsOn.length === 0
            ? "fără dependență"
            : `depinde de ${node.dependsOn
                .map((dep) => composition.nodes.find((item) => item.id === dep)?.processLabel ?? dep)
                .join(", ")}`;
        return `${node.scopeLabel} — ${node.processLabel} (${deps})`;
      }),
    },
    ...(["FACE", "VOLUME", "BACK", "LIGHTING", "BODY"] as const).flatMap((scope) => {
      const nodes = [...byScope(scope)].sort(
        (left, right) =>
          composition.derivedOrder.indexOf(left.id) -
          composition.derivedOrder.indexOf(right.id),
      );
      return nodes.map((node) => ({
        id: node.id,
        title:
          nodes.length === 1
            ? node.scopeLabel
            : `${node.scopeLabel} — ${node.processLabel}`,
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
                        composition.nodes.find((item) => item.id === dep)?.processLabel ??
                        dep,
                    )
                    .join("; "),
                },
              ]
            : []),
        ],
        lines: [node.reason, ...node.blockers],
      }));
    }),
    {
      id: "gaps",
      title: "Procese lipsă",
      lines: composition.missingProcesses.map(
        (item) => `${item.label} — ${item.classificationLabel}. ${item.note}`,
      ),
    },
    {
      id: "technical",
      title: "Tehnic",
      technical: true,
      facts: [{ label: "Produs", value: composition.productCode }],
    },
  ];
}
