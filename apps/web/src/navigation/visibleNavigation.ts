import {
  NAVIGATION_CATEGORY_IDS,
  NAVIGATION_DESTINATIONS,
  type NavigationCategoryId,
  type NavigationDestination,
} from "./navigationRegistry";

export type NavigationVisibilityContext = {
  mode: "single_plane" | "cloud";
  role: "owner" | "member" | null;
  organizationId: string | null;
  capabilities?: ReadonlySet<string>;
};

export const DEFAULT_NAVIGATION_VISIBILITY: NavigationVisibilityContext = {
  mode: "single_plane",
  role: null,
  organizationId: null,
};

export function navigationVisibilityKey(context: NavigationVisibilityContext): string {
  const capabilities = context.capabilities
    ? [...context.capabilities].sort().join(",")
    : "";
  return [context.mode, context.organizationId ?? "", context.role ?? "", capabilities].join(":");
}

export function isDestinationVisible(
  destination: NavigationDestination,
  context: NavigationVisibilityContext,
): boolean {
  if (destination.availability !== "implemented" || destination.href == null) {
    return false;
  }
  if (destination.requiredRole === "owner") {
    if (context.mode === "cloud" && context.role !== "owner") {
      return false;
    }
  }
  if (
    destination.requiredCapability &&
    !(context.capabilities?.has(destination.requiredCapability) ?? false)
  ) {
    return false;
  }
  return true;
}

export function resolveVisibleDestinations(
  context: NavigationVisibilityContext,
  destinations: readonly NavigationDestination[] = NAVIGATION_DESTINATIONS,
): NavigationDestination[] {
  return destinations.filter((destination) => isDestinationVisible(destination, context));
}

export function groupVisibleDestinations(
  destinations: readonly NavigationDestination[],
): Array<{ category: NavigationCategoryId; destinations: NavigationDestination[] }> {
  return NAVIGATION_CATEGORY_IDS.flatMap((category) => {
    const items = destinations.filter((destination) => destination.category === category);
    return items.length > 0 ? [{ category, destinations: items }] : [];
  });
}

export function visibleMenuSignature(destinations: readonly NavigationDestination[]): string {
  return destinations.map((destination) => destination.id).join("|");
}

export function hiddenNotImplementedDestinations(
  destinations: readonly NavigationDestination[] = NAVIGATION_DESTINATIONS,
): NavigationDestination[] {
  return destinations.filter((destination) => destination.availability === "not_implemented");
}
