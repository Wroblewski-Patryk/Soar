# LUC-43 Repeatable Smoke/E2E Evidence (2026-05-26)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks web,api`
- Result: PASS
- JSON artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| Web smoke pack | PASS | 5089 | `pnpm run test:go-live:web` |
| API smoke pack | PASS | 42669 | `pnpm run test:go-live:api` |

## Failure Notes
- none
