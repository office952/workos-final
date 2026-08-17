import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Sync registry text search with `?q=` so refresh / Back restore findability context.
 * Local draft is authoritative while typing; URL updates immediately (replace) so a
 * quick open-result navigation cannot drop a pending debounced write.
 * Preserves unrelated query params (e.g. Requests `?customer=`).
 */
export function useRegistrySearchQuery(): [string, (next: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQueryState] = useState(urlQuery);

  useEffect(() => {
    setQueryState((current) => (current === urlQuery ? current : urlQuery));
  }, [urlQuery]);

  const setQuery = useCallback(
    (next: string) => {
      setQueryState(next);
      setSearchParams(
        (current) => {
          const existing = current.get("q") ?? "";
          if (existing === next) {
            return current;
          }
          const params = new URLSearchParams(current);
          if (next.length === 0) {
            params.delete("q");
          } else {
            params.set("q", next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [query, setQuery];
}
