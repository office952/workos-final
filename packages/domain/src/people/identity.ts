export const PERSON_STATUSES = ["ACTIVE", "RETIRED"] as const;
export type PersonStatus = (typeof PERSON_STATUSES)[number];

export const PERSON_DISPLAY_NAME_MAX_LENGTH = 80;

export type Person = {
  personId: string;
  displayName: string;
  status: PersonStatus;
  createdAt: string;
  retiredAt: string | null;
};

export const PERSON_MUTATION_ERRORS = [
  "invalid_name",
  "not_found",
  "already_retired",
] as const;
export type PersonMutationError = (typeof PERSON_MUTATION_ERRORS)[number];

export type PersonMutationResult =
  | { ok: true; person: Person; alreadyApplied: boolean }
  | { ok: false; error: PersonMutationError };

export function generatePersonId(): string {
  return `per:${crypto.randomUUID()}`;
}

export function createPerson(
  displayName: string,
  options?: { personId?: string; createdAt?: string },
): PersonMutationResult {
  const name = readDisplayName(displayName);
  if (!name) {
    return { ok: false, error: "invalid_name" };
  }
  return {
    ok: true,
    alreadyApplied: false,
    person: {
      personId: options?.personId ?? generatePersonId(),
      displayName: name,
      status: "ACTIVE",
      createdAt: options?.createdAt ?? new Date().toISOString(),
      retiredAt: null,
    },
  };
}

export function renamePerson(
  person: Person,
  displayName: string,
): PersonMutationResult {
  const name = readDisplayName(displayName);
  if (!name) {
    return { ok: false, error: "invalid_name" };
  }
  if (person.displayName === name) {
    return { ok: true, person, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    person: {
      ...person,
      displayName: name,
    },
  };
}

export function retirePerson(
  person: Person,
  retiredAt: string,
): PersonMutationResult {
  if (person.status === "RETIRED") {
    return { ok: true, person, alreadyApplied: true };
  }
  return {
    ok: true,
    alreadyApplied: false,
    person: {
      ...person,
      status: "RETIRED",
      retiredAt,
    },
  };
}

export function isPersonStatus(value: string): value is PersonStatus {
  return value === "ACTIVE" || value === "RETIRED";
}

export function personFromRow(
  personId: string,
  displayName: string,
  status: string,
  createdAt: string,
  retiredAt: string | null,
): Person | null {
  if (!personId || !displayName || !isPersonStatus(status) || !createdAt) {
    return null;
  }
  return {
    personId,
    displayName,
    status,
    createdAt,
    retiredAt,
  };
}

export function activePeople(people: readonly Person[]): Person[] {
  return people
    .filter((person) => person.status === "ACTIVE")
    .slice()
    .sort((left, right) => left.displayName.localeCompare(right.displayName, "ro"));
}

export function findPerson(
  people: readonly Person[],
  personId: string,
): Person | undefined {
  return people.find((person) => person.personId === personId);
}

export function personStatusLabel(status: PersonStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Activă";
    case "RETIRED":
      return "Retrasă";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function readDisplayName(value: string): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > PERSON_DISPLAY_NAME_MAX_LENGTH) {
    return null;
  }
  return trimmed;
}
