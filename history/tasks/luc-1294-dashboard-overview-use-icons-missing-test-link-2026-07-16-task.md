# Task

## Header
- ID: `LUC-1294`
- Title: `Dashboard overview USE /icons missing-test-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing icons API e2e proof
- Priority: `P1`
- Iteration: `2026-07-16`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1294-DASHBOARD-OVERVIEW-USE-ICONS-PROOF-2026-07-16`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routes the first Dashboard overview
generated proof gap to `USE /icons` on
`apps/api/src/router/dashboard.routes.ts#/icons`. The repository already
contains executable proof in `apps/api/src/modules/icons/icons.e2e.test.ts`,
but there is no direct generator-readable relation from the router mount to
that test.

## Goal
Attach the smallest durable proof relation for the dashboard icons router mount,
refresh the generated truth indexes, and confirm the queue no longer dispatches
`USE /icons` as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing e2e proof already covers the route
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done
- [x] `priority-test-links.csv` contains the direct `USE /icons` proof link.
- [x] `scanner-overrides.json` carries the matching verified/test relation
      evidence.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/dashboard.routes.ts#/icons` as `missing_test_link`.
- [x] Evidence and state files record the remaining Dashboard overview gaps and
      validation results.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan
1. Link the dashboard icons router mount to the existing icons API e2e proof.
2. Run the focused icons API test file to keep the proof current.
3. Rebuild architecture awareness, app completion, and project truth
   sequentially.
4. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1294-dashboard-overview-use-icons-missing-test-link-2026-07-16.md`,
  `history/tasks/luc-1294-dashboard-overview-use-icons-missing-test-link-2026-07-16-task.md`.
- Validation:
  full `icons.e2e.test.ts` replay PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/icons` is no longer routed as
  `missing_test_link`; after the proof-link refresh it advances to
  `Account access` / `missing_doc_link`, and the next Dashboard overview
  proof-owned gap is now `USE /logs`.
- Residual:
  this heartbeat closes only the scoped `USE /icons` proof-link lane; it does
  not claim doc-link closure for the same endpoint or broader Dashboard
  overview proof closure.
