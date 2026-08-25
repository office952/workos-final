import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

const api = process.env.NEW_API_URL ?? "http://127.0.0.1:8787";
const pin = process.env.WORKOS_AUDIT_SYNTHETIC_PIN;
if (!pin || pin.length < 4) {
  throw new Error("WORKOS_AUDIT_SYNTHETIC_PIN must be set in the environment and never written to the pack");
}

const outState = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", ".tmp", "ui-ux-audit-v1", "correction-fixture.json");

async function json(path, init) {
  const response = await fetch(`${api}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} ${response.status}`);
  }
  return body;
}

const seller = await json("/api/seller", {
  method: "PATCH",
  body: JSON.stringify({
    legalName: "Audit Synthetic SRL",
    brand: "Audit Synthetic",
    fiscalId: "",
    tradeRegister: "",
    address: "",
    locality: "",
    iban: "",
    bank: "",
  }),
});

const peopleBody = await json("/api/people");
const skillsBody = await json("/api/people/skills");
const skillByCode = new Map((skillsBody.skills ?? []).map((skill) => [skill.code, skill.skillId]));

let renamed = 0;
let retired = 0;
for (const [index, person] of (peopleBody.people ?? []).entries()) {
  const label = `Operator Audit ${String(index + 1).padStart(2, "0")}`;
  const retire = await fetch(`${api}/api/people/${encodeURIComponent(person.personId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "RETIRED" }),
  });
  if (retire.ok) {
    retired += 1;
    continue;
  }
  await json(`/api/people/${encodeURIComponent(person.personId)}`, {
    method: "PATCH",
    body: JSON.stringify({ displayName: label, roleLabel: "Audit fixture" }),
  });
  renamed += 1;
}

const eligible = await json("/api/people", {
  method: "POST",
  body: JSON.stringify({ displayName: "Operator Eligible", roleLabel: "Audit eligible" }),
});
const ineligible = await json("/api/people", {
  method: "POST",
  body: JSON.stringify({ displayName: "Operator Ineligible", roleLabel: "Audit ineligible" }),
});

const eligibleId = eligible.person.personId;
const ineligibleId = ineligible.person.personId;

for (const code of ["SK_ASSEMBLY", "SK_CNC_OPERATOR", "SK_ELECTRICIAN"]) {
  const skillId = skillByCode.get(code);
  if (skillId) {
    await json(`/api/people/${encodeURIComponent(eligibleId)}/skills`, {
      method: "POST",
      body: JSON.stringify({ skillId }),
    });
  }
}

await json(`/api/people/${encodeURIComponent(eligibleId)}/operator-pin`, {
  method: "PUT",
  body: JSON.stringify({ pin, confirmPin: pin }),
});
await json(`/api/people/${encodeURIComponent(ineligibleId)}/operator-pin`, {
  method: "PUT",
  body: JSON.stringify({ pin, confirmPin: pin }),
});

const jobs = await json("/api/jobs");
const job = jobs.overview?.jobs?.[0] ?? null;

writeFileSync(
  outState,
  JSON.stringify(
    {
      sellerLegalName: seller.seller?.legalName ?? seller.profile?.legalName ?? null,
      retired,
      renamed,
      createdEligible: Boolean(eligibleId),
      createdIneligible: Boolean(ineligibleId),
      jobInscription: job?.inscription ?? null,
      executionHref: job?.href ?? null,
    },
    null,
    2,
  ),
);

console.log("FIXTURE_READY");
console.log(`SELLER=${seller.seller?.legalName ?? seller.profile?.legalName ?? "unknown"}`);
console.log(`RETIRED=${retired}`);
console.log(`RENAMED=${renamed}`);
console.log(`JOB=${job?.inscription ?? "none"}`);
console.log(`EXEC_HREF_SET=${Boolean(job?.href)}`);
