# LUC-1397 Dashboard Overview `USE /strategies` Missing-Test-Link Closure

- Agent: `09 TAE (Test Automation Engineer)`
- Issue: `[LUC-1397](/LUC/issues/LUC-1397)`
- Scope: close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/strategies`.

## Result

- Classification: `implemented and verified`
- Closure mode:
  link the existing executable proof instead of adding duplicate route tests

## Evidence Readback

- `apps/api/src/router/dashboard.routes.ts` mounts `strategiesRouter` at
  `/strategies` behind the shared dashboard `requireAuth` guard.
- `apps/api/src/modules/strategies/strategies.e2e.test.ts` already exercises:
  - unauthenticated `GET /dashboard/strategies` fail-closed with
    `401 Missing token`
  - authenticated create/list/get/update/delete flow on mounted strategy routes
  - authenticated export/import flow with versioned package readback
  - non-owner get/update/delete fail-closed behavior on mounted strategy detail
    routes
  - active-bot update/delete lock behavior plus inactive-bot edit allowance
- `docs/architecture/relations/priority-test-links.csv` now links
  `apps/api/src/router/dashboard.routes.ts#/strategies` to
  `apps/api/src/modules/strategies/strategies.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now adds:
  - a verified entity override for
    `apps/api/src/router/dashboard.routes.ts#/strategies`
  - direct mounted-route proof evidence for the existing strategies e2e file

## Verification

- `pnpm --filter api exec vitest run src/modules/strategies/strategies.e2e.test.ts -t "rejects unauthenticated access|supports create/list/get/update/delete flow for authenticated user|supports export/import flow with format versioning|enforces ownership isolation on get/update/delete|blocks strategy updates when strategy is used by any active bot|allows strategy updates when linked bots are inactive|blocks strategy delete when strategy is used by any active bot" --run`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- first `build-app-completion-index.mjs` write hit a transient Windows `UNKNOWN` file-lock on `docs/status/app-completion-index.json`; immediate retry PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`

## Residual Risk

- This packet closes only the direct automated proof-link gap for
  `Dashboard overview: USE /strategies`.
- Fresh generated readback no longer emits `USE /strategies` in either
  `app-completion` or `project-truth`.
- The next Dashboard overview proof-owned gaps are now `USE /wallets` and
  `USE /dashboard` as `missing_test_link`.
