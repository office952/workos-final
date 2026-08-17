import type {
  Customer,
  CustomerProfilePatch,
  CustomerRegistryProjection,
  CustomerWorkspaceProjection,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(`${baseUrl}/api/customers`);
  if (!response.ok) {
    throw new Error("customers_unavailable");
  }
  const body = await readJson<{ customers?: Customer[] }>(response);
  return body.customers ?? [];
}

export async function fetchCustomerRegistry(): Promise<CustomerRegistryProjection> {
  const response = await fetch(`${baseUrl}/api/customers`);
  if (!response.ok) {
    throw new Error("customers_unavailable");
  }
  const body = await readJson<{ registry?: CustomerRegistryProjection }>(response);
  if (!body.registry) {
    throw new Error("customers_unavailable");
  }
  return body.registry;
}

export async function fetchCustomerWorkspace(
  customerId: string,
): Promise<CustomerWorkspaceProjection | null> {
  const response = await fetch(
    `${baseUrl}/api/customers/${encodeURIComponent(customerId)}/workspace`,
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("customer_workspace_unavailable");
  }
  const body = await readJson<{ workspace?: CustomerWorkspaceProjection }>(response);
  return body.workspace ?? null;
}

export async function createCustomer(
  displayName: string,
  profile?: Omit<CustomerProfilePatch, "displayName">,
): Promise<{ customer: Customer; customers: Customer[] }> {
  const response = await fetch(`${baseUrl}/api/customers`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName, ...profile }),
  });
  const body = await readJson<{
    customer?: Customer;
    customers?: Customer[];
    error?: string;
  }>(response);
  if (!response.ok || !body.customer) {
    throw new Error(body.error ?? "customer_create_failed");
  }
  return {
    customer: body.customer,
    customers: body.customers ?? [],
  };
}

export async function updateCustomer(
  customerId: string,
  patch: CustomerProfilePatch,
): Promise<{ customer: Customer; customers: Customer[] }> {
  const response = await fetch(`${baseUrl}/api/customers/${encodeURIComponent(customerId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  const body = await readJson<{
    customer?: Customer;
    customers?: Customer[];
    error?: string;
  }>(response);
  if (!response.ok || !body.customer) {
    throw new Error(body.error ?? "customer_update_failed");
  }
  return {
    customer: body.customer,
    customers: body.customers ?? [],
  };
}

export async function renameCustomer(
  customerId: string,
  displayName: string,
): Promise<Customer[]> {
  const updated = await updateCustomer(customerId, { displayName });
  return updated.customers;
}

export async function retireCustomer(customerId: string): Promise<Customer[]> {
  const response = await fetch(`${baseUrl}/api/customers/${encodeURIComponent(customerId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "RETIRED" }),
  });
  const body = await readJson<{ customers?: Customer[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "customer_retire_failed");
  }
  return body.customers ?? [];
}
