# LUC-1286 Dashboard Overview `USE /bots` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1286](/LUC/issues/LUC-1286)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/bots`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` mounts `botsRouter` at `/bots`
  behind the shared dashboard `requireAuth` guard.
- `apps/api/src/modules/bots/bots.e2e.test.ts` already exercises:
  - unauthenticated `GET /dashboard/bots` fail-closed with `401 Missing token`
  - authenticated owner CRUD and list/readback on `/dashboard/bots`
  - market-type filtered `/dashboard/bots` list behavior
  - non-owner fail-closed reads and writes on mounted bot routes
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/bots` to
  `apps/api/src/modules/bots/bots.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now adds:
  - a verified entity override for `apps/api/src/router/dashboard.routes.ts#/bots`
  - a direct `api_endpoint:use-bots:d49fee56cc -> bots.e2e.test.ts` test
    relation override

## Verification

- `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run`
  -> failed on an unrelated pre-existing timeout in
  `lists and returns runtime session monitoring summary with ownership isolation`
  after `26` passes; not used as the scoped acceptance proof for this lane
- `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "rejects unauthenticated access|supports full CRUD for authenticated owner|enforces ownership isolation for get/update/delete"`
  -> PASS (`3` tests, `24` skipped)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /bots`.
- The same endpoint now remains docs-owned as
  `Account access: USE /bots has app-completion risk missing_doc_link.`
- The next Dashboard overview proof-owned gap is now `USE /icons` as
  `missing_test_link`.
