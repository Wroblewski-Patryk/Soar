# Task

## Header

- ID: LUC-2333
- Title: Complete runtime aggregate trade row repair after failed QA rerun
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: [LUC-2317](/LUC/issues/LUC-2317), [LUC-2328](/LUC/issues/LUC-2328)
- Priority: P0
- Module Confidence Rows: Bot Runtime aggregate / production API reliability
- Requirement Rows: REQ-FUNC-003 / REQ-FUNC-021
- Quality Scenario Rows: Runtime aggregate reliability / bounded materialization
- Risk Rows: RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25
- Operation Mode: BUILDER
- Mission ID: LUC-2333-RUNTIME-AGGREGATE-TRADE-ROW-REPAIR-2026-06-06
- Mission Status: VERIFIED

## Context

[LUC-2317](/LUC/issues/LUC-2317) QA reran the DB-backed aggregate proof after
[LUC-2328](/LUC/issues/LUC-2328). The endpoint returned HTTP `200`, but
persisted trade rows/totals were still omitted because aggregate fanout treated
one nested reader timeout/error as a whole-session row failure.

## Goal

Make the runtime monitoring aggregate preserve persisted trade rows/totals in
the DB-backed proof while keeping hidden trade materialization bounded.

## Scope

- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Existing focused e2e proof in
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Evidence and local source-of-truth updates

## Implementation Plan

1. Reproduce the failed combined aggregate proof.
2. Compare behavior with an extended subquery timeout to isolate whether data
   and bounded trade queries are correct.
3. Repair aggregate fanout so each nested reader fails soft independently.
4. Rerun the exact combined proof from the issue.
5. Run API typecheck.
6. Update evidence and module/risk/project state.

## Acceptance Criteria

- The combined command from [LUC-2333](/LUC/issues/LUC-2333) passes.
- The bounded proof returns `trades.total === 260` and `trades.items.length === 5`.
- The neighboring trade-total proof returns visible trade rows and truthful totals.
- `trade.findMany` remains bounded below hidden row cardinality.
- No production deploy/restart/account/exchange/live-trading mutation.

## Definition of Done

- [x] Focused DB-backed aggregate e2e passes.
- [x] API typecheck passes.
- [x] Evidence file records commands and results.
- [x] Project state/module confidence/risk records are updated.
- [x] No production or live-trading mutation occurred.

## Forbidden

- No workaround endpoint or client fallback.
- No unbounded trade materialization.
- No schema/migration changes.
- No production deploy, restart, rollback, protected smoke, account mutation,
  exchange mutation, or live-trading action.

## Validation Evidence

- PASS:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "bounds aggregate hidden trade materialization while preserving trade totals|keeps aggregate trade totals truthful when visible trade rows are limited" --reporter=verbose --testTimeout=30000`
- PASS:
  `pnpm --filter api exec tsc --noEmit --pretty false`
- Cleanup: `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue`
  returned no matching processes.
- Evidence:
  `history/evidence/luc-2333-runtime-aggregate-trade-row-repair-after-qa-rerun-2026-06-06.md`

## Architecture Evidence

- Architecture source reviewed: existing Bot Runtime aggregate service and
  bounded materialization tests.
- Fits approved architecture: yes. The backend aggregate remains the canonical
  source of runtime monitoring truth; no frontend reconstruction or parallel
  truth path was introduced.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence

- Deploy impact: none in this heartbeat.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the aggregate fanout fallback change if it regresses
  runtime monitoring semantics before deployment.

## Result Report

- Task summary: repaired aggregate fanout so nested reader timeout/error no
  longer drops the entire session row and erases valid trade rows/totals.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - existing `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    spy binding change from the prior repair remains in scope.
- How tested: focused DB-backed aggregate e2e plus API typecheck.
- What is incomplete: production promotion, protected runtime smoke, and SLO
  proof remain release gates.
- Next steps: unblock [LUC-2317](/LUC/issues/LUC-2317) QA rerun from this
  backend repair.
