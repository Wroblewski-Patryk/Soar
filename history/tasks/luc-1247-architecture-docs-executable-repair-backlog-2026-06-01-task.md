# Task

## Header
- ID: LUC-1247
- Title: `[Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Priority: high
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: CHECKPOINTED

## Context
Wake reason is `issue_assigned` with inline payload and no pending comments (`0/0`, `fallbackFetchNeeded=false`). This lane owns planning conversion only: refresh architecture docs into executable backlog control truth.

## Goal
Publish a current executable control map for `ARB-001..ARB-008` and synchronize source-of-truth state for this heartbeat.

## Constraints
- Planning/state only; no runtime, deploy, or protected-input mutation.
- Stay inside PM role boundaries; no specialist implementation takeover.
- Keep fail-closed blocker truth unless fresh unblock evidence exists.

## Definition of Done
- [x] `LUC-1247` control map exists with owner/status/action for `ARB-001..ARB-008`.
- [x] Active blockers and decision-gated rows are explicitly separated.
- [x] `TASK_BOARD` and `PROJECT_STATE` include this heartbeat result and disposition.

## Forbidden
- Re-implementing closed specialist lanes.
- Reclassifying blocked rows as done without new evidence.
- Leaving issue disposition ambiguous.

## Implementation Plan
1. Re-read canonical architecture repair backlog and latest control-map lineage.
2. Reconcile each `ARB-001..ARB-008` row to live owner, status, and blocker class.
3. Publish refreshed `LUC-1247` control-map artifact.
4. Synchronize canonical context files with final disposition and next legal action.

## Acceptance Criteria
- `history/plans/luc-1247-architecture-repair-backlog-control-map-2026-06-01.md` exists and references canonical backlog/control-map lineage.
- Control map keeps `ARB-006` as active blocker and `ARB-001/ARB-002` as decision-gated rows.
- Context files record wake handling, concrete action, evidence links, and `done` disposition.

## Validation Evidence
- `rg -n "LUC-1247|ARB-006|DEC-ARB-001|DEC-ARB-002|control_map_refreshed" history/plans/luc-1247-architecture-repair-backlog-control-map-2026-06-01.md history/tasks/luc-1247-architecture-docs-executable-repair-backlog-2026-06-01-task.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary:
  - Converted architecture docs into a refreshed executable repair backlog control map for `LUC-1247` and synchronized canonical project state files.
- Files changed:
  - `history/plans/luc-1247-architecture-repair-backlog-control-map-2026-06-01.md`
  - `history/tasks/luc-1247-architecture-docs-executable-repair-backlog-2026-06-01-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - Specialist execution for `ARB-006` under `LUC-402` remains blocked on protected-input ownership and child evidence lanes.
- Next steps:
  1. Delivery/PM creates or refreshes `ARB6-EV-001..008` child issues under `LUC-402`.
  2. Security/Test + Ops execute bounded evidence checkpoints for ready child lanes.
  3. Keep `ARB-001` and `ARB-002` closed behind explicit decision-gate triggers.
- Decisions made:
  - `ARB-001` and `ARB-002` remain `done_gated`; `ARB-006` remains the sole active architecture-repair blocker.

## Continuation Delta (finish_successful_run_handoff)
- 2026-06-01: Anti-drift revalidation rerun confirmed unchanged control truth and blocker routing (ARB-006 via LUC-402 remains the only active blocker).
- Wake disposition: done.

## Continuation Delta (source_scoped_recovery_action)
- 2026-06-01: Reconciled latest wake payload with canonical artifacts and confirmed unchanged routing (`ARB-001/ARB-002` remain `done_gated`; `ARB-006` remains the only active blocker through `LUC-402`).
- No additional implementation/delegation lane was opened in this heartbeat because `LUC-1247` remains planning-complete and execution ownership is already routed to blocker owner lanes.
- Wake disposition: done.
