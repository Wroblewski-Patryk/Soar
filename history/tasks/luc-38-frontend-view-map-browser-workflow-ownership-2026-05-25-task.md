# Task

## Header
- ID: `LUC-38`
- Title: Frontend view map and browser workflow ownership
- Task Type: `design`
- Current Stage: `implementation`
- Status: `DONE`
- Owner: `Frontend Builder`
- Priority: `P1`
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: `CHECKPOINTED`

## Context
Frontend ownership for route-to-view mapping and browser workflow proof was missing as a single durable source for the Soar pilot issue lane.

## Goal
Publish a canonical frontend-owned view map and workflow ownership contract tied to current Web routes and existing proof indexes.

## Scope
- `docs/status/view-map-browser-workflow-ownership.md`
- `docs/documentation-map.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Constraints
- Reuse canonical route map and current app routes.
- No backend/API behavior changes.
- No new framework/process creation.

## Implementation Plan
1. Read canonical route map and current `apps/web/src/app/**/page.tsx` route inventory.
2. Publish route-to-view ownership table grouped by frontend surfaces.
3. Define browser workflow ownership and minimum proof obligations.
4. Link the new status doc into documentation map and project state/board.

## Acceptance Criteria
- New status doc exists with route/view ownership and workflow verification contract.
- Documentation map references the new status doc.
- Task board and project state include `LUC-38` checkpoint with evidence path.

## Definition of Done
- [x] Goal achieved with durable source-of-truth update.
- [x] Scope updated without cross-layer side effects.
- [x] Evidence and references captured in repository.

## Validation Evidence
- Tests: `not run` (docs/state only).
- Manual checks: reviewed `dashboard-route-map.md` and route inventory under `apps/web/src/app`.
- Reality status: `implemented and verified` (documentation/state scope).

## Result Report
- Task summary: added frontend route/view ownership map and browser workflow proof ownership contract.
- Files changed:
  - `docs/status/view-map-browser-workflow-ownership.md`
  - `docs/documentation-map.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-38-frontend-view-map-browser-workflow-ownership-2026-05-25-task.md`
- What is incomplete: protected authenticated browser proofs remain in dedicated proof lanes.
- Next steps: use this map as the default entrypoint for frontend route-impacting fixes and proof updates.

## Continuation Checkpoint (Run Liveness Follow-up)
- Added explicit route-to-client API mapping in the status doc to satisfy the
  acceptance criterion for primary views and client API calls.
- Added regression reproduction status with exact blocker wording for protected
  browser proof and cross-lane owner note for the backtests smoke instability
  (`backend/api` lane).

## Resume Checkpoint (2026-05-26)
- Board comment acknowledged after local Codex auth repair and inbox triage.
- Scope remained narrow and unchanged for `LUC-38` frontend lane.
- No additional frontend code/runtime changes were needed; existing acceptance
  evidence remains current in `docs/status/view-map-browser-workflow-ownership.md`.
- Honest status for this lane remains `done`.
