# LUC-1152 Admin Operation GET Root Doc-Link Closure

## Context

- ID: `LUC-1152`
- Title: Admin operation `GET /admin` missing-doc-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID:
  `LUC-1152-ADMIN-OPERATION-GET-ROOT-DOC-LINK-2026-07-14`
- Mission Status: `VERIFIED`

The generated Admin operation project-truth queue routed
`apps/api/src/router/admin.routes.ts#/` as the first docs-owned
`missing_doc_link` row, so the admin root reachability probe needed a direct
source-of-truth module description and canonical graph relation.

## Goal

Attach durable module documentation and canonical graph relations for
`GET /admin` so generated app-completion and project-truth no longer classify
`apps/api/src/router/admin.routes.ts#/` as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new tests
- no deploy, push, restart, rollback, or protected account/session proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `docs/modules/api-admin.md` explicitly documents the scoped `GET /admin`
      route contract.
- [x] `docs/architecture/relations/documentation-links.csv` and
      `docs/architecture/scanner-overrides.json` contain the matching
      `documents` relation.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/admin.routes.ts#/` as `missing_doc_link`.
- [x] Evidence and state files record the next routed gap and validation
      results.

## Forbidden

- new systems without approval
- duplicated logic or parallel documentation systems
- temporary bypasses or manual status-only edits
- architecture changes outside the scoped docs relation repair

## Plan

1. Extend `docs/modules/api-admin.md` with the admin root probe route contract.
2. Add the direct docs relation in the canonical registries.
3. Rebuild architecture awareness, rerun app-completion, then rerun
   project-truth sequentially from the refreshed app-completion output.
4. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/modules/api-admin.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1152-admin-operation-get-doc-link-2026-07-14.md`,
  `history/tasks/luc-1152-admin-operation-get-doc-link-2026-07-14-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only.
- Readback:
  `apps/api/src/router/admin.routes.ts#/` is no longer a docs-owned first gap.
  The next overall Admin operation row advances to
  `apps/api/src/router/admin.routes.ts#/users` as `missing_test_link`, while
  the next docs-owned first gap in generated project truth advances to
  `Dashboard overview: USE /backtests` as `missing_doc_link`.
- Residual:
  direct proof for admin route behavior remains owned by the existing
  `missing_test_link` and `needs_browser_review` lanes; this heartbeat closes
  only the scoped documentation-link gap.
