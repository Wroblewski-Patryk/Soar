# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-27)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-5577-qa-smoke-runner-infra-api-2026-06-27.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | FAIL | 2190 | `pnpm run test:go-live:api:with-infra` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
