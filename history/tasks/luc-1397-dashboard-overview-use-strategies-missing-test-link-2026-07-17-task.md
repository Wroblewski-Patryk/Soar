# Task

## Header
- ID: `LUC-1397`
- Title: `Dashboard overview USE /strategies missing-test-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing strategies API e2e proof
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `ARCHITECT`
- Mission ID: `LUC-1397-DASHBOARD-OVERVIEW-USE-STRATEGIES-PROOF-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routed the first Dashboard overview
generated proof gap to `USE /strategies` on
`apps/api/src/router/dashboard.routes.ts#/strategies`. The repository already
contained executable proof in
`apps/api/src/modules/strategies/strategies.e2e.test.ts`, but there was no
direct generator-readable relation from the router mount to that test.

## Goal
Attach the smallest durable proof relation for the dashboard strategies router
mount, refresh the generated truth indexes, and confirm the queue no longer
dispatches `USE /strategies` as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing e2e proof already covers the route
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done
- [x] `priority-test-links.csv` contains the direct `USE /strategies` proof
      link.
- [x] `scanner-overrides.json` carries the matching verified/test relation
      evidence.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/dashboard.routes.ts#/strategies` as
      `missing_test_link`.
- [x] Evidence and state files record the remaining Dashboard overview and
      Account access gaps plus validation results.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan
1. Link the dashboard strategies router mount to the existing strategies API
   e2e proof.
2. Run the smallest passing route-mount subset needed for scoped acceptance.
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
  `history/evidence/luc-1397-dashboard-overview-use-strategies-missing-test-link-2026-07-17.md`,
  `history/tasks/luc-1397-dashboard-overview-use-strategies-missing-test-link-2026-07-17-task.md`.
- Validation:
  focused `strategies.e2e.test.ts` route-mount subset PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS after one transient Windows file-lock retry on `docs/status/app-completion-index.json`;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/strategies` is no longer routed as
  `missing_test_link`, and the same endpoint no longer appears in either
  generated `app-completion` or `project-truth` gap queues.
  The next Dashboard overview proof-owned gaps are now `USE /wallets` and
  `USE /dashboard`.
- Residual:
  this heartbeat closes only the scoped `USE /strategies` proof-link lane; it
  does not claim broader strategies-suite changes beyond the mounted-route
  proof-link repair.
