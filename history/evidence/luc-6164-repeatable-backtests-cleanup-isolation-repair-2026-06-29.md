# LUC-6164 Repeatable Backtests Cleanup-Isolation Repair Evidence

- Issue: [LUC-6164](/LUC/issues/LUC-6164)
- Date: 2026-06-29
- Scope: local backend/API test-harness repair and verification for repeatable
  Backtests cleanup isolation.
- Boundary: no deploy, push, production smoke, protected account proof, secret
  readback, production DB/Redis mutation, exchange/payment action, order,
  position, or live-trading action.

## Diagnosis

- Direct focused Vitest without infra failed because local Postgres was not
  listening on `localhost:5432`; the project-supported path is the
  infra-aware wrapper.
- `pnpm run test:go-live:backtests:with-infra` reproduced current local
  residuals:
  - the 3-symbol parity case exceeded the default 15s timeout, and later the
    previous 20s critical timeout budget;
  - the create/list/get test could manually upsert `totalTrades=2`, then have
    the async backtest job complete and overwrite the report with
    `totalTrades=0`.

## Repair

- Updated `apps/api/src/modules/backtests/backtests.e2e.test.ts`.
- Increased `BACKTESTS_E2E_CRITICAL_TIMEOUT_MS` to `45_000`.
- Applied the shared critical timeout to the 3-symbol parity e2e case.
- Waited for `waitForBacktestReport(agent, runId)` before manually inserting
  the trade/report fixture used by the create/list/get endpoint assertions.

## Validation

| Command | Result |
| --- | --- |
| `pnpm run test:go-live:backtests:with-infra` | PASS: 1 file / 15 tests |
| `pnpm run test:go-live:api:with-infra` | PASS: 4 files / 45 tests |
| `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests --artifact-prefix luc-6164-qa-repeatable-smoke-e2e` | PASS: 2 selected checks |

## Artifacts

- `history/artifacts/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.json`
- `history/evidence/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.md`
- `history/tasks/luc-6164-repeatable-backtests-cleanup-isolation-repair-2026-06-29-task.md`

## Cleanup Evidence

- The infra-aware wrappers started local Docker Postgres/Redis and ran
  `docker compose down` after each proof.
- Final process/container cleanup was checked after validation in the
  heartbeat closure.

## Residual Risk

- Repository source control remains mixed dirty and divergent; this heartbeat
  did not commit or push.
- The generated repeatable artifact still carries the runner legacy internal
  issue label `LUC-43`; the issue-specific artifact prefix and this evidence
  file bind the proof to [LUC-6164](/LUC/issues/LUC-6164).
