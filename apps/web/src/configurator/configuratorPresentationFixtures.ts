import type { ConfiguratorView } from "./configuratorView";

const emptyContext = {
  returnHref: "/products",
  returnLabel: "Catalog",
  requestReference: null,
  clientName: null,
  objectLabel: null,
};

function baseView(partial: Partial<ConfiguratorView>): ConfiguratorView {
  return {
    title: "Ansamblu ACM + litere volumetrice",
    statusLabel: "3 din 4 module validate",
    complete: false,
    modulesValidated: 3,
    modulesTotal: 4,
    productKind: "letters",
    scopes: [
      { id: "panou-acm", label: "PANOU ACM" },
      { id: "litere", label: "LITERE" },
      { id: "ansamblare", label: "ANSAMBLARE" },
      { id: "compozitie", label: "COMPOZIȚIE" },
    ],
    activeScopeId: "litere",
    targets: [],
    activeTargetId: null,
    blueprintTitle: "Anatomie fizică",
    blueprintIncomplete: false,
    sections: [],
    editorTitle: "Configurezi",
    editorLead: "Fixture de prezentare. Nu este adevăr de domeniu.",
    editorSections: [],
    editorComponentIds: [],
    compositionItems: [],
    context: emptyContext,
    ...partial,
  };
}

export function fixtureAcmMultiPiece(): ConfiguratorView {
  return baseView({
    productKind: "acm",
    activeScopeId: "panou-acm",
    editorTitle: "Configurezi panoul ACM",
    blueprintTitle: "Construcție cadru și corp",
    sections: [
      {
        id: "FACE",
        label: "CORP CASETAT",
        incomplete: false,
        facts: [
          {
            id: "face.pieces",
            label: "Bucăți",
            display: "2 × 1600 × 800 mm",
            kind: "configured",
            required: true,
          },
        ],
      },
    ],
  });
}

export function fixtureLettersPersonalized(): ConfiguratorView {
  return baseView({
    activeScopeId: "litere",
    targets: [
      { id: "common", label: "COMUN", kind: "common" },
      { id: "prichindel", label: "PRICHINDEL", kind: "group" },
    ],
    activeTargetId: "prichindel",
    editorTitle: "Configurezi PRICHINDEL",
    sections: [
      {
        id: "VOLUME",
        label: "CANT",
        incomplete: false,
        facts: [
          {
            id: "volume.depthMm",
            label: "Lățime bandă",
            display: "60 mm",
            kind: "personalized",
            required: true,
          },
          {
            id: "volume.finish",
            label: "Colantare",
            display: "Oracal 651",
            kind: "inherited",
            required: true,
          },
        ],
      },
    ],
  });
}

export function fixtureAssemblyDirect(): ConfiguratorView {
  return baseView({
    productKind: "unknown",
    activeScopeId: "ansamblare",
    editorTitle: "Configurezi ansamblarea",
    blueprintTitle: "Relație de ansamblare",
    sections: [
      {
        id: "ASSEMBLY",
        label: "ANSAMBLARE",
        incomplete: false,
        facts: [
          {
            id: "assembly.mount",
            label: "Montare",
            display: "Direct",
            kind: "configured",
            required: true,
          },
        ],
      },
    ],
  });
}

export function fixtureAssemblyJoint(): ConfiguratorView {
  return baseView({
    productKind: "unknown",
    activeScopeId: "ansamblare",
    editorTitle: "Configurezi ansamblarea",
    blueprintTitle: "Relație de ansamblare",
    sections: [
      {
        id: "ASSEMBLY",
        label: "ANSAMBLARE",
        incomplete: false,
        facts: [
          {
            id: "assembly.mount",
            label: "Montare",
            display: "Distanțate",
            kind: "configured",
            required: true,
          },
          {
            id: "assembly.joint",
            label: "Joint",
            display: "din limita de panou",
            kind: "derived",
            required: true,
          },
        ],
      },
    ],
  });
}
