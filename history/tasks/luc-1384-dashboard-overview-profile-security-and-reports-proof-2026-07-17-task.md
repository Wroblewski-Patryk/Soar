# Task

## Header
- ID: `LUC-1384`
- Title: `Dashboard overview /profile/security and /reports proof-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: existing profile security and reports API e2e proof
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1384-DASHBOARD-OVERVIEW-PROFILE-SECURITY-REPORTS-PROOF-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/app-completion-index.md` routed two Dashboard overview generated
proof gaps to `USE /profile/security` and `USE /reports` on
`apps/api/src/router/dashboard.routes.ts`. The repository already contained
executable API proof for both router mounts, but there was no direct
generator-readable relation from those router mounts to the existing tests.

## Goal
Attach the smallest durable proof relations for the dashboard profile-security
and reports router mounts, refresh the generated truth indexes, and confirm the
queue no longer dispatches either row as `missing_test_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new test behavior when the existing proof already covers the routes
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done
- [x] `priority-test-links.csv` contains direct proof links for
      `USE /profile/security` and `USE /reports`.
- [x] `scanner-overrides.json` carries matching verified route and test-relation
      evidence for both mounts.
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
2. Run the smallest API proof pack that anchors those mounts.
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
  `history/evidence/luc-1384-dashboard-overview-profile-security-and-reports-proof-2026-07-17.md`,
  `history/tasks/luc-1384-dashboard-overview-profile-security-and-reports-proof-2026-07-17-task.md`.
- Validation:
  `security.e2e.test.ts` replay blocked by missing local PostgreSQL on
  `localhost:5432`;
  `reports.e2e.test.ts` replay partially ran but DB-backed authenticated cases
  were blocked by the same missing local PostgreSQL runtime;
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted readback PASS.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/profile/security` and
  `apps/api/src/router/dashboard.routes.ts#/reports` are no longer routed as
  `missing_test_link`; after the proof-link refresh they advance to
  docs-owned `missing_doc_link` follow-up classification.
- Residual:
  the scoped QA lane is complete; browser-review gaps for the reports page and
  broader doc-link closure are separate follow-up lanes. Same-run DB-backed e2e
  replay remains environment-blocked on missing local PostgreSQL at
  `localhost:5432`, but that does not block the proof-link closure itself.
