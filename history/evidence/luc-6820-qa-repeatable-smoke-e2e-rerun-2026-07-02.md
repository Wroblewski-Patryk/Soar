# LUC-43 Repeatable Smoke/E2E Evidence (2026-07-02)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: PASS
- JSON artifact: `history/artifacts/luc-6820-qa-repeatable-smoke-e2e-rerun-2026-07-02.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | PASS | 51167 | `pnpm run test:go-live:web` |
| API smoke pack | PASS | 72421 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | PASS | 34947 | `pnpm run test:go-live:backtests:with-infra` |

## Failure Notes
- none
