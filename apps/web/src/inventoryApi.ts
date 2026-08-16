import type {
  InventoryItemDetail,
  InventoryMovement,
  InventoryStockProjection,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchInventory(): Promise<InventoryStockProjection> {
  const response = await fetch(`${baseUrl}/api/inventory`);
  if (!response.ok) {
    throw new Error("inventory_unavailable");
  }
  const body = await readJson<{ inventory: InventoryStockProjection }>(response);
  return body.inventory;
}

export async function fetchInventoryItem(resourceId: string): Promise<InventoryItemDetail> {
  const response = await fetch(`${baseUrl}/api/inventory/${encodeURIComponent(resourceId)}`);
  if (!response.ok) {
    throw new Error(response.status === 404 ? "not_found" : "inventory_unavailable");
  }
  return readJson<InventoryItemDetail>(response);
}

export async function recordInventoryAdjustment(
  resourceId: string,
  quantityDelta: number,
  note?: string,
): Promise<{ movement: InventoryMovement; inventory: InventoryStockProjection }> {
  const response = await fetch(
    `${baseUrl}/api/inventory/${encodeURIComponent(resourceId)}/adjustments`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quantityDelta,
        ...(note ? { note } : {}),
      }),
    },
  );
  if (!response.ok) {
    throw new Error("adjustment_unavailable");
  }
  return readJson<{ movement: InventoryMovement; inventory: InventoryStockProjection }>(
    response,
  );
}
