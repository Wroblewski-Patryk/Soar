Run: `PAPERCLIP_RUN_ID=$env:PAPERCLIP_RUN_ID`

Done

- Added direct proof links for `apps/api/src/router/dashboard.routes.ts#/profile/basic` and `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` in `docs/architecture/relations/priority-test-links.csv`.
- Added matching verified route-mount overrides in `docs/architecture/scanner-overrides.json`.
- Regenerated architecture-awareness, app-completion, and project-truth outputs.
- Targeted readback confirms both rows no longer appear as `Dashboard overview / missing_test_link`.

Verification

- `pnpm --filter api exec vitest run src/modules/profile/basic/basic.e2e.test.ts --run`
  -> FAIL because Prisma could not reach PostgreSQL at `localhost:5432`
- `pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts --run`
  -> TIMED OUT in the current workstation session
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

Readback

- `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` now routes as `Account access / missing_doc_link`.
- `apps/api/src/router/dashboard.routes.ts#/profile/basic` now routes as `Dashboard overview / missing_doc_link`.

Evidence

- `history/tasks/luc-1383-dashboard-overview-profile-basic-and-apikeys-proof-2026-07-17-task.md`
- `history/evidence/luc-1383-dashboard-overview-profile-basic-and-apikeys-proof-2026-07-17.md`

Residual

- Docs Memory Lead + Project Manager own the remaining doc-link follow-up for the refreshed rows.
- Same-run local DB-backed replay remains blocked by missing PostgreSQL at `localhost:5432`.
