# 11 — Smart modularity guard

```text
NO_CLIENT_CODE_FORK                 = YES
NO_PRODUCT_CODE_HARDCODED_IN_KIT    = YES
NO_DISABLED_MODULE_EMPTY_NAV        = YES_AS_FUTURE_CONTRACT
KIT                                 = shared product grammar
NOT                                 = HUB MEDIA configuration
```

The kit represents WorkOS product grammar. It must not encode one customer's modules as universal UI.

## Scenarios the kit must survive

| ID | Scenario | Kit law |
|---|---|---|
| A | Advanced production company | Mai multe may show Resurse + Oameni + Utilaje + Stoc when **visibility truth** enables them |
| B | Smaller commercial/manual company | L1 still Cereri · Comercial · Lucrări; empty modules hidden; no Coming Soon |
| C | Machines disabled | No empty Utilaje group; no kit floorplan that requires machines |
| D | Stock disabled | No empty Stoc destination |
| E | Execution disabled | No fake Execution L1; Atelier/Exec reduced chrome only when those routes exist |
| F | Later module enablement | Adding a destination must not require a forked kit; use visibility slots |
| G | Different ProductTemplate | Config composition binds to `template.components` / form schema. ACM without VOLUME/LIGHTING is valid |

## Runtime honesty (do not hide)

`visibleNavigation.ts` can filter by capability, but `AppShell` does not pass organization capabilities, and registry `requiredCapability` is currently null (IR1 accepted carry).  

RW1 preserved existing visibility truth. The kit must **draw the contract** (hide empty), not invent HUB MEDIA flags.

## Product-specific hard stop (never generic kit)

- LETTERS FACE / VOLUME / BACK / LIGHTING as universal component anatomy
- ACM-specific geometry
- Pricing / cost / readiness formulas
- Machine / people / stock requirements as kit furniture
- Quote or execution lifecycle rules as foundations

Those belong to domains and page composition.

## Classification law for every future Figma element

Every element must be tagged as one or more of:

`FOUNDATION` · `GENERIC_CONTROL` · `SEMANTIC_PRIMITIVE` · `PAGE_SPECIFIC_PATTERN` · `RUNTIME_EXISTING` · `RUNTIME_NEEDS_CALIBRATION` · `LEGACY_TRANSITIONAL` · `DEPRECATED_LATER`

No unclassified design-system furniture.

## Variant discipline

Variants only for real semantic state (selected, blocked, frozen, disabled, error).  
Forbidden: 12 button colors, 7 card sizes, decorative loading, unused icon families.
