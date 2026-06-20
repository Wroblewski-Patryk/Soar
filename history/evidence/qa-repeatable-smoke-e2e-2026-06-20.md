# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-20)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: PASS
- JSON artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-06-20.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | PASS | 7622 | `pnpm run test:go-live:web` |
| API smoke pack | PASS | 32621 | `pnpm run test:go-live:api` |
| Focused backtests e2e | PASS | 15412 | `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run` |

## Failure Notes
- none
