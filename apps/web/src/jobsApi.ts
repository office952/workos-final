import type { JobOverviewItem, JobOverviewProjection } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type JobDetailResponse = {
  job: JobOverviewItem;
  order: Record<string, unknown>;
  quote: {
    quoteSnapshotId: string;
    href: string;
    reference: string | null;
  };
  request: {
    requestId: string;
    href: string;
    reference: string | null;
  } | null;
  release: { releaseSnapshotId: string } | null;
  execution: {
    planId: string;
    href: string | null;
    statusLabel: string;
    progressLabel: string | null;
    blocked: boolean;
    attentionLabel: string | null;
    view: Record<string, unknown> | null;
  } | null;
};

export async function fetchJobOverview(): Promise<JobOverviewProjection> {
  const response = await fetch(`${baseUrl}/api/jobs`, { credentials: "include" });
  if (!response.ok) {
    throw new Error("jobs_unavailable");
  }
  const body = (await response.json()) as { overview?: JobOverviewProjection };
  if (!body.overview) {
    throw new Error("jobs_unavailable");
  }
  return body.overview;
}

export async function fetchJobDetail(jobId: string): Promise<
  | { ok: true; detail: JobDetailResponse }
  | { ok: false; reason: "not_found" | "forbidden" | "unavailable" }
> {
  const response = await fetch(`${baseUrl}/api/jobs/${encodeURIComponent(jobId)}`, {
    credentials: "include",
  });
  if (response.status === 404) {
    return { ok: false, reason: "not_found" };
  }
  if (response.status === 401 || response.status === 403) {
    return { ok: false, reason: "forbidden" };
  }
  if (!response.ok) {
    return { ok: false, reason: "unavailable" };
  }
  const body = (await response.json()) as JobDetailResponse;
  if (!body.job) {
    return { ok: false, reason: "unavailable" };
  }
  return { ok: true, detail: body };
}
