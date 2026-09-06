# 05 — Figma source map (read-only)

```text
FIGMA_FILE     = 0XP0yGa1siWQdTTL7ou8xz
FIGMA_READ     = YES
FIGMA_WRITE    = NO
VARIABLE_DEFS  = EMPTY on 233:69 via MCP get_variable_defs
```

MCP page list returned only `0:1` **00 — North Star**. Accepted nodes on other pages **do resolve** when queried by ID. Do not treat the page list as a full sitemap.

## Inspected accepted nodes

| Role | Node | Observed name | Kit implication |
|---|---|---|---|
| FINAL IA stamp | `229:66` | OWNER ACCEPT · FINAL UI20 IA · 2026-09-06 | IA3 + Candidate A + no L1 sidebar |
| Candidate A shell 1440 | `224:96` | IAF1A / A NORMAL GLOBAL STATE / 1440 | Quiet 48px bar; **Acasă + Search drawn** — runtime hides both |
| Comercial L2 | `224:115` | IAF1A / B COMERCIAL L2 OPEN / 1440 | Clienți · Oferte · Catalog; Cereri not in L2 |
| Mai multe | `225:66` | IAF1A / C SECONDARY DESTINATIONS OPEN / 1440 | One secondary mechanism; Utilaje/Stoc only if enabled |
| Cont / Admin entry | `225:90` | IAF1A / D ACCOUNT ADMIN ENTRY / 1440 | Cont → Administrare → local admin nav |
| Operator reduced chrome | `222:66` | IAF1 / WORKSHOP FOCUS | Brand + job + return; Owner L1 clutter disappears |
| Visual DNA | `233:69` | VIS1 / VISUAL DNA | Direction board; no published variables via MCP |
| VIS1 section | `233:66` | (parent of DNA; IR1 lock) | Do not overwrite |
| Cerere 1440 | `239:69` | VIS1A / CERERE / 1440 | knownPlane + unPlane + AttentionEdge + 44px CTAs + objStrip |
| Cerere 768 | `241:161` | VIS1A Cerere 768 (accepted) | Sequential Resolution Field |
| Config 1440 | `234:103` | VIS1 / NORTH STAR / CONFIG · 1440 LIGHT | Composition + Lens; specimen uses FAȚĂ/VOLUM/SPATE/ILUMINARE |
| Config 1280 | `240:66` | VIS1A / CONFIG / 1280 | Composition survives pressure; Search omitted in this frame |
| Config 768 | `241:66` | VIS1A Config 768 | Must remain composition, not a form dump |
| Ofertă 1440 | `235:66` | VIS1 / NORTH STAR / OFERTA · 1440 LIGHT FROZEN | Centered sheet + frozen marker |
| Ofertă 768 | `241:100` | VIS1A Ofertă 768 | Sheet compress, not card wall |
| Lucrare 1280 | `240:115` | VIS1A Lucrare 1280 | Traveler |
| Client Hub 1280 | `240:160` | VIS1A Client Hub 1280 | Relationship workspace |
| Atelier 1280 | `240:198` | VIS1A Atelier 1280 | Dispatch floor |
| Execution 768 | `241:202` | VIS1A Execution 768 | Workstation |
| Owner final board | `242:66` | VIS1A Owner Final Visual Board | Acceptance surface |
| Control board | `242:941` | VIS1A / CONTROL COMPARISON | Includes historical sidebar preview — **not** living shell |

North Star page `0:1` still says R5 “not Owner-accepted visual”. Living acceptance is VIS1/VIS1A + Final IA stamps, not that banner.

## Figma vs runtime chrome (intentional)

| Figma still shows | Runtime RW1 law |
|---|---|
| Acasă L1 | Hidden until RW6 |
| Search / ⌕ | Not rendered until functional |
| Object strip copy | Primitive exists; unpopulated |
| Deep green as page primary | Shell accent only; bodies still legacy blue |
| LETTERS role tiles in Config | Must not become kit anatomy |

## Existing screenshot evidence (reuse, do not duplicate)

`docs/worklog/ui20-rw1/evidence/MANIFEST.md` maps 1440/1280/768/dark jobs/requests to `224:96`.  
VIS1/VIS1A packs remain in those worklogs. KIT1 adds no giant pack.
