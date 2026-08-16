import type { Person } from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchPeople(): Promise<Person[]> {
  const response = await fetch(`${baseUrl}/api/people`);
  if (!response.ok) {
    throw new Error("people_unavailable");
  }
  const body = await readJson<{ people?: Person[] }>(response);
  return body.people ?? [];
}

export async function createPerson(displayName: string): Promise<Person[]> {
  const response = await fetch(`${baseUrl}/api/people`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  const body = await readJson<{ people?: Person[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "people_create_failed");
  }
  return body.people ?? [];
}

export async function renamePerson(personId: string, displayName: string): Promise<Person[]> {
  const response = await fetch(`${baseUrl}/api/people/${personId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  const body = await readJson<{ people?: Person[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "people_rename_failed");
  }
  return body.people ?? [];
}

export async function retirePerson(personId: string): Promise<Person[]> {
  const response = await fetch(`${baseUrl}/api/people/${personId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "RETIRED" }),
  });
  const body = await readJson<{ people?: Person[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "people_retire_failed");
  }
  return body.people ?? [];
}
