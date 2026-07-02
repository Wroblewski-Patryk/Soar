# LUC-43 Repeatable Smoke/E2E Evidence (2026-07-02)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-6820-qa-repeatable-smoke-e2e-2026-07-02.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | PASS | 21838 | `pnpm run test:go-live:web` |
| API smoke pack | FAIL | 2985 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | FAIL | 3857 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
