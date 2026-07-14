# LUC-1162 Account Access `USE /users` Doc-Link Closure

## Context

- ID: `LUC-1162`
- Title: Account access `USE /users` missing-doc-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID: `LUC-1162-ACCOUNT-ACCESS-USE-USERS-DOC-LINK-2026-07-15`
- Mission Status: `VERIFIED`

The generated Account access project-truth queue routed
`apps/api/src/router/admin.routes.ts#/users` as the first docs-owned
`missing_doc_link` row after [LUC-1155](/LUC/issues/LUC-1155) closed the
paired proof gap. The repo already had route documentation and verified test
evidence, but it still lacked the direct scanner-readable `documents`
relation at the router-mount boundary.

## Goal

Attach durable module documentation and canonical graph relations for
`USE /users` so generated app-completion and project-truth no longer classify
`apps/api/src/router/admin.routes.ts#/users` as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new tests
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `docs/modules/api-admin.md` explicitly documents the scoped
      `USE /admin/users` router-mount contract.
- [x] `docs/architecture/relations/documentation-links.csv` and
      `docs/architecture/scanner-overrides.json` contain the matching
      `documents` relation.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/admin.routes.ts#/users` as `missing_doc_link`.
- [x] Evidence and state files record the next routed gap and validation
      results.

## Forbidden

- new systems without approval
- duplicated logic or parallel documentation systems
- temporary bypasses or manual status-only edits
- architecture changes outside the scoped docs relation repair

## Plan

1. Extend `docs/modules/api-admin.md` with the admin users router-mount
   contract.
2. Add the direct docs relation in the canonical registries.
3. Rebuild architecture awareness, rerun app-completion, then rerun
   project-truth sequentially from the refreshed app-completion output.
4. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/modules/api-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.agents/state/next-steps.md`,
  `history/evidence/luc-1162-account-access-use-users-doc-link-2026-07-15.md`,
  `history/tasks/luc-1162-account-access-use-users-doc-link-2026-07-15-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` PASS with line-ending warnings only or clean.
- Readback:
  `apps/api/src/router/admin.routes.ts#/users` is no longer routed as
  `missing_doc_link`; the next docs-owned first gap advances to
  `apps/api/src/router/dashboard.routes.ts#/backtests`, while the remaining
  Admin operation proof-owned row stays `USE /admin` as `missing_test_link`.
- Residual:
  this heartbeat closes only the scoped `USE /users` doc-link lane; it does
  not claim `USE /admin` proof closure or admin users browser-review
  completion.
