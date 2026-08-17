import type { ProductionCapabilityClassId } from "@workos-final/domain";

export type TrustedSkillSeed = {
  skillId: string;
  code: string;
  displayLabel: string;
  description: string | null;
};

export type TrustedPersonSeed = {
  personId: string;
  displayName: string;
  roleLabel: string;
  skillCodes: readonly string[];
};

export const TRUSTED_SKILLS: readonly TrustedSkillSeed[] = [
  { skillId: "skl:legacy:graphic-design", code: "SK_GRAPHIC_DESIGN", displayLabel: "Grafician", description: null },
  { skillId: "skl:legacy:quoting", code: "SK_QUOTING", displayLabel: "Ofertare", description: null },
  { skillId: "skl:legacy:print-operator", code: "SK_PRINT_OPERATOR", displayLabel: "Operator Imprimantă", description: null },
  { skillId: "skl:legacy:laminator-operator", code: "SK_LAMINATOR_OPERATOR", displayLabel: "Operator Laminator", description: null },
  { skillId: "skl:legacy:cutter-operator", code: "SK_CUTTER_OPERATOR", displayLabel: "Operator Cutter Plotter", description: null },
  { skillId: "skl:legacy:cnc-operator", code: "SK_CNC_OPERATOR", displayLabel: "CNC", description: null },
  { skillId: "skl:legacy:cnc-prep", code: "SK_CNC_PREP", displayLabel: "Pregătire materiale CNC", description: null },
  { skillId: "skl:legacy:letter-cant", code: "SK_LETTER_CANT_OPERATOR", displayLabel: "Operator CNC cant litere", description: null },
  { skillId: "skl:legacy:letter-modeling", code: "SK_LETTER_MODELING", displayLabel: "Modelare cant litere", description: null },
  { skillId: "skl:legacy:locksmith", code: "SK_LOCKSMITH", displayLabel: "Lăcătuș", description: null },
  { skillId: "skl:legacy:assembly", code: "SK_ASSEMBLY", displayLabel: "Ansamblare", description: null },
  { skillId: "skl:legacy:vinyl", code: "SK_VINYL_APPLICATOR", displayLabel: "Colantator", description: null },
  { skillId: "skl:legacy:electrician", code: "SK_ELECTRICIAN", displayLabel: "Electrician", description: null },
  { skillId: "skl:legacy:field-installer", code: "SK_FIELD_INSTALLER", displayLabel: "Montator", description: null },
  { skillId: "skl:legacy:commercial-tech", code: "SK_COMMERCIAL_TECH", displayLabel: "Director comercial / tehnic", description: null },
];

export const TRUSTED_PEOPLE: readonly TrustedPersonSeed[] = [
  {
    personId: "per:legacy:calin-cimpean",
    displayName: "Calin Cimpean",
    roleLabel: "Grafician / Operator",
    skillCodes: [
      "SK_GRAPHIC_DESIGN",
      "SK_QUOTING",
      "SK_PRINT_OPERATOR",
      "SK_LAMINATOR_OPERATOR",
      "SK_CUTTER_OPERATOR",
    ],
  },
  {
    personId: "per:legacy:octavian-dumitru",
    displayName: "Octavian Dumitru",
    roleLabel: "Grafician / Operator",
    skillCodes: [
      "SK_GRAPHIC_DESIGN",
      "SK_QUOTING",
      "SK_PRINT_OPERATOR",
      "SK_LAMINATOR_OPERATOR",
      "SK_CUTTER_OPERATOR",
    ],
  },
  {
    personId: "per:legacy:florin-cnc",
    displayName: "Florin CNC",
    roleLabel: "Operator CNC",
    skillCodes: ["SK_CNC_OPERATOR", "SK_CNC_PREP", "SK_LETTER_CANT_OPERATOR"],
  },
  {
    personId: "per:legacy:putaru-sandu",
    displayName: "Putaru Sandu",
    roleLabel: "Lăcătuș / Montator",
    skillCodes: [
      "SK_LOCKSMITH",
      "SK_ASSEMBLY",
      "SK_VINYL_APPLICATOR",
      "SK_ELECTRICIAN",
      "SK_FIELD_INSTALLER",
    ],
  },
  {
    personId: "per:legacy:vali-colantator",
    displayName: "Vali Colantator",
    roleLabel: "Colantator / Montator",
    skillCodes: ["SK_ASSEMBLY", "SK_VINYL_APPLICATOR", "SK_ELECTRICIAN", "SK_FIELD_INSTALLER"],
  },
  {
    personId: "per:legacy:costi-modelator",
    displayName: "Costi Modelator",
    roleLabel: "Modelator / Colantator",
    skillCodes: [
      "SK_ASSEMBLY",
      "SK_VINYL_APPLICATOR",
      "SK_ELECTRICIAN",
      "SK_FIELD_INSTALLER",
      "SK_LETTER_MODELING",
    ],
  },
  {
    personId: "per:legacy:andrei-goghi",
    displayName: "Andrei Goghi",
    roleLabel: "Producție / CNC",
    skillCodes: [
      "SK_ASSEMBLY",
      "SK_VINYL_APPLICATOR",
      "SK_ELECTRICIAN",
      "SK_FIELD_INSTALLER",
      "SK_CNC_OPERATOR",
    ],
  },
  {
    personId: "per:legacy:chirila-cristian",
    displayName: "Chirila Cristian",
    roleLabel: "Direct comercial / tehnic",
    skillCodes: ["SK_COMMERCIAL_TECH", "SK_QUOTING"],
  },
];

export const TRUSTED_CAPABILITY_SKILLS: ReadonlyArray<{
  capabilityId: ProductionCapabilityClassId;
  skillCode: string;
}> = [
  { capabilityId: "CNC_ROUTING", skillCode: "SK_CNC_OPERATOR" },
  { capabilityId: "PROFILE_FORMING", skillCode: "SK_LETTER_CANT_OPERATOR" },
  { capabilityId: "PROFILE_FORMING", skillCode: "SK_LETTER_MODELING" },
  { capabilityId: "MANUAL_ASSEMBLY", skillCode: "SK_ASSEMBLY" },
  { capabilityId: "VINYL_APPLICATION", skillCode: "SK_VINYL_APPLICATOR" },
  { capabilityId: "ELECTRICAL_ASSEMBLY", skillCode: "SK_ELECTRICIAN" },
  { capabilityId: "PRINTING", skillCode: "SK_PRINT_OPERATOR" },
  { capabilityId: "LAMINATION", skillCode: "SK_LAMINATOR_OPERATOR" },
  { capabilityId: "PLOTTER_CUTTING", skillCode: "SK_CUTTER_OPERATOR" },
  { capabilityId: "WELD_STEEL", skillCode: "SK_LOCKSMITH" },
  { capabilityId: "WELD_ALUMINIUM", skillCode: "SK_LOCKSMITH" },
  { capabilityId: "RIGID_FILM_LAMINATION", skillCode: "SK_VINYL_APPLICATOR" },
  { capabilityId: "PAINTING", skillCode: "SK_ASSEMBLY" },
  { capabilityId: "QUALITY_CONTROL", skillCode: "SK_ASSEMBLY" },
  { capabilityId: "PACKAGING", skillCode: "SK_ASSEMBLY" },
];
