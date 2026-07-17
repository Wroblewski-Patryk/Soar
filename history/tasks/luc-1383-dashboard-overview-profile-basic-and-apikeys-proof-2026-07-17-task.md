# Task

## Header
- ID: `LUC-1383`
- Title: `Dashboard overview /profile/basic and /profile/apiKeys proof-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing profile basic and profile API-key API e2e proof
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1383-DASHBOARD-OVERVIEW-PROFILE-BASIC-APIKEYS-PROOF-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routed Dashboard overview proof gaps to
`USE /profile/basic` and `USE /profile/apiKeys` on
`apps/api/src/router/dashboard.routes.ts`. The repository already contained
executable API proof for both router mounts, but there was no direct
generator-readable relation from those router mounts to the existing tests and
no matching verified overrides for those exact mounted paths.

## Goal
Attach the smallest durable proof relations for the dashboard profile-basic and
profile-apiKeys router mounts, refresh the generated truth indexes, and confirm
the queue no longer dispatches either row as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing proof already covers the routes
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done
- [x] `priority-test-links.csv` contains direct proof links for
      `USE /profile/basic` and `USE /profile/apiKeys`.
- [x] `scanner-overrides.json` carries matching verified route evidence for
      both mounts.
- [x] Generated app-completion readback no longer routes either mount as
      `missing_test_link`.
- [x] Generated project-truth readback no longer routes either mount as
      `missing_test_link`.
- [x] Evidence and state files record the remaining residual gaps and
      validation results.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped proof-link repair

## Plan
1. Link the two dashboard router mounts to the existing focused API e2e proof.
2. Replay the smallest available API proof pack for those mounts.
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
  `history/evidence/luc-1383-dashboard-overview-profile-basic-and-apikeys-proof-2026-07-17.md`,
  `history/tasks/luc-1383-dashboard-overview-profile-basic-and-apikeys-proof-2026-07-17-task.md`,
  `history/artifacts/luc-1383-paperclip-closeout-2026-07-17.md`.
- Validation:
  `basic.e2e.test.ts` FAIL because Prisma could not reach PostgreSQL at
  `localhost:5432`;
  `apiKey.e2e.test.ts` replay timed out in the current workstation session
  before producing a conclusive result;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` is no longer routed
  as `Dashboard overview / missing_test_link`; after the proof-link refresh it
  now advances to `Account access / missing_doc_link`.
  `apps/api/src/router/dashboard.routes.ts#/profile/basic` is no longer routed
  as `Dashboard overview / missing_test_link`; after the proof-link refresh it
  now advances to `Dashboard overview / missing_doc_link`.
- Residual:
  the scoped QA proof-link lane is complete; docs-owned follow-up remains for
  both mounts. Same-run DB-backed e2e replay remains environment-blocked by the
  missing local PostgreSQL listener on `localhost:5432`.
