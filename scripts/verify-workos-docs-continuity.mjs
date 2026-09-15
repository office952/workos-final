import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_DOCS = [
  "docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md",
  "docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md",
  "docs/governance/WORKOS_AUTHORITY_MAP.md",
  "docs/development/WORKOS_CURSOR_WORKFLOW.md",
  "docs/development/WORKOS_FIGMA_WORKFLOW.md",
  "docs/continuity/WORKOS_SESSION_CURRENT.md",
  "docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md",
  "docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md",
  "docs/CURSOR_PLUGINS.md",
  "docs/README.md",
  "AGENTS.md",
];

const CLASSIFIED_DOCS = [
  "docs/governance/WORKOS_DOCUMENTATION_GOVERNANCE.md",
  "docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md",
  "docs/governance/WORKOS_AUTHORITY_MAP.md",
  "docs/development/WORKOS_CURSOR_WORKFLOW.md",
  "docs/development/WORKOS_FIGMA_WORKFLOW.md",
  "docs/continuity/WORKOS_SESSION_CURRENT.md",
  "docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md",
];

const SESSION_REQUIRED_POINTERS = [
  "LIVE_MAIN_AUTHORITY",
  "GITHUB_ORIGIN_MAIN",
  "DELIVERY_ROADMAP",
  "AUTHORITY_MAP",
  "TERMINOLOGY_CANON",
  "CURSOR_WORKFLOW",
  "CURSOR_PLUGIN_REGISTRY",
  "FIGMA_WORKFLOW",
  "PRODUCT_TRUTH_AUTHORITIES",
  "UI_UX_AUTHORITIES",
];

const FORBIDDEN_PATH_RE = /(?:[A-Za-z]:\\Users\\|[A-Za-z]:\/Users\/|\/Users\/)/;
const SECRET_RE =
  /(?:(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})/;
const ROLE_RE = /^ROLE\s*=\s*\S+/m;
const OWNS_RE = /^OWNS\s*=\s*\S+/m;
const DOES_NOT_OWN_RE = /^DOES_NOT_OWN\s*=\s*\S+/m;

export function repoRootFrom(moduleUrl = import.meta.url) {
  return resolve(dirname(fileURLToPath(moduleUrl)), "..");
}

export function readRepoFile(repoRoot, relativePath) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

export function collectMarkdownPaths(relativeDir, repoRoot) {
  const absolute = join(repoRoot, relativeDir);
  if (!existsSync(absolute)) {
    return [];
  }
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const next = join(relativeDir, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      return collectMarkdownPaths(next, repoRoot);
    }
    return entry.name.endsWith(".md") ? [next] : [];
  });
}

function fail(errors, message) {
  errors.push(message);
}

export function verifyRequiredDocs(repoRoot, errors) {
  for (const relativePath of REQUIRED_DOCS) {
    if (!existsSync(join(repoRoot, relativePath))) {
      fail(errors, `missing required doc: ${relativePath}`);
    }
  }
}

export function verifyReadmeIndex(readme, errors) {
  const requiredMentions = [
    "WORKOS_DOCUMENTATION_GOVERNANCE.md",
    "WORKOS_ROMANIAN_TERMINOLOGY_CANON.md",
    "WORKOS_AUTHORITY_MAP.md",
    "WORKOS_CURSOR_WORKFLOW.md",
    "WORKOS_FIGMA_WORKFLOW.md",
    "WORKOS_SESSION_CURRENT.md",
    "WORKOS_NEW_SESSION_BOOTSTRAP.md",
    "WORKOS_V1_DELIVERY_ROADMAP.md",
    "CURSOR_PLUGINS.md",
  ];
  for (const mention of requiredMentions) {
    if (!readme.includes(mention)) {
      fail(errors, `docs/README.md must reference ${mention}`);
    }
  }
}

export function verifyDocumentRoles(repoRoot, errors) {
  for (const relativePath of CLASSIFIED_DOCS) {
    const text = readRepoFile(repoRoot, relativePath);
    if (!ROLE_RE.test(text) || !OWNS_RE.test(text) || !DOES_NOT_OWN_RE.test(text)) {
      fail(errors, `${relativePath} must declare ROLE, OWNS, and DOES_NOT_OWN`);
    }
    if (/ROLE\s*=\s*ACTIVE_V1_DELIVERY/.test(text)) {
      fail(errors, `${relativePath} must not claim ACTIVE_V1_DELIVERY`);
    }
  }
}

export function verifyAuthorityMapPaths(repoRoot, mapText, errors) {
  const ignored = new Set(["packages/domain"]);
  const matches = mapText.matchAll(/`((?:docs|AGENTS)[^`]+)`/g);
  for (const match of matches) {
    const relativePath = match[1].replace(/\\/g, "/");
    if (ignored.has(relativePath) || relativePath.endsWith("/")) {
      continue;
    }
    if (!existsSync(join(repoRoot, relativePath))) {
      fail(errors, `authority map references missing path: ${relativePath}`);
    }
  }
}

export function verifySessionCurrent(sessionText, errors) {
  for (const pointer of SESSION_REQUIRED_POINTERS) {
    if (!sessionText.includes(pointer)) {
      fail(errors, `WORKOS_SESSION_CURRENT.md must contain ${pointer}`);
    }
  }
  if (!/LIVE_GITHUB_WINS\s*=\s*YES/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must say LIVE_GITHUB_WINS = YES");
  }
  if (!/NOT_AUTHORIZED_AFTER_FC1|NONE_AUTHORIZED_AFTER_FC1/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must not silently authorize the next product slice");
  }
  if (/FC2_AUTHORIZED\s*=\s*YES/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must not authorize FC2");
  }
}

export function verifyRoadmapFc1(roadmapText, errors) {
  if (!/FORM_COMPLETENESS_FC1\s*=\s*INTEGRATED_ON_MAIN/.test(roadmapText)) {
    fail(errors, "living roadmap must record FORM_COMPLETENESS_FC1 = INTEGRATED_ON_MAIN");
  }
  if (!/PR26\s*=\s*INTEGRATED_ON_MAIN/.test(roadmapText)) {
    fail(errors, "living roadmap must record PR26 = INTEGRATED_ON_MAIN");
  }
  if (!/NEXT_PRODUCT_SLICE\s*=\s*NOT_AUTHORIZED_AFTER_FC1/.test(roadmapText)) {
    fail(errors, "living roadmap must record NEXT_PRODUCT_SLICE = NOT_AUTHORIZED_AFTER_FC1");
  }
  if (/FORM_COMPLETENESS\s*=\s*FC1_IMPLEMENTED_LOCAL_IN_REVIEW/.test(roadmapText)) {
    fail(errors, "living roadmap still records FC1 as local-in-review");
  }
  if (
    !/NEXT_PRODUCT_GATE\s*=\s*CHATGPT_ROADMAP_REEVALUATION_AFTER_DOCUMENTATION_CONTINUITY_V1/.test(
      roadmapText,
    )
  ) {
    fail(
      errors,
      "living roadmap must record NEXT_PRODUCT_GATE = CHATGPT_ROADMAP_REEVALUATION_AFTER_DOCUMENTATION_CONTINUITY_V1",
    );
  }
}

export function verifyNoPersonalPathsOrSecrets(relativePath, text, errors) {
  if (FORBIDDEN_PATH_RE.test(text)) {
    fail(errors, `personal machine path in ${relativePath}`);
  }
  if (SECRET_RE.test(text)) {
    fail(errors, `possible secret token in ${relativePath}`);
  }
}

export function verifyTerminologyConcepts(terminologyText, errors) {
  const concepts = [...terminologyText.matchAll(/^### CONCEPT = ([A-Z0-9_]+)\s*$/gm)].map(
    (match) => match[1],
  );
  if (concepts.length === 0) {
    fail(errors, "terminology canon must declare CONCEPT identifiers");
    return;
  }
  const seen = new Set();
  for (const concept of concepts) {
    if (seen.has(concept)) {
      fail(errors, `duplicate CONCEPT: ${concept}`);
    }
    seen.add(concept);
  }
}

export function verifyOwnerUpdateRule(agentsText, cursorWorkflowText, errors) {
  if (!agentsText.includes("OWNER_UPDATE_LINKS")) {
    fail(errors, "AGENTS.md must require OWNER_UPDATE_LINKS");
  }
  if (!cursorWorkflowText.includes("OWNER_UPDATE_LINKS")) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must require OWNER_UPDATE_LINKS");
  }
}

export function verifyWorkosDocsContinuity(repoRoot = repoRootFrom()) {
  const errors = [];
  verifyRequiredDocs(repoRoot, errors);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const readme = readRepoFile(repoRoot, "docs/README.md");
  const session = readRepoFile(repoRoot, "docs/continuity/WORKOS_SESSION_CURRENT.md");
  const roadmap = readRepoFile(repoRoot, "docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md");
  const authorityMap = readRepoFile(repoRoot, "docs/governance/WORKOS_AUTHORITY_MAP.md");
  const terminology = readRepoFile(repoRoot, "docs/governance/WORKOS_ROMANIAN_TERMINOLOGY_CANON.md");
  const agents = readRepoFile(repoRoot, "AGENTS.md");
  const cursorWorkflow = readRepoFile(repoRoot, "docs/development/WORKOS_CURSOR_WORKFLOW.md");

  verifyReadmeIndex(readme, errors);
  verifyDocumentRoles(repoRoot, errors);
  verifyAuthorityMapPaths(repoRoot, authorityMap, errors);
  verifySessionCurrent(session, errors);
  verifyRoadmapFc1(roadmap, errors);
  verifyTerminologyConcepts(terminology, errors);
  verifyOwnerUpdateRule(agents, cursorWorkflow, errors);

  const guarded = [
    ...CLASSIFIED_DOCS,
    "docs/CURSOR_PLUGINS.md",
    "docs/README.md",
    "docs/worklog/WORKOS_DOCUMENTATION_AND_SESSION_CONTINUITY_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md",
  ];
  for (const relativePath of guarded) {
    if (existsSync(join(repoRoot, relativePath))) {
      verifyNoPersonalPathsOrSecrets(relativePath, readRepoFile(repoRoot, relativePath), errors);
    }
  }

  return { ok: errors.length === 0, errors };
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }
  return resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  const result = verifyWorkosDocsContinuity();
  if (!result.ok) {
    process.stderr.write(`${result.errors.join("\n")}\n`);
    process.exit(1);
  }
  process.stdout.write("DOCS_CHECK=PASS\n");
}
