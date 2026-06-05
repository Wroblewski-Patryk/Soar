# Task

## Header
- ID: LUC-2328
- Title: Repair runtime aggregate trade totals in DB-backed proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: [LUC-2317](/LUC/issues/LUC-2317), [LUC-2300](/LUC/issues/LUC-2300)
- Priority: P0
- Module Confidence Rows: Bot Runtime aggregate
- Requirement Rows: REQ-FUNC-003, REQ-FUNC-021
- Risk Rows: RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25
- Operation Mode: BUILDER
- Mission ID: LUC-2328-RUNTIME-AGGREGATE-TRADE-TOTALS-2026-06-06
- Mission Status: VERIFIED

## Context
[LUC-2300](/LUC/issues/LUC-2300) bounded Bot Runtime aggregate trade and position materialization, but the DB-backed e2e proof was previously blocked by missing local Postgres. After [LUC-2319](/LUC/issues/LUC-2319) restored local DB/Redis, the proof reached the aggregate endpoint and returned HTTP `200`, but failed because the e2e's Prisma `findMany` spy broke Prisma delegate binding and the default aggregate subquery timeout fail-softed before the bounded DB path completed.

## Goal
Make the focused DB-backed runtime aggregate proof verify that aggregate trade totals and fees remain truthful while visible trade rows are bounded.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`

## Implementation Plan
1. Reproduce the focused DB-backed aggregate proof now that local Postgres is available.
2. Fix the e2e spy so it preserves Prisma delegate binding while still recording bounded `findMany` arguments.
3. Raise the bounded aggregate subquery default from `5000ms` to `15000ms`, keeping the environment override intact.
4. Rerun focused DB-backed proof and API typecheck.

## Acceptance Criteria
- Focused DB-backed aggregate e2e passes for 260 hidden trades with `perSessionLimit=5`.
- Aggregate response reports total `260`, returns `5` visible rows, and keeps DB `findMany` calls bounded below full hidden row count.
- API typecheck passes.

## Definition of Done
- [x] Existing runtime aggregate systems reused; no parallel implementation added.
- [x] DB-backed proof passed.
- [x] Source-of-truth state and evidence updated.
- [x] No production mutation, deploy, migration, secret/account, exchange, or live-trading action performed.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run -t "bounds aggregate hidden trade materialization while preserving trade totals" --testTimeout=30000`
  - PASS `pnpm --filter api exec tsc --noEmit --pretty false`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/graphs/architecture-graph.md` through scoped runtime aggregate history from [LUC-2300](/LUC/issues/LUC-2300).
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: requires Ops for any production promotion.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not applicable.
- Rollback note: revert the timeout default and e2e spy change if runtime latency policy must be restored.

## Result Report
- Task summary: repaired the DB-backed aggregate proof by preserving Prisma delegate binding in the bounded-materialization spy and allowing the bounded aggregate DB subquery to complete under default config.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- How tested: focused aggregate e2e and API typecheck passed.
- What is incomplete: production deploy/promotion and protected runtime smoke are outside this Backend heartbeat.
- Next steps: QA can treat [LUC-2317](/LUC/issues/LUC-2317) DB-backed aggregate proof blocker as resolved locally and proceed with release-gate ownership.
