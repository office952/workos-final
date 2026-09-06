import {
  findActiveDestination,
  type NavigationDestination,
  type NavigationDestinationId,
  type NavigationLocation,
} from "./navigationRegistry";

/** UI20 presentation slots — does not own availability/href/capability truth. */
export type Ui20PresentationSlot =
  | "home"
  | "requests"
  | "commercial"
  | "jobs"
  | "atelier"
  | "more"
  | "admin";

const COMMERCIAL_IDS: readonly NavigationDestinationId[] = ["clients", "quotes", "catalog"];
const MORE_RESOURCES_IDS: readonly NavigationDestinationId[] = ["costs", "stock", "machines"];
const MORE_PEOPLE_IDS: readonly NavigationDestinationId[] = ["people"];
const ADMIN_IDS: readonly NavigationDestinationId[] = [
  "firm",
  "operational-services",
  "product-system",
  "governance",
];

export type Ui20NavLink = {
  destination: NavigationDestination;
  href: string;
};

export type Ui20SecondaryGroup = {
  id: "resources" | "people";
  label: string;
  items: Ui20NavLink[];
};

export type Ui20PresentationModel = {
  home: Ui20NavLink | null;
  requests: Ui20NavLink | null;
  commercial: Ui20NavLink[];
  jobs: Ui20NavLink | null;
  atelier: Ui20NavLink | null;
  moreGroups: Ui20SecondaryGroup[];
  admin: Ui20NavLink[];
  activeDestination: NavigationDestination | null;
  activeSlot: Ui20PresentationSlot | null;
};

function asLink(destination: NavigationDestination | undefined): Ui20NavLink | null {
  if (!destination?.href) {
    return null;
  }
  return { destination, href: destination.href };
}

function linksFor(
  destinations: readonly NavigationDestination[],
  ids: readonly NavigationDestinationId[],
): Ui20NavLink[] {
  const byId = new Map(destinations.map((item) => [item.id, item]));
  const links: Ui20NavLink[] = [];
  for (const id of ids) {
    const link = asLink(byId.get(id));
    if (link) {
      links.push(link);
    }
  }
  return links;
}

export function buildUi20PresentationModel(
  visibleDestinations: readonly NavigationDestination[],
  location: NavigationLocation,
): Ui20PresentationModel {
  const byId = new Map(visibleDestinations.map((item) => [item.id, item]));
  const commercial = linksFor(visibleDestinations, COMMERCIAL_IDS);
  const resourceItems = linksFor(visibleDestinations, MORE_RESOURCES_IDS);
  const peopleItems = linksFor(visibleDestinations, MORE_PEOPLE_IDS);
  const moreGroups: Ui20SecondaryGroup[] = [];
  if (resourceItems.length > 0) {
    moreGroups.push({ id: "resources", label: "Resurse", items: resourceItems });
  }
  if (peopleItems.length > 0) {
    moreGroups.push({ id: "people", label: "Oameni", items: peopleItems });
  }

  const activeDestination = findActiveDestination(location, visibleDestinations);
  return {
    home: asLink(byId.get("home")),
    requests: asLink(byId.get("requests")),
    commercial,
    jobs: asLink(byId.get("jobs")),
    atelier: asLink(byId.get("atelier")),
    moreGroups,
    admin: linksFor(visibleDestinations, ADMIN_IDS),
    activeDestination,
    activeSlot: resolveActiveSlot(activeDestination),
  };
}

export function resolveActiveSlot(
  destination: NavigationDestination | null,
): Ui20PresentationSlot | null {
  if (!destination) {
    return null;
  }
  switch (destination.id) {
    case "home":
      return "home";
    case "requests":
      return "requests";
    case "clients":
    case "quotes":
    case "catalog":
      return "commercial";
    case "jobs":
      return "jobs";
    case "atelier":
      return "atelier";
    case "costs":
    case "stock":
    case "machines":
    case "people":
      return "more";
    case "firm":
    case "operational-services":
    case "product-system":
    case "governance":
    case "policies":
    case "suppliers":
    case "purchasing":
    case "attendance":
    case "payments":
      return "admin";
    default: {
      const _exhaustive: never = destination.id;
      return _exhaustive;
    }
  }
}

export function hasMaiMulte(model: Ui20PresentationModel): boolean {
  return model.moreGroups.length > 0;
}
