export function formatQuantity(value: number): string {
  return value.toLocaleString("ro-RO", { maximumFractionDigits: 2 });
}

export function formatUnit(unit: string): string {
  switch (unit) {
    case "m2":
      return "m²";
    case "mm2":
      return "mm²";
    case "W":
      return "W";
    case "buc":
      return "buc";
    default:
      return unit;
  }
}

export function formatMoney(value: number): string {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("ro-RO");
}

export function formatCalendarDate(value: string): string {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCostCompleteness(
  completeness: "PARTIAL" | "COMPLETE",
): string {
  switch (completeness) {
    case "PARTIAL":
      return " (parțial)";
    case "COMPLETE":
      return " (complet)";
    default: {
      const _exhaustive: never = completeness;
      return _exhaustive;
    }
  }
}
