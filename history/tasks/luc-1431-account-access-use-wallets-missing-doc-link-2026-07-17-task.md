# Task

## Header
- ID: `LUC-1431`
- Title: `Account access USE /wallets missing-doc-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Product Docs Agent`
- Depends on: existing wallet route proof from `LUC-1417`
- Priority: `P1`
- Iteration: `2026-07-17`
- Operation Mode: `ARCHITECT`
- Mission ID: `LUC-1431-ACCOUNT-ACCESS-USE-WALLETS-DOC-LINK-2026-07-17`
- Mission Status: `VERIFIED`

## Context
`docs/status/project-truth-index.md` routed the next Account access generated
gap to `USE /wallets` on `apps/api/src/router/dashboard.routes.ts#/wallets`.
The repo already contained direct mounted-route proof and route verification
from `LUC-1417`, but it still lacked the generator-readable documentation
relation and explicit module-doc classification for the router mount.

## Goal
Attach the smallest durable doc-link relation for the dashboard wallets router
mount, rebuild the generated indexes, and confirm project truth no longer
dispatches `USE /wallets` as `missing_doc_link`.

## Constraints
- use existing systems and approved mechanisms
- no runtime code changes
- no new tests when existing wallet route proof already covers the mount
- no deploy, push, restart, rollback, or protected browser proof
- no manual status-only edits or workaround paths

## Definition of Done
- [x] `docs/modules/api-wallets.md` contains the direct router-mount
      classification row.
- [x] `docs/architecture/relations/documentation-links.csv` contains the direct
      `USE /wallets` doc relation.
- [x] `docs/architecture/scanner-overrides.json` carries the matching
      `documents` relation override.
- [x] Generated app-completion and project-truth readback no longer route
      `apps/api/src/router/dashboard.routes.ts#/wallets` as `missing_doc_link`.
- [x] Evidence and state files record the next owner/action after doc-link
      closure.

## Forbidden
- new systems without approval
- duplicated logic or parallel proof systems
- temporary bypasses or manual status-only edits
- architecture or runtime changes outside the scoped doc-link repair

## Plan
1. Link the dashboard wallets router mount to the existing wallet owner doc.
2. Regenerate architecture-awareness, app-completion, and project-truth.
3. Record evidence and refresh project state files.

## Result Report

- Updated files:
  `docs/modules/api-wallets.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  generated `docs/graphs/*` and `docs/status/*`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `history/evidence/luc-1431-account-access-use-wallets-missing-doc-link-2026-07-17.md`,
  `history/tasks/luc-1431-account-access-use-wallets-missing-doc-link-2026-07-17-task.md`,
  `history/artifacts/luc-1431-paperclip-closeout-2026-07-17.md`.
- Validation:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` PASS;
  `pnpm run architecture:graph:drift:strict` PASS;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` PASS with final `missingDocLink=2`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply` PASS;
  targeted `rg` readback across `docs/status/app-completion-index.{md,json}` and
  `docs/status/project-truth-index.{md,json}` confirms `USE /wallets` no
  longer appears as an active gap;
  `git diff --check` PASS with line-ending warnings only.
- Readback:
  `apps/api/src/router/dashboard.routes.ts#/wallets` is no longer routed as
  `Account access / missing_doc_link`.
  The remaining generated doc-link rows now narrow to
  `apps/api/src/router/index.ts#/alerts` and
  `apps/api/src/router/index.ts#/metrics`, while the next project-truth app
  completion gap advances to `Dashboard overview: USE /dashboard` as
  `missing_test_link`.
- Residual:
  this heartbeat closes only the direct documentation-link gap for
  `USE /wallets`; it does not claim broader runtime readiness or protected
  production health recovery.
