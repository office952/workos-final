import type { SellerProfile, SellerProfileInput } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchSellerProfile(): Promise<SellerProfile> {
  const response = await fetch(`${baseUrl}/api/seller`);
  const body = await readJson<{ seller?: SellerProfile }>(response);
  if (!response.ok || !body.seller) {
    throw new Error("seller_unavailable");
  }
  return body.seller;
}

export async function updateSellerProfile(input: SellerProfileInput): Promise<SellerProfile> {
  const response = await fetch(`${baseUrl}/api/seller`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await readJson<{ seller?: SellerProfile; error?: string }>(response);
  if (!response.ok || !body.seller) {
    throw new Error(body.error ?? "seller_update_failed");
  }
  return body.seller;
}
