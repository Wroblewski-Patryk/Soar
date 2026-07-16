# LUC-1332 Dashboard Overview `USE /markets` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1332](/LUC/issues/LUC-1332)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/markets`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` mounts `marketsRouter` at
  `/markets` behind the shared dashboard `requireAuth` guard.
- `apps/api/src/modules/markets/markets.e2e.test.ts` already exercises:
  - unauthenticated `GET /dashboard/markets/universes` fail-closed with
    `401 Missing token`
  - authenticated owner CRUD readback on `/dashboard/markets/universes`
  - authenticated `GET /dashboard/markets/catalog` market-type and
    base-currency filtering on the mounted catalog route
  - non-owner fail-closed reads and writes on mounted market-universe routes
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/markets` to
  `apps/api/src/modules/markets/markets.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now adds:
  - a verified entity override for
    `apps/api/src/router/dashboard.routes.ts#/markets`
  - direct mounted-route proof evidence for the existing markets e2e file

## Verification

- `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts --run`
  -> failed on unrelated pre-existing coverage in
  `syncs linked symbol groups with composed universe contract (volume U whitelist) - blacklist`
  and
  `returns Gate.io public market catalog through the exchange adapter contract`;
  not used as the scoped acceptance proof for this lane
- `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts -t "rejects unauthenticated access|supports full CRUD for authenticated owner|returns public market catalog filtered by base currency and market type|enforces ownership isolation for get/update/delete" --run`
  -> PASS (`4` tests, `14` skipped)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /markets`.
- The same endpoint now remains docs-owned as
  `Account access: USE /markets has app-completion risk missing_doc_link.`
- The next Dashboard overview proof-owned gap is now `USE /orders` as
  `missing_test_link`.
- The broader `markets.e2e.test.ts` file still carries pre-existing failures
  outside the scoped route-mount acceptance subset.
