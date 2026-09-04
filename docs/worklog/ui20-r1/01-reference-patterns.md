# UI20-R1 — Reference patterns

25 analyzed patterns. Not 25 URLs. Public interaction models only. No brand cloning.

| # | SOURCE | PATTERN | SCREEN / INTERACTION | PRIMARY_USER_JOB | PRIMARY_OBJECT | WHY_IT_WORKS | BORROW | REJECT | WORKOS_APPLICATION | CONF |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: |
| 1 | Figma (product) | Selection owns inspector | Click layer → right context updates | Inspect the thing I just touched | Selected node | Context is bound to selection, not a second page | Context Lens; object continuity | Design-tool layers metaphor | Configurator + Product System + any selected role | 0.9 |
| 2 | Figma | Return to exact place | File → inspect → back | Resume work | Canvas + selection | The tool never reconstructs your place for you | Preserved selection/scroll | Infinite canvas as home | Cerere → Configurator → Cerere | 0.9 |
| 3 | Linear | Command speed | `Cmd-K` + issue key | Jump without IA archaeology | Issue | Navigation pleasure is a first-class object | Command/search of recent objects | Issue-tracker chrome | Launchpad + recent CER/OF/LUC | 0.8 |
| 4 | Linear | Status as language | Issue status change | Know what to do next | Issue | State is a verb, not a color chip | Action Morph | Startup accent palette | Cerere/Job next action | 0.85 |
| 5 | Raycast | Keyboard-complete work | Command list | Act without mouse | Command | Experts stay in flow | Keyboard on registries | Launcher as the whole app | Filter, select, open | 0.7 |
| 6 | SAP Fiori | Object page floorplan | Header + sections | Understand one business object | Business object | Named floorplans beat page-by-page invention | Floorplan family | Fiori tile launchpad / SAP visual | Object workspace | 0.85 |
| 7 | SAP Fiori | List-to-object | Worklist → object | Find then work | Row → object | Registries exist to exit | Registry → stable page | Nested list-in-list | Clienți / Cereri / Oferte | 0.9 |
| 8 | SAP Digital Manufacturing | Dispatch vs execute | Work center / POD | Start vs do | Operation | Starting and doing are different rooms | Atelier ≠ Execuție | Fake OEE gauges | J2 | 0.8 |
| 9 | Siemens IX | Industrial restraint | Industrial app shells | Work under pressure | Equipment / order | Calm density, status discipline | Restraint; status ≠ decoration | SCADA cosplay | All operational pages | 0.8 |
| 10 | ISA-101 / High-performance HMI | Color = exception | Alarm vs normal | Detect abnormal | Process | Gray normal, color only when needed | No-color survival | Control-room gray as brand | State matrix | 0.85 |
| 11 | Tulip | Station app | Operator station | Do one procedure | Station + job | Focused execution, few exits | Execution focus | App-builder widgets as WorkOS | Execuție | 0.75 |
| 12 | Ignition Perspective | Responsive industrial | Desktop / mobile views | Same job, different plane | View | Mental model survives breakpoint | 1440/1280/768 declared per floorplan | Widget dashboard | All floorplans | 0.7 |
| 13 | IBM Carbon | Productive density | Data table + batch | Scan many rows | Collection | Type and table do the work | Density system; tables | IBM enterprise chrome | Registries, ledger | 0.8 |
| 14 | PatternFly | Empty / error / filter | Collection pages | Recover from no-data | Collection | Honest empty is orientation | Empty/error patterns | Widget walls | All registries | 0.85 |
| 15 | AWS Cloudscape | Split / help panel | Console + tools panel | Keep object, open help | Resource | Context without leaving | Optional split lens | AWS IA / density | Inspector, not second route | 0.7 |
| 16 | Fluent | Commanding | Command bar morph | Available actions change | Document / list | Actions follow state | Action Morph | Office look | Request / Job CTAs | 0.8 |
| 17 | Atlassian | Object lineage | Jira issue links | See related work | Issue | Related objects without losing the current one | Related-object navigation | Ticket soup | Client/Cerere/Ofertă/Lucrare | 0.75 |
| 18 | Fusion / Onshape | Feature / component tree | Browser + properties | Understand construction | Feature / part | Structure first, properties second | Construction workspace | CAD history as product law | Configurator / Product System | 0.85 |
| 19 | SolidWorks (public concepts) | Assembly vs part | Assembly context | See whole vs detail | Assembly | Whole-object is not a fifth part | Open footing / whole product | Mechanical mates | Produs întreg ≠ role | 0.8 |
| 20 | n8n | Selected node inspector | Graph click | Edit one step | Node | Graph + panel, not graph-only | Selected relation | Graph as commercial OS | Construction / process later | 0.7 |
| 21 | Node-RED | Side panel on select | Flow editor | Configure selected node | Node | Selection is the form | Contextual configuration | Wiring as journey | Configurator | 0.7 |
| 22 | Camunda / BPMN | Stage vs token | Process diagram | Where is this instance | Process instance | Journey is instance position, not a template picture | Honest current/future/blocked | BPMN notation in operator UI | Journey Rail | 0.8 |
| 23 | PatternFly Topology | Too-much-graph | Topology view | See dependencies | Nodes/edges | Graphs die when everything is a node | Use graph only for construction/capability | React Flow as default page | Machines later | 0.75 |
| 24 | Oracle Manufacturing (public) | Work order vs resource | WO + resource pages | Plan vs consume | Work order | Order owns commercial/production; resource owns rate | Object ownership | ERP form stacks | Quote/Job vs Resources | 0.7 |
| 25 | Rockwell / Plex (public) | Operator worklist | Production worklist | What can I start | Operation | Dispatch is a list of startable work | Atelier inbox | Plant-map home | Atelier | 0.7 |
| 26 | ServiceNow (public) | Record + related lists | Workspace | One record, many relations | Ticket / CI | Related stays secondary | History compression | ITSM chrome | Job related quotes/requests | 0.65 |

Extra (justified, not padding):

| # | SOURCE | PATTERN | WHY | WORKOS |
| --- | --- | --- | --- | --- |
| 27 | Figma Motion | Path trim / one-shot | Reveal is better than loop | SelectedRelation; LOOP forbidden |
| 28 | Notion (limited) | Slash / progressive blocks | Only for long writing | Reject as OS; maybe notes later |
| 29 | Microsoft Fluent motion | Short semantic timing | Motion explains state | 100–200 ms one-shot |

```text
REFERENCE_PATTERN_COUNT = 29
PATTERNS_ANALYZED = 26_CORE + 3_SUPPORT
VISUAL_CLONING = NO
```
