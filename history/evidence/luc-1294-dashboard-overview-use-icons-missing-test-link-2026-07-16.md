# LUC-1294 Dashboard Overview `USE /icons` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1294](/LUC/issues/LUC-1294)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/icons`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` mounts `iconsRouter` at `/icons`
  behind the shared dashboard `requireAuth` guard.
- `apps/api/src/modules/icons/icons.e2e.test.ts` already exercises:
  - unauthenticated `GET /dashboard/icons/lookup` fail-closed with
    `401 Missing token`
  - authenticated CoinGecko-backed icon lookup on `/dashboard/icons/lookup`
  - cache-hit reuse on repeated authenticated lookup
  - curated fallback when CoinGecko is unavailable
  - deterministic placeholder fallback for unknown assets
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/icons` to
  `apps/api/src/modules/icons/icons.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now adds:
  - a verified entity override for `apps/api/src/router/dashboard.routes.ts#/icons`
  - a direct `api_endpoint:use-icons:309c3997b9 -> icons.e2e.test.ts` test
    relation override

## Verification

- `pnpm --filter api exec vitest run src/modules/icons/icons.e2e.test.ts --run`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /icons`.
- The same endpoint now remains docs-owned as
  `Account access: USE /icons has app-completion risk missing_doc_link.`
- The next Dashboard overview proof-owned gap is now `USE /logs` as
  `missing_test_link`.
