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
  "docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md",
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
  if (/FC2_AUTHORIZED\s*=\s*YES/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must not authorize FC2");
  }
  if (/FC2D_AUTHORIZED\s*=\s*YES/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must not authorize FC2D");
  }
  if (
    !/NOT_AUTHORIZED_AFTER_FC1|NONE_AUTHORIZED_AFTER_FC1/.test(sessionText) &&
    !/FC2A_IMPLEMENTED_LOCAL_IN_REVIEW\s*=\s*YES/.test(sessionText)
  ) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must not silently authorize the next product slice");
  }
  if (
    /FC2A_IMPLEMENTED_LOCAL_IN_REVIEW\s*=\s*YES/.test(sessionText) &&
    !/FC2D_AUTHORIZED\s*=\s*NO/.test(sessionText)
  ) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must keep FC2D unauthorized after FC2A");
  }
}

export function verifyRoadmapFc1(roadmapText, errors) {
  if (!/FORM_COMPLETENESS_FC1\s*=\s*INTEGRATED_ON_MAIN/.test(roadmapText)) {
    fail(errors, "living roadmap must record FORM_COMPLETENESS_FC1 = INTEGRATED_ON_MAIN");
  }
  if (!/PR26\s*=\s*INTEGRATED_ON_MAIN/.test(roadmapText)) {
    fail(errors, "living roadmap must record PR26 = INTEGRATED_ON_MAIN");
  }
  if (!/PR27\s*=\s*INTEGRATED_ON_MAIN/.test(roadmapText)) {
    fail(errors, "living roadmap must record PR27 = INTEGRATED_ON_MAIN");
  }
  if (!/FORM_COMPLETENESS_FC2A\s*=\s*IMPLEMENTED_LOCAL_IN_REVIEW/.test(roadmapText)) {
    fail(errors, "living roadmap must record FORM_COMPLETENESS_FC2A = IMPLEMENTED_LOCAL_IN_REVIEW");
  }
  if (!/FORM_COMPLETENESS\s*=\s*FC2A_IMPLEMENTED_LOCAL_IN_REVIEW/.test(roadmapText)) {
    fail(errors, "living roadmap must record FORM_COMPLETENESS = FC2A_IMPLEMENTED_LOCAL_IN_REVIEW");
  }
  if (
    !/NEXT_PRODUCT_SLICE\s*=\s*FC2D_RESOURCE_IDENTITIES_AND_EDITABLE_COSTING/.test(
      roadmapText,
    )
  ) {
    fail(
      errors,
      "living roadmap must record NEXT_PRODUCT_SLICE = FC2D_RESOURCE_IDENTITIES_AND_EDITABLE_COSTING",
    );
  }
  if (/FORM_COMPLETENESS\s*=\s*FC1_IMPLEMENTED_LOCAL_IN_REVIEW/.test(roadmapText)) {
    fail(errors, "living roadmap still records FC1 as local-in-review");
  }
  if (
    !/NEXT_PRODUCT_GATE\s*=\s*OWNER_REVIEW_FC2A_THEN_FC2D/.test(roadmapText)
  ) {
    fail(errors, "living roadmap must record NEXT_PRODUCT_GATE = OWNER_REVIEW_FC2A_THEN_FC2D");
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

const FORBIDDEN_CONFIGURATOR_FIGMA_SOLE_AUTHORITY = [
  /Configurator V1 — VISUAL_AUTHORITY/,
  /Only section [`']?219:3[`']? is Configurator implementation visual authority/i,
  /Only section [`']?219:3[`']? is implementation authority/i,
  /STATIC_VISUAL_AUTHORITY\s*=\s*FIGMA_219_3/,
];

export function verifyConfiguratorUiAuthority(
  frameworkText,
  figmaWorkflowText,
  authorityMapText,
  sessionText,
  errors,
) {
  if (!/CURRENT_IMPLEMENTED_UI_AUTHORITY\s*=\s*APPLICATION_ON_MAIN/.test(frameworkText)) {
    fail(
      errors,
      "CONFIGURATOR_V1_UI_FRAMEWORK.md must record CURRENT_IMPLEMENTED_UI_AUTHORITY = APPLICATION_ON_MAIN",
    );
  }
  if (!/FIGMA_ROLE\s*=\s*ACCEPTED_BASELINE_REFERENCE/.test(frameworkText)) {
    fail(errors, "CONFIGURATOR_V1_UI_FRAMEWORK.md must record FIGMA_ROLE = ACCEPTED_BASELINE_REFERENCE");
  }
  if (!/FORCE_SYNC_APP_TO_FIGMA\s*=\s*NO/.test(frameworkText)) {
    fail(errors, "CONFIGURATOR_V1_UI_FRAMEWORK.md must record FORCE_SYNC_APP_TO_FIGMA = NO");
  }

  if (!/CLASS\s*=\s*ACCEPTED_BASELINE_REFERENCE/.test(figmaWorkflowText)) {
    fail(
      errors,
      "WORKOS_FIGMA_WORKFLOW.md must classify Configurator 219:3 as ACCEPTED_BASELINE_REFERENCE",
    );
  }
  if (!/CURRENT_IMPLEMENTED_UI_AUTHORITY\s*=\s*APPLICATION_ON_MAIN/.test(figmaWorkflowText)) {
    fail(
      errors,
      "WORKOS_FIGMA_WORKFLOW.md must record CURRENT_IMPLEMENTED_UI_AUTHORITY = APPLICATION_ON_MAIN",
    );
  }
  if (!/FORCE_SYNC_APP_TO_FIGMA\s*=\s*NO/.test(figmaWorkflowText)) {
    fail(errors, "WORKOS_FIGMA_WORKFLOW.md must record FORCE_SYNC_APP_TO_FIGMA = NO");
  }

  for (const pattern of FORBIDDEN_CONFIGURATOR_FIGMA_SOLE_AUTHORITY) {
    if (pattern.test(figmaWorkflowText) || pattern.test(frameworkText)) {
      fail(
        errors,
        "living Configurator docs must not treat Figma 219:3 as sole/current implementation visual authority",
      );
    }
  }

  if (!/apps\/web/.test(authorityMapText) || !/CONFIGURATOR_V1_UI_FRAMEWORK/.test(authorityMapText)) {
    fail(
      errors,
      "WORKOS_AUTHORITY_MAP.md must route current Configurator presentation to apps/web plus the frozen framework",
    );
  }
  if (!/ACCEPTED_BASELINE_REFERENCE/.test(authorityMapText)) {
    fail(errors, "WORKOS_AUTHORITY_MAP.md must classify Configurator 219:3 as ACCEPTED_BASELINE_REFERENCE");
  }

  if (!/CONFIGURATOR_CURRENT_UI_UX_AUTHORITY\s*=\s*CURRENT_IMPLEMENTED_APPLICATION_ON_MAIN/.test(sessionText)) {
    fail(
      errors,
      "WORKOS_SESSION_CURRENT.md must record CONFIGURATOR_CURRENT_UI_UX_AUTHORITY = CURRENT_IMPLEMENTED_APPLICATION_ON_MAIN",
    );
  }
  if (!/FIGMA_219_3_ROLE\s*=\s*ACCEPTED_BASELINE_REFERENCE/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must record FIGMA_219_3_ROLE = ACCEPTED_BASELINE_REFERENCE");
  }
  if (!/FORCE_SYNC_APP_TO_FIGMA\s*=\s*NO/.test(sessionText)) {
    fail(errors, "WORKOS_SESSION_CURRENT.md must record FORCE_SYNC_APP_TO_FIGMA = NO");
  }
}

const FORBIDDEN_BLANKET_PAGE_ACCEPTANCE = [
  /ALL_UI20_PAGES_OWNER_ACCEPTED\s*=\s*YES/,
  /ALL_WORKOS_PAGES_UI_UX\s*=\s*OWNER_ACCEPTED/,
  /OWNER_APPROVED_CURRENT_UI_UX_SURFACES\s*=\s*ALL/,
  /OTHER_WORKOS_PAGES_UI_UX\s*=\s*REJECTED/,
];

export function verifyOwnerUiUxApprovalScope(
  sessionText,
  figmaWorkflowText,
  authorityMapText,
  bootstrapText,
  roadmapText,
  errors,
) {
  if (!/OWNER_APPROVED_CURRENT_UI_UX_SURFACES\s*=\s*CONFIGURATOR_ONLY/.test(sessionText)) {
    fail(
      errors,
      "WORKOS_SESSION_CURRENT.md must record OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
    );
  }
  if (!/CONFIGURATOR_CURRENT_UI_UX\s*=\s*OWNER_APPROVED_IMPLEMENTED_APPLICATION/.test(sessionText)) {
    fail(
      errors,
      "WORKOS_SESSION_CURRENT.md must record CONFIGURATOR_CURRENT_UI_UX = OWNER_APPROVED_IMPLEMENTED_APPLICATION",
    );
  }
  if (!/OTHER_PAGE_UI_UX_OWNER_ACCEPTANCE\s*=\s*NOT_GRANTED/.test(sessionText)) {
    fail(
      errors,
      "WORKOS_SESSION_CURRENT.md must record OTHER_PAGE_UI_UX_OWNER_ACCEPTANCE = NOT_GRANTED",
    );
  }
  if (!/PAGE_LEVEL_OWNER_ACCEPTANCE/.test(figmaWorkflowText)) {
    fail(
      errors,
      "WORKOS_FIGMA_WORKFLOW.md must separate UI20 direction from page-level Owner acceptance",
    );
  }
  if (!/OWNER_APPROVED_CURRENT_UI_UX_SURFACES\s*=\s*CONFIGURATOR_ONLY/.test(figmaWorkflowText)) {
    fail(
      errors,
      "WORKOS_FIGMA_WORKFLOW.md must record OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
    );
  }
  if (!/CONFIGURATOR_ONLY/.test(authorityMapText)) {
    fail(errors, "WORKOS_AUTHORITY_MAP.md must record CONFIGURATOR_ONLY page-level UI/UX Owner acceptance");
  }
  if (!/CONFIGURATOR_ONLY/.test(bootstrapText) || !/page-level Owner acceptance/.test(bootstrapText)) {
    fail(
      errors,
      "WORKOS_NEW_SESSION_BOOTSTRAP.md must preserve Configurator-only page-level Owner acceptance",
    );
  }
  if (!/OWNER_APPROVED_CURRENT_UI_UX_SURFACES\s*=\s*CONFIGURATOR_ONLY/.test(roadmapText)) {
    fail(
      errors,
      "living roadmap current state must record OWNER_APPROVED_CURRENT_UI_UX_SURFACES = CONFIGURATOR_ONLY",
    );
  }

  for (const text of [sessionText, figmaWorkflowText, authorityMapText, bootstrapText]) {
    for (const pattern of FORBIDDEN_BLANKET_PAGE_ACCEPTANCE) {
      if (pattern.test(text)) {
        fail(
          errors,
          "living continuity docs must not imply all UI20/WorkOS pages are Owner-accepted or rejected",
        );
      }
    }
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

export function verifyCursorWorkflowCiLaw(cursorWorkflowText, errors) {
  if (!/OWNER_APPROVAL_MODEL\s*=\s*SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION/.test(cursorWorkflowText)) {
    fail(
      errors,
      "WORKOS_CURSOR_WORKFLOW.md must record OWNER_APPROVAL_MODEL = SCOPE_AUTHORIZATION_NOT_COMMAND_AUTHORIZATION",
    );
  }
  if (!/ROUTINE_COMMAND_CONFIRMATION\s*=\s*FORBIDDEN/.test(cursorWorkflowText)) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must record ROUTINE_COMMAND_CONFIRMATION = FORBIDDEN");
  }
  if (!/ROUTINE_APPROVAL_PROMPTS\s*=\s*0/.test(cursorWorkflowText)) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must record ROUTINE_APPROVAL_PROMPTS = 0");
  }
  if (!/CUSTOM_HOOK_ASK\s*=\s*FORBIDDEN/.test(cursorWorkflowText)) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must record CUSTOM_HOOK_ASK = FORBIDDEN");
  }
  if (!/UNKNOWN_COMMAND_BEHAVIOR\s*=\s*DENY_REFORMULATE_AUTONOMOUSLY/.test(cursorWorkflowText)) {
    fail(
      errors,
      "WORKOS_CURSOR_WORKFLOW.md must record UNKNOWN_COMMAND_BEHAVIOR = DENY_REFORMULATE_AUTONOMOUSLY",
    );
  }
  if (!/EXACT_HEAD_RELEVANT_CI/.test(cursorWorkflowText)) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must record EXACT_HEAD_RELEVANT_CI");
  }
  if (/EXACT_HEAD_CI\s*=\s*REQUIRED BEFORE INTEGRATION/.test(cursorWorkflowText) && !/EXACT_HEAD_RELEVANT_CI/.test(cursorWorkflowText)) {
    fail(errors, "WORKOS_CURSOR_WORKFLOW.md must not keep the old undifferentiated exact-head CI law");
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
  const figmaWorkflow = readRepoFile(repoRoot, "docs/development/WORKOS_FIGMA_WORKFLOW.md");
  const framework = readRepoFile(repoRoot, "docs/architecture/CONFIGURATOR_V1_UI_FRAMEWORK.md");

  verifyReadmeIndex(readme, errors);
  verifyDocumentRoles(repoRoot, errors);
  verifyAuthorityMapPaths(repoRoot, authorityMap, errors);
  verifySessionCurrent(session, errors);
  verifyRoadmapFc1(roadmap, errors);
  verifyTerminologyConcepts(terminology, errors);
  verifyOwnerUpdateRule(agents, cursorWorkflow, errors);
  verifyCursorWorkflowCiLaw(cursorWorkflow, errors);
  verifyConfiguratorUiAuthority(framework, figmaWorkflow, authorityMap, session, errors);
  const bootstrap = readRepoFile(repoRoot, "docs/continuity/WORKOS_NEW_SESSION_BOOTSTRAP.md");
  verifyOwnerUiUxApprovalScope(session, figmaWorkflow, authorityMap, bootstrap, roadmap, errors);

  const guarded = [
    ...CLASSIFIED_DOCS,
    "docs/CURSOR_PLUGINS.md",
    "docs/README.md",
    "docs/worklog/WORKOS_DOCUMENTATION_AND_SESSION_CONTINUITY_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md",
    "docs/worklog/WORKOS_CI_TIERING_V1_IMPLEMENTED_LOCAL_IN_REVIEW.md",
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
