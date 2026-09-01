import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { CustomerRegistryFilter } from "@workos-final/domain";
import { useRegistrySearchQuery } from "./useRegistrySearchQuery";

export function parseClientsStatusParam(value: string | null): CustomerRegistryFilter {
  switch (value) {
    case "active":
      return "ACTIVE";
    case "retired":
      return "RETIRED";
    default:
      return "ALL";
  }
}

export function useClientsRegistryState(): {
  query: string;
  setQuery: (next: string) => void;
  status: CustomerRegistryFilter;
  setStatus: (next: CustomerRegistryFilter) => void;
  attention: boolean;
  setAttention: (next: boolean) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useRegistrySearchQuery();
  const status = parseClientsStatusParam(searchParams.get("status"));
  const attention = searchParams.get("attention") === "1";

  const setStatus = useCallback(
    (next: CustomerRegistryFilter) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          switch (next) {
            case "ALL":
              params.delete("status");
              break;
            case "ACTIVE":
              params.set("status", "active");
              break;
            case "RETIRED":
              params.set("status", "retired");
              break;
            default: {
              const _exhaustive: never = next;
              return _exhaustive;
            }
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
