# LUC-43 Repeatable Smoke/E2E Evidence (2026-06-27)

- Command: `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
- Result: FAIL
- JSON artifact: `history/artifacts/luc-5586-local-docker-postgres-redis-availability-2026-06-27.json`

## Check Summary

| Check | Status | Duration ms | Command |
| --- | --- | ---: | --- |
| API smoke pack | PASS | 56595 | `pnpm run test:go-live:api:with-infra` |
| Focused backtests e2e | FAIL | 69200 | `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run` |

## Failure Notes
- See JSON artifact stderr/stdout fields for exact failure output.

## DRE Classification

- Local Docker Desktop Linux engine was restored in this heartbeat.
- `docker compose up -d postgres redis` restored `soar-postgres-1` and
  `soar-redis-1` on `127.0.0.1:5432` and `127.0.0.1:6379`.
- API smoke passed through `pnpm run test:go-live:api:with-infra`.
- The combined runner then failed Backtests because the API wrapper ran
  `docker compose down` before the bare Backtests command.
- After re-starting local infra, direct Backtests proof passed:
  `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run`
  returned `1` file and `15` tests passed.

Conclusion: local Docker/Postgres/Redis availability is restored. Remaining
combined-runner failure is a QA orchestration issue, not an active DRE local
runtime blocker.
