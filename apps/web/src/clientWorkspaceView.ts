import {
  CUSTOMER_WORKSPACE_SECTIONS,
  type Customer,
  type CustomerWorkspaceNextAction,
  type CustomerWorkspaceProjection,
  type CustomerWorkspaceSection,
} from "@workos-final/domain";

export const CLIENT_WORKSPACE_SECTION_QUERY: Record<string, CustomerWorkspaceSection> = {
  prezentare: "OVERVIEW",
  cereri: "REQUESTS",
  oferte: "QUOTES",
  lucrari: "JOBS",
};

export const CLIENT_WORKSPACE_SECTION_PATH: Record<CustomerWorkspaceSection, string> = {
  OVERVIEW: "prezentare",
  REQUESTS: "cereri",
  QUOTES: "oferte",
  JOBS: "lucrari",
};

export function sectionFromQuery(value: string | null): CustomerWorkspaceSection {
  if (!value) {
    return "OVERVIEW";
  }
  return CLIENT_WORKSPACE_SECTION_QUERY[value] ?? "OVERVIEW";
}

export function customerWorkspaceHasAttention(
  summary: CustomerWorkspaceProjection["summary"],
): boolean {
  return (
    summary.requestNeedsAction > 0 ||
    summary.quoteNeedsAction > 0 ||
    summary.jobNeedsAction > 0
  );
}

export function customerWorkspaceAttentionAction(
  workspace: CustomerWorkspaceProjection,
): CustomerWorkspaceNextAction | null {
  if (!customerWorkspaceHasAttention(workspace.summary)) {
    return null;
  }
  return workspace.nextActions[0] ?? null;
}

export function customerIdentityLine(customer: Customer): string {
  return [customer.cui, customer.contactName, customer.city]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(" · ");
}

export function displayOrUnset(value: string | null | undefined): string {
  return value && value.trim().length > 0 ? value : "Nesetat";
}

export function customerAddressLine(customer: Customer): string | null {
  const parts = [customer.address, customer.city].filter(
    (value): value is string => Boolean(value && value.trim().length > 0),
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

export function customerHasCommercialActivity(
  workspace: CustomerWorkspaceProjection,
): boolean {
  return (
    workspace.requests.length > 0 ||
    workspace.quotes.length > 0 ||
    workspace.jobs.length > 0
  );
}

export function clientWorkspaceSectionItems(): readonly CustomerWorkspaceSection[] {
  return CUSTOMER_WORKSPACE_SECTIONS;
}

export function formatClientDate(value: string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
