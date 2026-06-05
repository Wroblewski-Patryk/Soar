# LUC-2300 Bound Runtime Aggregate Trade/Position Materialization

## Header
- ID: LUC-2300
- Title: Bound runtime aggregate trade/position materialization
- Task Type: fix
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: Backend API Engineer
- Priority: P0
- Module Confidence Rows: Bot Runtime
- Requirement Rows: REQ-FUNC-003 / REQ-FUNC-021
- Risk Rows: RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25
- Operation Mode: BUILDER
- Mission ID: LUC-2300-SOAR-API-RUNTIME-AGGREGATE-MATERIALIZATION-2026-06-05

## Context
[LUC-2291](/LUC/issues/LUC-2291) traced the May 31 `soar-api` V8 heap OOM to
the authenticated Bot Runtime aggregate path as the likely code-local failure
surface after the first fanout cap. The remaining backend risk was nested
runtime positions/trades readers loading production-sized trade history before
visible-row slicing.

## Goal
Make the smallest backend change so
`GET /dashboard/bots/:id/runtime-monitoring/aggregate` no longer depends on
unbounded trade/position support materialization for hidden historical rows.

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`

## Implementation Plan
1. Move visible runtime trade row ordering and pagination into Prisma for
   database-sortable columns.
2. Use DB `count` and `aggregate` paths for trade `total` and `feesPaid`.
3. Add explicit caps for carry-over position ids and lifecycle/support trade
   rows used by runtime trade and position serialization.
4. Add a regression that creates hidden high-cardinality trade history and
   checks that aggregate visible rows are bounded while total remains truthful.

## Result Report
- Runtime trade reads now call `prisma.trade.findMany` with `orderBy`, `skip`,
  and `take` for database-sortable views instead of loading all rows before
  slicing.
- Runtime trade total and fee summary now use DB `count` and `aggregate`.
- Runtime trade carry-over position ids are capped by
  `RUNTIME_TRADE_CARRY_OVER_POSITION_ID_CAP` (default `2000`).
- Runtime trade lifecycle support rows are capped by
  `RUNTIME_TRADE_SUPPORT_ROW_CAP` (default `2000`).
- Runtime position lifecycle support trade rows are capped by
  `RUNTIME_POSITION_SUPPORT_TRADE_ROW_CAP` (default `2000`, never below
  `query.limit * 20`).
- Added DB-backed regression coverage for `260` hidden trade rows with
  `perSessionLimit=5`; the test asserts response `trades.total=260`,
  `items.length=5`, and bounded `trade.findMany` arguments.

## Validation Evidence
- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts --run`
- BLOCKED: `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false --testNamePattern "bounded aggregate hidden trade materialization|keeps aggregate trade totals truthful"` did not reach the new regression because local Postgres was unavailable:
  `Can't reach database server at localhost:5432` from `resetBotsE2eState`.
- PASS: `git diff --check -- apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`

## Definition Of Done
- Implemented: yes.
- Focused compile proof: verified.
- DB-backed behavioral proof: implemented but blocked by unavailable local DB.
- Production deploy/restart/db/account/secret/exchange/live-trading mutation:
  none.

## Residual Risk
DB-backed aggregate e2e must be rerun once local Postgres is available before
this fix is promoted through a release path. The bounded support caps preserve
normal visible-row behavior but intentionally prevent unbounded hidden lifecycle
support materialization.
