# Task

## Header
- ID: LUC-2351
- Title: Re-repair aggregate e2e after source-closure rerun still fails
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API
- Priority: P0
- Module Confidence Rows: `LUC-2351-RUNTIME-AGGREGATE-SOURCE-CLOSURE-RERUN-2026-06-06`
- Iteration: 2026-06-06
- Operation Mode: BUILDER
- Mission ID: `LUC-2351-RUNTIME-AGGREGATE-SOURCE-CLOSURE-RERUN-2026-06-06`
- Mission Status: VERIFIED

## Context
[LUC-2341](/LUC/issues/LUC-2341) source-control closure reran the exact Bot
Runtime monitoring aggregate e2e proof after the earlier [LUC-2342](/LUC/issues/LUC-2342)
repair and still observed an unstable result: two aggregate requests exceeded
the `30000ms` per-test budget, and one overlapping running-session closed
position proof returned an empty `positions.historyItems` array.

## Goal
Make the exact aggregate e2e command pass consistently enough for the
source-closure lane to resume without weakening assertions or skipping tests.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Source-of-truth state/evidence files for this backend repair.

## Implementation Plan
1. Reproduce the exact aggregate e2e command from the source-closure failure.
2. Inspect current aggregate timeout/fallback and e2e spy lifecycle changes.
3. Remove temporary diagnostics.
4. Wire the existing bounded position fallback into aggregate position subquery
   timeout/error handling.
5. Clear aggregate timeout timers after successful subqueries so resolved reads
   do not leave unnecessary timers alive.
6. Re-run the exact aggregate e2e and API typecheck.

## Acceptance Criteria
- Exact command passes:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --testTimeout=30000`
- API typecheck passes.
- No diagnostic logging or temporary instrumentation remains.
- No push, deploy, restart, rollback, protected smoke, account, secret,
  exchange, database migration, or live-trading mutation occurs.

## Constraints
- Reuse the existing aggregate reader.
- Do not introduce a parallel aggregate path.
- Preserve `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS` override.
- Keep the dirty set coherent for source-control closure.

## Definition of Done
- [x] Exact aggregate e2e command passes.
- [x] API typecheck passes.
- [x] Diagnostic logging removed.
- [x] Project evidence/state updated.
- [x] Paperclip issue updated with final disposition.

## Forbidden
- Temporary bypasses or skipped aggregate assertions.
- Production deploy/restart/rollback.
- Secret, account, exchange, protected-smoke, or live-trading mutation.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --testTimeout=30000` (`19` tests passed; test body time `25464ms`, total command duration `29.86s`).
  - PASS `pnpm --filter api run typecheck`.
- Manual checks:
  - Removed `LUC-2353 open-position aggregate debug` console output from the
    aggregate e2e.
  - Verified the existing bounded hidden-trade spy remains forwarding and uses
    `mockClear()` instead of mid-suite `mockRestore()`.
- High-risk checks:
  - No production or account mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified local.

## Architecture Evidence
- Architecture source reviewed: existing Bot Runtime aggregate reader and e2e
  aggregate contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: low local backend repair only.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the position fallback wiring, timeout cleanup, and
  test diagnostic removal if the source-control closure review rejects this
  repair.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: the source-control closure rerun still failed the exact aggregate e2e
  after the earlier local pass.
- Gap: aggregate position timeout/error fallback still returned an empty row
  even though a bounded position fallback builder existed; timeout helper also
  left timers alive after successful subqueries.
- Architecture constraints: existing aggregate reader and bounded DB-backed
  projections must be reused.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2351](/LUC/issues/LUC-2351) source-closure aggregate
  e2e re-repair.
- Priority rationale: critical blocker for [LUC-2341](/LUC/issues/LUC-2341)
  source-control closure.
- Deferred: production protected runtime smoke and SLO proof.

### 3. Plan Implementation
- Files modified:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Logic:
  - Clear `withTimeout` timers in a `finally` block after race resolution.
  - On position reader timeout/error, use the existing bounded fallback
    position projection before falling back to an empty position payload.
  - Remove temporary aggregate debug logging from the e2e file.

### 4. Execute Implementation
- Implementation notes:
  - Kept the existing `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS`
    override and did not add a new aggregate read path.
  - Did not change assertion expectations or skip any tests.

### 5. Verify and Test
- Validation performed:
  - Full aggregate e2e command from issue.
  - API typecheck.
- Result: passed.

### 6. Self-Review
- Architecture alignment: existing aggregate fallback/read path reused.
- No workaround introduced: yes; fallback remains bounded and truth-preserving
  for positions.
- No logic duplication introduced: uses the existing fallback builder.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, module confidence ledger, system health,
  active mission, project state, task board, learning journal.

## Result Report
- Task summary: stabilized the aggregate e2e source-closure rerun by wiring
  bounded position fallback on position subquery timeout/error, clearing
  timeout timers after subquery completion, and removing a temporary diagnostic
  log.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - project state/evidence files.
- How tested:
  - Exact aggregate e2e proof passed.
  - API typecheck passed.
- What is incomplete:
  - Production promotion, protected runtime smoke, and SLO proof remain release
    gates outside this backend source-closure repair.
- Next steps:
  - [LUC-2341](/LUC/issues/LUC-2341) source-control closure can rerun its
    dirty-set validation and decide whether to commit the coherent repair set.
