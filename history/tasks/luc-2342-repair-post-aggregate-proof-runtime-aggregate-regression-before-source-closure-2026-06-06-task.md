# Task

## Supersession Note
This LUC-2342 artifact was superseded by [LUC-2351](/LUC/issues/LUC-2351)
after [LUC-2341](/LUC/issues/LUC-2341) source-control closure reran the exact
aggregate proof and still observed timeout/history instability. The durable
current repair is recorded in
`history/tasks/luc-2351-re-repair-aggregate-e2e-after-source-closure-rerun-2026-06-06-task.md`:
aggregate timeout timers are cleared after race resolution, position
timeout/error fallback uses the existing bounded position projection before
empty fallback, and temporary aggregate e2e debug logging is removed. Treat the
older `25000ms` timeout wording below as superseded by the LUC-2351 evidence.

## Header
- ID: LUC-2342
- Title: Repair post-aggregate-proof runtime aggregate regression before source closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P0
- Module Confidence Rows: `LUC-2342-RUNTIME-AGGREGATE-POST-PROOF-REGRESSION-2026-06-06`
- Iteration: 2026-06-06
- Operation Mode: BUILDER
- Mission ID: `LUC-2342-RUNTIME-AGGREGATE-POST-PROOF-REGRESSION-2026-06-06`
- Mission Status: VERIFIED

## Context
[LUC-2341](/LUC/issues/LUC-2341) source closure was blocked because the full
Bot Runtime monitoring aggregate e2e file regressed after earlier focused
aggregate proofs. The failing command returned HTTP `200` but empty aggregate
symbol stats, positions, trades, and paper capital summaries in later tests.

## Goal
Repair the backend aggregate code/test state so the exact full aggregate e2e
proof passes before source closure continues.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Focused local DB-backed validation only.

## Implementation Plan
1. Reproduce the exact failing command from LUC-2342.
2. Identify whether failures are runtime aggregate logic, timeout fallback, or
   test-state contamination.
3. Apply the smallest backend/test repair that preserves aggregate production
   fallback behavior and bounded materialization proof.
4. Re-run exact aggregate e2e and API typecheck.
5. Update project source-of-truth notes and Paperclip issue status.

## Acceptance Criteria
- Exact command passes:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --testTimeout=30000`
- API typecheck passes.
- No diagnostic logging or temporary instrumentation remains.
- No push, deploy, restart, rollback, protected smoke, account, secret,
  exchange, or live-trading mutation occurs.

## Constraints
- Reuse existing aggregate reader and test infrastructure.
- Do not introduce a parallel aggregate path.
- Preserve `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS` override.
- Keep repair scoped to source-closure blocker.

## Definition of Done
- [x] Exact failing aggregate e2e command passes.
- [x] API typecheck passes.
- [x] Project evidence/state updated.
- [x] Paperclip issue updated with final disposition.

## Forbidden
- Temporary bypasses or skipped aggregate assertions.
- Production deploy/restart/rollback.
- Secret, account, exchange, or live-trading mutation.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --testTimeout=30000` (`19` tests passed).
  - PASS `pnpm --filter api run typecheck`.
- Manual checks:
  - `git diff` confirmed temporary diagnostics were removed.
- High-risk checks:
  - No production or account mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: existing Bot Runtime aggregate reader and test
  contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the two changed lines if the wider release gate rejects
  the timeout/test lifecycle adjustment.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: full aggregate e2e failed after earlier focused aggregate proofs.
- Gap: late timed-out aggregate subqueries could outlive a Prisma delegate spy
  restoration and produce empty fallback rows in later tests.
- Architecture constraints: use existing aggregate reader, fallback, and e2e
  proof path.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2342 source-closure aggregate regression.
- Priority rationale: critical source-control closure blocker.
- Deferred: broader aggregate performance work and production SLO proof.

### 3. Plan Implementation
- Files modified:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Logic:
  - Raise default aggregate subquery timeout from `15000ms` to `25000ms` while
    preserving env override.
  - Keep the bounded hidden-trade proof spy forwarding instead of restoring it
    before late aggregate promises can finish.
- Edge cases:
  - Maintains bounded `trade.findMany` assertion and production timeout
    override.

### 4. Execute Implementation
- Implementation notes:
  - Temporary debug traces identified timeout fallback and
    `prisma.trade.findMany is not a function` after spy restoration; all debug
    traces were removed before final proof.

### 5. Verify and Test
- Validation performed:
  - Full aggregate e2e command from issue.
  - API typecheck.
- Result: passed.

### 6. Self-Review
- Simpler option considered: disabling aggregate timeout in test. Rejected
  because it made requests exceed the test budget and did not represent
  production behavior.
- Technical debt introduced: no.
- Scalability assessment: bounded materialization remains in place; timeout
  remains configurable.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, module confidence ledger, system health,
  active mission, project state, task board, learning journal.
- Learning journal updated: yes.

## Result Report
- Task summary: repaired post-proof aggregate regression by extending the
  aggregate subquery ceiling and avoiding early Prisma spy restoration while
  timed-out aggregate promises may still be active.
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
  - Source closure can include the two backend aggregate changes after normal
    source-control review.
