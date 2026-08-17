export const CUSTOMER_STATUSES = ["ACTIVE", "RETIRED"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_DISPLAY_NAME_MAX_LENGTH = 80;

export type Customer = {
  customerId: string;
  displayName: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
  retiredAt: string | null;
};

export const CUSTOMER_MUTATION_ERRORS = [
  "invalid_name",
  "not_found",
  "already_retired",
] as const;
export type CustomerMutationError = (typeof CUSTOMER_MUTATION_ERRORS)[number];

export type CustomerMutationResult =
  | { ok: true; customer: Customer; alreadyApplied: boolean }
  | { ok: false; error: CustomerMutationError };

export type FrozenCustomerIdentity = {
  customerId: string;
  displayName: string;
};

export function generateCustomerId(): string {
  return `cus:${crypto.randomUUID()}`;
}

export function createCustomer(
  displayName: string,
  options?: { customerId?: string; createdAt?: string },
): CustomerMutationResult {
  const name = readDisplayName(displayName);
  if (!name) {
    return { ok: false, error: "invalid_name" };
  }
  const createdAt = options?.createdAt ?? new Date().toISOString();
  return {
    ok: true,
    alreadyApplied: false,
    customer: {
      customerId: options?.customerId ?? generateCustomerId(),
      displayName: name,
      status: "ACTIVE",
      createdAt,
      updatedAt: createdAt,
      retiredAt: null,
    },
  };
}

export function renameCustomer(
  customer: Customer,
  displayName: string,
  updatedAt = new Date().toISOString(),
): CustomerMutationResult {
  const name = readDisplayName(displayName);
  if (!name) {
    return { ok: false, error: "invalid_name" };
  }
  if (customer.displayName === name) {
    return { ok: true, customer, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    customer: {
      ...customer,
      displayName: name,
      updatedAt,
    },
  };
}

export function retireCustomer(
  customer: Customer,
  retiredAt: string,
): CustomerMutationResult {
  if (customer.status === "RETIRED") {
    return { ok: true, customer, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    customer: {
      ...customer,
      status: "RETIRED",
      updatedAt: retiredAt,
      retiredAt,
    },
  };
}

export function isCustomerStatus(value: string): value is CustomerStatus {
  return value === "ACTIVE" || value === "RETIRED";
}

export function customerFromRow(
  customerId: string,
  displayName: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  retiredAt: string | null,
): Customer | null {
  if (
    !customerId ||
    !displayName ||
    !isCustomerStatus(status) ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }
  return {
    customerId,
    displayName,
    status,
    createdAt,
    updatedAt,
    retiredAt,
  };
}

export function activeCustomers(customers: readonly Customer[]): Customer[] {
  return customers
    .filter((customer) => customer.status === "ACTIVE")
    .slice()
    .sort((left, right) => left.displayName.localeCompare(right.displayName, "ro"));
}

export function findCustomer(
  customers: readonly Customer[],
  customerId: string,
): Customer | undefined {
  return customers.find((customer) => customer.customerId === customerId);
}

export function customerStatusLabel(status: CustomerStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Activ";
    case "RETIRED":
      return "Retras";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function freezeCustomerIdentity(
  customer: Pick<Customer, "customerId" | "displayName">,
): FrozenCustomerIdentity | null {
  const customerId = customer.customerId.trim();
  const displayName = customer.displayName.trim();
  if (!customerId || !displayName) {
    return null;
  }
  return { customerId, displayName };
}

export function copyFrozenCustomerIdentity(
  customer: FrozenCustomerIdentity | undefined,
): FrozenCustomerIdentity | undefined {
  if (!customer) {
    return undefined;
  }
  return {
    customerId: customer.customerId,
    displayName: customer.displayName,
  };
}

function readDisplayName(value: string): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > CUSTOMER_DISPLAY_NAME_MAX_LENGTH) {
    return null;
  }
  return trimmed;
}
