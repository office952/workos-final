import { useLocation } from "react-router-dom";
import { pathIdAfter } from "./routePath";

export function usePathIdAfter(prefix: string): string {
  const { pathname } = useLocation();
  return pathIdAfter(pathname, prefix);
}
