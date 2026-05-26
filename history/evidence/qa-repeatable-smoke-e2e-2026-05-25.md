# LUC-43 Repeatable Smoke/E2E Evidence (2026-05-25)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-25.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | FAIL | 214829 | `pnpm run test:go-live:web` |
| API smoke pack | FAIL | 587553 | `pnpm run test:go-live:api` |
| Focused backtests e2e | FAIL | 343261 | `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
