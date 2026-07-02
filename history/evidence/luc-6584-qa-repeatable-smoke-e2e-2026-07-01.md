# LUC-6584 Repeatable Smoke/E2E Evidence (2026-07-01)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-6584-qa-repeatable-smoke-e2e-2026-07-01.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | FAIL | 160564 | `pnpm run test:go-live:web` |
| API smoke pack | FAIL | 12288 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | FAIL | 9197 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
