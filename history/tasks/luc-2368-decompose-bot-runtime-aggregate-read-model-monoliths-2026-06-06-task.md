# LUC-2368 Decompose Bot Runtime Aggregate Read-Model Monoliths

## Context

- Issue: `LUC-2368 [Soar][Backend] Decompose Bot Runtime aggregate read-model monoliths after LUC-2364 allowlist`
- Stage: verification
- Wake: `issue_assigned`, inline payload consumed first, `fallbackFetchNeeded=false`, comments `0/0`.
- Scope: Backend Bot Runtime aggregate and positions read-model maintainability after [LUC-2364](/LUC/issues/LUC-2364) temporarily allowlisted two production files above the `1000`-line monolith threshold.

## Architecture Links

- Primary feature/module: Bot Runtime aggregate and session positions read models.
- Architecture nodes: `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITIONS-READ.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITION-LIFETIME.md`, `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-ORDER-LIFETIME.md`.
- Function chains: `docs/pipelines/live-imported-position-reconciliation.md`, `docs/architecture/reference/live-position-restart-continuity-contract.md`.
- Affected files: `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`.
- Tests/proof: API typecheck, `pnpm run quality:guardrails`, focused runtime aggregate/session positions tests, and `bots.monitoring-aggregate.e2e.test.ts`.
- Docs updated: `history/tasks/luc-2368-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md`.

## Goal

Remove the Backend Bot Runtime monolith exception by decomposing the aggregate/positions read-model files while preserving the existing endpoint contract and bounded materialization behavior.

## Constraints

- Do not change production runtime, deploy, restart, rollback, env, account, secret, exchange, protected smoke, or live-trading state.
- Keep decomposition inside existing Bot Runtime read-model ownership.
- Preserve existing public API entry points and test imports.
- Do not revert unrelated source-state changes.

## Implementation Plan

1. Keep `getBotRuntimeMonitoringAggregate` and `listBotRuntimeSessionPositions` as the public service entry points.
2. Use existing extracted aggregate helpers for runtime/cache/concurrency, projectors, and fallback payloads.
3. Remove runtime-only cycles introduced by type-only helper imports.
4. Keep positions open-order selection in a dedicated read-model helper.
5. Verify typecheck, guardrails, focused helper/unit tests, and targeted aggregate behavior.

## Acceptance Criteria

- `runtimeMonitoringAggregateRead.service.ts` is below the `1000`-line production monolith threshold.
- `runtimeSessionPositionsRead.service.ts` is below the `1000`-line production monolith threshold.
- Repository guardrails pass without Backend runtime aggregate staged-decomposition allowlist entries.
- API typecheck passes.
- Focused aggregate/positions read-model tests pass.
- Any incomplete full-suite proof is recorded with owner/action.

## Result Report

- Aggregate read service is `635` lines.
- Runtime session positions read service is `932` lines.
- Backend staged-decomposition allowlist no longer includes either target file.
- Fixed helper extraction runtime dependency risk:
  - `runtimeMonitoringAggregateFallbacks.service.ts` now imports runtime read functions as `import type`.
  - `runtimeSessionOpenOrdersReadModel.service.ts` now imports the repository function as `import type`.
- Local API test DB was reset with `pnpm --filter api run db:reset:local` to clear failed e2e fixture residue before the full aggregate proof.
- No production/runtime/deploy/env/account/secret/exchange/live-trading mutation occurred.

## Verification

- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` (`23/23`).
- PASS: full DB-backed aggregate route proof after local test DB reset:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true --testTimeout=30000 --reporter=dot` (`19/19`).

## Definition Of Done

- Backend decomposition and guardrail closure are implemented.
- Source-of-truth status records verified local behavior and guardrail proof.
- Final Paperclip disposition can be `done`; production promotion remains owned by separate Ops/QA release gates.

## Forbidden

- No temporary bypasses.
- No new allowlist entry for the target Backend files.
- No production mutation.
- No secret, protected payload, or live-trading action.
