# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-27)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-5590-api-backtests-teardown-sequencing-2026-06-27.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | FAIL | 222120 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | PASS | 27775 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.

## 2026-06-27 TAE Classification

- Teardown sequencing status: `implemented and verified at runner level`.
- Script contract validation:
  `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs`
  passed `20/20`.
- Real runner interpretation:
  the API wrapper did tear down Compose after its failed API pack, but the
  subsequent Backtests check no longer depended on that prior Compose lifetime.
  It invoked `pnpm run test:go-live:backtests:with-infra`, recreated/started
  local Postgres and Redis, applied migrations, ran the focused Backtests e2e
  file, and passed `15/15`.
- Residual:
  the full command still exits nonzero because the API pack fails inside
  `apps/api/src/modules/backtests/backtests.e2e.test.ts` with shared-DB cleanup
  failures (`BotMarketGroup_symbolGroupId_fkey`,
  `MarketUniverse_userId_fkey`, `Position_userId_fkey`) and missing-user
  reads after registration. That is a separate API DB-backed e2e cleanup
  isolation issue, not the original teardown sequencing issue.
