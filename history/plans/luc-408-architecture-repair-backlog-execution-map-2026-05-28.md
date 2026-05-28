# LUC-408 Architecture Repair Backlog Execution Map

Last updated: 2026-05-28
Source issue: `LUC-408 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
Backlog source: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`
Status: `execution_mapped`

## Goal
Turn the architecture repair backlog (`ARB-001..ARB-008`) into an execution-ready map with one owner lane, concrete next action, and tracked disposition per row.

## Execution Map
| Backlog ID | Current execution issue/lane | Current status | Next owner | Next concrete action | Blocker class |
| --- | --- | --- | --- | --- | --- |
| ARB-001 | `LUC-385` | blocked_on_decision | Product + CTO | Publish explicit activation scope decision for hot-path assistant rollout. | decision_gate |
| ARB-002 | `LUC-386` | done | PM + Docs Memory | Keep as completed baseline; reopen only when mobile implementation scope expands. | none |
| ARB-003 | `LUC-387` | done | PM + QA/Test | Keep test-table mapping in parity checks for future module edits. | none |
| ARB-004 | `LUC-388` | done | PM + UX | Keep scorecard metric rows non-template and dated in later reviews. | none |
| ARB-005 | `LUC-389` | done | PM + Delivery | Keep parity enforcement in validator/guardrail contract. | none |
| ARB-006 | `LUC-402` | blocked_on_protected_inputs | Delivery + Security/Test + Ops | Create/assign `ARB6-EV-001..008` child execution issues from the register and run bounded protected evidence checkpoints. | protected_input_gate |
| ARB-007 | LUC-403 | backlog_ready | Docs Memory | Start the existing Docs Memory lane to add explicit "history is evidence, not active ownership" guard language in high-traffic entry docs. | none |
| ARB-008 | `LUC-404` | done | PM + Backend/QA | Keep regression suite in focused contract pack and re-run after exchange capability changes. | none |

## Immediate Delegation Queue
1. Start `LUC-403` for `ARB-007` (Docs Memory lane, low-coupling closure).
2. Trigger ARB-006 child execution issue creation from `ARB6-EV-001..008` register.
3. Hold ARB-001 until Product/CTO decision lands; do not widen implementation before decision.

## Closure Rule For This Planning Lane
- This issue is complete when every ARB row has a tracked execution lane or an explicit blocker owner/action in this map.
- Implementation and verification remain delegated to specialist lanes.
