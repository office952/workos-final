import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { RequestOverviewFilter } from "@workos-final/domain";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

const STATUS_TO_PARAM: Record<RequestOverviewFilter, string | null> = {
  ALL: null,
  NEW: "new",
  IN_REVIEW: "in-review",
  WAITING_CUSTOMER: "waiting",
  READY_FOR_QUOTE: "ready",
  BLOCKED: "blocked",
  CANCELLED: "cancelled",
};

export function parseRequestsStatusParam(value: string | null): RequestOverviewFilter {
  switch (value) {
    case "new":
      return "NEW";
    case "in-review":
      return "IN_REVIEW";
    case "waiting":
      return "WAITING_CUSTOMER";
    case "ready":
      return "READY_FOR_QUOTE";
    case "blocked":
      return "BLOCKED";
    case "cancelled":
      return "CANCELLED";
    default:
      return "ALL";
  }
}

export function useRequestsRegistryState(): {
  query: string;
  setQuery: (next: string) => void;
  status: RequestOverviewFilter;
  setStatus: (next: RequestOverviewFilter) => void;
  attention: boolean;
  setAttention: (next: boolean) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useRegistrySearchQuery();
  const status = parseRequestsStatusParam(searchParams.get("status"));
  const attention = searchParams.get("attention") === "1";

  const setStatus = useCallback(
    (next: RequestOverviewFilter) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          const encoded = STATUS_TO_PARAM[next];
          if (encoded) {
            params.set("status", encoded);
          } else {
            params.delete("status");
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setAttention = useCallback(
    (next: boolean) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          if (next) {
            params.set("attention", "1");
          } else {
            params.delete("attention");
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { query, setQuery, status, setStatus, attention, setAttention };
}
