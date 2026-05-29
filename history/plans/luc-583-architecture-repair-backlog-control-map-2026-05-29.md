# LUC-583 Architecture Repair Backlog Control Map

Last updated: 2026-05-29
Source issue: `LUC-583 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
Backlog source: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`
Execution baselines: `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`, `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`
Status: `control_map_refreshed`

## Goal
Refresh executable architecture-repair backlog ownership and blocker truth for current PM routing.

## Executable Control Map
| Backlog ID | Execution lane | Status | Owner | Next action | Blocker class |
| --- | --- | --- | --- | --- | --- |
| ARB-001 | `LUC-385` | blocked_on_decision | Product + CTO | Publish explicit activation-scope decision for assistant hot-path rollout before reopening implementation. | decision_gate |
| ARB-002 | `LUC-386` | done_gated | PM + Docs Memory | Keep as closed baseline. Reopen only when `DEC-ARB-002` trigger is met: Product/CTO-approved mobile issue is `in_progress` and includes non-scaffold runtime scope in `apps/mobile`. | decision_gate |
| ARB-003 | `LUC-387` | done | PM + QA/Test | Keep module confidence + requirement parity checks in future edits. | none |
| ARB-004 | `LUC-388` | done | PM + UX | Keep scorecard rows explicit and dated (no template placeholders). | none |
| ARB-005 | `LUC-389` | done | PM + Delivery | Keep CI validator/checklist enforcement active in reruns. | none |
| ARB-006 | `LUC-402` | blocked_on_protected_inputs | Delivery + Security/Test + Ops | Create/assign `ARB6-EV-001..008` child issues from the register and execute bounded protected/public evidence runs. | protected_input_gate |
| ARB-007 | `LUC-403` | done | PM + Docs Memory | Keep guard text in high-traffic docs entrypoints; reopen only on drift. | none |
| ARB-008 | `LUC-404` | done | PM + Backend/QA | Keep exchange capability regression suite in focused pack after boundary changes. | none |

## Remaining Blockers
1. `ARB-001` (`LUC-385`): blocked on Product/CTO activation decision.
2. `ARB-006` (`LUC-402`): blocked on protected-input ownership and child execution issuance.

## Closure Rule For This PM Lane
- `LUC-583` is complete when this control map reflects canonical backlog/execution artifacts and project state files are synchronized.
- Specialist implementation remains delegated to owner lanes.
