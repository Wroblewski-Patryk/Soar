# LUC-1166 Admin Operation `USE /admin` Missing-Test-Link Closure

## Context

- ID: `LUC-1166`
- Title: Admin operation `USE /admin` missing-test-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Priority: `P1`
- Mission ID: `LUC-1166-ADMIN-OPERATION-USE-ADMIN-PROOF-2026-07-15`
- Mission Status: `VERIFIED`

The generated Admin operation project-truth queue routed
`apps/api/src/router/index.ts#/admin` as `missing_test_link` even though the
repo already contained focused local API proof in
`apps/api/src/modules/admin/users/users.e2e.test.ts`, including the exact
`GET /admin` admin-root readback. The gap was missing scanner-readable linkage
at the router-mount boundary.

## Goal

Attach the smallest durable proof relation for `USE /admin`, rerun the local
truth generators, and confirm the Admin operation queue no longer dispatches
that router mount as `missing_test_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing e2e proof already covers the route
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `priority-test-links.csv` contains the direct `USE /admin` proof link.
- [x] `scanner-overrides.json` carries the matching verified/test relation
      evidence.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/index.ts#/admin` as `missing_test_link`.
- [x] Evidence and state files record the remaining Admin operation gaps and
      validation results.

## Forbidden

- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan

1. Link the admin router mount to the existing e2e proof in the canonical
   relation inputs.
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
  `history/evidence/luc-1166-admin-operation-use-admin-missing-test-link-2026-07-15.md`,
  `history/tasks/luc-1166-admin-operation-use-admin-missing-test-link-2026-07-15-task.md`.
- Validation:
  focused `users.e2e.test.ts` PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only or clean.
- Readback:
  `apps/api/src/router/index.ts#/admin` is no longer routed as
  `missing_test_link`; after the proof-link refresh it advances to
  `Account access` / `missing_doc_link`, and the remaining visible Admin
  operation gaps stay in the browser-review queue for `/admin`,
  `/admin/users`, and `AdminUsersPage.tsx`.
- Residual:
  this heartbeat closes only the scoped `USE /admin` proof-link lane; it does
  not claim doc-link closure for the same endpoint or browser-review completion
  for protected admin screens.
