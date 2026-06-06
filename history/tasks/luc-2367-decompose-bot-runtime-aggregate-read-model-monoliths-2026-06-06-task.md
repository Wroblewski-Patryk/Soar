# LUC-2367 Decompose Bot Runtime Aggregate Read-Model Monoliths

## Header
- ID: LUC-2367
- Title: Decompose Bot Runtime aggregate read-model monoliths after release guardrail allowlist
- Task Type: refactor
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: 09 CBE
- Priority: P1
- Module Confidence Rows: Bot Runtime aggregate, Release guardrails
- Requirement Rows: Release guardrail proof
- Quality Scenario Rows: Maintainability, regression resistance
- Risk Rows: Runtime aggregate regression risk, release gate drift
- Operation Mode: BUILDER
- Mission ID: LUC-2367-BOT-RUNTIME-READ-MODEL-DECOMPOSITION-2026-06-06
- Mission Status: PARTIALLY_VERIFIED

## Context
[LUC-2364](/LUC/issues/LUC-2364) restored release guardrails for candidate
`de3db789` by temporarily allowlisting two Backend Bot Runtime read-model
monoliths. This backend follow-up decomposes those files so the temporary
monolith exceptions can be removed without changing runtime behavior.

## Goal
Split the aggregate and positions read-model helper logic out of the two
allowlisted service files while preserving bounded materialization, timeout,
fallback, ownership, and aggregate projection behavior.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- New helper modules for aggregate projectors, aggregate runtime helpers,
  aggregate fallback payloads, and open-order/takeover read-model helpers.
- Guardrail policy and maintainability inventory updates.

## Implementation
- Extracted aggregate projection/sorting/meta helpers to
  `runtimeMonitoringAggregateProjectors.ts`.
- Extracted aggregate cache key, timeout, and limited concurrency helpers to
  `runtimeMonitoringAggregateRuntime.service.ts`, with the existing
  `mapWithLimitedConcurrency` export preserved through the read service.
- Extracted aggregate empty/fallback payload builders to
  `runtimeMonitoringAggregateFallbacks.service.ts`.
- Extracted positions open-order de-dupe and runtime takeover helper logic to
  `runtimeSessionOpenOrdersReadModel.service.ts`.
- Reduced `runtimeMonitoringAggregateRead.service.ts` to `635` lines and
  `runtimeSessionPositionsRead.service.ts` to `932` lines.
- Updated `docs/governance/code-quality-guardrails.md` and
  `history/audits/code-quality-maintainability-inventory-2026-04-21.md` to
  remove the Backend temporary monolith exception narrative.

## Definition of Done
- Target Backend read-model files are below the `1000`-line production
  monolith threshold.
- Repository guardrails pass without Backend read-model monolith exceptions.
- API typecheck passes.
- Focused helper/unit tests pass.
- Any unverified e2e proof gap is recorded honestly.

## Forbidden
- No runtime behavior rewrite beyond mechanical extraction.
- No push, deploy, restart, rollback, protected smoke, account, secret,
  exchange, database, or live-trading mutation.
- No new wildcard guardrail exception.

## Validation Evidence
- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --sequence.concurrent=false` (`23/23`).
- BLOCKED/PARTIAL: full `bots.monitoring-aggregate.e2e.test.ts` did not
  produce a clean behavioral proof in the current local DB state. Runs failed
  before or during setup with `401`/`400` create responses and Prisma FK
  cleanup errors such as `Order_userId_fkey`, `Strategy_userId_fkey`,
  `BotRuntimeSession_botId_fkey`, and `BotRuntimeSymbolStat_sessionId_fkey`.
  The failure is recorded as local test-state contamination, not production
  evidence.

## Result Report
- Status: `partially verified`.
- Deployment impact: none.
- Residual risk: the full aggregate e2e should be rerun from a clean local
  test database before using this extraction as release behavior proof.
- Next owner/action: QA/Test or Backend should refresh the aggregate e2e test
  database state and rerun the exact full aggregate e2e proof.
