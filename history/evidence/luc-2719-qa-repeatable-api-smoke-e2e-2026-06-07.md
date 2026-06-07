# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-07)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-2719-qa-repeatable-api-smoke-e2e-2026-06-07.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | FAIL | 202152 | `pnpm run test:go-live:api` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
