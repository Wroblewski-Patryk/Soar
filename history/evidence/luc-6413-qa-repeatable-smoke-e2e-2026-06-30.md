# LUC-6413 Repeatable Smoke/E2E Evidence (2026-06-30)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-6413-qa-repeatable-smoke-e2e-2026-06-30.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | FAIL | 203957 | `pnpm run test:go-live:web` |
| API smoke pack | FAIL | 12227 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | FAIL | 13048 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
