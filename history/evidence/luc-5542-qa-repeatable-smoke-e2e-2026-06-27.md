# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-27)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-5542-qa-repeatable-smoke-e2e-2026-06-27.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | FAIL | 2897 | `pnpm run test:go-live:web` |
| API smoke pack | FAIL | 2406 | `pnpm run test:go-live:api` |
| Focused backtests e2e | FAIL | 2686 | `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.
