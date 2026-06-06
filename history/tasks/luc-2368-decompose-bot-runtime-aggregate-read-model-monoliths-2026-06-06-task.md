# LUC-2368 Decompose Bot Runtime Aggregate Read-Model Monoliths

## Context

- Issue: `LUC-2368 [Soar][Backend] Decompose Bot Runtime aggregate read-model monoliths after LUC-2364 allowlist`
- Stage: verification
- Wake: `issue_assigned`, inline payload consumed first, `fallbackFetchNeeded=false`, comments `0/0`.
- Scope: Backend Bot Runtime aggregate and positions read-model maintainability after [LUC-2364](/LUC/issues/LUC-2364) temporarily allowlisted two production files above the `1000`-line monolith threshold.

## Goal

Remove the Backend Bot Runtime monolith exception by decomposing the aggregate/positions read-model files while preserving the existing endpoint contract and bounded materialization behavior.

## Constraints

- Do not change production runtime, deploy, restart, rollback, env, database, account, secret, exchange, protected smoke, or live-trading state.
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
- No production/runtime/deploy/env/database/account/secret/exchange/live-trading mutation occurred.

## Verification

- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `git diff --check` with LF/CRLF warnings only.
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` (`23/23`).
- PASS: isolated aggregate route proof:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "returns aggregate payload with status/symbol filters and ownership isolation" --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true --testTimeout=30000`.
- PARTIAL/BLOCKED: full `bots.monitoring-aggregate.e2e.test.ts` long DB-backed run did not fully pass in the current local DB state. After the type-only import repair it improved to `11/19` passing, but remaining failures include setup/create status mismatches, Prisma FK cleanup errors, and empty aggregate rows in later cases. This needs a clean local test DB rerun by QA/Test Automation before release-behavior proof is claimed.

## Definition Of Done

- Backend decomposition and guardrail closure are implemented.
- Source-of-truth status records partial verification and the required clean DB rerun.
- Final Paperclip disposition must either block on or delegate the clean aggregate e2e rerun.

## Forbidden

- No temporary bypasses.
- No new allowlist entry for the target Backend files.
- No production mutation.
- No secret, protected payload, or live-trading action.
