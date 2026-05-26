# Task

## Header
- ID: LUC-193
- Title: [Soar] Autonomous idle and map drift sweep
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Docs-memory lane checkpoint to keep Soar source-of-truth aligned with idle-lane
status rules and route/view ownership map truth.

## Goal
Run one bounded autonomous sweep that confirms:
1. no passive idle-lane `in_progress` drift in active state docs, and
2. no route-family map drift between canonical route docs and current web pages.

## Scope
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`
- `docs/status/view-map-browser-workflow-ownership.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `apps/web/src/app/**/page.tsx`

## Implementation Plan
1. Re-read idle-lane rule source entries in state files.
2. Re-run route map drift command against current `page.tsx` inventory.
3. Compare route families with canonical dashboard route map.
4. Record durable sweep result in source-of-truth files.

## Acceptance Criteria
- Idle-lane operating rule remains explicit and unambiguous in active state docs.
- Route-family drift status is recorded with date and evidence command.
- Sweep disposition is durable in `TASK_BOARD` and `PROJECT_STATE`.

## Definition of Done
- [x] Idle-lane status rule rechecked and captured.
- [x] Route-family map parity rechecked and captured.
- [x] Durable references added to board/state files.

## Validation Evidence
- Commands:
  - `rg -n "idle-lane rule|in_progress" .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md .agents/state/next-steps.md`
  - `Get-ChildItem -Path apps/web/src/app -Recurse -Filter page.tsx`
  - `Get-Content docs/architecture/reference/dashboard-route-map.md`
- Manual checks:
  - Idle-lane status contract remains fail-closed (`blocked/todo` when idle).
  - Route families (`public`, `dashboard`, `admin`, `offline`) remain aligned.
- Reality status: verified

## Result Report
- Task summary: bounded docs-memory sweep executed; no idle-lane policy drift
  and no route-family map drift detected.
- Files changed:
  - `docs/status/view-map-browser-workflow-ownership.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
  - `history/tasks/luc-193-autonomous-idle-and-map-drift-sweep-2026-05-26-task.md`
- What is incomplete:
  - Protected authenticated browser journey proof remains blocked outside this lane.
- Next steps:
  - Keep idle lanes out of passive `in_progress` during non-live heartbeats.
  - Re-run route-map drift check on every route-impacting web task.

## Continuation Note
- 2026-05-26 `finish_successful_run_handoff`: no pending comments (`0/0`), no
  new blocker evidence, and no scope change; disposition remains `done`.
