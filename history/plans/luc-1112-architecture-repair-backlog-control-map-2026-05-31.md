# LUC-1112 Architecture Repair Backlog Control Map

Last updated: 2026-05-31
Source issue: `LUC-1112 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
Backlog source: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`
Execution baselines: `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`, `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`, `history/plans/luc-919-architecture-repair-backlog-control-map-2026-05-30.md`
Status: `control_map_refreshed`

## Goal
Reconfirm executable architecture-repair backlog ownership and publish the live unblock path for current PM routing.

## Executable Control Map
| Backlog ID | Execution lane | Status | Owner | Next action | Blocker class |
| --- | --- | --- | --- | --- | --- |
| ARB-001 | `LUC-385` + `LUC-616` | done_gated | Product + CTO + AI Runtime | Keep `DEC-ARB-001` fail-closed scope; reopen only with explicit post-V1 activation lane. | decision_gate |
| ARB-002 | `LUC-386` + `LUC-633` | done_gated | PM + Docs Memory | Keep `DEC-ARB-002` trigger contract; reopen only when mobile runtime activation is explicitly `in_progress`. | decision_gate |
| ARB-003 | `LUC-387` | done | PM + QA/Test | Preserve exact web test-table parity in future module edits. | none |
| ARB-004 | `LUC-388` | done | PM + UX | Keep scorecard rows dated and explicit; no placeholder metrics. | none |
| ARB-005 | `LUC-389` | done | PM + Delivery | Keep docs parity and route-audit gate enforced in CI/checklists. | none |
| ARB-006 | `LUC-402` | blocked_on_protected_inputs | Delivery + Security/Test + Ops | Issue and execute `ARB6-EV-001..008` child evidence tasks with approved protected/public inputs. | protected_input_gate |
| ARB-007 | `LUC-403` | done | PM + Docs Memory | Keep "history is evidence, not active owner" guard text at high-traffic entrypoints. | none |
| ARB-008 | `LUC-404` | done | PM + Backend/QA | Keep exchange capability regression suite in focused proof after contract changes. | none |

## Remaining Blockers
1. `ARB-006` (`LUC-402`) remains the only active architecture-repair blocker and is blocked on protected input ownership plus `ARB6-EV-001..008` issuance/execution.

## Decision-Gated (Not Active Blockers)
1. `ARB-001` is decision-gated by accepted `DEC-ARB-001`.
2. `ARB-002` is decision-gated by accepted `DEC-ARB-002`.

## Closure Rule For This PM Lane
- `LUC-1112` is complete when this control map reflects canonical backlog truth and source-of-truth context files are synchronized.
- Implementation remains delegated to owning specialist lanes.
