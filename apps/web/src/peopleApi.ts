import type {
  PeopleRegistryProjection,
  Person,
  PersonRegistryItem,
  Skill,
} from "@workos-final/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchPeopleRegistry(): Promise<PeopleRegistryProjection> {
  const response = await fetch(`${baseUrl}/api/people`);
  if (!response.ok) {
    throw new Error("people_unavailable");
  }
  const body = await readJson<{ registry?: PeopleRegistryProjection; people?: Person[] }>(
    response,
  );
  if (body.registry) {
    return body.registry;
  }
  return {
    summary: {
      total: body.people?.length ?? 0,
      active: 0,
      available: 0,
      temporarilyUnavailable: 0,
      retired: 0,
    },
    people: [],
  };
}

export async function fetchPerson(
  personId: string,
): Promise<{ person: Person; item: PersonRegistryItem | null } | null> {
  const response = await fetch(`${baseUrl}/api/people/${encodeURIComponent(personId)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("person_unavailable");
  }
  return readJson(response);
}

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(`${baseUrl}/api/people/skills`);
  if (!response.ok) {
    throw new Error("skills_unavailable");
  }
  const body = await readJson<{ skills?: Skill[] }>(response);
  return body.skills ?? [];
}

export async function fetchEligibility(capabilityId: string): Promise<{
  eligiblePeople: Array<{ personId: string; displayName: string }>;
}> {
  const response = await fetch(
    `${baseUrl}/api/people/eligibility?capabilityId=${encodeURIComponent(capabilityId)}`,
  );
  if (!response.ok) {
    throw new Error("eligibility_unavailable");
  }
  return readJson(response);
}

export async function createPerson(
  displayName: string,
  roleLabel?: string,
): Promise<PeopleRegistryProjection> {
  const response = await fetch(`${baseUrl}/api/people`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ displayName, roleLabel }),
  });
  const body = await readJson<{ registry?: PeopleRegistryProjection; error?: string }>(
    response,
  );
  if (!response.ok) {
    throw new Error(body.error ?? "people_create_failed");
  }
  return body.registry ?? fetchPeopleRegistry();
}

export async function updatePerson(
  personId: string,
  patch: {
    displayName?: string;
    availability?: "AVAILABLE" | "TEMPORARILY_UNAVAILABLE";
    unavailableReason?: string | null;
    unavailableUntil?: string | null;
    roleLabel?: string | null;
  },
): Promise<Person> {
  const response = await fetch(`${baseUrl}/api/people/${encodeURIComponent(personId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  const body = await readJson<{ person?: Person; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "people_update_failed");
  }
  if (!body.person) {
    throw new Error("people_update_failed");
  }
  return body.person;
}

export async function retirePerson(personId: string): Promise<void> {
  const response = await fetch(`${baseUrl}/api/people/${encodeURIComponent(personId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "RETIRED" }),
  });
  const body = await readJson<{ error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "people_retire_failed");
  }
}

export async function createSkill(input: {
  code: string;
  displayLabel: string;
}): Promise<Skill[]> {
  const response = await fetch(`${baseUrl}/api/people/skills`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await readJson<{ skills?: Skill[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "skill_create_failed");
  }
  return body.skills ?? [];
}

export async function retireSkill(skillId: string): Promise<Skill[]> {
  const response = await fetch(`${baseUrl}/api/people/skills/${encodeURIComponent(skillId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "RETIRED" }),
  });
  const body = await readJson<{ skills?: Skill[]; error?: string }>(response);
  if (!response.ok) {
    throw new Error(body.error ?? "skill_retire_failed");
  }
  return body.skills ?? [];
}

export async function assignPersonSkill(personId: string, skillId: string): Promise<void> {
  const response = await fetch(
    `${baseUrl}/api/people/${encodeURIComponent(personId)}/skills`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ skillId }),
    },
  );
  if (!response.ok) {
    const body = await readJson<{ error?: string }>(response);
    throw new Error(body.error ?? "skill_assign_failed");
  }
}

export async function removePersonSkill(personId: string, skillId: string): Promise<void> {
  const response = await fetch(
    `${baseUrl}/api/people/${encodeURIComponent(personId)}/skills/${encodeURIComponent(skillId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "RETIRED" }),
    },
  );
  if (!response.ok) {
    const body = await readJson<{ error?: string }>(response);
    throw new Error(body.error ?? "skill_remove_failed");
  }
}
