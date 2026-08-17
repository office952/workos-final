import type { JobOverviewProjection } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchJobOverview(): Promise<JobOverviewProjection> {
  const response = await fetch(`${baseUrl}/api/jobs`);
  if (!response.ok) {
    throw new Error("jobs_unavailable");
  }
  const body = (await response.json()) as { overview?: JobOverviewProjection };
  if (!body.overview) {
    throw new Error("jobs_unavailable");
  }
  return body.overview;
}
