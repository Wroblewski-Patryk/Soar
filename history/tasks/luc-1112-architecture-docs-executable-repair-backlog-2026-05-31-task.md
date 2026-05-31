# Task

## Header
- ID: LUC-1112
- Title: `[Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Priority: P1
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: CHECKPOINTED

## Context
LUC-1112 requires a fresh architecture-repair backlog map with executable ownership and current blocker truth, without implementing specialist code lanes.

## Goal
Produce a durable, execution-ready control map from architecture backlog artifacts and synchronize project source-of-truth state.

## Scope
- `history/plans/luc-1112-architecture-repair-backlog-control-map-2026-05-31.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Re-read canonical ARB backlog/control-map artifacts and decision gates.
2. Reconcile each `ARB-001..ARB-008` row to a live execution lane, owner, and blocker class.
3. Publish the refreshed LUC-1112 control map.
4. Synchronize `TASK_BOARD` and `PROJECT_STATE` with outcome and next legal action.

## Acceptance Criteria
- A new `LUC-1112` control map exists and maps `ARB-001..ARB-008` to owner/status/action.
- Active blockers and decision-gated rows are explicitly separated.
- Context files record wake handling, concrete action, evidence links, and final disposition.

## Definition of Done
- [x] Backlog conversion artifact published for `LUC-1112`.
- [x] Source-of-truth context synchronized (`TASK_BOARD`, `PROJECT_STATE`).
- [x] Final disposition is explicit and evidence-backed.

## Validation Evidence
- Commands:
  - `rg -n "LUC-919|ARB-|DEC-ARB-001|DEC-ARB-002|LUC-402" .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md history/plans -S`
- Manual proof:
  - Reconciled ARB lineage against existing execution/control-map documents.
- Reality status: verified

## Result Report
- Task summary:
  - Converted architecture docs into an updated executable repair backlog for `LUC-1112` by publishing a fresh control map and syncing canonical context.
- Files changed:
  - `history/plans/luc-1112-architecture-repair-backlog-control-map-2026-05-31.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-1112-architecture-docs-executable-repair-backlog-2026-05-31-task.md`
- How tested:
  - Read-only lineage reconciliation and cross-file grep consistency checks.
- What is incomplete:
  - Specialist execution for `ARB-006` child evidence tasks remains blocked on protected-input gate ownership.
- Next steps:
  - Delivery + Security/Test + Ops issue and execute `ARB6-EV-001..008` under `LUC-402`.
- Decisions made:
  - `ARB-001` and `ARB-002` remain `done_gated`; only `ARB-006` remains active blocker.
