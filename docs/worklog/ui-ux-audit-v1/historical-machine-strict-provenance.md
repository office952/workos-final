# Historical Machine Strict evidence — provenance only

These files were captured in an earlier isolated Machine Strict build. They are **not** newly captured in this correction. They are reused only for IA states that this session did not recapture: manual task startable without a machine, in-progress task, and completed task.

Source worklog: `docs/worklog/WORKOS_MACHINE_STRICT_MANUAL_WORK_AREAS_FLEXIBLE_V1.md`

Fixture: isolated `.tmp/machine-strict-qa` job `QAE23` / person `QA Evidence Skilled` (synthetic). Not the real Cloud root.

| File | SHA-256 | Visible assertion | IA state |
| --- | --- | --- | --- |
| `docs/worklog/screenshots/machine-strict-v1/04-machine-start-blocked.png` | `913efae6341dce35d5fed7716beae2734d001757bb0b3405d13e32f48bce7c84` | Task 02 Debitare foaie CNC; `Alocă mai întâi utilajul` | machine-blocked (task card) |
| `docs/worklog/screenshots/machine-strict-v1/06-led-startable-without-table.png` | `a1d2e8dcc010dfaa9768377b5ac6915ff00fd10db26969140287a5528bdc5487` | Task 03 Montare module LED `Pornește`; Task 01 Finalizat | manual startable + completed FACE/BACK CNC |
| `docs/worklog/screenshots/machine-strict-v1/08-led-started-without-table.png` | `0fbeb6f15e606cbe9d7b0d5c1416c3417a8e5ebd054fe82b671554ae79652005` | Task 03 `În lucru`; `Finalizează` | in-progress manual task |
| `docs/worklog/screenshots/machine-strict-v1/07-led-unskilled-blocked.png` | `130b9e5bfb2118eb8323651795f008ff337ee1fe2ddd31b10ff957e27a90aba1` | unskilled operator cannot start LED | ineligible skill (historical) |
| `docs/worklog/screenshots/machine-strict-v1/05-back-cnc-in-progress-face-blocked.png` | `f0ca264b1cbdef9c0dabbd1a78b548cfa59a3adb46512365ad457876a9e77ad4` | BACK CNC in progress; FACE blocked | in-progress + blocked sibling |
| `docs/worklog/screenshots/machine-strict-v1/09-atelier-inbox.png` | `5b39776254d14ff73843d52a483aa82d45756e8999ac11e098c3512d2aeb7d1c` | Atelier inbox with session tasks | populated atelier (historical) |

This correction **newly** captured on isolated fixture AUD8389 / Operator Eligible / Operator Ineligible:

- populated Atelier inbox
- machine-blocked execution workspace
- ineligible operator on execution
- eligible operator session
- invalid PIN modal (`PIN greșit.`, PIN masked)

```text
HISTORICAL_MACHINE_STRICT_PIXELS =
REFERENCE_ONLY_NOT_PART_OF_ACCEPTED_283_PNG_PACK
```

Do not count the historical files in `CAPTURED_ROWS` / `ACTUAL_PNG` for `screenshot-manifest.csv`. Later Figma and canon work must not treat these as captures of the accepted pack.
