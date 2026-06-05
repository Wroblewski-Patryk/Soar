# LUC-2328 Evidence - Runtime Aggregate Trade Totals DB-Backed Proof

Date: 2026-06-06
Owner: Backend API Engineer

## Summary

Implemented and verified: the focused Bot Runtime aggregate DB-backed proof now preserves truthful trade totals while visible trade rows remain bounded.

## What Changed

- `runtimeMonitoringAggregateRead.service.ts`
  - Increased default `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS` fallback from `5000` to `15000`.
  - The existing environment override remains supported.
- `bots.monitoring-aggregate.e2e.test.ts`
  - Changed the Prisma `trade.findMany` spy to call the original delegate with its bound Prisma context.
  - This keeps the e2e capable of asserting bounded DB `take` values without breaking the service call.

## Verification

- PASS `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run -t "bounds aggregate hidden trade materialization while preserving trade totals" --testTimeout=30000`
  - Result: `1 passed`, `18 skipped`.
  - The proof validates `260` hidden trades, `5` visible aggregate rows, aggregate metadata total `260`, and bounded `prisma.trade.findMany` calls.
- PASS `pnpm --filter api exec tsc --noEmit --pretty false`

## Earlier Failed Proofs

- Initial focused e2e with local DB available failed at Vitest's default `5000ms` test timeout before assertions.
- Rerun with wider test timeout exposed the product assertion failure: aggregate `trades.total` was `0` instead of `260`.
- Diagnostic narrowed the defect to the test spy breaking Prisma delegate calls and the aggregate fail-soft timeout hiding the DB-backed result under the old `5000ms` default.

## Safety

- No production deploy, restart, rollback, migration, database mutation outside the local e2e test DB, account mutation, secret readback, exchange mutation, protected smoke, or live-trading action occurred.
- Local Postgres/Redis were already running from [LUC-2319](/LUC/issues/LUC-2319); this heartbeat did not start new persistent runtime services.

## Residual Risk

- Production promotion remains an Ops/QA gate.
- Protected runtime aggregate smoke and SLO evidence remain outside this backend proof.
