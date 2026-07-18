# LUC-1443 Dashboard Overview `USE /dashboard` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1443](/LUC/issues/LUC-1443)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/index.ts#/dashboard`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/index.ts` mounts `dashboardRoutes` at `/dashboard`
  behind `applyNoStoreHeaders`.
- `apps/api/src/middleware/requireAuth.test.ts` already exercises `/dashboard`
  with:
  - valid bearer-token access returning `200` and the authenticated user payload
  - previous-secret cookie rotation acceptance
  - missing-token, invalid-token, deleted-user, stale-session, and temporary
    auth-store failure paths
- `apps/api/src/router/cacheHeaders.test.ts` already exercises the same mount
  for `401` fail-closed behavior with the expected no-store cache headers.
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/index.ts#/dashboard` to
  `apps/api/src/middleware/requireAuth.test.ts`.
- `docs/architecture/scanner-overrides.json` now marks
  `apps/api/src/router/index.ts#/dashboard` as verified with direct auth and
  cache-header evidence for the mounted namespace.

## Verification

- `pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --run`
  -> PASS
- `pnpm --filter api exec vitest run src/router/cacheHeaders.test.ts --run`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /dashboard`.
- The same endpoint now remains docs-owned as
  `Dashboard overview: USE /dashboard has app-completion risk missing_doc_link.`
- No runtime behavior, deploy state, or protected-browser evidence was changed
  or claimed in this heartbeat.
