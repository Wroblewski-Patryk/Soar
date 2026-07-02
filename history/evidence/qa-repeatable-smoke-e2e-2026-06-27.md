# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-27)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
- Result: PASS
- JSON artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-06-27.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | PASS | 41710 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | PASS | 25907 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- none
