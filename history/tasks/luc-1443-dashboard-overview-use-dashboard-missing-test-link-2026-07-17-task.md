# Task

## Header
- ID: `LUC-1443`
- Title: `Dashboard overview USE /dashboard missing-test-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing dashboard mount auth and cache-header proof
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1443-DASHBOARD-OVERVIEW-USE-DASHBOARD-PROOF-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routed the active Dashboard overview
generated proof gap to `USE /dashboard` on `apps/api/src/router/index.ts#/dashboard`.
The repository already contained executable mounted-route proof in
`apps/api/src/middleware/requireAuth.test.ts` and
`apps/api/src/router/cacheHeaders.test.ts`, but there was no direct
generator-readable relation from the top-level router mount to that proof.

## Goal
Attach the smallest durable proof relation for the dashboard router mount,
refresh the generated truth indexes, and confirm the queue no longer dispatches
`USE /dashboard` as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing route proof already covers the mount
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done
- [x] `priority-test-links.csv` contains the direct `USE /dashboard` proof link.
- [x] `scanner-overrides.json` carries the matching verified/test relation
      evidence.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/index.ts#/dashboard` as
      `Dashboard overview / missing_test_link`.
- [x] Evidence and state files record the resulting docs-owned follow-up lane
      and validation results.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan
1. Link the dashboard top-level router mount to the existing `/dashboard`
   auth proof.
2. Replay the focused `/dashboard` auth and cache-header tests.
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
  `history/evidence/luc-1443-dashboard-overview-use-dashboard-missing-test-link-2026-07-17.md`,
  `history/tasks/luc-1443-dashboard-overview-use-dashboard-missing-test-link-2026-07-17-task.md`.
- Validation:
  focused `requireAuth.test.ts` replay PASS;
  focused `cacheHeaders.test.ts` replay PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS.
- Readback:
  `apps/api/src/router/index.ts#/dashboard` is no longer routed as
  `Dashboard overview / missing_test_link`; after the proof-link refresh it
  advances to `Dashboard overview / missing_doc_link`.
- Residual:
  this heartbeat closes only the scoped `USE /dashboard` proof-link lane; it
  does not claim doc-link closure for the same endpoint or broader dashboard
  browser-review closure.
