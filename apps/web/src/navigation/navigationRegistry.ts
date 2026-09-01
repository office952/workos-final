export const NAVIGATION_CATEGORY_IDS = [
  "principal",
  "comercial",
  "productie",
  "resurse",
  "oameni",
  "administrare",
] as const;

export type NavigationCategoryId = (typeof NAVIGATION_CATEGORY_IDS)[number];

export const NAVIGATION_CATEGORY_LABELS: Record<NavigationCategoryId, string> = {
  principal: "Principal",
  comercial: "Comercial",
  productie: "Producție",
  resurse: "Resurse",
  oameni: "Oameni",
  administrare: "Administrare",
};

export const NAVIGATION_DESTINATION_IDS = [
  "home",
  "clients",
  "requests",
  "quotes",
  "catalog",
  "jobs",
  "atelier",
  "costs",
  "stock",
  "machines",
  "suppliers",
  "purchasing",
  "people",
  "attendance",
  "payments",
  "firm",
  "policies",
  "operational-services",
  "product-system",
  "governance",
] as const;

export type NavigationDestinationId = (typeof NAVIGATION_DESTINATION_IDS)[number];

export type NavigationAvailability = "implemented" | "not_implemented";

export type NavigationIconName =
  | "house"
  | "users"
  | "inbox"
  | "file-text"
  | "layout-grid"
  | "briefcase"
  | "wrench"
  | "circle-dollar-sign"
  | "package"
  | "cog"
  | "truck"
  | "shopping-cart"
  | "user-round"
  | "calendar-clock"
  | "banknote"
  | "building-2"
  | "scale"
  | "map-pin"
  | "layers"
  | "shield-check";

export type NavigationLocation = {
  pathname: string;
  search: string;
};

export type NavigationDestination = {
  id: NavigationDestinationId;
  category: NavigationCategoryId;
  label: string;
  icon: NavigationIconName;
  href: string | null;
  availability: NavigationAvailability;
  requiredRole: "any" | "owner";
  requiredCapability: string | null;
  match: (location: NavigationLocation) => boolean;
};

export const SIDEBAR_EXPANDED_WIDTH_PX = 256;
export const SIDEBAR_COLLAPSED_WIDTH_PX = 72;
export const SIDEBAR_DRAWER_MAX_WIDTH_PX = 384;
export const SIDEBAR_COLLAPSED_STORAGE_KEY = "workos.v3.sidebar.collapsed";

export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
  {
    id: "home",
    category: "principal",
    label: "Acasă",
    icon: "house",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "clients",
    category: "comercial",
    label: "Clienți",
    icon: "users",
    href: "/clients",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/clients"),
  },
  {
    id: "requests",
    category: "comercial",
    label: "Cereri",
    icon: "inbox",
    href: "/requests",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/requests") ||
      productContinuation(location) === "request",
  },
  {
    id: "quotes",
    category: "comercial",
    label: "Oferte",
    icon: "file-text",
    href: "/quotes",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/quotes") ||
      productContinuation(location) === "quote",
  },
  {
    id: "catalog",
    category: "comercial",
    label: "Catalog",
    icon: "layout-grid",
    href: "/products",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      location.pathname === "/products" ||
      (pathEqualsOrChild(location.pathname, "/products") &&
        productContinuation(location) === null),
  },
  {
    id: "jobs",
    category: "productie",
    label: "Lucrări",
    icon: "briefcase",
    href: "/jobs",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      location.pathname === "/" ||
      pathEqualsOrChild(location.pathname, "/jobs") ||
      productContinuation(location) === "order",
  },
  {
    id: "atelier",
    category: "productie",
    label: "Atelier",
    icon: "wrench",
    href: "/atelier",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/atelier") ||
      pathEqualsOrChild(location.pathname, "/execution"),
  },
  {
    id: "costs",
    category: "resurse",
    label: "Resurse și costuri",
    icon: "circle-dollar-sign",
    href: "/admin/resources",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/admin/resources"),
  },
  {
    id: "stock",
    category: "resurse",
    label: "Stoc",
    icon: "package",
    href: "/admin/stock",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/admin/stock"),
  },
  {
    id: "machines",
    category: "resurse",
    label: "Utilaje",
    icon: "cog",
    href: "/admin/workcenters",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/admin/workcenters"),
  },
  {
    id: "suppliers",
    category: "resurse",
    label: "Furnizori",
    icon: "truck",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "purchasing",
    category: "resurse",
    label: "Achiziții",
    icon: "shopping-cart",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "people",
    category: "oameni",
    label: "Angajați",
    icon: "user-round",
    href: "/admin/people",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/admin/people"),
  },
  {
    id: "attendance",
    category: "oameni",
    label: "Pontaj",
    icon: "calendar-clock",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "payments",
    category: "oameni",
    label: "Plăți și avansuri",
    icon: "banknote",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "firm",
    category: "administrare",
    label: "Firmă",
    icon: "building-2",
    href: "/admin/seller",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) => pathEqualsOrChild(location.pathname, "/admin/seller"),
  },
  {
    id: "policies",
    category: "administrare",
    label: "Politici",
    icon: "scale",
    href: null,
    availability: "not_implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: () => false,
  },
  {
    id: "operational-services",
    category: "administrare",
    label: "Servicii operaționale",
    icon: "map-pin",
    href: "/admin/operational-services",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/admin/operational-services"),
  },
  {
    id: "product-system",
    category: "administrare",
    label: "Sistem produs",
    icon: "layers",
    href: "/admin/product-system",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/admin/product-system") ||
      pathEqualsOrChild(location.pathname, "/components"),
  },
  {
    id: "governance",
    category: "administrare",
    label: "Guvernanță",
    icon: "shield-check",
    href: "/governance",
    availability: "implemented",
    requiredRole: "any",
    requiredCapability: null,
    match: (location) =>
      pathEqualsOrChild(location.pathname, "/governance") ||
      pathEqualsOrChild(location.pathname, "/system"),
  },
];

export function pathEqualsOrChild(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isOperationalOperatorRoute(pathname: string): boolean {
  return pathEqualsOrChild(pathname, "/atelier") || pathEqualsOrChild(pathname, "/execution");
}

export function productContinuation(
  location: NavigationLocation,
): "request" | "quote" | "order" | null {
  if (!pathEqualsOrChild(location.pathname, "/products") || location.pathname === "/products") {
    return null;
  }
  const params = new URLSearchParams(location.search);
  if (params.has("request")) {
    return "request";
  }
  if (params.has("quote")) {
    return "quote";
  }
  if (params.has("order")) {
    return "order";
  }
  return null;
}

export function destinationAccessibleName(destination: NavigationDestination): string {
  return `${NAVIGATION_CATEGORY_LABELS[destination.category]} — ${destination.label}`;
}

export function findActiveDestination(
  location: NavigationLocation,
  destinations: readonly NavigationDestination[] = NAVIGATION_DESTINATIONS,
): NavigationDestination | null {
  return destinations.find((destination) => destination.match(location)) ?? null;
}
