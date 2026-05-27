# Task

## Header
- ID: LUC-227
- Title: [Soar] Autonomous idle and map drift sweep
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Docs-memory checkpoint requested for autonomous idle and route-map drift
revalidation on current repository state.

## Goal
Re-run one bounded drift sweep and leave durable status for:
1. idle-lane fail-closed posture in state docs,
2. canonical web route-family parity between docs and `app/**/page.tsx`.

## Scope
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`
- `docs/status/view-map-browser-workflow-ownership.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `apps/web/src/app/**/page.tsx`

## Implementation Plan
1. Recheck idle-lane clauses in canonical state files.
2. Re-list current web pages and compare with canonical route map.
3. Record dated sweep result in docs-memory sources of truth.

## Acceptance Criteria
- Idle-lane rule remains explicit (`blocked/todo` when idle, no passive
  `in_progress`).
- Route-family parity status is refreshed with date and evidence command.
- `TASK_BOARD` and `PROJECT_STATE` include `LUC-227` checkpoint disposition.

## Definition of Done
- [x] Idle-lane rule revalidated and captured.
- [x] Route-family parity revalidated and captured.
- [x] Durable state updates written in board/state/docs files.

## Validation Evidence
- Commands:
  - `rg -n "idle-lane rule|in_progress only during|fail-closed|blocked when idle" .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md .agents/state/next-steps.md`
  - `Get-ChildItem -Path apps/web/src/app -Recurse -Filter page.tsx`
  - `Get-Content -Raw docs/architecture/reference/dashboard-route-map.md`
- Manual checks:
  - Idle-lane contract remains fail-closed in active PM lanes.
  - Route families remain aligned (`public`, `dashboard`, `admin`, `offline`).
  - Current route inventory remains `37` `page.tsx` entries.
- Reality status: verified

## Result Report
- Task summary: bounded docs-memory sweep executed on 2026-05-27; no idle-lane
  policy drift and no route-family map drift detected.
- Files changed:
  - `history/tasks/luc-227-autonomous-idle-and-map-drift-sweep-2026-05-27-task.md`
  - `docs/status/view-map-browser-workflow-ownership.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - Authenticated protected-route browser journey proof remains outside this
    docs-memory lane.
- Next steps:
  - Keep no-stall PM lanes in `blocked/todo` while idle.
  - Re-run route-map drift check after every route-impacting web change.

## Continuation Note
- 2026-05-27 `finish_successful_run_handoff`: inline wake reconciled first
  (`fallbackFetchNeeded=false`, comments `0/0`); no new drift or blocker
  evidence arrived, and disposition remains `done`.
