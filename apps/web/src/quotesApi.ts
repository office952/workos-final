import type { QuoteOverviewProjection } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchQuoteOverview(): Promise<QuoteOverviewProjection> {
  const response = await fetch(`${baseUrl}/api/quotes`);
  if (!response.ok) {
    throw new Error("quotes_unavailable");
  }
  const body = (await response.json()) as { overview?: QuoteOverviewProjection };
  if (!body.overview) {
    throw new Error("quotes_unavailable");
  }
  return body.overview;
}
