import type { QuoteOverviewItem, QuoteOverviewProjection } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type QuoteInspectionResponse = {
  quote: QuoteOverviewItem;
  quoteSnapshot: Record<string, unknown>;
  acceptance: { acceptanceId: string } | null;
  order: { orderSnapshotId: string; href: string } | null;
  request: { requestId: string; href: string; reference: string | null } | null;
};

export async function fetchQuoteOverview(): Promise<QuoteOverviewProjection> {
  const response = await fetch(`${baseUrl}/api/quotes`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("quotes_unavailable");
  }
  const body = (await response.json()) as { overview?: QuoteOverviewProjection };
  if (!body.overview) {
    throw new Error("quotes_unavailable");
  }
  return body.overview;
}

export async function fetchQuoteInspection(quoteSnapshotId: string): Promise<
  | { ok: true; detail: QuoteInspectionResponse }
  | { ok: false; reason: "not_found" | "forbidden" | "unavailable" }
> {
  const response = await fetch(
    `${baseUrl}/api/quotes/${encodeURIComponent(quoteSnapshotId)}`,
    { credentials: "include" },
  );
  if (response.status === 404) {
    return { ok: false, reason: "not_found" };
  }
  if (response.status === 401 || response.status === 403) {
    return { ok: false, reason: "forbidden" };
  }
  if (!response.ok) {
    return { ok: false, reason: "unavailable" };
  }
  const body = (await response.json()) as QuoteInspectionResponse;
  if (!body.quote) {
    return { ok: false, reason: "unavailable" };
  }
  return { ok: true, detail: body };
}
