# LUC-2380 Close Post-2374 Dirty API Runtime Diff Before Push Permit

## Header
- ID: LUC-2380
- Title: Close post-2374 dirty API runtime diff before push permit
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: 09 CTO
- Priority: P0
- Module Confidence Rows: Bot Runtime aggregate, Release guardrails
- Requirement Rows: Release source-control hygiene, Bot Runtime maintainability proof
- Quality Scenario Rows: Maintainability, regression resistance, release traceability
- Risk Rows: Dirty source-state risk, runtime aggregate regression risk
- Operation Mode: BUILDER
- Mission ID: LUC-2380-POST-2374-DIRTY-API-RUNTIME-DIFF-CLOSURE-2026-06-06
- Mission Status: VERIFIED

## Architecture Links

- Primary feature/module: Bot Runtime source-control closure for aggregate read-model decomposition.
- Architecture nodes: `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITIONS-READ.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-ORDER-LIFETIME.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITION-LIFETIME.md`.
- Function chains: `docs/pipelines/live-imported-position-reconciliation.md`, `docs/architecture/reference/live-position-restart-continuity-contract.md`.
- Affected files: `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`.
- Tests/proof: API typecheck, repository guardrails, focused runtime helper tests, aggregate e2e proof, and `git diff --check`.
- Docs updated: `history/tasks/luc-2380-close-post-2374-dirty-api-runtime-diff-before-push-permit-2026-06-06-task.md`.

## Context

[LUC-2374](/LUC/issues/LUC-2374) closed the prior dirty source state before a
renewed push decision for candidate `de3db789177cd497447343395d335fca6a84444c`.
The post-[LUC-2374](/LUC/issues/LUC-2374) worktree again contained a small
dirty API runtime set from Bot Runtime read-model decomposition follow-up work,
with related [LUC-2367](/LUC/issues/LUC-2367), [LUC-2368](/LUC/issues/LUC-2368),
and [LUC-2381](/LUC/issues/LUC-2381) source-of-truth/task evidence.

## Goal

Verify that the current dirty API runtime diff is coherent, locally proven, and
safe to close as a local source-control checkpoint before any push permit is
reconsidered.

## Scope

- Bot Runtime aggregate helper source diff.
- Bot Runtime read-model task artifacts and source-of-truth state.
- No production, deployment, account, secret, exchange, protected-smoke, or
  live-trading action.

## Implementation Plan

1. Inspect the dirty tree and classify runtime/source-of-truth/task evidence.
2. Run the smallest proof set that matches the dirty diff.
3. Record CTO closure and residual release-proof blocker.
4. Commit the coherent local closure set after validation.

## Acceptance Criteria

- API runtime diff is classified and validated.
- API typecheck passes.
- Repository guardrails pass.
- Focused Bot Runtime helper/unit tests pass.
- Whitespace check reports no errors beyond known LF/CRLF warnings.
- Full aggregate e2e proof is verified or explicitly blocked.
- No push or production mutation occurs.

## Definition of Done

- [x] Current dirty source state is documented.
- [x] Relevant local checks pass.
- [x] Source-of-truth state is updated.
- [x] Work is eligible only for local commit closure; push remains outside this
      issue.

## Forbidden

- No push.
- No deploy, restart, rollback, env/database/account, secret, exchange,
  protected-smoke, or live-trading mutation.
- No new guardrail allowlist or temporary bypass.

## Validation Evidence

- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `git diff --check` with LF/CRLF warnings only.
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` (`23/23`).
- PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true --testTimeout=30000 --reporter=dot` (`19/19`).

## Result Report

- Runtime diff classification:
  - extracted aggregate fallback and open-order helper modules now use
    type-only imports for read-model function shapes.
  - aggregate subquery default timeout is `25000ms` with the existing
    environment override preserved.
- Source-of-truth classification:
  - [LUC-2367](/LUC/issues/LUC-2367), [LUC-2368](/LUC/issues/LUC-2368), and
    [LUC-2381](/LUC/issues/LUC-2381) task/state evidence records the Backend
    decomposition and source-state closure details.
  - this [LUC-2380](/LUC/issues/LUC-2380) artifact records the CTO push-permit
    source-control closure wrapper.
- Reality status: `verified` for local source-control closure.
- Residual risk: protected runtime/worker/SLO proof and explicit Ops mutation
  permit remain required before candidate promotion decisions claim release
  readiness.
- Deployment impact: none.
- Push impact: no push performed; push permit remains gated by protected
  runtime/worker/SLO proof and explicit Ops mutation approval.
