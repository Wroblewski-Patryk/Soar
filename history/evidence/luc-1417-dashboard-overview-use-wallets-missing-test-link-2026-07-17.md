# LUC-1417 Dashboard Overview `USE /wallets` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1417](/LUC/issues/LUC-1417)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/wallets`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` mounts `walletsRouter` at
  `/wallets` behind the shared dashboard `requireAuth` guard.
- `apps/api/src/modules/wallets/wallets.e2e.test.ts` already exercises:
  - unauthenticated mounted-route fail-closed access
  - authenticated metadata and live balance-preview behavior
  - mounted analytics reads for performance summary, equity timeline, and
    cashflow events
  - mounted reset-paper guardrails and fail-closed protections
- `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts` already exercises:
  - authenticated create/read/update/delete behavior on mounted wallet routes
  - ownership isolation for mounted get/update/delete
  - owner-scoped listing and active-bot deletion/update guardrails
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/wallets` to
  `apps/api/src/modules/wallets/wallets.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now adds a verified entity
  override for `apps/api/src/router/dashboard.routes.ts#/wallets` with both
  wallet e2e files as proof evidence.

## Verification

- `pnpm --filter api exec vitest run src/modules/wallets/wallets.e2e.test.ts --run`
  -> PASS (`1` file / `24` tests)
- `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts --run`
  -> PASS (`1` file / `12` tests)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- first `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> wrote a stale `missing_test_link` readback for `USE /wallets`
- isolated rerun of the same `build-app-completion-index.mjs`
  -> PASS with corrected wallet row:
  `owner=Test Automation Engineer`, `status=verified`,
  `hasTest=true`, `risk=missing_doc_link`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /wallets`.
- Fresh generated readback no longer emits `USE /wallets` as
  `missing_test_link` in either `app-completion` or `project-truth`.
- The same endpoint now advances to `Account access: USE /wallets has
  app-completion risk missing_doc_link`, owned by Docs Memory Lead +
  Project Manager.
- The remaining Dashboard overview proof-owned API row is now `USE /dashboard`.
