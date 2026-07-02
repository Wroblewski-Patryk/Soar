# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-29)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
- Result: PASS
- JSON artifact: `history/artifacts/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | PASS | 190574 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | PASS | 82653 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- none
