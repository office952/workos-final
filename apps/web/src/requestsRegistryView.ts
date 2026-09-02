import type {
  RequestOverviewFilter,
  RequestOverviewItem,
  RequestOverviewProjection,
} from "@workos-final/domain";
import { filterRequestOverview } from "@workos-final/domain";

export function applyRequestsAttentionFilter(
  items: readonly RequestOverviewItem[],
  attentionOnly: boolean,
): readonly RequestOverviewItem[] {
  return attentionOnly ? items.filter((item) => item.needsAttention) : items;
}

export function visibleRequests(
  overview: RequestOverviewProjection,
  status: RequestOverviewFilter,
  query: string,
  attentionOnly: boolean,
): RequestOverviewItem[] {
  return [...applyRequestsAttentionFilter(filterRequestOverview(overview, status, query), attentionOnly)];
}

export function requestsResultCountLabel(count: number): string {
  return count === 1 ? "1 cerere" : `${count} cereri`;
}

export function requestRowMeta(item: RequestOverviewItem): string {
  return item.customerDisplayName
    ? `${item.reference} · ${item.customerDisplayName}`
    : item.reference;
}

export function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
