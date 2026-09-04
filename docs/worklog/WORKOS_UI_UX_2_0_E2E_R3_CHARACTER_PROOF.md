# WorkOS UI/UX 2.0 E2E — R3 high-fidelity character proof

```text
PROGRAM = WORKOS_UI_UX_2_0_E2E
WAVE = UI20_R3_HIGH_FIDELITY_CHARACTER_PROOF
STATUS = CHARACTER_PROOF_IN_REVIEW
R3A = TARGETED_AMENDMENT_COMPLETE
UI20_R2 = RESEARCH_ACCEPTED_WITH_ADVISORIES
UI20_LEADING_VISUAL_HYPOTHESIS = G_LIVING_FABRICATION_INSTRUMENT
UI20_LEADING_IA_HYPOTHESIS = IA3_QUIET_DESTINATIONS_OBJECT_CONTINUITY
UI20_CURRENT_VISUAL_DIRECTION = NOT_SELECTED
UI20_CURRENT_IA = NOT_SELECTED
OWNER_ACCEPTED_VISUAL_DIRECTION = NO
OWNER_ACCEPTED_IA = NO
G = LEADING_RESEARCH_HYPOTHESIS
IA3 = LEADING_RESEARCH_HYPOTHESIS
G1 = PREFERRED_BASE_FOR_CORRECTION
G2 = LOCAL_ENERGY_REFERENCE_ONLY
H = NOT_CREATED
A3_1 = RESEARCH_INPUT_NOT_CANON
REACT = HOLD
PRODUCT_SYSTEM = HOLD
MACHINES = HOLD
OS_S8 = HOLD
UI_CODE_WRITE = NO
FIGMA_LIBRARY_PUBLISH = NO
CURSOR_MAY_NOT_OWNER_ACCEPT = YES
NEXT_STEP = CHATGPT_INDEPENDENT_UI20_R3A_REVIEW
```

```text
ROADMAP_READ = YES
UI_UX_CANON_READ = YES
ATELIER_CANON_READ = YES
DIRECTION_CONFLICT = NO
```

## Identity

```text
R2_PR = 14
R2_PR_HEAD = 87ccfb760e6eb203b6250a13c666cb85653f8e04
R2_STRICT_FF = YES
R2_INTEGRATED_HEAD = 87ccfb760e6eb203b6250a13c666cb85653f8e04
R2_CLOSURE_HEAD = 58bd8279fedfdf549d0e68c884a369768b9ab282
R3_BRANCH = design/ui20-r3-character-proof
R3_BASE_HEAD = 58bd8279fedfdf549d0e68c884a369768b9ab282
R3_PR = 15
R3_HEAD_BEFORE_R3A = f07a31f3ca73fbd5ffc34aba21ee89bd311b05d1
FIGMA_FILE = WorkOS UI UX 2.0 — E2E
FIGMA_FILE_KEY = 0XP0yGa1siWQdTTL7ou8xz
```

## Question answered

Can the WorkOS design DNA become a memorable, fast, operational product?

R3 tests that in real screens. R3A is a targeted correction on the same proof, not a new research wave. It does not select a final visual direction. It does not authorize React.

## Hygiene

`figma.root.children` order after R3A:

`00 01 02 03 04 05 10 20 30 40 50 80 90 99`

Page IDs: `0:1 1:2 1:3 1:4 1:5 1:6 1:7 1:8 1:9 1:10 1:11 1:12 1:13 1:14`.

Independent Plugin API had previously reported `40` before `20`/`30` and `99` before `90`. R3A reordered the live file. Documentation now matches `figma.root.children`, not the intended list alone.

R1 matrix `10:78` remains on `90` and labelled historical. Current matrix is `28:2` on `00`.

## R3A — what was corrected

Independent R3 review required a targeted amendment. R3 did not fail as a character wave. These concrete defects were closed:

1. Atelier contradicted `OPERATOR_TASK_INBOX_ATELIER_CANON.md` (dispatch / assignment language).
2. Ofertă Dark `35:57` and Execuție Dark `35:2` were visually invalid (white planes, unreadable contrast).
3. Visible design/research jargon remained in product copy.
4. Stress tests were written as if they had passed; R3 had not produced controlled evidence.
5. Actual Figma page order differed from `FRAMES.md`.
6. WorkOS signature improved but stayed below the research 8.5 bar. R3A refined G1 only. No H.

## Proof screens

| Screen | Current node | Previous node | Page |
| --- | --- | --- | --- |
| G1 Cerere 1440 Light | `29:2` | same | 10 |
| G2 Cerere 1440 Light | `30:2` | same | 10 |
| Configurator 1440 Light | `31:2` | same; copy corrected | 10 |
| Ofertă 1440 Light | `32:2` | same; copy corrected | 10 |
| Ofertă frozen | `32:61` | same; copy corrected | 10 |
| Ofertă Dark | `46:135` | `35:57` hidden | 10 |
| Cerere 768 | `34:2` | same | 10 |
| Configurator 768 | `34:20` | same | 10 |
| Atelier 1440 Light | `46:2` | `29:84` hidden | 20 |
| Execuție 1440 Light | `30:86` | same; copy corrected | 20 |
| Execuție Dark | `46:101` | `35:2` hidden | 20 |
| Atelier 768 | `46:72` | `32:172` hidden | 20 |
| Resurse 1440 Light | `29:149` | same; copy corrected | 30 |
| Resurse 768 | `32:147` | same | 30 |
| Command Layer | `35:29` | same; copy corrected | 80 |
| IA-3 flow storyboards | `35:51` | same | 80 |
| Motion SELECT | `35:99` | same | 04 |
| Motion FREEZE | `35:105` | same | 04 |
| Motion Atelier→Execuție | `35:111` | same | 04 |

Prototype reactions: Cerere `29:81` → Configurator `31:2`; back `35:95` → Cerere `29:2`; Ofertă `32:57` → frozen `32:61`; Atelier Continuă `46:42` → Execuție `30:86`. Old Atelier start `35:114` is retired with the hidden R3 Atelier frame.

## Atelier — current-operator inbox

Canonical read model, not a manager staffing screen:

- **În lucru la mine** → **Continuă**
- **Disponibile pentru mine** → ready + `canClaimStart` → **Pornește**; provider/machine missing → visible, not startable, local cause
- **Urmează** → eligible, dependency incomplete

Removed: “Alege un operator eligibil sau amână montajul.”, “Dispecerizare”, “Lipsește operator eligibil” as a staffing reason.

Kept: one scan list (not a three-column dashboard), quiet normal rows, local blocker, disclaimer *Ordinea de afișare nu reprezintă programare sau prioritate de producție.*, lead **Munca mea**.

Evidence: `docs/worklog/ui20-r3/evidence/r3a-atelier-1440.png`, `r3a-atelier-768.png`.

## Dark — real compositions

R3 dark nodes failed visual review. R3A rebuilt both as complete dark compositions on designed charcoal neutrals, cream primary ink, no neon / LED glow / cyberpunk.

Evidence: `r3a-oferta-dark-1440.png`, `r3a-executie-dark-1440.png`. Text in the exported screenshots is readable. Large white planes are gone.

## Product copy

Visible research/meta phrases were removed from current product frames. Interaction law remains; pattern names do not appear in UI.

Command search is `Caută în WorkOS…` with `Ctrl+K / ⌘K`. Frozen Ofertă states Înghețată, revision, provenance, and that a later change is a new offer. No invented revision-creation action.

## Cursor recommendation (not Owner accept)

Carry the six-page family in **G1 Calm Precision**. Keep G2 as a local-energy reference around current work only. Do not create H. Do not Owner-accept G or IA-3. Do not implement React.

Independent Cursor WORKOS_SIGNATURE estimate after R3A: **7.6**. Not 8.5. Not Owner truth. The identity edge, inbox model, and operational copy raise recognizability; they do not yet make the family automatic without the wordmark.

## Stress / speed — factual evidence

R3 docs previously described these as if they had passed. That was too strong. R3A created controlled clones on page 80 and scored only what was inspected.

| Test | Status | Evidence | Note |
| --- | --- | --- | --- |
| LOGO_OFF | PASS | `49:2` · `r3a-cerere-logo-off.png` | Cerere still reads as a clarification sheet: known/missing, local block, object id. |
| TITLE_OFF | PASS | `49:324` · `r3a-atelier-title-off.png` | Atelier still reads as the current-operator inbox via lanes and actions. `MUNCA MEA` hidden. |
| GRAYSCALE | PASS | `49:624` · `r3a-resurse-grayscale.png` | Resurse clone has 0 chromatic fills. Ledger columns and selected material identity survive. |
| MOTION_OFF | PASS | `49:704` / `49:764` · live + frozen PNGs | Freeze remains a structural state without animation: controls retreat, Înghețată, no edit. |
| ANONYMITY | PASS | judged from LOGO_OFF | Distinguishable as this instrument family, not a CRM. Residual generic industrial-SaaS risk remains. |
| CONTAINER_OFF | NOT_TESTED | — | No controlled containerless variant was built. |
| ROMANIAN_LENGTH | PASS | 1440 + 768 proofs | Long verbs wrap. |
| FABRICATION_AUTHENTICITY | PASS | fixture-safe LETTERS facts | No invented stock, selling price, or named machine. |

Additional stress clones exist (`49:86` Cerere TITLE_OFF, `49:170` Cerere GRAYSCALE, Atelier LOGO_OFF/GRAYSCALE, Resurse LOGO_OFF/TITLE_OFF). They were created for completeness. Scores above use the inspected representative set required by R3A.

## Product System / Machines

Still HOLD. Configurator is a banc, not A3.1-as-OS. Atelier does not invent machine contracts and does not require manager dispatch.

## Smart modularity

Re-checked after the Atelier correction:

- Advanced manufacturing and small/manual companies share the same inbox instrument.
- Unused machines do not create a visual fork.
- Inventory disabled does not change Atelier.
- Execution disabled is a later capability, not a HUB-specific skin.
- Different ProductTemplates reuse construction-first configuration.
- Manual ready work stays startable. Machine-required work stays locally blocked when genuinely required.

## Pack

`docs/worklog/ui20-r3/` plus evidence under `docs/worklog/ui20-r3/evidence/`. R3A files are prefixed `r3a-`.
