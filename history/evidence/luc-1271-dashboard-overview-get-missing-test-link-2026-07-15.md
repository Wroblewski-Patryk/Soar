# LUC-1271 Dashboard Overview `GET /` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1271](/LUC/issues/LUC-1271)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` exposes `GET /` behind
  `requireAuth` and returns the dashboard welcome payload plus `req.user`.
- `apps/api/src/middleware/requireAuth.test.ts` already exercises
  `GET /dashboard` with:
  - a valid bearer token returning `200` and the authenticated user payload
  - previous-secret cookie rotation acceptance
  - missing-token, invalid-token, deleted-user, stale-session, and temporary
    auth-store failure paths
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/` to
  `apps/api/src/middleware/requireAuth.test.ts`.

## Verification

- `pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: GET /`.
- The same endpoint now remains docs-owned as
  `Dashboard overview: GET / has app-completion risk missing_doc_link.`
- The next Dashboard overview proof-owned gap is
  `USE /bots` as `missing_test_link`.
