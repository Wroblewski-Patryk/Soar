# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-29)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: PASS
- JSON artifact: `history/artifacts/luc-6205-qa-repeatable-smoke-e2e-2026-06-29.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | PASS | 35899 | `pnpm run test:go-live:web` |
| API smoke pack | PASS | 120970 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | PASS | 86339 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- none
