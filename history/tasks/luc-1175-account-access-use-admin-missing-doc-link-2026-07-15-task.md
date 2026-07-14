# LUC-1175 Account Access `USE /admin` Missing-Doc-Link Closure

## Context

- ID: `LUC-1175`
- Title: Account access `USE /admin` missing-doc-link closure
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Priority: `P1`
- Mission ID: `LUC-1175-ACCOUNT-ACCESS-USE-ADMIN-DOC-LINK-2026-07-15`
- Mission Status: `VERIFIED`

The generated Account access project-truth queue routes
`apps/api/src/router/index.ts#/admin` as `missing_doc_link` even though
`docs/modules/api-admin.md` already documents the protected `/admin` mount and
its admin-only reachability probe. The canonical documentation relation input
still links only the downstream `admin.routes.ts#/` router surface, so the
generator cannot attach the docs directly to the actual router mount surfaced in
app completion.

## Goal

Attach the smallest durable documentation relation for `USE /admin`, rerun the
local truth generators, and confirm the Account access queue no longer dispatches
that router mount as `missing_doc_link`.

## Constraints

- use existing systems and approved mechanisms
- no runtime code changes
- no new docs module when `docs/modules/api-admin.md` already owns the surface
- no deploy, push, restart, rollback, or protected browser proof
- no workaround paths or manual status-only edits

## Definition of Done

- [x] `documentation-links.csv` contains the direct `USE /admin` doc link.
- [x] `scanner-overrides.json` carries the matching documents relation.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/index.ts#/admin` as `missing_doc_link`.
- [x] Evidence and state files record the next front-row gap and validation
      results.

## Forbidden

- new systems without approval
- duplicated logic or parallel documentation systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped doc-link repair

## Plan

1. Link the admin router mount directly to the existing admin module docs in the
   canonical relation inputs.
2. Rebuild architecture awareness, app completion, and project truth
   sequentially.
3. Record readback, evidence, and state-file updates for the next generated
   front row.

## Result Report

- Updated files:
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1175-account-access-use-admin-missing-doc-link-2026-07-15.md`,
  `history/tasks/luc-1175-account-access-use-admin-missing-doc-link-2026-07-15-task.md`.
- Validation:
  `build-architecture-awareness-index.mjs` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `build-app-completion-index.mjs` PASS;
  sequential `build-project-truth-indexes.mjs --apply` PASS;
  targeted `rg` readback PASS;
  `git diff --check` with line-ending warnings only.
- Readback:
  `apps/api/src/router/index.ts#/admin` is no longer routed as
  `missing_doc_link`; Account access is now fully `ok` in app completion, and
  the first generated project-truth gap advances to Admin operation
  browser-review for `apps/web/src/app/admin/page.tsx`.
- Residual:
  this heartbeat closes only the scoped `USE /admin` doc-link lane; it does not
  claim browser-review completion for protected admin screens or any deploy,
  push, runtime mutation, or protected-account validation.
