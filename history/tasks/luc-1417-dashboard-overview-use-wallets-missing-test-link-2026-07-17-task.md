# Task

## Header
- ID: `LUC-1417`
- Title: `Dashboard overview USE /wallets missing-test-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing wallet API e2e proof
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `ARCHITECT`
- Mission ID: `LUC-1417-DASHBOARD-OVERVIEW-USE-WALLETS-PROOF-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routed the next Dashboard overview
generated proof gap to `USE /wallets` on
`apps/api/src/router/dashboard.routes.ts#/wallets`. The repository already
contained executable mounted-route proof in
`apps/api/src/modules/wallets/wallets.e2e.test.ts` and
`apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`, but there was no
direct generator-readable relation from the dashboard router mount to that
proof.

## Goal
Attach the smallest durable proof relation for the dashboard wallets router
mount, replay the wallet route proof, refresh generated truth indexes, and
confirm the queue no longer dispatches `USE /wallets` as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no duplicate route tests when existing wallet e2e proof already covers the mount
- no deploy, push, restart, rollback, or protected browser proof
- no manual status-only edits or workaround paths

## Definition of Done
- [x] `priority-test-links.csv` contains the direct `USE /wallets` proof link.
- [x] `scanner-overrides.json` carries the matching verified route evidence.
- [x] Focused wallet API e2e proof passes for the mounted route surface.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/dashboard.routes.ts#/wallets` as
      `missing_test_link`.
- [x] Evidence and state files record the next owner/action after proof closure.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan
1. Link the dashboard wallets router mount to the existing wallet API e2e proof.
2. Run the smallest passing wallet route proof needed for scoped acceptance.
3. Rebuild architecture awareness, app completion, and project truth.
4. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1417-dashboard-overview-use-wallets-missing-test-link-2026-07-17.md`,
  `history/tasks/luc-1417-dashboard-overview-use-wallets-missing-test-link-2026-07-17-task.md`,
  `history/artifacts/luc-1417-paperclip-closeout-2026-07-17.md`.
- Validation:
  `pnpm --filter api exec vitest run src/modules/wallets/wallets.e2e.test.ts --run` PASS;
  `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts --run` PASS;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  first `build-app-completion-index.mjs` run wrote a stale `missing_test_link`
  readback for `USE /wallets`; isolated rerun PASS with corrected `verified /
  hasTest=true / missing_doc_link` state;
  final `build-project-truth-indexes.mjs --apply` PASS with aligned
  `missing_doc_link` readback.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/wallets` is no longer routed as
  `missing_test_link`. The same endpoint now truthfully advances to
  `Account access / missing_doc_link`, owned by Docs Memory Lead + Project
  Manager, and the remaining dashboard proof-owned API row is now
  `apps/api/src/router/index.ts#/dashboard`.
- Residual:
  this heartbeat closes only the direct automated proof-link gap for
  `USE /wallets`; it does not claim the remaining docs-owned wallet row or the
  dashboard browser-review backlog.
