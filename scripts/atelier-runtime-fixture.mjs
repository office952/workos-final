/**
 * Runtime fixture for Atelier QA — two open LETTERS plans with Back CNC providers.
 * Does not print PIN values.
 */
const API = process.env.API_BASE ?? "http://127.0.0.1:8787";

const readyValues = (inscription) => ({
  "root.inscription": inscription,
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
});

async function json(response) {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status}:${JSON.stringify(body)}`);
  }
  return body;
}

async function createPlan(inscription) {
  const compiled = await json(
    await fetch(`${API}/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ values: readyValues(inscription) }),
    }),
  );
  const accepted = await json(
    await fetch(
      `${API}/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/accepted-production-snapshot`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          definition: compiled.definition,
          reviewId: compiled.reviewId,
        }),
      },
    ),
  );
  const created = await json(
    await fetch(
      `${API}/api/products/PRD-LETTERS-FRONTLIT-PLEXI-AL06/accepted-production-snapshots/${accepted.snapshot.snapshotId}/execution-plan`,
      { method: "POST" },
    ),
  );
  const view = created.executionPlan;
  const backCnc = view.tasks.find(
    (task) => task.processLabel === "Debitare foaie CNC" && task.scopeLabel === "Spate",
  );
  const faceCnc = view.tasks.find(
    (task) => task.processLabel === "Debitare foaie CNC" && task.scopeLabel === "Față",
  );
  await json(
    await fetch(`${API}/api/execution-tasks/${encodeURIComponent(backCnc.taskId)}/provider`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerId: "MCH-CNC-4020" }),
    }),
  );
  if (faceCnc) {
    await json(
      await fetch(`${API}/api/execution-tasks/${encodeURIComponent(faceCnc.taskId)}/provider`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ providerId: "MCH-CNC-4020" }),
      }),
    );
  }
  return {
    planId: view.plan.planId,
    inscription: view.plan.inscription,
    backCncTaskId: backCnc.taskId,
    faceCncTaskId: faceCnc?.taskId ?? null,
  };
}

async function ensurePin(personId, pin) {
  const response = await fetch(`${API}/api/people/${encodeURIComponent(personId)}/operator-pin`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pin, confirmPin: pin }),
  });
  if (!response.ok && response.status !== 409) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`pin_failed:${personId}:${response.status}:${JSON.stringify(body)}`);
  }
}

async function main() {
  const people = await json(await fetch(`${API}/api/people`));
  const list = people.people ?? people;
  const florin = list.find((p) => p.displayName === "Florin CNC");
  const andrei = list.find((p) => p.displayName === "Andrei Goghi");
  if (!florin || !andrei) {
    throw new Error("missing_people");
  }
  await ensurePin(florin.personId, "246810");
  await ensurePin(andrei.personId, "975310");
  const jobA = await createPlan("ATELIER-A");
  const jobB = await createPlan("ATELIER-B");
  console.log(
    JSON.stringify(
      {
        florinId: florin.personId,
        andreiId: andrei.personId,
        jobA,
        jobB,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
