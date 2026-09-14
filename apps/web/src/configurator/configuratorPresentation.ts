function stripRoleWord(label: string, word: string): string {
  return label
    .replace(new RegExp(`(?:^|\\s)${word}(?=\\s|$)`, "gi"), " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function projectVisualLabel(label: string): string {
  const withoutUnit = label.replace(/\s*\((mm²|mm)\)\s*/gi, " ").replace(/\s+/g, " ").trim();
  if (/îndoitur/i.test(withoutUnit)) {
    return "Îndoituri";
  }
  if (/adâncime\s+casetă/i.test(withoutUnit)) {
    return "Adâncime panou";
  }
  if (/adâncime\s+volum/i.test(withoutUnit)) {
    return "Lățime bandă";
  }
  if (/lățime\s+exterioară/i.test(withoutUnit)) {
    return "Lățime finală";
  }
  if (/înălțime/i.test(withoutUnit)) {
    return "Înălțime finală";
  }
  if (/finisaj/i.test(withoutUnit)) {
    return "Colantare";
  }
  if (/^iluminare$/i.test(withoutUnit)) {
    return "Sistem";
  }
  let stripped = withoutUnit;
  for (const word of [
    "confirmată",
    "confirmat",
    "exterioară",
    "exterior",
    "literelor",
    "lucrare",
    "de prindere",
    "volum",
    "casetă",
    "față",
    "spate",
  ]) {
    stripped = stripRoleWord(stripped, word);
  }
  if (/^textul$/i.test(stripped)) {
    return "Text";
  }
  return stripped || withoutUnit;
}

export function fieldUnitFromLabel(label: string): string | null {
  if (/\(mm²\)/i.test(label) || /mm²/i.test(label)) {
    return "mm²";
  }
  if (/\(mm\)/i.test(label)) {
    return "mm";
  }
  return null;
}

/** Gap after the compact title row, before the scope rail. Not extra header chrome. */
export const CFG_TITLE_TO_SCOPE_RAIL_PX = 18;

export type ConfiguratorRailMode = "distributed" | "proportional" | "group";

export function configuratorRailMode(count: number): ConfiguratorRailMode {
  if (count === 4) {
    return "distributed";
  }
  if (count >= 3) {
    return "proportional";
  }
  return "group";
}

export function configuratorRailSlot(index: number): 1 | 2 | 3 | 4 {
  const slot = index + 1;
  if (slot === 1 || slot === 2 || slot === 3 || slot === 4) {
    return slot;
  }
  return 4;
}
