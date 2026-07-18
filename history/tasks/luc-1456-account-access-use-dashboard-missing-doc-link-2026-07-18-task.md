# LUC-1456 Account Access `USE /dashboard` Missing-Doc-Link Closure

## Context

- ID: `LUC-1456`
- Title: `Account access USE /dashboard missing-doc-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID: `LUC-1456-ACCOUNT-ACCESS-USE-DASHBOARD-DOC-LINK-2026-07-18`
- Mission Status: `VERIFIED`

The generated Account access project-truth queue routed
`apps/api/src/router/index.ts#/dashboard` as `missing_doc_link` after
`LUC-1443` closed the proof-link side of the same mount. `docs/modules/api-root.md`
already owned the root API router and `GET /dashboard` probe, but the canonical
documentation relation inputs still linked only the downstream
`dashboard.routes.ts#/` surface instead of the top-level `router.use('/dashboard', ...)`
mount emitted by app completion.

## Goal

Attach the smallest durable documentation relation for `USE /dashboard`, rerun
the local truth generators, and confirm the Account access queue no longer
dispatches that router mount as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new docs module when `docs/modules/api-root.md` already owns the surface
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `documentation-links.csv` contains the direct `USE /dashboard` doc link.
- [x] `scanner-overrides.json` carries the matching documents relation.
- [x] `docs/modules/api-root.md` explicitly describes the top-level dashboard
      namespace mount as part of the root module boundary.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/index.ts#/dashboard` as `missing_doc_link`.
- [x] Evidence and state files record the remaining docs-owned front row and
      the source-control closure follow-up issue.

## Forbidden

- new systems without approval
- duplicated logic or parallel documentation systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped doc-link repair

## Plan

1. Link the dashboard router mount directly to the existing root API module doc
   in the canonical relation inputs.
2. Clarify the mount boundary in `docs/modules/api-root.md`.
3. Rebuild architecture awareness, app completion, and project truth
   sequentially.
4. Record readback, evidence, state updates, and the source-control closure
   sidecar.

## Result Report

- Updated files:
  `docs/modules/api-root.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`,
  `history/evidence/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18.md`,
  `history/tasks/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18-task.md`,
  `history/artifacts/luc-1456-paperclip-closeout-2026-07-18.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only.
- Readback:
  `apps/api/src/router/index.ts#/dashboard` is no longer routed as
  `missing_doc_link`; the remaining generated docs-owned rows are now
  `GET /alerts` and `GET /metrics`.
- Residual:
  this heartbeat closes only the scoped `USE /dashboard` doc-link lane. Local
  source-control closure is delegated to [LUC-1458](/LUC/issues/LUC-1458), and
  the production runtime readiness blocker on `https://api.soar.luckysparrow.ch/ready`
  remains outside this docs-owned scope.
