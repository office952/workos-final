import {
  resolveFinancialAccess,
  type FinancialAccessScope,
  type FinancialEndpointFamily,
} from "@workos-final/domain";
import { isOwner, type ApiContext } from "../cloud/context.js";

export function financialAccess(
  c: ApiContext,
  family: FinancialEndpointFamily,
): FinancialAccessScope {
  return resolveFinancialAccess({
    family,
    isOwner: isOwner(c),
  });
}
