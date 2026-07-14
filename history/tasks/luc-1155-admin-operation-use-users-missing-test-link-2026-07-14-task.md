# LUC-1155 Admin Operation `USE /users` Missing-Test-Link Closure

## Context

- ID: `LUC-1155`
- Title: Admin operation `USE /users` missing-test-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Priority: `P1`
- Mission ID: `LUC-1155-ADMIN-OPERATION-USE-USERS-PROOF-2026-07-14`
- Mission Status: `VERIFIED`

The generated Admin operation project-truth queue routed
`apps/api/src/router/admin.routes.ts#/users` as the first `missing_test_link`
row even though the repo already contained focused local proof in
`apps/api/src/modules/admin/users/users.e2e.test.ts`. The gap was missing
scanner-readable linkage at the router-mount boundary.

## Goal

Attach the smallest durable proof relation for `USE /users`, rerun the local
truth generators, and confirm the Admin operation queue no longer dispatches
that router mount as `missing_test_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing e2e proof already covers the route
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `priority-test-links.csv` contains the direct `USE /users` proof link.
- [x] `scanner-overrides.json` carries the matching verified/test relation
      evidence.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/admin.routes.ts#/users` as `missing_test_link`.
- [x] Evidence and state files record the remaining Admin operation gaps and
      validation results.

## Forbidden

- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan

1. Link the admin users router mount to the existing e2e proof in the
   canonical relation inputs.
2. Run the focused admin users API test to keep the proof current.
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
  `history/evidence/luc-1155-admin-operation-use-users-missing-test-link-2026-07-14.md`,
  `history/tasks/luc-1155-admin-operation-use-users-missing-test-link-2026-07-14-task.md`.
- Validation:
  focused `users.e2e.test.ts` PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only or clean.
- Readback:
  `apps/api/src/router/admin.routes.ts#/users` is no longer routed as
  `missing_test_link`; after the proof link refresh it advances to
  `missing_doc_link`, and the first remaining proof-owned Admin operation row
  is now `USE /admin` for test-link proof while the Admin page/page-component
  browser-review lanes remain open.
- Residual:
  this heartbeat closes only the scoped `USE /users` proof-link lane; it does
  not claim the new docs-owned `USE /users` lane, admin root proof closure, or
  browser-review completion.
